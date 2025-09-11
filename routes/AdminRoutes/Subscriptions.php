<?php

use App\Http\Controllers\PackageController;
use App\Http\Controllers\PackageProcessController;
use App\Models\SubscriptionPlan;
use App\Models\Tip;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('adminDashboard/subscriptions', [PackageProcessController::class,'index'])->name('adminDashboard.subscriptions');
    Route::post('adminDashboard/subscriptions/updateTipsData/{id}', [PackageProcessController::class,'updateTipsData'])->name('adminDashboard.updateTipsData');
});

Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('packages', PackageController::class);
});
