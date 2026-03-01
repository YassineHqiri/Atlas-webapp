<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'customer_name',
        'email',
        'phone',
        'selected_pack_id',
        'crm_lead_id',
        'status',
        'notes',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function servicePack(): BelongsTo
    {
        return $this->belongsTo(ServicePack::class, 'selected_pack_id');
    }

    public function crmLead(): BelongsTo
    {
        return $this->belongsTo(CrmLead::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
