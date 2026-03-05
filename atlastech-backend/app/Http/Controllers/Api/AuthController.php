<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FailedAuthAttempt;
use App\Models\User;
use App\Services\RecaptchaService;
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
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
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
                'email' => $user->email,
                'ip' => $request->ip(),
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
                'error' => $e->getMessage(),
                'email' => $validated['email'],
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
                'email' => $credentials['email'],
                'ip' => $request->ip(),
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
                'email' => $user->email,
                'ip' => $request->ip(),
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

        $status = Password::sendResetLink($request->only('email'));

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email',
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'We could not find a user with that email address.',
        ], 400);
    }

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => ['required', 'confirmed', PasswordRule::min(8)],
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
