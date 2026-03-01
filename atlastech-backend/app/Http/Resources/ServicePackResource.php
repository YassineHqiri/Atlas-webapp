<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ServicePackResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => number_format($this->price, 2),
            'features' => $this->features,
            'is_active' => $this->is_active,
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}
