<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('adminDashboard/tips', function () {
        return Inertia::render('AdminDashboardSystem/Accounts',[
            'currentPageTitle' => 'Tips',
        ]);
    })->name('adminDashboard.tips');

});
