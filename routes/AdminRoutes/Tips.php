<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\MatchModel;

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {

    Route::get('adminDashboard/tips', function () {
        $matches = MatchModel::with([
            'league:id,name',
            'homeTeam:id,name',
            'awayTeam:id,name',
            'tips' => function ($query) {
                $query->select(
                    'id',
                    'match_id',
                    'prediction_type as tipType',
                    'pick_label as prediction',
                    'risk_level as riskLevel',
                    'status as winningStatus',
                    'is_free as free',
                    'free_for_date'
                );
            }
        ])
            ->select('id', 'league_id', 'home_team_id', 'away_team_id', 'kickoff_at', 'status')
            ->get()
            ->map(function ($match) {
                return [
                    'id' => $match->id,
                    'league' => $match->league ? $match->league->name : null,
                    'homeTeam' => $match->homeTeam ? $match->homeTeam->name : null,
                    'awayTeam' => $match->awayTeam ? $match->awayTeam->name : null,
                    'date' => $match->kickoff_at?->format('M d Y'),
                    'time' => $match->kickoff_at?->format('H:i'),
                    'status' => $match->status,
                    'tipsData' => $match->tips->map(fn ($tip) => [
                        'id' => $tip->id,
                        'tipType' => $tip->tipType,
                        'prediction' => $tip->prediction,
                        'riskLevel' => $tip->riskLevel,
                        'winningStatus' => $tip->winningStatus,
                        'free' => $tip->free,
                    ]),
                ];
            });

        return Inertia::render('AdminDashboardSystem/Tips', [
            'currentPageTitle' => 'Tips',
            'matches' => $matches,
        ]);
    })->name('adminDashboard.tips');

});
