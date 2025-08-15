<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PromoRedemption extends Model
{
    public $timestamps = false;
    protected $fillable = ['promo_code_id','user_id','transaction_id','created_at'];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function code(): BelongsTo
    {
        return $this->belongsTo(PromoCode::class, 'promo_code_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
