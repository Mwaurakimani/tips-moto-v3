<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Http\Request;

Route::get('/', function () {
    return Inertia::render('welcome',[
        'todaysFreeTips' => []
    ]);
})->name('home');

Route::get('/tips', function () {
    return Inertia::render('Home/Pages/Tips');
})->name('tips');

Route::get('/about-us', function () {
    return Inertia::render('Home/Pages/AboutUs');
})->name('about-us');


Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('adminDashboard', function () {
        return Inertia::render('adminDashboard',[
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
