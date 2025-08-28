<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Models\League;
use App\Models\MatchModel;
use App\Models\Team;
use App\Models\Tip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
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
use Illuminate\Support\Facades\DB;
use App\Models\Transaction;

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

Route::post('onit/callback', function (Request $request) {
    Log::info('Onit callback payload', ['payload' => $request->all()]);

    // --- Normalize our reference ---
    $originator = (string) $request->input('originatorRequestId', '');

    // If no explicit originatorRequestId, try to parse it from the failure "message"
    if ($originator === '' && $request->filled('message')) {
        if (preg_match('/(?:\d+\|)?(ONIT-[A-Za-z0-9\-]+)/', (string)$request->input('message'), $m)) {
            $originator = $m[1]; // e.g. ONIT-68AF6CCB203CB
        }
    }

    // Strip any "clientId|" prefix (e.g. "1003|") and any leading "AD-"
    $normalizedRef = $originator ? Str::afterLast($originator, '|') : '';
    $normalizedRef = preg_replace('/^AD-/', '', $normalizedRef ?? '');

    if ($normalizedRef === '') {
        Log::warning('Onit callback missing resolvable originator reference', ['payload' => $request->all()]);
        return response()->json(['message' => 'Missing originator reference'], 422);
    }

    // --- Find the local transaction by our stored provider_ref ---
    // We store provider_ref = "ONIT-xxxx", so look that up.
    $transaction = Transaction::where('provider_ref', $normalizedRef)->first();

    if (!$transaction) {
        Log::warning('Transaction not found for callback', ['provider_ref' => $normalizedRef]);
        return response()->json(['message' => 'Transaction not found'], 404);
    }

    // Idempotency: if already terminal, do nothing
    if (in_array($transaction->status, ['successful', 'failed'], true)) {
        return response()->json(['message' => 'Already processed']);
    }

    // --- Determine success vs failure across both payload styles ---
    $statusField  = strtoupper((string)$request->input('status', '')); // might be "SUCCESS" on some providers
    $hasSuccessKeys = $request->has('originatorRequestId') && $request->has('transactionReference');
    $looksSuccessful = ($statusField === 'SUCCESS') || $hasSuccessKeys;

    // For success payload: amount is present; for failure it usually isn't
    $amountFromCallback = (float) $request->input('amount', 0);
    $creditAmount = $amountFromCallback > 0 ? $amountFromCallback : (float) $transaction->amount;

    // Failure details (sample has "message" and "description")
    $failureReason = (string) ($request->input('message')
        ?: $request->input('description')
            ?: 'Onit reported failure');

    // --- Apply updates atomically ---
    DB::transaction(function () use (
        $transaction,
        $looksSuccessful,
        $creditAmount,
        $failureReason,
        $request
    ) {
        if ($looksSuccessful) {
            // Mark transaction successful
            $transaction->update([
                'status' => 'successful',
                // Optionally capture provider tx ref if you have a column for it:
                // 'provider_tx_ref' => $request->input('transactionReference'),
                // Optionally you could also store channel: $request->input('channel')
            ]);

//            // Credit user balance
//            $user = $transaction->user()->lockForUpdate()->first();
//            $user->increment('balance', max(0, $creditAmount));

            Log::info('Transaction success processed', [
                'transaction_id' => $transaction->id,
                'user_id'        => $transaction->user_id,
                'credited'       => $creditAmount,
                'provider_ref'   => $transaction->provider_ref,
                'provider_txref' => $request->input('transactionReference'),
            ]);
        } else {
            // Mark transaction failed and include reason in description
            $newDesc = trim(($transaction->description ? $transaction->description . ' | ' : '') . $failureReason);

            $transaction->update([
                'status'      => 'failed',
                'description' => $newDesc,
            ]);

            Log::info('Transaction failure processed', [
                'transaction_id' => $transaction->id,
                'reason'         => $failureReason,
            ]);
        }
    });

    return response()->json(['message' => 'Callback processed']);
})->name('onit_callback');


