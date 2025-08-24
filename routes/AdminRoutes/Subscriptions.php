<?php

use App\Models\SubscriptionPlan;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('adminDashboard/subscriptions', function () {
        $plans = SubscriptionPlan::all()->map(function ($plan) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'price' => (float) $plan->price,
                'currency' => strtoupper($plan->currency),
                'interval' => $plan->interval,
                'interval_count' => $plan->interval_count,
                'trial_days' => $plan->trial_days,
                'is_active' => (bool) $plan->is_active,
                'created_at' => $plan->created_at?->format('Y-m-d H:i:s'),
                'updated_at' => $plan->updated_at?->format('Y-m-d H:i:s'),

                // features is already cast into array in the model
                'features' => $plan->features ?? [],

                // analytics placeholder (replace with real queries later)
                'analytics' => [
                    'totalSubscribers' => 0,
                    'activeSubscribers' => 0,
                    'successRate' => 0,
                    'averageRating' => 0,
                    'weeklyRevenue' => 0,
                    'totalRevenue' => 0,
                ],

                // tips placeholder (empty for now)
                'tipsData' => [],
            ];
        });

        return Inertia::render('AdminDashboardSystem/Subscriptions', [
            'currentPageTitle' => 'Packages',
            'subscriptions' => $plans
        ]);
    })->name('adminDashboard.subscriptions');

});
