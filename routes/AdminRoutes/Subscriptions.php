<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('adminDashboard/subscriptions', function () {
        return Inertia::render('AdminDashboardSystem/Accounts',[
            'currentPageTitle' => 'subscriptions',
        ]);
    })->name('adminDashboard.subscriptions');

});
