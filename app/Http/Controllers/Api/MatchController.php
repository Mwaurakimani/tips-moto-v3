<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MatchModel;
use App\Http\Resources\MatchResource;
use Illuminate\Http\Request;

class MatchController extends Controller
{
    public function index(Request $request) {
        $status = $request->query('status');
        $q = MatchModel::with(['league','homeTeam','awayTeam']);
        if ($status) $q->where('status', $status);
        return MatchResource::collection($q->orderBy('kickoff_at')->paginate(50));
    }

    public function show(MatchModel $match) {
        return new MatchResource($match->load(['league','homeTeam','awayTeam','tips']));
    }

    public function update(Request $request, MatchModel $match) {
        $data = $request->validate([
            'status' => 'in:scheduled,live,finished,postponed,canceled',
            'score_home' => 'nullable|integer|min:0|max:99',
            'score_away' => 'nullable|integer|min:0|max:99',
            'kickoff_at' => 'nullable|date',
        ]);
        $match->update($data);
        return new MatchResource($match->fresh()->load(['league','homeTeam','awayTeam']));
    }
}
