<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tip extends Model
{
    protected $fillable = [
        'match_id','author_id','prediction_type','prediction_value','pick_label','odds','bookmaker',
        'confidence','risk_level','is_free','free_for_date','visibility','publish_at','status','result','settled_at','notes'
    ];

    protected $casts = [
        'is_free' => 'boolean',
        'free_for_date' => 'date',
        'publish_at' => 'datetime',
        'settled_at' => 'datetime',
    ];

    public function match(): BelongsTo
    {
        return $this->belongsTo(MatchModel::class, 'match_id');
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function accesses(): HasMany
    {
        return $this->hasMany(TipAccess::class);
    }
}
