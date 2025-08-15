<?php

namespace App\Policies;

use App\Models\Subscription;
use App\Models\User;

class SubscriptionPolicy
{
    public function update(User $user, Subscription $subscription): bool
    {
        return $subscription->user_id === $user->id;
    }
}
