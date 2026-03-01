<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => 'required|string|max:255',
            'email' => 'required|email:rfc,dns|max:255',
            'phone' => 'nullable|string|max:50',
            'selected_pack_id' => 'required|exists:service_packs,id',
            'notes' => 'nullable|string|max:1000',
        ];
    }

    public function messages(): array
    {
        return [
            'customer_name.required' => 'Customer name is required',
            'email.required' => 'Email address is required',
            'email.email' => 'Please provide a valid email address',
            'selected_pack_id.required' => 'Please select a service pack',
            'selected_pack_id.exists' => 'Selected service pack does not exist',
        ];
    }
}
