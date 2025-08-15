<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Sport;

class LeagueFactory extends Factory
{
    public function definition(): array
    {
        return [
            'sport_id' => Sport::factory(),
            'name' => fake()->unique()->words(3, true),
            'country' => fake()->country(),
            'slug' => fake()->unique()->slug(),
        ];
    }
}
