# 🔐 SECURITY FIXES - IMPLEMENTATION GUIDE
## Complete Secure Code for Atlas-webapp

This document contains ready-to-use, copy-paste secure code implementations for all vulnerabilities found in the security audit.

---

## 1️⃣ FIX #1: Secure Environment Configuration

### File: `docker-compose.yml`
**✅ Secure Version**

```yaml
version: '3.8'

services:
  # Backend API
  atlastech-backend:
    build:
      context: ./atlastech-backend
      dockerfile: Dockerfile
    container_name: atlastech-backend
    restart: unless-stopped
    ports:
      - "8080:443"
    env_file:
      - .env.production  # Never hardcode credentials
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    volumes:
      - /etc/letsencrypt/live/atlascyber.viewdns.net/fullchain.pem:/etc/nginx/ssl/cert.pem:ro
      - /etc/letsencrypt/live/atlascyber.viewdns.net/privkey.pem:/etc/nginx/ssl/key.pem:ro
      - atlastech_logs:/var/www/html/storage/logs
      - atlastech_storage:/var/www/html/storage/app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    networks:
      - atlas-network
    security_opt:
      - no-new-privileges:true

  # Frontend
  atlastech-frontend:
    build:
      context: ./atlastech-frontend
      dockerfile: Dockerfile
      args:
        VITE_API_URL: https://atlascyber.viewdns.net:8080/api
    container_name: atlastech-frontend
    restart: unless-stopped
    ports:
      - "443:443"
    volumes:
      - /etc/letsencrypt/live/atlascyber.viewdns.net/fullchain.pem:/etc/nginx/ssl/cert.pem:ro
      - /etc/letsencrypt/live/atlascyber.viewdns.net/privkey.pem:/etc/nginx/ssl/key.pem:ro
    networks:
      - atlas-network
    security_opt:
      - no-new-privileges:true

volumes:
  atlastech_logs:
  atlastech_storage:

networks:
  atlas-network:
    driver: bridge
```

### File: `.env.production` (NEW - Add to .gitignore)
```bash
# Never commit this file to version control!
APP_NAME="AtlasTech Solutions"
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:GENERATE_NEW_WITH_php_artisan_key:generate
APP_URL=https://atlascyber.viewdns.net:8080
FRONTEND_URL=https://atlascyber.viewdns.net

LOG_CHANNEL=daily
LOG_LEVEL=warning

DB_CONNECTION=mysql
DB_HOST=atlascommercial.c1u4ayqi0rzj.eu-north-1.rds.amazonaws.com
DB_PORT=3306
DB_DATABASE=atlascommercial
DB_USERNAME=atlastech_app
DB_PASSWORD=CHANGE_THIS_SECURE_PASSWORD_IMMEDIATELY

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=local
QUEUE_CONNECTION=sync
SESSION_DRIVER=database
SESSION_LIFETIME=120

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=MAILTRAP_USERNAME
MAIL_PASSWORD=MAILTRAP_PASSWORD
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@atlastech.com"
MAIL_FROM_NAME="${APP_NAME}"

SANCTUM_STATEFUL_DOMAINS=atlascyber.viewdns.net
CORS_ALLOWED_ORIGINS=https://atlascyber.viewdns.net
RECAPTCHA_SITE_KEY=REGENERATE_IN_GOOGLE_CONSOLE
RECAPTCHA_SECRET_KEY=REGENERATE_IN_GOOGLE_CONSOLE
RECAPTCHA_VERIFY_SSL=true
```

### File: `.gitignore` - Add these lines
```bash
# Environment files
.env
.env.local
.env.*.local
.env.production
.env.testing

# Secrets
secrets/
docker-compose.override.yml
docker-compose.local.yml

# IDE
.vscode/
.idea/

# Dependencies
vendor/
node_modules/

# Logs
storage/logs/
*.log

# Cache
bootstrap/cache/
storage/framework/cache/
```

---

## 2️⃣ FIX #2: Secure Password Reset Implementation

### File: `database/migrations/2024_03_09_create_password_reset_tokens_table.php` (NEW)

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('token', 60);
            $table->timestamp('expires_at');
            $table->boolean('used')->default(false);
            $table->timestamps();
            
            $table->unique(['user_id', 'token']);
            $table->index('expires_at');
        });

        // Migrate existing data from password_resets
        \DB::statement('
            INSERT INTO password_reset_tokens (user_id, token, expires_at, created_at, updated_at)
            SELECT 
                u.id,
                SHA2(CONCAT(pr.token, u.id), 256),
                DATE_ADD(pr.created_at, INTERVAL 60 MINUTE),
                pr.created_at,
                pr.created_at
            FROM password_resets pr
            JOIN users u ON u.email = pr.email
        ');
    }

    public function down(): void
    {
        Schema::dropIfExists('password_reset_tokens');
    }
};
```

### File: `app/Models/User.php` - Add relationship

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // New relationship
    public function passwordResetTokens(): HasMany
    {
        return $this->hasMany(PasswordResetToken::class);
    }

    public function isSuperAdmin(): bool
    {
        return $this->role === 'super_admin';
    }

    public function isAdmin(): bool
    {
        return in_array($this->role, ['admin', 'super_admin']);
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    // ... rest of model
}
```

### File: `app/Models/PasswordResetToken.php` (NEW)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PasswordResetToken extends Model
{
    public $timestamps = true;

    protected $fillable = [
        'user_id',
        'token',
        'expires_at',
        'used',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeValid($query)
    {
        return $query->where('expires_at', '>', now())
            ->where('used', false);
    }
}
```

### File: `app/Notifications/CustomResetPassword.php` - SECURE VERSION

```php
<?php

namespace App\Notifications;

use App\Models\PasswordResetToken;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Str;

class CustomResetPassword extends Notification implements ShouldQueue
{
    use Queueable;

    private $resetToken;

    public function __construct()
    {
        $this->onQueue('emails');
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        // Generate secure token
        $plainToken = Str::random(60);
        $hashedToken = hash('sha256', $plainToken);

        // Store in database
        $resetToken = $notifiable->passwordResetTokens()->create([
            'token' => $hashedToken,
            'expires_at' => now()->addMinutes(60),
        ]);

        // Create reset URL with encoded token
        $resetUrl = (config('app.frontend_url') ?: config('app.url'))
            . '/reset-password?token=' . base64_encode($plainToken . '|' . $notifiable->id);

        return (new MailMessage)
            ->subject('Reset Your Password')
            ->greeting('Hello ' . $notifiable->name . '!')
            ->line('You requested a password reset for your account.')
            ->action('Reset Password', $resetUrl)
            ->line('This link will expire in 60 minutes.')
            ->line('Token preview: ' . substr($plainToken, 0, 8) . '...') // Show only first 8 chars
            ->line('If you did not request this reset, please ignore this email and your password will remain unchanged.')
            ->salutation('Best regards,\\nAtlasTech Support');
    }
}
```

### File: `app/Http/Controllers/Api/AuthController.php` - SECURE resetPassword METHOD

```php
/**
 * Reset the user's password using secure token
 */
public function resetPassword(Request $request): JsonResponse
{
    $validated = $request->validate([
        'token' => 'required|string',
        'email' => 'required|email|exists:users,email',
        'password' => [
            'required',
            'confirmed',
            Password::min(12)->letters()->mixedCase()->numbers()->symbols()
        ],
    ]);

    try {
        // Decode token
        $decodedToken = base64_decode($request->token, true);
        if (!$decodedToken) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid reset token format',
            ], 422);
        }

        [$plainToken, $userId] = explode('|', $decodedToken);

        // Find user
        $user = User::findOrFail($userId);

        // Verify email matches
        if ($user->email !== $validated['email']) {
            Log::warning('Password reset - email mismatch', [
                'user_id' => $userId,
                'ip' => $request->ip(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Invalid reset request',
            ], 422);
        }

        // Find and verify token
        $hashedToken = hash('sha256', $plainToken);
        $resetToken = PasswordResetToken::where('user_id', $userId)
            ->where('token', $hashedToken)
            ->where('expires_at', '>', now())
            ->where('used', false)
            ->firstOrFail();

        // Update password
        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        // Mark token as used
        $resetToken->update(['used' => true]);

        // Invalidate all other active tokens
        $user->passwordResetTokens()
            ->where('id', '!=', $resetToken->id)
            ->update(['used' => true]);

        Log::info('Password reset successful', [
            'user_id' => $user->id,
            'ip' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password has been reset successfully. Please log in with your new password.',
        ], 200);

    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        Log::warning('Password reset - invalid token', [
            'ip' => $request->ip(),
        ]);
        return response()->json([
            'success' => false,
            'message' => 'Invalid or expired reset token',
        ], 422);
    } catch (\Exception $e) {
        Log::error('Password reset error', [
            'error_type' => get_class($e),
            'ip' => $request->ip(),
        ]);
        return response()->json([
            'success' => false,
            'message' => 'An error occurred while resetting your password. Please try again.',
        ], 500);
    }
}
```

---

## 3️⃣ FIX #3: Secure reCAPTCHA Service

### File: `app/Services/RecaptchaService.php` - COMPLETE SECURE VERSION

```php
<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Support\Facades\Log;

class RecaptchaService
{
    protected $client;
    protected $secretKey;
    protected $siteKey;
    protected $verifyUrl = 'https://www.google.com/recaptcha/api/siteverify';

    public function __construct()
    {
        $this->client = new Client([
            'timeout' => 10,
            'verify' => true, // ALWAYS verify SSL certificates
            'connect_timeout' => 5,
        ]);

        $this->secretKey = config('services.recaptcha.secret_key') 
            ?? env('RECAPTCHA_SECRET_KEY');
        $this->siteKey = config('services.recaptcha.site_key') 
            ?? env('RECAPTCHA_SITE_KEY');
    }

    /**
     * Verify reCAPTCHA token from frontend
     *
     * @param string $token The token from frontend
     * @param string|null $expectedAction Expected action name
     * @param float $minScore Minimum score threshold (v3)
     * @return array Result array with success status
     */
    public function verify(
        string $token,
        ?string $expectedAction = null,
        float $minScore = 0.5
    ): array {
        // Validate input
        if (!$token || empty(trim($token))) {
            Log::warning('reCAPTCHA verification failed: empty token');
            return $this->error('reCAPTCHA token is required', 'MISSING_TOKEN');
        }

        if (!$this->secretKey) {
            Log::error('reCAPTCHA secret key not configured');
            return $this->error('reCAPTCHA not configured', 'MISSING_SECRET');
        }

        if (strlen($token) > 10000) {
            Log::warning('reCAPTCHA verification failed: token too long');
            return $this->error('Invalid reCAPTCHA token', 'INVALID_TOKEN');
        }

        try {
            // Prepare request
            $options = [
                'form_params' => [
                    'secret' => $this->secretKey,
                    'response' => $token,
                ],
                'timeout' => 10,
                'verify' => true, // ALWAYS verify SSL
                'headers' => [
                    'User-Agent' => 'AtlasTech/1.0',
                ],
            ];

            // Make request to Google
            $response = $this->client->post($this->verifyUrl, $options);

            // Parse response
            $body = json_decode($response->getBody(), true);

            if (!is_array($body)) {
                Log::error('reCAPTCHA: invalid response format');
                return $this->error('Invalid response from verification service', 'INVALID_RESPONSE');
            }

            // Check basic success field
            if (!isset($body['success']) || !$body['success']) {
                Log::warning('reCAPTCHA verification failed', [
                    'errors' => $body['error-codes'] ?? [],
                ]);
                return $this->error(
                    'reCAPTCHA verification failed',
                    'VERIFICATION_FAILED'
                );
            }

            // Verify score for v3
            if (isset($body['score'])) {
                if ($body['score'] < $minScore) {
                    Log::warning('reCAPTCHA score too low', [
                        'score' => $body['score'],
                        'minimum' => $minScore,
                    ]);
                    return $this->error('Failed security verification', 'LOW_SCORE');
                }
            }

            // Verify action if provided
            if ($expectedAction && isset($body['action'])) {
                if ($body['action'] !== $expectedAction) {
                    Log::warning('reCAPTCHA action mismatch', [
                        'expected' => $expectedAction,
                        'actual' => $body['action'],
                    ]);
                    return $this->error('Action mismatch', 'ACTION_MISMATCH');
                }
            }

            // Verify hostname
            if (isset($body['hostname'])) {
                $expectedHostname = parse_url(config('app.url'), PHP_URL_HOST);
                if ($body['hostname'] !== $expectedHostname) {
                    Log::warning('reCAPTCHA hostname mismatch');
                    return $this->error('Hostname mismatch', 'HOSTNAME_MISMATCH');
                }
            }

            return [
                'success' => true,
                'score' => $body['score'] ?? 1.0,
                'action' => $body['action'] ?? 'unknown',
                'challenge_ts' => $body['challenge_ts'] ?? null,
                'hostname' => $body['hostname'] ?? null,
            ];

        } catch (ConnectException $e) {
            Log::error('reCAPTCHA connection error', [
                'message' => 'Failed to connect to verification service',
            ]);
            return $this->error(
                'Verification service temporarily unavailable',
                'CONNECTION_ERROR'
            );

        } catch (ClientException $e) {
            Log::error('reCAPTCHA API error', [
                'status_code' => $e->getResponse()->getStatusCode(),
                // Don't log response body
            ]);
            return $this->error('Verification service error', 'API_ERROR');

        } catch (\Exception $e) {
            Log::error('Unexpected reCAPTCHA error', [
                'timestamp' => now(),
                // Don't log full exception details
            ]);
            return $this->error('An unexpected error occurred', 'EXCEPTION');
        }
    }

    /**
     * Return error response in standard format
     */
    private function error(string $message, string $code): array
    {
        return [
            'success' => false,
            'message' => $message,
            'code' => $code,
            'score' => 0,
            'action' => null,
        ];
    }
}
```

---

## 4️⃣ FIX #4: Authorization in Form Requests

### File: `app/Http/Requests/StoreServicePackRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServicePackRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Only admins can create service packs
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\p{L}\p{N}\s\-\.\']+$/u',
            ],
            'description' => [
                'nullable',
                'string',
                'max:2000',
            ],
            'price' => [
                'required',
                'numeric',
                'min:0',
                'max:999999.99',
            ],
            'features' => [
                'required',
                'array',
                'min:1',
                'max:20',
            ],
            'features.*' => [
                'string',
                'max:255',
                'regex:/^[\p{L}\p{N}\s\-\.]+$/u',
            ],
            'is_active' => [
                'sometimes',
                'boolean',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'authorize' => 'You are not authorized to create service packs.',
            'name.required' => 'Service pack name is required',
            'name.regex' => 'Service pack name contains invalid characters',
            'price.required' => 'Price is required',
            'price.numeric' => 'Price must be a valid number',
            'price.min' => 'Price cannot be negative',
            'features.required' => 'At least one feature is required',
            'features.array' => 'Features must be provided as a list',
            'features.*.regex' => 'Feature contains invalid characters',
        ];
    }
}
```

### File: `app/Http/Requests/StoreOrderRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Order creation allowed for authenticated and unauthenticated users
        // but controller validates further
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\p{L}\s\-\.\']+$/u',
            ],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                'not_in:admin@example.com,test@example.com',
            ],
            'phone' => [
                'nullable',
                'string',
                'max:50',
                'regex:/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/',
            ],
            'selected_pack_id' => [
                'required',
                'integer',
                'exists:service_packs,id',
            ],
            'notes' => [
                'nullable',
                'string',
                'max:1000',
                'not_regex:/<script|<iframe|javascript:|onerror=/i',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Customer name is required',
            'customer_name.regex' => 'Customer name contains invalid characters',
            'email.required' => 'Email address is required',
            'email.email' => 'Please provide a valid email address',
            'phone.regex' => 'Please provide a valid phone number',
            'selected_pack_id.required' => 'Please select a service pack',
            'selected_pack_id.exists' => 'Selected service pack does not exist',
            'notes.not_regex' => 'Notes contain invalid content',
        ];
    }
}
```

### File: `app/Http/Requests/StoreContactRequest.php`

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Contact form is publicly available
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\p{L}\s\-\.\']+$/u',
            ],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
                'not_in:admin@example.com',
            ],
            'message' => [
                'required',
                'string',
                'min:10',
                'max:5000',
                'not_regex:/<script|<iframe|javascript:|onerror=/i',
            ],
            'g_recaptcha_response' => [
                'required',
                'string',
                'max:10000',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'name.regex' => 'Name contains invalid characters',
            'email.required' => 'Email address is required',
            'message.required' => 'Message is required',
            'message.min' => 'Message must be at least 10 characters',
            'g_recaptcha_response.required' => 'reCAPTCHA verification is required',
        ];
    }
}
```

---

## 5️⃣ FIX #5: Rate Limiting on Auth Endpoints

### File: `routes/api.php` - Add Rate Limiting

```php
<?php

use App\Http\Controllers\Api\PublicController;
use App\Http\Controllers\Api\ChatbotController;
use App\Http\Controllers\Api\Admin\AuthController;
use App\Http\Controllers\Api\Admin\DashboardController;
use App\Http\Controllers\Api\Admin\OrderController;
use App\Http\Controllers\Api\Admin\ServicePackController;
use App\Http\Controllers\Api\Admin\CrmController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// CSRF Token endpoint
Route::post('/csrf-token', function (Request $request) {
    return response()->json([
        'token' => csrf_token(),
    ]);
})->middleware('api');

// Authentication routes
Route::prefix('auth')->group(function () {
    // Rate limit registration: 3 per hour per IP
    Route::post('/register', [\App\Http\Controllers\Api\AuthController::class, 'register'])
        ->middleware(['throttle:3,60', 'protect.auth']);
    
    // Rate limit login: 5 per minute per IP
    Route::post('/login', [\App\Http\Controllers\Api\AuthController::class, 'login'])
        ->middleware(['throttle:5,1', 'protect.auth']);
    
    // Rate limit forgot password: 3 per hour per IP
    Route::post('/forgot-password', [\App\Http\Controllers\Api\AuthController::class, 'forgotPassword'])
        ->middleware('throttle:3,60');
    
    // Rate limit reset password: 5 per hour per IP
    Route::post('/reset-password', [\App\Http\Controllers\Api\AuthController::class, 'resetPassword'])
        ->middleware('throttle:5,60');
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [\App\Http\Controllers\Api\AuthController::class, 'me']);
        Route::post('/logout', [\App\Http\Controllers\Api\AuthController::class, 'logout']);
    });
});

// Customer routes
Route::prefix('customer')->middleware(['auth:sanctum', 'customer'])->group(function () {
    Route::get('/orders', [\App\Http\Controllers\Api\CustomerController::class, 'orders']);
    Route::get('/profile', [\App\Http\Controllers\Api\CustomerController::class, 'profile']);
    Route::put('/profile', [\App\Http\Controllers\Api\CustomerController::class, 'updateProfile']);
    Route::put('/password', [\App\Http\Controllers\Api\CustomerController::class, 'changePassword']);
});

// Public routes
Route::prefix('public')->group(function () {
    Route::get('/service-packs', [PublicController::class, 'servicePacks']);
    Route::post('/orders', [PublicController::class, 'order'])
        ->middleware('throttle:10,60'); // 10 orders per hour per IP
    Route::post('/contact', [PublicController::class, 'contact'])
        ->middleware('throttle:5,60'); // 5 contact messages per hour per IP
});

// Chatbot routes
Route::prefix('chatbot')->group(function () {
    Route::post('/reply', [ChatbotController::class, 'reply'])
        ->middleware('throttle:10,1'); // 10 requests per minute per IP
});

// Admin routes
Route::prefix('admin')->group(function () {
    // Rate limit admin login: 3 per 5 minutes
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:3,5');
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::get('/dashboard', [DashboardController::class, 'index']);
        
        // Orders management
        Route::get('/orders', [OrderController::class, 'index']);
        Route::patch('/orders/{order}', [OrderController::class, 'updateStatus']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);
        Route::delete('/orders/{order}', [OrderController::class, 'destroy']);
        
        // Service packs management
        Route::get('/service-packs', [ServicePackController::class, 'index']);
        Route::post('/service-packs', [ServicePackController::class, 'store']);
        Route::get('/service-packs/{servicePack}', [ServicePackController::class, 'show']);
        Route::put('/service-packs/{servicePack}', [ServicePackController::class, 'update']);
        Route::delete('/service-packs/{servicePack}', [ServicePackController::class, 'destroy']);

        // CRM
        Route::prefix('crm')->group(function () {
            Route::get('/stats', [CrmController::class, 'stats']);
            Route::get('/pipeline', [CrmController::class, 'pipeline']);
            Route::get('/leads', [CrmController::class, 'index']);
            Route::post('/leads', [CrmController::class, 'store']);
            Route::get('/leads/{lead}', [CrmController::class, 'show']);
            Route::put('/leads/{lead}', [CrmController::class, 'update']);
            Route::delete('/leads/{lead}', [CrmController::class, 'destroy']);
            Route::post('/leads/{lead}/notes', [CrmController::class, 'addNote']);
            Route::delete('/leads/{lead}/notes/{note}', [CrmController::class, 'deleteNote']);
        });
    });
});
```

---

## 6️⃣ FIX #6: Security Headers Middleware

### File: `app/Http/Middleware/SecurityHeaders.php` (NEW)

```php
<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        // Prevent MIME type sniffing
        $response->header('X-Content-Type-Options', 'nosniff');

        // Prevent clickjacking attacks
        $response->header('X-Frame-Options', 'DENY');

        // XSS Protection (modern browsers)
        $response->header('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->header('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Strict Transport Security (HSTS)
        if (config('app.env') === 'production') {
            $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
        }

        // Content Security Policy
        $csp = "default-src 'self'; " .
            "script-src 'self' https://cdn.jsdelivr.net 'strict-dynamic'; " .
            "style-src 'self' https://cdn.jsdelivr.net 'unsafe-inline'; " .
            "img-src 'self' data: https:; " .
            "font-src 'self' https: data:; " .
            "connect-src 'self' https://www.google.com/recaptcha/ https://www.gstatic.com/; " .
            "frame-src https://www.google.com/recaptcha/; " .
            "form-action 'self'; " .
            "frame-ancestors 'none'; " .
            "base-uri 'self'; " .
            "require-trusted-types-for 'script'; " .
            "upgrade-insecure-requests;";

        $response->header('Content-Security-Policy', $csp);

        // Allow cross-origin requests for specific safe origins
        if ($request->origin && in_array($request->origin, explode(',', config('cors.allowed_origins', '')))) {
            $response->header('Access-Control-Allow-Origin', $request->origin);
        }

        return $response;
    }
}
```

### File: `app/Http/Kernel.php` - Register Middleware

```php
protected $middleware = [
    // ... other middleware
    \App\Http\Middleware\SecurityHeaders::class,
];
```

---

## 7️⃣ FIX #7: Secure Password Validation Request

### File: `app/Http/Requests/secure_validation/ChangePasswordRequest.php` (NEW)

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Hash;

class ChangePasswordRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'current_password' => [
                'required',
                'string',
                'max:255',
                function ($attribute, $value, $fail) {
                    if (!Hash::check($value, auth()->user()->password)) {
                        $fail('The current password is incorrect.');
                    }
                },
            ],
            'password' => [
                'required',
                'confirmed',
                'different:current_password',
                Password::min(12)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
                    ->uncompromised(3),
            ],
            'password_confirmation' => [
                'required',
                'same:password',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'current_password.required' => 'Current password is required',
            'password.required' => 'New password is required',
            'password.confirmed' => 'Passwords do not match',
            'password.different' => 'New password must differ from current password',
            'password.min' => 'Password must be at least 12 characters',
        ];
    }
}
```

---

## 8️⃣ FIX #8: Secure Logging

### File: `app/Http/Controllers/Api/AuthController.php` - Secure Logging

```php
public function register(Request $request): JsonResponse
{
    try {
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'customer',
        ]);

        // Log safely - don't include email or password
        Log::info('User registration successful', [
            'user_id' => $user->id,
            'ip_hash' => hash('sha256', $request->ip()),
            'timestamp' => now(),
        ]);

        $token = $user->createToken('customer-token')->plainTextToken;

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
        // Log safely
        Log::error('User registration failed', [
            'error_type' => get_class($e),
            'ip_hash' => hash('sha256', $request->ip()),
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Registration failed. Please try again.',
        ], 500);
    }
}

public function login(Request $request): JsonResponse
{
    // Validate reCAPTCHA first
    $recaptchaValidation = $this->validateRecaptcha($request, 'login');
    if (!$recaptchaValidation['valid']) {
        \Log::warning('Failed login - invalid reCAPTCHA', [
            'ip_hash' => hash('sha256', $request->ip()),
            'timestamp' => now(),
        ]);

        return response()->json([
            'success' => false,
            'message' => $recaptchaValidation['message'],
        ], 422);
    }

    $credentials = $request->validate([
        'email' => 'required|email',
        'password' => 'required|string|min:12',
        'g_recaptcha_response' => 'required|string',
    ]);

    if (!Auth::attempt($credentials)) {
        // Log safely - don't include password
        Log::warning('Failed login attempt', [
            'ip_hash' => hash('sha256', $request->ip()),
            'timestamp' => now(),
        ]);

        FailedAuthAttempt::record(
            identifier: $credentials['email'],
            reason: 'Invalid credentials',
            type: 'login',
            ipAddress: $request->ip(),
            userAgent: $request->userAgent()
        );

        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password',
        ], 401);
    }

    $user = Auth::user();
    $token = $user->createToken('customer-token')->plainTextToken;

    // Log successful login safely
    Log::info('User login successful', [
        'user_id' => $user->id,
        'ip_hash' => hash('sha256', $request->ip()),
        'timestamp' => now(),
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
```

---

## 9️⃣ FIX #9: Audit Logging

### File: `database/migrations/2024_03_09_create_audit_logs_table.php` (NEW)

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('action', 50);
            $table->string('model', 50)->nullable();
            $table->unsignedBigInteger('model_id')->nullable();
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address_hash', 64)->nullable();
            $table->string('user_agent_hash', 64)->nullable();
            $table->text('description')->nullable();
            $table->timestamp('created_at');
            
            // Indexes for performance
            $table->index('user_id');
            $table->index('model');
            $table->index('model_id');
            $table->index('action');
            $table->index('created_at');
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
```

### File: `app/Models/AuditLog.php` (NEW)

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AuditLog extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'action',
        'model',
        'model_id',
        'old_values',
        'new_values',
        'ip_address_hash',
        'user_agent_hash',
        'description',
    ];

    protected $casts = [
        'old_values' => 'json',
        'new_values' => 'json',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public static function log(
        $action,
        $model = null,
        $modelId = null,
        $oldValues = null,
        $newValues = null,
        $description = null
    ) {
        $request = request();
        
        return static::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model' => $model,
            'model_id' => $modelId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address_hash' => hash('sha256', $request->ip()),
            'user_agent_hash' => hash('sha256', $request->userAgent()),
            'description' => $description,
        ]);
    }
}
```

---

## 🔟 FIX #10: Environment Configuration File

### File: `config/security.php` (NEW)

```php
<?php

return [
    // Password security requirements
    'password' => [
        'min_length' => 12,
        'require_uppercase' => true,
        'require_lowercase' => true,
        'require_numbers' => true,
        'require_symbols' => true,
        'expiration_days' => 90,
    ],

    // Session security
    'session' => [
        'secure_cookies' => env('SESSION_SECURE_COOKIES', true),
        'http_only' => true,
        'same_site' => 'Lax',
        'lifetime' => 120,
    ],

    // Rate limiting
    'rate_limiting' => [
        'auth_register' => '3,60',       // 3 per 1 hour
        'auth_login' => '5,1',           // 5 per 1 minute
        'admin_login' => '3,5',          // 3 per 5 minutes
        'password_reset' => '5,60',      // 5 per 1 hour
        'contact_form' => '5,60',        // 5 per 1 hour
        'api_default' => '100,1',        // 100 per 1 minute
    ],

    // Security headers
    'headers' => [
        'X-Content-Type-Options' => 'nosniff',
        'X-Frame-Options' => 'DENY',
        'X-XSS-Protection' => '1; mode=block',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
    ],

    // Failed authentication thresholds
    'auth_attempts' => [
        'max_attempts' => 5,
        'lockout_minutes' => 15,
    ],

    // 2FA settings
    'two_factor' => [
        'enabled' => env('TWO_FACTOR_ENABLED', true),
        'issuer' => 'AtlasTech',
        'token_lifetime' => 30,
    ],

    // CORS
    'cors' => [
        'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')),
        'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        'max_age' => 86400,
    ],
];
```

---

## 📋 DEPLOYMENT CHECKLIST

Before deploying to production, verify:

- [ ] All hardcoded credentials removed
- [ ] `.env.production` created with secure values
- [ ] `.gitignore` updated to exclude sensitive files
- [ ] Database password changed in production
- [ ] reCAPTCHA keys regenerated
- [ ] SSL certificates installed
- [ ] Rate limiting configured
- [ ] Security headers enabled
- [ ] Logging configured safely
- [ ] Database backups encrypted
- [ ] Monitoring and alerting active
- [ ] Incident response plan documented

---

## 📚 REFERENCES

- OWASP Top 10: https://owasp.org/Top10/
- CVSS v3.1 Calculator: https://www.first.org/cvss/calculator/3.1
- Laravel Security: https://laravel.com/docs/security
- CWE/CWSS: https://cwe.mitre.org/

---

**Generated:** March 9, 2026  
**Last Updated:** March 9, 2026

