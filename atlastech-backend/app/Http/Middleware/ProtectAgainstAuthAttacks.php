<?php

namespace App\Http\Middleware;

use App\Models\FailedAuthAttempt;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ProtectAgainstAuthAttacks
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get identifier (email from request or IP)
        $identifier = $this->getIdentifier($request);
        $type = $this->getType($request);

        // Check if this identifier is currently blocked
        if (FailedAuthAttempt::isBlocked($identifier, $type)) {
            $blockedUntil = FailedAuthAttempt::getBlockedUntil($identifier, $type);
            $waitMinutes = ceil($blockedUntil / 60);

            return response()->json([
                'success' => false,
                'message' => "Too many failed attempts. Please try again in {$waitMinutes} minutes.",
                'locked_until' => $blockedUntil,
                'blocked' => true,
            ], 429);
        }

        return $next($request);
    }

    /**
     * Get the identifier for the auth attempt (email or IP)
     */
    private function getIdentifier(Request $request): string
    {
        // Try to get email from request
        if ($request->has('email')) {
            return strtolower($request->input('email'));
        }

        // Fallback to IP address
        return $request->ip();
    }

    /**
     * Determine the auth type based on the route
     */
    private function getType(Request $request): string
    {
        if (str_contains($request->path(), 'register')) {
            return 'register';
        }

        return 'login';
    }
}
