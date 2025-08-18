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
    public function index(Request $request)
    {
        $q = Tip::with('match.league')
            ->whereHas('match', function ($query) {
                $query->whereDate('kick_off', now()->toDateString());
            });

        if ($request->boolean('free_today')) {
            $q->where('is_free', true)
                ->whereDate('free_for_date', now()->toDateString());
        }

        if ($request->filled('match_id')) {
            $q->where('match_id', $request->query('match_id'));
        }

        return TipResource::collection(
            $q->orderBy('match.kickoff_at', 'asc')->paginate(50)
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
        $limit = (int) $request->query('limit', 3);
        $limit = max(1, min($limit, 50));

        $tips = Tip::with([
            'match.league',
            'match.homeTeam',
            'match.awayTeam',
        ])
            ->where('is_free', 1)
            ->whereDate('free_for_date', Carbon::today())
            ->where(function ($q) {
                $q->whereNull('publish_at')->orWhere('publish_at', '<=', now());
            })
            ->orderByDesc('publish_at')
            ->limit($limit)
            ->get();

        return TipResource::collection($tips);
    }
}
