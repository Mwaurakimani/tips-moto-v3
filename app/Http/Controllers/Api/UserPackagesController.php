<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Tip;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;

class UserPackagesController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->validate(['email' => ['required','email']]);

        $user = User::where('email', $data['email'])->first();
        if (! $user) {
            return response()->json(['data' => []]);
        }

        // Get subscriptions + plan (assumes SubscriptionPlan::$casts['features'] = 'array')
        $subs = $user->subscriptions()->with('plan')->get();

        // Collect all tip IDs across all plans (keep order per plan later)
        $allTipIds = $subs->map(function ($sub) {
            $features = $sub->plan?->features ?? [];
            if (!is_array($features)) {
                $decoded = json_decode($features, true);
                $features = is_array($decoded) ? $decoded : [];
            }
            $ids = $features['tips_list'] ?? [];
            return is_array($ids) ? $ids : [];
        })
            ->flatten()
            ->filter()       // remove nulls
            ->unique()
            ->values();

        // Fetch all required tips once (with relations)
        $tipsById = Tip::with(['match.league', 'match.homeTeam', 'match.awayTeam'])
            ->whereIn('id', $allTipIds)
            ->get()
            ->keyBy('id');

        $now = now();

        // Build response per subscription
        $subs = $subs->map(function ($sub) use ($now, $tipsById) {
            $start = $sub->start_at;
            $end   = $sub->end_at;

            $isActive = ($sub->status === 'active') && (is_null($end) || $end->greaterThan($now));
            $expiryTs = $end ? $end->getTimestamp() : PHP_INT_MAX;

            // Pull plan tip IDs in original order
            $features = $sub->plan?->features ?? [];
            if (!is_array($features)) {
                $decoded = json_decode($features, true);
                $features = is_array($decoded) ? $decoded : [];
            }
            $tipIds = $features['tips_list'] ?? [];
            $tipIds = is_array($tipIds) ? $tipIds : [];

            // Map to required shape (skip missing IDs safely)
            $tipsData = collect($tipIds)
                ->map(function ($id) use ($tipsById) {
                    $tip = $tipsById->get($id);
                    if (!$tip || !$tip->match) return null;

                    return [
                        'id'            => $tip->id,
                        'match'         => ($tip->match->homeTeam?->name ?? '—') . ' vs ' . ($tip->match->awayTeam?->name ?? '—'),
                        'homeTeam'      => $tip->match->homeTeam?->name,
                        'awayTeam'      => $tip->match->awayTeam?->name,
                        'league'        => $tip->match->league?->name,
                        'prediction'    => $tip->pick_label,
                        'tipType'       => $tip->prediction_type,
                        'riskLevel'     => $tip->risk_level,
                        'winningStatus' => null,
                        'time'          => $tip->match->kickoff_at?->format('H:i'),
                    ];
                })
                ->filter() // drop nulls
                ->values();

            return [
                'id'           => $sub->id,
                'name'         => optional($sub->plan)->name,
                'slug'         => optional($sub->plan)->slug,
                'status'       => $isActive ? 'active' : 'expired',
                'purchaseDate' => optional($start)->toIso8601String(),
                'expiryDate'   => optional($end)->toIso8601String(),

                // Optional UI fields
                'price'        => optional($sub->plan)->price ?? null,
                'winRate'      => $sub->win_rate      ?? null,
                'tipsAccessed' => $sub->tips_accessed ?? null,
                'totalTips'    => $sub->total_tips    ?? null,

                // Attach tips list for this plan
                'tipsData'     => $tipsData,

                // helpers for sorting
                '_isActive'    => $isActive,
                '_expiryTs'    => $expiryTs,
            ];
        })
            // Active first, then by farthest expiry
            ->sortBy([
                ['_isActive', 'desc'],
                ['_expiryTs', 'desc'],
            ])
            ->values()
            ->map(fn ($p) => Arr::except($p, ['_isActive', '_expiryTs']));

        return response()->json(['data' => $subs]);
    }
}
