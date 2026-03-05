<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Faq extends Model
{
    protected $fillable = ['question', 'answer', 'is_active', 'language'];
    protected $casts = ['is_active' => 'boolean'];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeLanguage($query, $language = 'fr')
    {
        return $query->where('language', $language);
    }

    public function scopeSearch($query, $term)
    {
        return $query->where('question', 'LIKE', "%{$term}%")
                     ->orWhere('answer', 'LIKE', "%{$term}%");
    }
}
