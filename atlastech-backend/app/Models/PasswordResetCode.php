<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PasswordResetCode extends Model
{
    use HasFactory;

    protected $table = 'password_reset_codes';

    protected $fillable = [
        'email',
        'code',
        'code_verified',
        'code_expires_at',
    ];

    protected $casts = [
        'code_verified' => 'boolean',
        'code_expires_at' => 'datetime',
    ];

    /**
     * Check if code is still valid and not expired
     */
    public function isValid(): bool
    {
        return !$this->code_verified && now()->isBefore($this->code_expires_at);
    }

    /**
     * Verify the code
     */
    public function markAsVerified(): void
    {
        $this->update(['code_verified' => true]);
    }

    /**
     * Find valid code by email and code
     */
    public static function findValidCode(string $email, string $code): ?self
    {
        return self::where('email', $email)
            ->where('code', $code)
            ->where('code_verified', false)
            ->where('code_expires_at', '>', now())
            ->first();
    }
}
