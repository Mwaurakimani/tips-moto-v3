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
        'odds' => 'decimal:2',
        'prediction_value' => 'integer',
        'confidence' => 'integer',
    ];

    /**
     * Normalize prediction_type to use underscores (GG_NG, 1_X_2, 1X_X2_12)
     * Handles both hyphen and underscore formats for backward compatibility
     */
    public function setPredictionTypeAttribute($value): void
    {
        // Normalize GG-NG to GG_NG (standardize on underscore)
        $this->attributes['prediction_type'] = str_replace('-', '_', $value);
    }

    /**
     * Always return prediction_type with underscores
     */
    public function getPredictionTypeAttribute($value): string
    {
        // Ensure consistency - replace any hyphens with underscores
        return str_replace('-', '_', $value);
    }

    /**
     * Get display label for prediction type
     */
    public function getPredictionTypeDisplayAttribute(): string
    {
        return match ($this->prediction_type) {
            '1_X_2' => 'Full Time Result',
            '1X_X2_12' => 'Double Chance',
            'GG_NG' => 'Both Teams Score',
            'Over/Under' => 'Goals Over/Under',
            default => $this->prediction_type,
        };
    }

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
