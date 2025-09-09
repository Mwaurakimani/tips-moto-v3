<?php

namespace App\Http\Controllers;

use App\SystemClasses\TipFetcher;

abstract class AbstractTipController extends Controller
{
    use TipFetcher;
}
