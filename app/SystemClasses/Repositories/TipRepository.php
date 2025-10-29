<?php

namespace App\SystemClasses\Repositories;

use App\Models\Tip;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class TipRepository
{
    /**
     * Get today's free tips
     */
    public static function getTodaysFreeTips($limit = 3): Collection
    {
        return Tip::with('match.league', 'match.homeTeam', 'match.awayTeam')
            ->where('is_free', true)
            ->where('free_for_date', Carbon::today())
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }

    /**
     * Get yesterday's winning/losing tips
     * Returns tips for matches that occurred yesterday with won/lost results
     */
    public static function getYesterdaysTips($limit = 15): Collection
    {
        $yesterdayStart = Carbon::yesterday()->startOfDay();
        $yesterdayEnd = Carbon::yesterday()->endOfDay();

        return Tip::with('match.league', 'match.homeTeam', 'match.awayTeam')
            ->whereHas('match', function ($query) use ($yesterdayStart, $yesterdayEnd) {
                $query->whereBetween('kickoff_at', [$yesterdayStart, $yesterdayEnd]);
            })
            ->whereIn('result', ['won', 'lost'])
            ->orderBy('created_at', 'desc')
            ->take($limit)
            ->get();
    }
}
