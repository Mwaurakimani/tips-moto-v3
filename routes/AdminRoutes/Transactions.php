<?php

use App\Http\Controllers\Onit\OnitAuthorisation;
use App\Models\SubscriptionPlan;
use App\Models\Transaction;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;


Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('adminDashboard/transactions', function () {
        // Join transactions with users and subscription plans
        $transactions = DB::table('transactions')
            ->join('users', 'transactions.user_id', '=', 'users.id')
            ->leftJoin('subscriptions', 'transactions.id', '=', 'subscriptions.gateway_subscription_id')
            ->leftJoin('subscription_plans', 'subscriptions.plan_id', '=', 'subscription_plans.id')
            ->select(
                'transactions.id',
                'transactions.amount',
                'transactions.currency',
                'transactions.status',
                'transactions.provider_ref as reference',
                'transactions.created_at',
                'users.first_name',
                'users.last_name',
                'users.email',
                'users.phone',
                'subscription_plans.name as package'
            )
            ->orderByDesc('transactions.created_at')
            ->get()
            ->map(function ($t) {
                return [
                    'id' => $t->id,
                    'user' => trim($t->first_name . ' ' . $t->last_name),
                    'email' => $t->email,
                    'package' => $t->package ?? 'N/A',
                    'amount' => (float)$t->amount,
                    'currency' => $t->currency,
                    'status' => $t->status,
                    'reference' => $t->reference,
                    'phone' => $t->phone,
                    'date' => \Carbon\Carbon::parse($t->created_at)->format('Y-m-d'),
                    'time' => \Carbon\Carbon::parse($t->created_at)->format('H:i:s'),
                ];
            });

        return Inertia::render('AdminDashboardSystem/Transactions', [
            'currentPageTitle' => 'Transactions',
            'transactionData' => $transactions,
        ]);
    })->name('adminDashboard.transactions');

    Route::post('package/purchase', function (Request $request) {
        $phohe = $request->input('phohe');
//        $package = $request->input('package');

        $package = 8;
        $package = SubscriptionPlan::find($package);
        $request_id = 'ONIT-' . Str::uuid()->toString();
        $transaction = new Transaction();

        $transaction->user_id = auth()->user()->id;
        $transaction->currency = 'KSH';
        $transaction->amount = $package->price;
        $transaction->provider = 'M-Pesa';
        $transaction->provider_ref = $request_id;
        $transaction->type = 'subscription';
        $transaction->status = 'pending';
        $transaction->save();


        $onit = new OnitAuthorisation();
        $onit->authenticate();
        $response = $onit->deposit([
            "originatorRequestId" => "AD-" . $request_id,
            "destinationAccount" => "0001650000001",
            "sourceAccount" => $phohe,
            "amount" => $package->price,
            "channel" => "MPESA",
            "product" => "CA05",
            "event" => "",
            "narration" => "",
            "callbackUrl" => route('onit_callback')
        ]);

        dd($response);
    })->name('package.purchase');
});
