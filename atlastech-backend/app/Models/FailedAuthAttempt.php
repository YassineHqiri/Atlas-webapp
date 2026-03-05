<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class FailedAuthAttempt extends Model
{
    use HasFactory;

    protected $table = 'failed_authentication_attempts';

    protected $fillable = [
        'identifier',
        'type',
        'ip_address',
        'user_agent',
        'reason',
        'is_blocked',
        'blocked_until',
    ];

    protected $casts = [
        'is_blocked' => 'boolean',
        'blocked_until' => 'datetime',
    ];

    /**
     * Scope: Get recent failed attempts (last hour)
     */
    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', now()->subHour());
    }

    /**
     * Scope: Get currently active blocks
     */
    public function scopeActive($query)
    {
        return $query->where('is_blocked', true)
            ->where(function ($q) {
                $q->whereNull('blocked_until')
                  ->orWhere('blocked_until', '>', now());
            });
    }

    /**
     * Check if this identifier is currently blocked
     */
    public static function isBlocked($identifier, $type = 'login'): bool
    {
        $blocked = self::where('identifier', $identifier)
            ->where('type', $type)
            ->where('is_blocked', true)
            ->where(function ($q) {
                $q->whereNull('blocked_until')
                  ->orWhere('blocked_until', '>', now());
            })
            ->first();

        return $blocked !== null;
    }

    /**
     * Get remaining block time in seconds
     */
    public static function getBlockedUntil($identifier, $type = 'login'): ?int
    {
        $blocked = self::where('identifier', $identifier)
            ->where('type', $type)
            ->where('is_blocked', true)
            ->where('blocked_until', '>', now())
            ->first();

        if ($blocked && $blocked->blocked_until) {
            return max(0, now()->diffInSeconds($blocked->blocked_until));
        }

        return null;
    }

    /**
     * Count recent failures for an identifier
     */
    public static function countRecent($identifier, $type = 'login'): int
    {
        return self::where('identifier', $identifier)
            ->where('type', $type)
            ->recent()
            ->count();
    }

    /**
     * Record a failed attempt
     */
    public static function record(
        string $identifier,
        string $reason,
        string $type = 'login',
        ?string $ipAddress = null,
        ?string $userAgent = null
    ): self {
        $attemptCount = self::countRecent($identifier, $type) + 1;
        $maxAttempts = config('auth.max_login_attempts', 5);

        $record = self::create([
            'identifier' => $identifier,
            'type' => $type,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'reason' => $reason,
            'is_blocked' => $attemptCount >= $maxAttempts,
            'blocked_until' => $attemptCount >= $maxAttempts
                ? now()->addMinutes(config('auth.lockout_duration_minutes', 15))
                : null,
        ]);

        // Log failed attempt
        \Log::warning("Failed authentication attempt", [
            'identifier' => $identifier,
            'type' => $type,
            'reason' => $reason,
            'ip_address' => $ipAddress,
            'attempt_count' => $attemptCount,
            'blocked' => $attemptCount >= $maxAttempts,
        ]);

        return $record;
    }

    /**
     * Clean up old records (older than 7 days)
     */
    public static function cleanup(): int
    {
        return self::where('created_at', '<', now()->subDays(7))->delete();
    }
}
