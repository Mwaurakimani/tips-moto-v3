<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriptionPlanFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => 'Plan ' . ucfirst(fake()->word()),
            'slug' => fake()->unique()->slug(),
            'price' => fake()->randomFloat(2, 5, 50),
            'currency' => 'USD',
            'interval' => 'month',
            'interval_count' => 1,
            'trial_days' => 0,
            'features' => ['tips_per_day' => fake()->numberBetween(5,20)],
            'is_active' => true,
        ];
    }
}
