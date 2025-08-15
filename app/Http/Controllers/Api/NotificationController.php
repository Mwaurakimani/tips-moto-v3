<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request) {
        $items = Notification::where('user_id', $request->user()->id)
            ->orderByDesc('created_at')->paginate(50);
        return NotificationResource::collection($items);
    }

    public function read(Notification $notification) {
        $notification->update(['read_at' => now()]);
        return new NotificationResource($notification->fresh());
    }
}
