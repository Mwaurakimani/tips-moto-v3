<?php

use App\Http\Controllers\Onit\OnitAuthorisation;
use App\Models\SubscriptionPlan;
use App\Models\Transaction;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;
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

        return Inertia::render('AdminDashboardSystem/Transactions/index', [
            'currentPageTitle' => 'Transactions',
            'transactionData' => $transactions,
        ]);
    })->name('adminDashboard.transactions');

    Route::post('package/purchase', function (Request $request) {
        $phoneNumber = $request->data['phoneNumber'];
        $package_id = $request->data['packageData']['id'];
        $package = SubscriptionPlan::find($package_id);

        do {
            $short = strtoupper(substr(str_replace('-', '', (string) Str::uuid()), 0, 7));
            $request_id = 'ONIT-' . $short;
        } while (Transaction::where('provider_ref', $request_id)->exists());

        $transaction = new Transaction();

        $transaction->user_id = auth()->user()->id;
        $transaction->currency = 'KES';
        $transaction->amount = $package->price;
        $transaction->provider = 'M-Pesa';
        $transaction->provider_ref = $request_id;
        $transaction->type = 'subscription';
        $transaction->status = 'pending';
        $transaction->metadata    = [
            'package_id'            => $package->id,
            'package_slug'          => $package->slug,
            'package_name'          => $package->name,
            'package_snapshot'      => [
                'price'     => (float) $package->price,
                'currency'  => strtoupper($package->currency ?? 'KES'),
                'interval'  => $package->interval,
                'interval_count' => (int) $package->interval_count,
                'features'  => $package->features,
            ],
            'phone'                 => $phoneNumber,
            'callback'              => route('onit_callback'),
        ];
        $transaction->save();

        switch (env('DEFAULT_PAYMENT_METHOD','ONIT')){
            case 'ONIT':
                $onit = new OnitAuthorisation();
                $onit->authenticate();
                $response = $onit->deposit([
                    "originatorRequestId" => "AD-" . $request_id,
                    "destinationAccount" => "0001650000001",
                    "sourceAccount" => $phoneNumber,
                    "amount" => intVal($package->price),
                    "channel" => "MPESA",
                    "product" => "CA05",
                    "event" => "",
                    "narration" => "Test",
                    "callbackUrl" => route('onit_callback')
                ]);

                Log::info('Transaction processed', $response);
                break;
            case 'TIPNYPESA':
                try {
                    $client = new Client();

                    $response = $client->post(
                        'https://api.tinypesa.com/api/v1/express/initialize/?username=TipsMoto',
                        [
                            'headers' => [
                                'Accept' => 'application/json',
                                'Apikey' => env('TINYPESA_API_KEY'),
                                'Content-Type' => 'application/json'
                            ],
                            'body' => json_encode([
                                'amount' => intVal($package->price),
                                'msisdn' => $phoneNumber,
                                'account_no' => 'TP-'.$request_id,
                                'username' => 'TipsMoto',
                            ]),
                            'verify' => false // for development only
                        ]
                    );
                } catch (\Exception $e) {
                    Log::error('Error initializing transaction: ' . $e->getMessage());
                }

                break;
            default:
                abort('500','Payment Service is down.Please Try again later');
        }



        return json_encode($response);
    })->name('package.purchase');
});


