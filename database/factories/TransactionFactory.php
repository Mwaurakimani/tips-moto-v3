<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;

class TransactionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'type' => 'subscription',
            'amount' => fake()->randomFloat(2, 5, 50),
            'currency' => 'USD',
            'status' => 'completed',
            'provider' => 'mock',
            'provider_ref' => fake()->unique()->uuid(),
            'description' => 'Mock transaction',
        ];
    }
}
