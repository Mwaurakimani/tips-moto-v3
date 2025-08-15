<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Subscription;
use App\Models\Transaction;
use App\Models\SupportTicket;
use App\Policies\SubscriptionPolicy;
use App\Policies\TransactionPolicy;
use App\Policies\SupportTicketPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Subscription::class => SubscriptionPolicy::class,
        Transaction::class => TransactionPolicy::class,
        SupportTicket::class => SupportTicketPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
