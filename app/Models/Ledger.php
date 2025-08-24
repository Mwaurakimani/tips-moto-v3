<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ledger extends Model
{
    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'status',
        'date',
    ];

    // Relation: a ledger entry belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
