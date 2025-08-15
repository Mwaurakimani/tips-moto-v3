<?php

namespace App\Policies;

use App\Models\Transaction;
use App\Models\User;

class TransactionPolicy
{
    public function view(User $user, Transaction $tx): bool
    {
        return $tx->user_id === $user->id;
    }
}
