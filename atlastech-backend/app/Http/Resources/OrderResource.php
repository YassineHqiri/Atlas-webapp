<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'customer_name' => $this->customer_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'selected_pack_id' => $this->selected_pack_id,
            'service_pack' => $this->whenLoaded('servicePack', function() {
                return new ServicePackResource($this->servicePack);
            }),
            'status' => $this->status,
            'notes' => $this->notes,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
