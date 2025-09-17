<?php

namespace App\SystemClasses;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;
use App\Models\Tip;

trait TipFetcher
{
    protected function readAndClampLimit(Request $request, int $default = 3, int $min = 1, int $max = 50): int
    {
        $limit = (int) $request->query('limit', $default);
        return max($min, min($limit, $max));
    }

    protected function parseIds(Request $request, array $default = []): Collection
    {
        $idsInput = $request->input('ids', $default);
        if (is_string($idsInput)) {
            $idsInput = explode(',', $idsInput);
        }

        return collect($idsInput)
            ->map(fn ($v) => (int) $v)
            ->filter()
            ->unique()
            ->values();
    }

    protected function hasIds(Collection $ids): bool
    {
        return $ids->isNotEmpty();
    }

    protected function buildBaseQuery(): Builder
    {
        return Tip::with([
            'match.league',
            'match.homeTeam',
            'match.awayTeam',
        ]);
    }

    protected function fetchByIdsPreservingOrder(Builder $base, Collection $ids, int $limit): \Illuminate\Database\Eloquent\Collection
    {
        $idArray = $ids->all();
        $count   = count($idArray);
        $placeholders = implode(',', array_fill(0, $count, '?'));

        return $base
            ->whereIn('id', $idArray)
            ->orderByRaw("FIELD(id, $placeholders)", $idArray)
            ->limit(min($limit, $count))
            ->get();
    }

    protected function fetchFreeToday(Builder $base, int $limit): Collection
    {
        return $base
            ->where('is_free', 1)
            ->whereDate('free_for_date', Carbon::today())
            ->where(function ($q) {
                $q->whereNull('publish_at')->orWhere('publish_at', '<=', now());
            })
            ->orderByDesc('publish_at')
            ->limit($limit)
            ->get();
    }
}

