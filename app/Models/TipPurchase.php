<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TipPurchase extends Model
{
    protected $fillable = [
        'user_id','tip_id','transaction_id','price','currency','status'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function tip(): BelongsTo
    {
        return $this->belongsTo(Tip::class);
    }

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }
}
