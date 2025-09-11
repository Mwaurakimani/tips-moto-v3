<?php

use App\Http\Controllers\PackageController;
use App\Models\SubscriptionPlan;
use App\Models\Tip;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('adminDashboard/subscriptions', function () {
        $plans = SubscriptionPlan::all()->map(function ($plan) {
            return [
                'id' => $plan->id,
                'name' => $plan->name,
                'slug' => $plan->slug,
                'price' => (float)$plan->price,
                'currency' => strtoupper($plan->currency),
                'interval' => $plan->interval,
                'interval_count' => $plan->interval_count,
                'trial_days' => $plan->trial_days,
                'is_active' => (bool)$plan->is_active,
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
                'tipsData' => (function () {
                    $tips_ids = [2446, 2485, 2476, 2479, 2464, 2443, 2449, 2458, 2482, 2461, 2491, 2452, 2473, 2470, 2488, 2494, 2455, 2467];
                    return Tip::with('match')->whereIn('id', $tips_ids)->get()->flatten(1)->map(function ($tip) {
                        return [
                            'id' => $tip->id,
                            'match' => $tip->match->homeTeam->name. ' vs ' . $tip->match->awayTeam->name,
                            'homeTeam' => $tip->match->homeTeam->name,
                            'awayTeam' => $tip->match->awayTeam->name,
                            'league' => $tip->match->league->name,
                            'prediction' => $tip->pick_label,
                            'tipType' => $tip->prediction_type,
                            'riskLevel' => $tip->risk_level,
                            'winningStatus' => null,
                            'time' => $tip->match->kickoff_at?->format('H:i'),
                        ];
                    });
                })(),

            ];
        });

        return Inertia::render('AdminDashboardSystem/Packages/index', [
            'currentPageTitle' => 'Packages',
            'subscriptions' => $plans
        ]);
    })->name('adminDashboard.subscriptions');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('packages', PackageController::class);
});
