<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ServicePack extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'features',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'features' => 'array',
        'is_active' => 'boolean',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class, 'selected_pack_id');
    }
}
