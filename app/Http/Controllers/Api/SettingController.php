<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index() {
        return Setting::all();
    }

    public function update(Request $request) {
        $data = $request->validate([
            'key' => 'required|string|max:120',
            'value' => 'required',
            'group' => 'nullable|string|max:60',
        ]);
        $setting = Setting::updateOrCreate(['key' => $data['key']], [
            'value' => $data['value'],
            'group' => $data['group'] ?? null,
        ]);
        return $setting;
    }
}
