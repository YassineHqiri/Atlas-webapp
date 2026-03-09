<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Prevent clickjacking attacks - only allow frames from same origin
        $response->header('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->header('X-Content-Type-Options', 'nosniff');

        // Enable browser XSS protection
        $response->header('X-XSS-Protection', '1; mode=block');

        // Enforce HTTPS (strict transport security)
        // max-age: 31536000 seconds = 1 year
        $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

        // Content Security Policy - restrict resource loading to prevent injection attacks
        // This is a strict CSP that only allows resources from same origin
        $response->header('Content-Security-Policy', 
            "default-src 'self'; " .
            "script-src 'self' https://cdn.jsdelivr.net https://js.recaptcha.net; " .
            "frame-src https://challenges.cloudflare.com https://www.recaptcha.net; " .
            "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; " .
            "img-src 'self' data: https:; " .
            "font-src 'self' data: https://fonts.googleapis.com; " .
            "connect-src 'self' https://api.atlascyber.com; " .
            "upgrade-insecure-requests; " .
            "block-all-mixed-content"
        );

        // Referrer Policy - limit information sent in referer header
        $response->header('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Permissions Policy - restrict browser features
        $response->header('Permissions-Policy', 
            'geolocation=(), microphone=(), camera=(), payment=()'
        );

        // Additional security header - indicate support for HTTPS only
        $response->header('Expect-CT', 'max-age=86400, enforce');

        // X-Permitted-Cross-Domain-Policies - prevent cross-domain file access
        $response->header('X-Permitted-Cross-Domain-Policies', 'none');

        return $response;
    }
}
