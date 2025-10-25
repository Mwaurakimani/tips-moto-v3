<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class TinyPesaController extends Controller
{
    public function __invoke(Request $requests): void
    {
        Log::info('TinyPesa Webhook Received');;
    }
}
