<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\MatchModel;

Route::middleware(['auth', 'verified'])->prefix('admin')->group(function () {

    Route::get('adminDashboard/tips', function () {
        // Fetch matches with related tips
        $matches = MatchModel::with(['tips' => function ($query) {
            $query->select(
                'id',
                'match_id',
                'prediction_type as tipType',
                'prediction_value as prediction',
                'risk_level as riskLevel',
                'status as winningStatus',
                'is_free as free',
                'free_for_date'
            );
        }])
            ->select('id', 'league_id', 'home_team_id as homeTeam', 'away_team_id as awayTeam', 'kickoff_at', 'status')
            ->get()
            ->map(function ($match) {
                return [
                    'id' => $match->id,
                    'league' => $match->league,
                    'homeTeam' => $match->homeTeam,
                    'awayTeam' => $match->awayTeam,
                    'date' => $match->kickoff_at->format('M d Y'), // "Jul 30 2025"
                    'time' => $match->kickoff_at->format('H:i'),
                    'status' => $match->status,
                    'tipsData' => $match->tips->map(function ($tip) {
                        return [
                            'id' => $tip->id,
                            'tipType' => $tip->tipType,
                            'prediction' => $tip->prediction,
                            'riskLevel' => $tip->riskLevel,
                            'winningStatus' => $tip->winningStatus,
                            'free' => $tip->free,
                        ];
                    }),
                ];
            });

        return Inertia::render('AdminDashboardSystem/Tips', [
            'currentPageTitle' => 'Tips',
            'matches' => $matches,
        ]);
    })->name('adminDashboard.tips');

});
