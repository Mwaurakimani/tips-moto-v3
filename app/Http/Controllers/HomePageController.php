<?php

namespace App\Http\Controllers;

use App\Http\Resources\TipResource;
use App\Models\Subscription;
use App\Models\User;
use App\SystemClasses\Repositories\TipRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomePageController extends Controller
{
    public function index(Request $request)
    {
        $todayFreeTipsMessage = "";
        // Get yesterday's winning/losing tips
        $yesterdaysTips = TipRepository::getYesterdaysTips();
        $formattedYesterdaysTips = TipResource::collection($yesterdaysTips)->toArray($request);

        $todayFreeTipsMessage = $this->getDisplayMessage();

        $todaysTips = TipRepository::getTodaysFreeTips();
        $formattedTodaysTips = TipResource::collection($todaysTips)->toArray($request);


        return Inertia::render('welcome', [
            'todaysFreeTips' => $formattedTodaysTips,
            'yesterdaysTips' => $formattedYesterdaysTips,
            'todayFreeTipsMessage' => $todayFreeTipsMessage
        ]);
    }

    private function getDisplayMessage(): string
    {
        if (!auth()->check())
            return "Log in to view";

        // check if the diffrence between now and the user's created_at is greater than 3 days'
        $createdAtIsGreaterThan3Days = User::where('id', auth()->id())->first()->created_at < now()->subDays(3);

        /*
         * check if the user has any premium package active
         * the subscription is considered active when the end_at is greater than now and status is active
         */
        $hasNoPremiumPackageActive = Subscription::where('user_id', auth()->id())
                ->where('end_at', '>', now())
                ->where('status', 'active')
                ->count() === 0;

        if ($createdAtIsGreaterThan3Days && $hasNoPremiumPackageActive)
            return "Purchase at least one premium package to view";

        return "";
    }


}
