<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Http\Resources\AdminResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function login(LoginRequest $request): JsonResponse
    {
        $credentials = $request->validated();

        if (Auth::attempt($credentials)) {
            $user = Auth::user();
            if (!$user->isAdmin()) {
                Auth::logout();
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied. Use the customer login.',
                ], 403);
            }
            $token = $user->createToken('admin-token')->plainTextToken;

            Log::info('Admin logged in', ['user_id' => $user->id, 'email' => $user->email]);

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'user' => new AdminResource($user),
                    'token' => $token,
                ],
            ]);
        }

        Log::warning('Failed login attempt', ['email' => $credentials['email']]);

        return response()->json([
            'success' => false,
            'message' => 'Invalid credentials',
        ], 401);
    }

    public function logout(): JsonResponse
    {
        $user = Auth::user();
        
        if ($user) {
            $user->currentAccessToken()->delete();
            
            Log::info('Admin logged out', ['user_id' => $user->id]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function me(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => new AdminResource(Auth::user()),
        ]);
    }
}
