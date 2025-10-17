<?php

use App\Http\Controllers\DashboardController;
use App\Http\Resources\TipResource;
use App\Models\Tip;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function (Request $request) {

    $tips = TipResource::collection(Tip::with('match.league')
        ->where('is_free', true)
        ->where('free_for_date', Carbon::today())
        ->take(3)
        ->orderBy('created_at', 'desc')
        ->get())->toArray($request);
    return Inertia::render('welcome', [
        'todaysFreeTips' => $tips,
        'yesterdaysTips' => $tips
    ]);
})->name('home');

Route::get('/tips', function () {
    return Inertia::render('Home/Pages/Tips');
})->name('tips');

Route::get('/about-us', function () {
    return Inertia::render('Home/Pages/AboutUs');
})->name('about-us');


Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Dashboard sub-pages
    Route::get('/dashboard/packages', [DashboardController::class, 'packages'])
        ->name('dashboard.packages');

    Route::get('/dashboard/my-tips', [DashboardController::class, 'myTips'])
        ->name('dashboard.my-tips');

    Route::get('/dashboard/account', [DashboardController::class, 'account'])
        ->name('dashboard.account');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('adminDashboard', function () {
        return Inertia::render('adminDashboard', [
            'currentPageTitle' => 'dashboard',
        ]);
    })->name('adminDashboard');
});

Route::middleware(['auth'])->group(function () {
    Route::get('api_me', function () {
        return response()->json([
            'user' => Auth::user()
        ]);
    })->name('api_me');
});

Route::middleware('auth:sanctum')->get('/is-admin', function (Request $request) {
    $user = $request->user();

    $isAdmin = $user->roles()->where('name', 'admin')->exists();

    return response()->json([
        'is_admin' => $isAdmin,
    ]);
})->name('is_admin');


require __DIR__ . '/integration.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/AdminRoutes/Accounts.php';
require __DIR__ . '/AdminRoutes/Matches.php';
require __DIR__ . '/AdminRoutes/Tips.php';
require __DIR__ . '/AdminRoutes/Subscriptions.php';
require __DIR__ . '/AdminRoutes/Transactions.php';
