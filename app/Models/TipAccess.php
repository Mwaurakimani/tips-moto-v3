<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TipAccess extends Model
{
    protected $fillable = ['user_id','tip_id','source','granted_at','expires_at'];

    protected $casts = [
        'granted_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tip(): BelongsTo
    {
        return $this->belongsTo(Tip::class);
    }
}
