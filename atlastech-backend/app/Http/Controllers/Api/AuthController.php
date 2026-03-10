<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FailedAuthAttempt;
use App\Models\User;
use App\Models\PasswordResetCode;
use App\Services\RecaptchaService;
use App\Notifications\PasswordResetCodeNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password as PasswordRule;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    private RecaptchaService $recaptcha;

    public function __construct(RecaptchaService $recaptcha)
    {
        $this->recaptcha = $recaptcha;
    }

    /**
     * Register a new customer account
     * Requires reCAPTCHA token for security
     */
    public function register(Request $request): JsonResponse
    {
        // Validate reCAPTCHA first
        $recaptchaValidation = $this->validateRecaptcha($request, 'register');
        if (!$recaptchaValidation['valid']) {
            $email = $request->input('email');
            FailedAuthAttempt::record(
                identifier: $email ?? $request->ip(),
                reason: 'Invalid reCAPTCHA: ' . $recaptchaValidation['message'],
                type: 'register',
                ipAddress: $request->ip(),
                userAgent: $request->userAgent()
            );

            return response()->json([
                'success' => false,
                'message' => $recaptchaValidation['message'],
            ], 422);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => ['required', 'confirmed', PasswordRule::min(12)->mixedCase()->numbers()->symbols()],
            'g_recaptcha_response' => 'required|string',
        ]);

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => $validated['password'],
                'role' => 'customer',
            ]);

            $token = $user->createToken('customer-token')->plainTextToken;

            Log::info('User registered successfully', [
                'user_id' => $user->id,
                'ip_hash' => hash('sha256', $request->ip()), // Hash IP instead of plaintext (SECURITY FIX)
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Account created successfully',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                ],
            ], 201);
        } catch (\Exception $e) {
            Log::error('Registration failed', [
                'error_type' => get_class($e),
                'ip_hash' => hash('sha256', $request->ip()), // Hash IP (SECURITY FIX)
                // Don't log: error message, email, password
            ]);

            FailedAuthAttempt::record(
                identifier: $validated['email'],
                reason: 'Registration error: ' . $e->getMessage(),
                type: 'register',
                ipAddress: $request->ip(),
                userAgent: $request->userAgent()
            );

            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Login a customer
     * Requires reCAPTCHA token for security
     */
    public function login(Request $request): JsonResponse
    {
        // Validate reCAPTCHA first
        $recaptchaValidation = $this->validateRecaptcha($request, 'login');
        if (!$recaptchaValidation['valid']) {
            $email = $request->input('email');
            FailedAuthAttempt::record(
                identifier: $email ?? $request->ip(),
                reason: 'Invalid reCAPTCHA: ' . $recaptchaValidation['message'],
                type: 'login',
                ipAddress: $request->ip(),
                userAgent: $request->userAgent()
            );

            return response()->json([
                'success' => false,
                'message' => $recaptchaValidation['message'],
            ], 422);
        }

        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'g_recaptcha_response' => 'required|string',
        ]);

        if (!Auth::attempt([
            'email' => $credentials['email'],
            'password' => $credentials['password'],
        ])) {
            // Record failed attempt
            FailedAuthAttempt::record(
                identifier: $credentials['email'],
                reason: 'Invalid email or password',
                type: 'login',
                ipAddress: $request->ip(),
                userAgent: $request->userAgent()
            );

            Log::warning('Failed login attempt', [
                'ip_hash' => hash('sha256', $request->ip()), // Hash IP (SECURITY FIX)
                // Don't log: email, password, full details
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid email or password',
            ], 401);
        }

        $user = Auth::user();

        if (!$user->isAdmin()) {
            $user->tokens()->delete();
            $token = $user->createToken('customer-token')->plainTextToken;

            Log::info('User logged in successfully', [
                'user_id' => $user->id,
                'ip_hash' => hash('sha256', $request->ip()), // Hash IP (SECURITY FIX)
                // Don't log: email, full user details
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => [
                        'id' => $user->id,
                        'name' => $user->name,
                        'email' => $user->email,
                        'role' => $user->role,
                    ],
                    'token' => $token,
                ],
            ]);
        }

        Auth::logout();
        FailedAuthAttempt::record(
            identifier: $user->email,
            reason: 'Admin tried to login via customer endpoint',
            type: 'login',
            ipAddress: $request->ip(),
            userAgent: $request->userAgent()
        );

        return response()->json([
            'success' => false,
            'message' => 'Use the admin panel to sign in.',
        ], 403);
    }

    /**
     * Validate reCAPTCHA response from frontend
     */
    private function validateRecaptcha(Request $request, string $expectedAction = 'login'): array
    {
        // Check if token is provided
        if (!$request->has('g_recaptcha_response')) {
            return [
                'valid' => false,
                'message' => 'reCAPTCHA token is missing',
            ];
        }

        $token = $request->input('g_recaptcha_response');

        // Verify with Google
        $result = $this->recaptcha->verify($token, $expectedAction);

        if (!$result['success']) {
            return [
                'valid' => false,
                'message' => 'reCAPTCHA verification failed. Please try again.',
            ];
        }

        return [
            'valid' => true,
            'message' => 'reCAPTCHA verified',
        ];
    }

    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate(['email' => 'required|email']);

        $email = $request->input('email');

        // Verify user exists
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'We could not find a user with that email address.',
            ], 400);
        }

        // Generate a 6-digit verification code
        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Store or update the code in database (expires in 15 minutes)
        PasswordResetCode::updateOrCreate(
            ['email' => $email],
            [
                'code' => $code,
                'code_verified' => false,
                'code_expires_at' => now()->addMinutes(15),
            ]
        );

        // Send the code via email
        try {
            $user->notify(new PasswordResetCodeNotification($code, $email));

            Log::info('Password reset code sent', [
                'email_hash' => hash('sha256', $email),
                'timestamp' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Verification code sent to your email. Valid for 15 minutes.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to send password reset code', [
                'error' => $e->getMessage(),
                'email_hash' => hash('sha256', $email),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to send verification code. Please try again.',
            ], 500);
        }
    }

    public function verifyResetCode(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string|size:6',
        ]);

        $email = $request->input('email');
        $code = $request->input('code');

        // Find and validate the code
        $resetCode = PasswordResetCode::findValidCode($email, $code);

        if (!$resetCode) {
            Log::warning('Invalid password reset code attempt', [
                'email_hash' => hash('sha256', $email),
                'ip_hash' => hash('sha256', $request->ip()),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired verification code.',
            ], 400);
        }

        // Mark code as verified
        $resetCode->markAsVerified();

        Log::info('Password reset code verified', [
            'email_hash' => hash('sha256', $email),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Code verified successfully. You can now reset your password.',
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email',
            'old_password' => 'required|string',
            'password' => ['required', 'confirmed', PasswordRule::min(12)->mixedCase()->numbers()->symbols()],
        ]);

        $email = $request->input('email');
        $oldPassword = $request->input('old_password');

        // Find user
        $user = User::where('email', $email)->first();
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'We could not find a user with that email address.',
            ], 400);
        }

        // Check if old password is correct
        if (!Hash::check($oldPassword, $user->password)) {
            Log::warning('Incorrect old password on password change', [
                'user_id' => $user->id,
                'email_hash' => hash('sha256', $email),
                'ip_hash' => hash('sha256', $request->ip()),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'The old password you entered is incorrect.',
            ], 401);
        }

        // Check if code has been verified
        $resetCode = PasswordResetCode::where('email', $email)
            ->where('code_verified', true)
            ->where('code_expires_at', '>', now())
            ->latest()
            ->first();

        if (!$resetCode) {
            return response()->json([
                'success' => false,
                'message' => 'Your verification code has expired or is invalid. Please request a new one.',
            ], 400);
        }

        // Update password
        try {
            $user->update([
                'password' => Hash::make($request->input('password')),
                'remember_token' => Str::random(60),
            ]);

            // Clean up the reset code
            $resetCode->delete();

            // Revoke all existing tokens for security
            $user->tokens()->delete();

            Log::info('Password changed successfully', [
                'user_id' => $user->id,
                'email_hash' => hash('sha256', $email),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password changed successfully. Please log in with your new password.',
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to change password', [
                'error' => $e->getMessage(),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to change password. Please try again.',
            ], 500);
        }
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::min(12)->mixedCase()->numbers()->symbols()],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid or expired reset token.',
        ], 400);
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }
}
