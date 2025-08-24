<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Onit\OnitAuthorisation;
use App\Models\Ledger;
use Illuminate\Http\Request;

class LedgerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): \Illuminate\Database\Eloquent\Collection
    {
        // Get all ledgers with related user
        return Ledger::with('user')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): \Illuminate\Http\JsonResponse
    {
//        $ledger = Ledger::create(
//            [
//                'user_id' => 1,
//                'type'    => $request->input('type'),
//                'amount'  => $request->input('amount'),
//                'status'  => 'Pending',
//                'date'    => $request->input('date'),
//            ]
//        );

        $unique_id = str_pad(random_int(1, 999999999), 9, "0", STR_PAD_LEFT);


        $onit = new OnitAuthorisation();
        $onit->authenticate();
        $response = $onit->deposit([
            "originatorRequestId" => "AD-".$unique_id,
            "destinationAccount"  => "0001650000001",
            "sourceAccount"       => "254759469851",
            "amount"              => $request->get('amount'),
            "channel"             => "MPESA",
            "product"             => "CA05",
            "event"               => "",
            "narration"           => "Chequemate-ID_001",
            "callbackUrl"         => "https://nexusgaming.co.ke/integration/callback"
        ]);

        dd($response);


//        return response()->json($ledger, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ledger $ledger): Ledger
    {
        return $ledger->load('user');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ledger $ledger)
    {
        $validated = $request->validate([
            'type'    => 'sometimes|string',
            'amount'  => 'sometimes|numeric|min:0',
            'status'  => 'sometimes|string',
            'date'    => 'sometimes|date',
        ]);

        $ledger->update($validated);

        return response()->json($ledger);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ledger $ledger): \Illuminate\Http\JsonResponse
    {
        $ledger->delete();

        return response()->json(null, 204);
    }
}
