<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TipResource extends JsonResource
{
    public function toArray($request): array
    {
        $m = $this->whenLoaded('match');

        return [
            'id'               => $this->id,
            'prediction_type'  => $this->prediction_type,
            'prediction_value' => $this->prediction_value,
            'pick_label'       => $this->pick_label,
            'odds'             => $this->odds,
            'confidence'       => $this->confidence,
            'risk_level'       => $this->risk_level,
            'is_free'          => (bool) $this->is_free,
            'free_for_date'    => optional($this->free_for_date)->toDateString() ?: $this->free_for_date,
            'publish_at'       => optional($this->publish_at)->toDateTimeString() ?: $this->publish_at,

            'match' => $m ? [
                'id'         => $m->id,
                'league'     => optional($m->league)->name,
                'kickoff_at' => (string) $m->kickoff_at,
                'home_team'  => optional($m->homeTeam)->name,
                'away_team'  => optional($m->awayTeam)->name,
            ] : null,
        ];
    }
}
