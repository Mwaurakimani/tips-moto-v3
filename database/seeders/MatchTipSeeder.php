<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\League;
use App\Models\Team;
use App\Models\MatchModel;
use App\Models\Tip;
use Carbon\Carbon;

class MatchTipSeeder extends Seeder
{
    public function run(): void
    {
        $league = League::where('slug','premier-league')->first();
        if (! $league) return;

        $teams = Team::where('league_id', $league->id)->get();
        if ($teams->count() < 2) return;

        $home = $teams[0];
        $away = $teams[1];

        $match = MatchModel::firstOrCreate([
            'league_id' => $league->id,
            'home_team_id' => $home->id,
            'away_team_id' => $away->id,
            'kickoff_at' => Carbon::now()->addDay(),
        ], ['status' => 'scheduled']);

        Tip::firstOrCreate([
            'match_id' => $match->id,
            'prediction_type' => '1_X_2',
            'prediction_value' => 1,
            'pick_label' => '1',
        ], [
            'odds' => 1.75,
            'confidence' => 80,
            'risk_level' => 'low',
            'is_free' => true,
            'free_for_date' => Carbon::today(),
            'visibility' => 'public',
            'publish_at' => Carbon::now(),
        ]);
    }
}
