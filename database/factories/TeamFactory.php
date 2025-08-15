<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\League;

class TeamFactory extends Factory
{
    public function definition(): array
    {
        return [
            'league_id' => League::factory(),
            'name' => fake()->unique()->company(),
            'short_name' => strtoupper(fake()->lexify('??')),
            'country' => fake()->country(),
            'logo_url' => null,
        ];
    }
}
