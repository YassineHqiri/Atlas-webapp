<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChatLog extends Model
{
    protected $fillable = ['user_message', 'bot_response', 'ip_address'];
    public $timestamps = true;
}
