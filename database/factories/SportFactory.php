<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SportFactory extends Factory
{
    public function definition(): array
    {
        return ['name' => ucfirst(fake()->unique()->word())];
    }
}
