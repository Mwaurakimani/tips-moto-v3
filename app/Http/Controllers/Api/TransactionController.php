<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Http\Resources\TransactionResource;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function index(Request $request) {
        $tx = Transaction::where('user_id', $request->user()->id)->orderByDesc('created_at')->paginate(50);
        return TransactionResource::collection($tx);
    }

    public function show(Transaction $transaction) {
        $this->authorize('view', $transaction);
        return new TransactionResource($transaction);
    }
}
