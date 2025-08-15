<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\League;
use App\Models\Team;

class MatchModelFactory extends Factory
{
    public function definition(): array
    {
        $league = League::factory()->create();
        $home = Team::factory()->create(['league_id' => $league->id]);
        $away = Team::factory()->create(['league_id' => $league->id]);

        return [
            'league_id' => $league->id,
            'home_team_id' => $home->id,
            'away_team_id' => $away->id,
            'kickoff_at' => now()->addDays(fake()->numberBetween(0, 10)),
            'venue' => fake()->streetName(),
            'status' => 'scheduled',
        ];
    }
}
