<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255',
                'regex:/^[\p{L}\s\-\.\']+$/u', // Only allow letters, spaces, dashes
            ],
            'email' => [
                'required',
                'email:rfc,dns',
                'max:255',
            ],
            'message' => [
                'required',
                'string',
                'min:10',
                'max:5000',
                'not_regex:/<script|<iframe|javascript:|onerror=/i', // XSS prevention (SECURITY FIX)
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Name is required',
            'email.required' => 'Email address is required',
            'email.email' => 'Please provide a valid email address',
            'message.required' => 'Message is required',
        ];
    }
}
