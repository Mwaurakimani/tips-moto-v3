<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tip;
use App\Models\TipAccess;
use App\Models\TipPurchase;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TipPurchaseController extends Controller
{
    public function store(Request $request) {
        $data = $request->validate([
            'tip_id' => 'required|exists:tips,id',
            'price'  => 'required|numeric|min:0',
            'currency' => 'nullable|string|size:3',
        ]);

        $tip = Tip::findOrFail($data['tip_id']);
        $user = $request->user();

        $tx = Transaction::create([
            'user_id' => $user->id,
            'type' => 'tip_purchase',
            'amount' => $data['price'],
            'currency' => $data['currency'] ?? 'USD',
            'status' => 'completed',
            'description' => 'Tip purchase #' . $tip->id,
        ]);

        $purchase = TipPurchase::create([
            'user_id' => $user->id,
            'tip_id' => $tip->id,
            'transaction_id' => $tx->id,
            'price' => $data['price'],
            'currency' => $data['currency'] ?? 'USD',
            'status' => 'paid',
        ]);

        TipAccess::updateOrCreate(
            ['user_id' => $user->id, 'tip_id' => $tip->id],
            ['source' => 'purchase', 'granted_at' => now()]
        );

        return response()->json($purchase->load('tip'), 201);
    }
}
