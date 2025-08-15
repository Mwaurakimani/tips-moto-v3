<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Team extends Model
{
    protected $fillable = ['league_id','name','short_name','country','logo_url'];

    public function league(): BelongsTo
    {
        return $this->belongsTo(League::class);
    }

    public function homeMatches(): HasMany
    {
        return $this->hasMany(MatchModel::class, 'home_team_id');
    }

    public function awayMatches(): HasMany
    {
        return $this->hasMany(MatchModel::class, 'away_team_id');
    }
}
