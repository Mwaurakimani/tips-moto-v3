<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PostMatchesController;
use App\Http\Controllers\TinyPesaController;
use App\Models\League;
use App\Models\MatchModel;
use App\Models\SubscriptionPlan;
use App\Models\Team;
use App\Models\Tip;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Hash;
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
use App\Http\Controllers\Api\UserPackagesController;
use Illuminate\Validation\Rule;

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
Route::get('/tips', [TipController::class, 'freeToday'])->name('fetchTipsApi');
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
    $normalizedRef = $originator ? \Illuminate\Support\Str::afterLast($originator, '|') : '';
    $normalizedRef = preg_replace('/^AD-/', '', $normalizedRef ?? '');

    if ($normalizedRef === '') {
        Log::warning('Onit callback missing resolvable originator reference', ['payload' => $request->all()]);
        return response()->json(['message' => 'Missing originator reference'], 422);
    }

    // --- Determine success vs failure across payload styles ---
    $statusField      = strtoupper((string) $request->input('status', '')); // sometimes "SUCCESS"
    $hasSuccessKeys   = $request->has('originatorRequestId') && $request->has('transactionReference');
    $looksSuccessful  = ($statusField === 'SUCCESS') || $hasSuccessKeys;

    $amountFromCallback = (float) $request->input('amount', 0);
    $creditAmount       = $amountFromCallback > 0 ? $amountFromCallback : 0.0; // (used in logs)

    $failureReason = (string) ($request->input('message')
        ?: $request->input('description')
            ?: 'Onit reported failure');

    // --- Atomic handling with row lock & re-check ---
    \Illuminate\Support\Facades\DB::transaction(function () use (
        $normalizedRef,
        $looksSuccessful,
        $creditAmount,
        $failureReason,
        $request
    ) {
        /** @var \App\Models\Transaction $tx */
        $tx = \App\Models\Transaction::where('provider_ref', $normalizedRef)
            ->lockForUpdate()
            ->first();

        if (! $tx) {
            Log::warning('Transaction not found for callback (inside tx)', ['provider_ref' => $normalizedRef]);
            // Nothing else to do; return 200 outside
            return;
        }

        // If already terminal, do nothing (idempotent)
        if (in_array($tx->status, ['completed','failed','refunded','canceled'], true)) {
            return;
        }

        if ($looksSuccessful) {
            $tx->update(['status' => 'completed']);

            // Create the subscription from metadata
            $packageId = data_get($tx->metadata, 'package_id');
            /** @var \App\Models\SubscriptionPlan $plan */
            $plan = \App\Models\SubscriptionPlan::findOrFail($packageId);
            $user = $tx->user;

            $start = now();
            $end   = match ($plan->interval) {
                'day'   => $start->copy()->addDays((int) $plan->interval_count),
                'week'  => $start->copy()->addWeeks((int) $plan->interval_count),
                'month' => $start->copy()->addMonths((int) $plan->interval_count),
                'year'  => $start->copy()->addYears((int) $plan->interval_count),
                default => $start->copy()->addDays((int) data_get($plan->features, 'period_days', 1)),
            };

            $user->subscriptions()->create([
                'plan_id'                 => $plan->id,
                'status'                  => 'active',
                'start_at'                => $start,
                'end_at'                  => $end,
                'gateway_subscription_id' => $tx->id, // matches your admin join
            ]);

            Log::info('Transaction success processed', [
                'transaction_id' => $tx->id,
                'user_id'        => $tx->user_id,
                'credited'       => $creditAmount,
                'provider_ref'   => $tx->provider_ref,
                'provider_txref' => $request->input('transactionReference'),
            ]);
        } else {
            $newDesc = trim(($tx->description ? $tx->description . ' | ' : '') . $failureReason);
            $tx->update([
                'status'      => 'failed',
                'description' => $newDesc,
            ]);

            Log::info('Transaction failure processed', [
                'transaction_id' => $tx->id,
                'reason'         => $failureReason,
            ]);
        }
    });

    // Always 200 to the provider, unless you specifically need to signal failure
    return response()->json(['message' => 'Callback processed']);
})->name('onit_callback');

Route::post('/tinyPesa/response', TinyPesaController::class);

Route::any('/callback', function (Request $request) {
    Log::info(json_encode($request->all()));
});

Route::post('tinypesa/callback', function (Request $request) {
    Log::info('Tiny callback payload', ['payload' => $request->all()]);

    // --- Normalize our reference ---
    $originator = (string) $request->input('originatorRequestId', '');

    // If no explicit originatorRequestId, try to parse it from the failure "message"
    if ($originator === '' && $request->filled('message')) {
        if (preg_match('/(?:\d+\|)?(ONIT-[A-Za-z0-9\-]+)/', (string)$request->input('message'), $m)) {
            $originator = $m[1]; // e.g. ONIT-68AF6CCB203CB
        }
    }

    // Strip any "clientId|" prefix (e.g. "1003|") and any leading "AD-"
    $normalizedRef = $originator ? \Illuminate\Support\Str::afterLast($originator, '|') : '';
    $normalizedRef = preg_replace('/^AD-/', '', $normalizedRef ?? '');

    if ($normalizedRef === '') {
        Log::warning('Onit callback missing resolvable originator reference', ['payload' => $request->all()]);
        return response()->json(['message' => 'Missing originator reference'], 422);
    }

    // --- Determine success vs failure across payload styles ---
    $statusField      = strtoupper((string) $request->input('status', '')); // sometimes "SUCCESS"
    $hasSuccessKeys   = $request->has('originatorRequestId') && $request->has('transactionReference');
    $looksSuccessful  = ($statusField === 'SUCCESS') || $hasSuccessKeys;

    $amountFromCallback = (float) $request->input('amount', 0);
    $creditAmount       = $amountFromCallback > 0 ? $amountFromCallback : 0.0; // (used in logs)

    $failureReason = (string) ($request->input('message')
        ?: $request->input('description')
            ?: 'Onit reported failure');

    // --- Atomic handling with row lock & re-check ---
    \Illuminate\Support\Facades\DB::transaction(function () use (
        $normalizedRef,
        $looksSuccessful,
        $creditAmount,
        $failureReason,
        $request
    ) {
        /** @var \App\Models\Transaction $tx */
        $tx = \App\Models\Transaction::where('provider_ref', $normalizedRef)
            ->lockForUpdate()
            ->first();

        if (! $tx) {
            Log::warning('Transaction not found for callback (inside tx)', ['provider_ref' => $normalizedRef]);
            // Nothing else to do; return 200 outside
            return;
        }

        // If already terminal, do nothing (idempotent)
        if (in_array($tx->status, ['completed','failed','refunded','canceled'], true)) {
            return;
        }

        if ($looksSuccessful) {
            $tx->update(['status' => 'completed']);

            // Create the subscription from metadata
            $packageId = data_get($tx->metadata, 'package_id');
            /** @var \App\Models\SubscriptionPlan $plan */
            $plan = \App\Models\SubscriptionPlan::findOrFail($packageId);
            $user = $tx->user;

            $start = now();
            $end   = match ($plan->interval) {
                'day'   => $start->copy()->addDays((int) $plan->interval_count),
                'week'  => $start->copy()->addWeeks((int) $plan->interval_count),
                'month' => $start->copy()->addMonths((int) $plan->interval_count),
                'year'  => $start->copy()->addYears((int) $plan->interval_count),
                default => $start->copy()->addDays((int) data_get($plan->features, 'period_days', 1)),
            };

            $user->subscriptions()->create([
                'plan_id'                 => $plan->id,
                'status'                  => 'active',
                'start_at'                => $start,
                'end_at'                  => $end,
                'gateway_subscription_id' => $tx->id, // matches your admin join
            ]);

            Log::info('Transaction success processed', [
                'transaction_id' => $tx->id,
                'user_id'        => $tx->user_id,
                'credited'       => $creditAmount,
                'provider_ref'   => $tx->provider_ref,
                'provider_txref' => $request->input('transactionReference'),
            ]);
        } else {
            $newDesc = trim(($tx->description ? $tx->description . ' | ' : '') . $failureReason);
            $tx->update([
                'status'      => 'failed',
                'description' => $newDesc,
            ]);

            Log::info('Transaction failure processed', [
                'transaction_id' => $tx->id,
                'reason'         => $failureReason,
            ]);
        }
    });

    // Always 200 to the provider, unless you specifically need to signal failure
    return response()->json(['message' => 'Callback processed']);
})->name('onit_callback');

Route::post('/post/matches', PostMatchesController::class);

//updates
Route::put('/user/profile', function (Request $request) {
    $user = auth()->user();

    $validatedData = $request->validate([
        'first_name' => 'required|string|max:255',
        'last_name' => 'required|string|max:255',
        'email' => [
            'required',
            'email',
            'max:255',
            Rule::unique('users')->ignore($user->id)
        ],
        'phone' => 'nullable|string|max:20',
        'current_password' => 'nullable|required_with:new_password',
        'new_password' => [
            'nullable',
            'min:8',
            'max:255',
            'different:current_password',
            'confirmed'
        ]
    ]);

    // Update basic profile information
    $user->update([
        'first_name' => $validatedData['first_name'],
        'last_name' => $validatedData['last_name'],
        'email' => $validatedData['email'],
        'phone' => $validatedData['phone'] ?? null
    ]);

    // Handle password change if new password is provided
    if (!empty($validatedData['new_password'])) {
        // Verify current password
        if (!Hash::check($validatedData['current_password'], $user->password)) {
            return response()->json([
                'message' => 'The provided password does not match your current password.',
                'errors' => [
                    'current_password' => ['Invalid current password']
                ]
            ], 422);
        }

        // Update password
        $user->password = Hash::make($validatedData['new_password']);
        $user->save();
    }

    // Refresh user to get updated data
    $user->refresh();

    // Return updated user data
    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => [
            'id' => $user->id,
            'first_name' => $user->first_name,
            'last_name' => $user->last_name,
            'email' => $user->email,
            'phone' => $user->phone,
        ]
    ]);
})->middleware(['auth:sanctum']);

