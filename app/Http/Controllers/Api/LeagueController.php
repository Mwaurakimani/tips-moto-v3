<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Http\Resources\LeagueResource;
use Illuminate\Http\Request;

class LeagueController extends Controller
{
    public function index(Request $request) {
        $leagues = League::with('sport')->orderBy('name')->paginate(50);
        return LeagueResource::collection($leagues);
    }
}
