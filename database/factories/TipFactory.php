<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\MatchModel;

class TipFactory extends Factory
{
    public function definition(): array
    {
        $values = [-1,0,1];
        $labels = ['1','X','2','1/X','X/2','1/2','GG','NG'];
        return [
            'match_id' => MatchModel::factory(),
            'prediction_type' => fake()->randomElement(['1_X_2','1X_X2_12','GG-NG']),
            'prediction_value' => fake()->randomElement($values),
            'pick_label' => fake()->randomElement($labels),
            'odds' => fake()->randomFloat(2, 1.5, 3.5),
            'bookmaker' => 'Mock',
            'confidence' => fake()->numberBetween(50,95),
            'risk_level' => fake()->randomElement(['low','mid','high']),
            'is_free' => fake()->boolean(20),
            'free_for_date' => now()->toDateString(),
            'visibility' => 'public',
            'publish_at' => now(),
        ];
    }
}
