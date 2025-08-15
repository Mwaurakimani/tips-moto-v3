<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\League;
use App\Models\MatchModel;
use App\Models\Team;
use App\Models\Tip;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\LeagueController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\MatchController;
use App\Http\Controllers\Api\TipController;
use App\Http\Controllers\Api\SubscriptionController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\TipPurchaseController;
use App\Http\Controllers\Api\SupportTicketController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\SettingController;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

// Public
Route::get('/leagues', [LeagueController::class, 'index']);
Route::get('/teams', [TeamController::class, 'index']);
Route::get('/matches', [MatchController::class, 'index']);
Route::get('/json_matches', function () {

    $storage = Storage::disk('local')->path('matches.json');
    $file = File::get($storage);
    $data = json_decode($file, true);
    $teams = [];
    $leagues = [];

    $data = collect($data);

    foreach ($data as $confidenceLevel => $match) {
        foreach ($match as $game) {
            $teams[] = $game['Home Team'];
            $leagues[] = $game['league'];
            $teams[] = $game['Away Team'];
        }
    }

    $unique_leagues = array_unique($leagues);

    foreach ($unique_leagues as $leagueName) {
        League::updateOrCreate(
            ['name' => $leagueName],
            [
                'sport_id' => 1,
                'name' => $leagueName,
                'country' => 'all',
                'slug' => Str::slug($leagueName),
            ]
        );
    }

    $unique_teams = array_unique($teams);

    foreach ($unique_teams as $unique_team) {
        Team::updateOrCreate(
            ['name' => $unique_team],
            [
                'league_id' => 1,
                'name' => $unique_team,
                'short_name' => $unique_team,
                'country' => 'all',
                'logo_url' => 'none',
            ]
        );
    }

    foreach ($data as $confidenceLevel => $match) {
        foreach ($match as $game) {
            $match = MatchModel::updateOrCreate(
                [
                    'league_id' => League::where('name', $game['league'])->first()->id,
                    'home_team_id' => Team::where('name', $game['Home Team'])->first()->id,
                    'away_team_id' => Team::where('name', $game['Away Team'])->first()->id,
                ],
                [
                    'kickoff_at' => $game['date'],
                ]
            );

            foreach ($game['tips'] as $key => $tip) {

                if ($key == 'Over/Under'){
                    continue;
                }

                Tip::updateOrCreate(
                    [
                        'match_id' => $match->id,
                        'prediction_type' => $key,
                    ],
                    [
                        'prediction_value' => $game['tips'][$key]['result'],
                        'pick_label' => 'label',
                    ]
                );
            }
        }
    }





    return response()->json($unique_leagues);
});
Route::get('/matches/{match}', [MatchController::class, 'show']);
Route::get('/tips', [TipController::class, 'index'])->name('fetchTipsApi');
Route::get('/tips/free-today', [TipController::class, 'freeToday']);
Route::get('/tips/{tip}', [TipController::class, 'show']);
Route::get('/plans', [SubscriptionController::class, 'plans']);



// Authenticated
Route::middleware('auth:sanctum')->group(function () {

    Route::post('/tips', [TipController::class, 'store']);
    Route::put('/tips/{tip}', [TipController::class, 'update']);
    Route::delete('/tips/{tip}', [TipController::class, 'destroy']);

    Route::post('/subscriptions', [SubscriptionController::class, 'store']);
    Route::get('/subscriptions', [SubscriptionController::class, 'index']);
    Route::post('/subscriptions/{subscription}/cancel', [SubscriptionController::class, 'cancel']);

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/{transaction}', [TransactionController::class, 'show']);

    Route::post('/tip-purchases', [TipPurchaseController::class, 'store']);

    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::post('/notifications/{notification}/read', [NotificationController::class, 'read']);

    Route::get('/support/tickets', [SupportTicketController::class, 'index']);
    Route::post('/support/tickets', [SupportTicketController::class, 'store']);
    Route::post('/support/tickets/{ticket}/message', [SupportTicketController::class, 'message']);

    Route::get('/settings', [SettingController::class, 'index']);
    Route::post('/settings', [SettingController::class, 'update']);

    Route::put('/matches/{match}', [MatchController::class, 'update']);
});
