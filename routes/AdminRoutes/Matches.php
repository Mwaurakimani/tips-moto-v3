<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('adminDashboard/matches', function () {
        return Inertia::render('AdminDashboardSystem/Accounts',[
            'currentPageTitle' => 'Matches',
        ]);
    })->name('adminDashboard.matches');

});
