<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasFactory, HasApiTokens, Notifiable;

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new \App\Notifications\CustomResetPassword($token));
    }

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

    public function orders()
    {
        return $this->hasMany(\App\Models\Order::class);
    }

    public function setPasswordAttribute($value): void
    {
        $this->attributes['password'] = bcrypt($value);
    }
}
