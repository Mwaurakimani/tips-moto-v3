<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Http\Resources\TeamResource;
use Illuminate\Http\Request;

class TeamController extends Controller
{
    public function index(Request $request) {
        $leagueId = $request->query('league_id');
        $q = Team::query();
        if ($leagueId) $q->where('league_id', $leagueId);
        return TeamResource::collection($q->orderBy('name')->paginate(100));
    }
}
