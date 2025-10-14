<?php

namespace App\Http\Controllers;

use App\Models\SubscriptionPlan;
use App\Models\Tip;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PackageProcessController extends Controller
{
    public $planToGroups = [
        'Full Time Scores Daily' => ['1_X_2'],
        'Full Time Scores Weekly' => ['1_X_2'],
        'Over/Under Market Daily' => [],
        'Over/Under Market Weekly' => [],
        'Sport Pesa Mega Jackpot' => ['1X_X2_12', '1_X_2'],
        'Sport Pesa Mid Week Jackpot' => ['1X_X2_12', '1_X_2'],
        'Mozzart daily jackpot' => ['1X_X2_12', '1_X_2'],
        'Mozzart weekly jackpot' => ['1X_X2_12', '1_X_2'],
        'Odi bets weekly jackpot' => ['1X_X2_12', '1_X_2'],
        'Double Chances Daily' => ['1X_X2_12'],
        'Double Chances Weekly' => ['1X_X2_12'],
        'Goal-No Goal Daily' => [],
        'Goal-No Goal Weekly' => [],
    ];

    public function index(): \Inertia\Response
    {
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

                'features' => $plan->features ?? [],

                'analytics' => [
                    'totalSubscribers' => 0,
                    'activeSubscribers' => 0,
                    'successRate' => 0,
                    'averageRating' => 0,
                    'weeklyRevenue' => 0,
                    'totalRevenue' => 0,
                ],

                'tipsData' => (function () use ($plan) {
                    $tips_ids = $plan->features['tips_list'] ?? [];
                    return $this->getCollection($tips_ids);
                })(),

                'availableTips' => (function () use ($plan) {
                    $filters = collect($this->planToGroups[$plan->name] ?? [])
                        ->filter()
                        ->unique()
                        ->values();

                    $baseQuery = Tip::query()
                        ->join('matches as m', 'm.id', '=', 'tips.match_id')
                        ->where('m.kickoff_at', '>', now());

                    // Apply filter only if this plan has defined groups
                    if ($filters->isNotEmpty()) {
                        $baseQuery->whereIn('tips.prediction_type', $filters->all());
                    }

                    $availableTipIds = $baseQuery
                        ->distinct()
                        ->pluck('tips.id');

                    return $this->getCollection($availableTipIds);
                })(),
            ];
        });

        return Inertia::render('AdminDashboardSystem/Packages/index', [
            'currentPageTitle' => 'Packages',
            'subscriptions' => $plans
        ]);
    }

    public function getCollection(mixed $tips_ids): Collection
    {
        $ids = collect($tips_ids)->filter()->unique()->values();
        if ($ids->isEmpty()) return collect();

        return Tip::with(['match.league', 'match.homeTeam', 'match.awayTeam'])
            ->whereIn('id', $ids)
            ->get()
            ->map(function ($tip) {
                return [
                    'id' => $tip->id,
                    'match' => $tip->match->homeTeam->name . ' vs ' . $tip->match->awayTeam->name,
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
    }


    public function updateTipsData(Request $request, $id)
    {
        // Find the subscription plan or fail
        $plan = SubscriptionPlan::findOrFail($id);

        // Get the current features
        $features = $plan->features ?? [];

        // Update only the tips_list, preserving other properties
        $features['tips_list'] = collect($request['tipsData'])
            ->pluck('id')
            ->toArray();

        if (!empty($request->input('features')['for'])) {
            $features['for'] = $request->input('features')['for'];
        }

        // Update the plan with the modified features
        $plan->update([
            'features' => $features
        ]);

        return redirect()->route('adminDashboard.subscriptions')
            ->with('success', 'Tips data updated successfully.');

    }
}
