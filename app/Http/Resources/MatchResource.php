<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MatchResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'kickoff_at' => optional($this->kickoff_at)->toISOString(),
            'venue' => $this->venue,
            'status' => $this->status,
            'score_home' => $this->score_home,
            'score_away' => $this->score_away,
            'league' => new LeagueResource($this->whenLoaded('league')),
            'home_team' => new TeamResource($this->whenLoaded('homeTeam')),
            'away_team' => new TeamResource($this->whenLoaded('awayTeam')),
        ];
    }
}
