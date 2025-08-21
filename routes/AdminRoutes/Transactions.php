<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('adminDashboard/transactions', function () {
        return Inertia::render('AdminDashboardSystem/Accounts',[
            'currentPageTitle' => 'Transactions',
        ]);
    })->name('adminDashboard.transactions');

});
