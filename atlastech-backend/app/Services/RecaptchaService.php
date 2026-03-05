<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use Illuminate\Support\Facades\Log;

class RecaptchaService
{
    protected $client;
    protected $secretKey;
    protected $siteKey;
    protected $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    public function __construct()
    {
        $this->client = new Client();
        $this->secretKey = config('services.recaptcha.secret_key') ?? env('RECAPTCHA_SECRET_KEY');
        $this->siteKey = config('services.recaptcha.site_key') ?? env('RECAPTCHA_SITE_KEY');
    }

    /**
     * Verify the reCAPTCHA token from the frontend
     *
     * @param string $token The token received from the frontend
     * @param string|null $expectedAction Optional: the expected action name
     * @param float $minScore Optional: minimum score for v3 (0.0 - 1.0)
     * @return array Result with status: ['success' => bool, 'score' => float, 'action' => string, 'challenge_ts' => string, 'hostname' => string, 'errors' => array]
     */
    public function verify(
        string $token,
        ?string $expectedAction = null,
        float $minScore = 0.5
    ): array {
        try {
            Log::info('🔍 Verifying reCAPTCHA token', [
                'token_length' => strlen($token),
                'token_sample' => substr($token, 0, 50) . '...',
                'expected_action' => $expectedAction,
                'timestamp' => now(),
            ]);

            if (!$token || empty(trim($token))) {
                Log::error('❌ reCAPTCHA token is missing or empty');
                return $this->error('Token is missing or empty', 'MISSING_TOKEN');
            }

            if (!$this->secretKey) {
                Log::error('❌ reCAPTCHA secret key not configured');
                return $this->error('reCAPTCHA not configured', 'MISSING_SECRET');
            }

            Log::info('✅ Token received and secret key configured');

            // Build request options
            $options = [
                'form_params' => [
                    'secret' => $this->secretKey,
                    'response' => $token,
                ],
                'timeout' => 10,
            ];

            // For development environments, disable SSL verification
            // This is needed when cURL certificates are not properly configured
            if (config('app.env') === 'local' || config('app.env') === 'development') {
                $options['verify'] = false;
            }

            $response = $this->client->post($this->verifyUrl, $options);

            Log::info('✅ Google API responded', [
                'status_code' => $response->getStatusCode(),
            ]);

            $body = json_decode($response->getBody(), true);

            Log::info('📋 Google Response Body', [
                'success' => $body['success'] ?? false,
                'score' => $body['score'] ?? 'N/A (v2)',
                'action' => $body['action'] ?? 'N/A (v2)',
                'challenge_ts' => $body['challenge_ts'] ?? 'N/A',
                'hostname' => $body['hostname'] ?? 'N/A',
                'error-codes' => $body['error-codes'] ?? [],
            ]);

            // Validate response structure
            if (!is_array($body)) {
                Log::error('Invalid reCAPTCHA response format');
                return $this->error('Invalid response from Google', 'INVALID_RESPONSE');
            }

            // Check if verification was successful
            if (!isset($body['success']) || !$body['success']) {
                $errors = $body['error-codes'] ?? ['unknown_error'];
                Log::warning('❌ reCAPTCHA verification FAILED', [
                    'errors' => $errors,
                    'challenge_ts' => $body['challenge_ts'] ?? null,
                    'hostname' => $body['hostname'] ?? null,
                    'full_response' => $body,
                ]);

                return [
                    'success' => false,
                    'score' => $body['score'] ?? 0,
                    'action' => $body['action'] ?? null,
                    'errors' => $errors,
                    'challenge_ts' => $body['challenge_ts'] ?? null,
                    'hostname' => $body['hostname'] ?? null,
                ];
            }

            // For v3: Check score if provided
            if (isset($body['score'])) {
                if ($body['score'] < $minScore) {
                    Log::warning('reCAPTCHA score below threshold', [
                        'score' => $body['score'],
                        'min_score' => $minScore,
                    ]);

                    return $this->error('Score too low, possible bot', 'LOW_SCORE', [
                        'score' => $body['score'],
                        'challenge_ts' => $body['challenge_ts'] ?? null,
                    ]);
                }
            }

            // Check action if v3
            if ($expectedAction && isset($body['action']) && $body['action'] !== $expectedAction) {
                Log::warning('reCAPTCHA action mismatch', [
                    'expected' => $expectedAction,
                    'received' => $body['action'],
                ]);

                return $this->error('Action mismatch', 'ACTION_MISMATCH');
            }

            Log::info('✅ reCAPTCHA verification SUCCESSFUL', [
                'action' => $body['action'] ?? 'N/A (v2)',
                'score' => $body['score'] ?? 1.0,
                'challenge_ts' => $body['challenge_ts'] ?? null,
                'hostname' => $body['hostname'] ?? null,
            ]);

            return [
                'success' => true,
                'score' => $body['score'] ?? 1.0,
                'action' => $body['action'] ?? null,
                'challenge_ts' => $body['challenge_ts'] ?? null,
                'hostname' => $body['hostname'] ?? null,
                'errors' => [],
            ];
        } catch (ClientException $e) {
            $statusCode = $e->getResponse()->getStatusCode();
            $responseBody = $e->getResponse()->getBody()->getContents();
            Log::error("❌ reCAPTCHA API CLIENT ERROR: {$statusCode}", [
                'status_code' => $statusCode,
                'error_body' => $responseBody,
                'message' => $e->getMessage(),
            ]);

            return $this->error("Google API error ({$statusCode})", 'API_ERROR');
        } catch (\Exception $e) {
            Log::error('❌ reCAPTCHA verification EXCEPTION: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'code' => $e->getCode(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            return $this->error('Verification failed: ' . $e->getMessage(), 'EXCEPTION');
        }
    }

    /**
     * Get the site key for frontend
     */
    public function getSiteKey(): string
    {
        return $this->siteKey;
    }

    /**
     * Helper method to generate error response
     */
    protected function error(string $message, string $code, array $extra = []): array
    {
        return array_merge([
            'success' => false,
            'score' => 0,
            'action' => null,
            'errors' => [$code => $message],
            'challenge_ts' => null,
            'hostname' => null,
        ], $extra);
    }
}
