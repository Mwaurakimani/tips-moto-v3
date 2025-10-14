<?php

namespace App\Http\Controllers\TinyPesa;

use App\Http\Controllers\Controller;
use App\Models\Packages;
use App\Models\Subscription;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TinyPesaWebhookController extends Controller
{
    public function handle(Request $request)
    {
        Log::info('TinyPesa Raw Webhook:', $request->all());

        $payload = $this->decodePayload($request);
        if (!$payload) {
            Log::warning('Invalid TinyPesa callback format.');
            return response()->json(['message' => 'Invalid format'], 400);
        }

        $transaction = $this->findTransaction($payload['ExternalReference']);
        if (!$transaction) {
            Log::warning("Transaction not found for ref: " . $payload['ExternalReference']);
            return response()->json(['message' => 'Transaction not found'], 404);
        }

        $this->updateTransaction($transaction, $payload);

        if ($payload['ResultCode'] == 0) {
            $this->activateSubscription($transaction);
        }

        return response()->json(['message' => 'Processed'], 200);
    }

    private function decodePayload(Request $request): ?array
    {
        $raw = $request->all();
        $json = isset($raw[0]) ? json_decode($raw[0], true) : null;
        return $json['Body']['stkCallback'] ?? null;
    }

    private function findTransaction($reference): ?Transaction
    {
        return Transaction::where('transaction_reference', $reference)->first();
    }

    private function updateTransaction(Transaction $transaction, array $callback): void
    {
        $fullJson = json_encode(['Body' => ['stkCallback' => $callback]]);
        $transaction->transaction_status = $callback['ResultCode'] == 0 ? 'successful' : 'failed';
        $transaction->transaction_description = $callback['ResultDesc'] . ' | ' . $fullJson;
        $transaction->save();
    }


    private function activateSubscription(Transaction $transaction): void
    {
        $package = Packages::find($transaction->package_id);
        if (!$package) return;

        Subscription::create([
            'user_id' => $transaction->user_id,
            'package_id' => $package->id,
            'start_date' => now()->format('Y-m-d'),
            'end_date' => now()->addDays($package->period)->format('Y-m-d'),
            'status' => 'active',
            'transaction_id' => $transaction->id,
        ]);
    }
}
