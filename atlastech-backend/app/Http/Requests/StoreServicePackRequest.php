<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreServicePackRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'features' => 'required|array|min:1',
            'features.*' => 'string|max:255',
            'is_active' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Service pack name is required',
            'price.required' => 'Price is required',
            'price.numeric' => 'Price must be a valid number',
            'features.required' => 'At least one feature is required',
            'features.array' => 'Features must be provided as a list',
        ];
    }
}
