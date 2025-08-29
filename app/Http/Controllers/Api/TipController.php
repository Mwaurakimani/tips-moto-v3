<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tip;
use App\Http\Requests\TipStoreRequest;
use App\Http\Requests\TipUpdateRequest;
use App\Http\Resources\TipResource;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;


class TipController extends Controller
{
    public function index(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        // Accept ids as array: ?ids[]=12&ids[]=34&ids[]=56 OR comma string: ?ids=12,34,56
        $idsInput = $request->input('ids', [734,726,718]);
        if (is_string($idsInput)) {
            $idsInput = explode(',', $idsInput);
        }

        $ids = collect($idsInput)
            ->map(fn ($v) => (int) $v)
            ->filter()
            ->unique()
            ->values()
            ->take(3); // limit to 3

        $q = Tip::with('match.league')
            ->join('matches', 'tips.match_id', '=', 'matches.id')
            ->select('tips.*');

        if ($ids->isNotEmpty()) {
            // Only the requested tips (max 3) and preserve the incoming order
            $placeholders = implode(',', array_fill(0, $ids->count(), '?'));
            $q->whereIn('tips.id', $ids->all())
                ->orderByRaw("FIELD(tips.id, $placeholders)", $ids->all())
                ->limit(3);

            return TipResource::collection($q->get());
        }

        // Fallback (no ids passed): return 3 tips for today (keep your original behavior)
        $q->whereHas('match', fn ($m) => $m->whereDate('kickoff_at', now()->toDateString()));

        if ($request->boolean('free_today')) {
            $q->where('tips.is_free', 1)
                ->whereDate('tips.free_for_date', now()->toDateString());
        }

        if ($request->filled('match_id')) {
            $q->where('tips.match_id', $request->query('match_id'));
        }

        return TipResource::collection(
            $q->orderBy('matches.kickoff_at', 'asc')->limit(3)->get()
        );
    }


    public function show(Tip $tip) {
        return new TipResource($tip->load('match.league'));
    }

    public function store(TipStoreRequest $request) {
        $data = $request->validated();
        $data['author_id'] = $request->user()->id ?? null;
        $tip = Tip::create($data);
        return (new TipResource($tip->load('match.league')))->response()->setStatusCode(201);
    }

    public function update(TipUpdateRequest $request, Tip $tip) {
        $tip->update($request->validated());
        return new TipResource($tip->fresh()->load('match.league'));
    }

    public function destroy(Tip $tip) {
        $tip->delete();
        return response()->noContent();
    }


    public function freeToday(Request $request): \Illuminate\Http\Resources\Json\AnonymousResourceCollection
    {
        // limit 1–50 (default 3)
        $limit = (int) $request->query('limit', 3);
        $limit = max(1, min($limit, 50));

        // Accept ids as array (?ids[]=1&ids[]=2&ids[]=3) or comma string (?ids=1,2,3)

        $idsInput = $request->input('ids', [788,784,780]);
        if (is_string($idsInput)) {
            $idsInput = explode(',', $idsInput);
        }
        $ids = collect($idsInput)
            ->map(fn ($v) => (int) $v)
            ->filter()
            ->unique()
            ->values();

        $base = Tip::with([
            'match.league',
            'match.homeTeam',
            'match.awayTeam',
        ]);

        // If specific IDs are provided: return exactly those (featured/manual pick),
        // preserving the incoming order and respecting the limit.
        if ($ids->isNotEmpty()) {
            $placeholders = implode(',', array_fill(0, $ids->count(), '?'));

            $tips = $base
                ->whereIn('id', $ids->all())
                ->orderByRaw("FIELD(id, $placeholders)", $ids->all())
                ->limit(min($limit, $ids->count()))
                ->get();

            return TipResource::collection($tips);
        }

        // Fallback: "free today" logic
        $tips = $base
            ->where('is_free', 1)
            ->whereDate('free_for_date', Carbon::today())
            ->where(function ($q) {
                $q->whereNull('publish_at')
                    ->orWhere('publish_at', '<=', now());
            })
            ->orderByDesc('publish_at')
            ->limit($limit)
            ->get();

        return TipResource::collection($tips);
    }

}
