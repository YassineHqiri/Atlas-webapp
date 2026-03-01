<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CrmLead extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'company',
        'status',
        'source',
        'contact_message_id',
        'service_interest',
        'estimated_value',
        'message',
    ];

    protected $casts = [
        'estimated_value' => 'decimal:2',
    ];

    public function notes(): HasMany
    {
        return $this->hasMany(CrmNote::class)->orderBy('created_at', 'desc');
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class)->orderBy('created_at', 'desc');
    }

    public function contactMessage(): BelongsTo
    {
        return $this->belongsTo(ContactMessage::class);
    }
}
