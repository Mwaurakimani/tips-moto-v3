<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\SubscriptionPlan;

class SubscriptionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'plan_id' => SubscriptionPlan::factory(),
            'status' => 'active',
            'start_at' => now()->subDays(5),
            'end_at' => null,
            'renews_at' => now()->addMonth(),
            'cancel_at' => null,
            'auto_renew' => true,
        ];
    }
}
