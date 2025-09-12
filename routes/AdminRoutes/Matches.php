<?php

use App\Http\Controllers\MatchController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\MatchModel;



Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('adminDashboard/matches', function () {
        $matches = MatchModel::with(['league', 'homeTeam', 'awayTeam', 'tips'])
            ->orderBy('kickoff_at', 'desc')
            ->get()
            ->map(function ($match) {
                return [
                    'id' => $match->id,
                    'league' => $match->league->name ?? 'Unknown',
                    'homeTeam' => $match->homeTeam->name ?? 'Unknown',
                    'awayTeam' => $match->awayTeam->name ?? 'Unknown',
                    'date' => $match->kickoff_at->format('Y-m-d'),
                    'time' => $match->kickoff_at->format('H:i'),
                    'tips' => $match->tips->count(), // total number of tips
                    'tipsData' => $match->tips->map(function ($tip) {
                        return [
                            'id' => $tip->id,
                            'tipType' => $tip->prediction_type,
                            'subType' => $tip->pick_label,
                            'value' => $tip->prediction_value,
                            'prediction' => $tip->prediction_value, // adjust if needed
                            'riskLevel' => $tip->risk_level,
                            'winningStatus' => $tip->result,
                            'free' => (bool)$tip->is_free,
                        ];
                    }),
                    'status' => $match->status,
                ];
            });

        return Inertia::render('AdminDashboardSystem/Matches/index', [
            'currentPageTitle' => 'Matches',
            'matches' => $matches,
        ]);
    })->name('adminDashboard.matches');

    Route::post('adminDashboard/matches/create',[MatchController::class,'store'] )->name('adminDashboard.matches.create');

    Route::put('adminDashboard/matches/update/{match}',[MatchController::class,'update'] )->name('adminDashboard.matches.update');

    Route::post('/adminDashboard/matches/{match}/tips',[MatchController::class,'addTip'] )->name('adminDashboard.tip.add');

    Route::delete('/adminDashboard/tips/{tip}', [MatchController::class, 'deleteTip'])->name('adminDashboard.tip.delete');

    Route::put('/adminDashboard/tips/{tip}', [MatchController::class, 'updateTip'])->name('adminDashboard.tip.update');



});
