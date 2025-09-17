<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Api\UserPackagesController;
use App\Http\Resources\TipResource;
use App\Models\SubscriptionPlan;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MatchModel;
use App\Models\Tip;
use App\Models\Subscription;
use Inertia\Response;

class DashboardController extends AbstractTipController
{

    public $tips = [];

    public function __construct()
    {
        $this->tips = Tip::whereDate('created_at', Carbon::today())->pluck('id')->toArray();
    }

    public function index(Request $request): Response
    {
        $user = $request->user();

        $tips = TipResource::collection(Tip::with('match.league')
            ->where('is_free', true)
            ->where('free_for_date', Carbon::today())
            ->take(3)
            ->orderBy('created_at', 'desc')
            ->get())->toArray($request);

        // Get user's matches and stats
        $matches = MatchModel::with(['tips', 'homeTeam', 'awayTeam', 'league'])
            ->where('kickoff_at', '>=', now())
            ->take(10)
            ->get();

        $stats = [
        ];

        return Inertia::render('dashboard', [
            'matches' => $tips,
            'stats' => $stats,
        ]);
    }

    public function packages(Request $request): Response
    {
        $user = $request->user();

        $counter = 1;

        // Get available packages/subscription plans
        $packages = SubscriptionPlan::where('is_active', true)
            ->get();

        // Get matches for package preview
        $matches = MatchModel::with(['tips', 'homeTeam', 'awayTeam', 'league'])
            ->where('kickoff_at', '>=', now())
            ->take(20)
            ->get();

        return Inertia::render('UserDashboard/DashboardPackages', [
            'packages' => $packages,
            'matches' => $matches,
        ]);
    }

    /** Reused logic injected into myTipsCopy */
    public function myTips(Request $request): Response
    {
        $limit = $this->readAndClampLimit($request, 100);   // default 20 for dashboard page size
        $ids = $this->parseIds($request, $this->tips ?? []);
        $base = $this->buildBaseQuery();

        $tips = $this->hasIds($ids)
            ? $this->fetchByIdsPreservingOrder($base, $ids, $limit)
            : $this->fetchFreeToday($base, $limit);

        $matchIds = $tips->pluck('match_id')->filter()->unique()->values();

        $matches = MatchModel::with(['tips', 'homeTeam', 'awayTeam', 'league'])
            ->whereIn('id', $matchIds)
            ->where('kickoff_at', '>=', now())
            ->orderBy('kickoff_at', 'desc')
            ->get();

        // If you specifically need pagination objects for the Inertia table,
        // you can wrap $tips into a simple manual paginator, otherwise pass as-is.
        return Inertia::render('UserDashboard/DashboardMyTips', [
            'userTips' => TipResource::collection($tips),
            'matches' => $matches,
            'activePackages' => (new UserpackagesController())->getActivePackages()
        ]);
    }

    public function account(Request $request): Response
    {
        $user = $request->user();

        return Inertia::render('UserDashboard/DashboardAccount');
    }
}
