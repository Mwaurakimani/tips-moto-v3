<?php

use App\Http\Controllers\LedgerController;
use App\Models\Ledger;
use App\Models\User;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('integration', function () {
    $user = User::where('email','kimmwaus@gmail.com')->first();
    $ledger = Ledger::all();

    return Inertia::render('integration',[
        'user' => $user,
        'ledger' => $ledger
    ]);
})->name('integration');


Route::post('integration/callback', function (Request $request) {
    Log::info(json_encode($request->all()));
})
    ->withoutMiddleware([VerifyCsrfToken::class])
    ->name('integration');

Route::resource('/ledger', LedgerController::class)
    ->withoutMiddleware([VerifyCsrfToken::class]);
;
