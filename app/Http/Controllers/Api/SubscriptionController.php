<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Subscription;
use App\Models\SubscriptionPlan;
use App\Http\Resources\SubscriptionPlanResource;
use App\Http\Resources\SubscriptionResource;
use App\Http\Requests\SubscriptionStoreRequest;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function plans() {
        $plans = SubscriptionPlan::where('is_active', true)->orderBy('price')->get();
        return SubscriptionPlanResource::collection($plans);
    }

    public function index(Request $request) {
        $subs = Subscription::with('plan')->where('user_id', $request->user()->id)->get();
        return SubscriptionResource::collection($subs);
    }

    public function store(SubscriptionStoreRequest $request) {
        $plan = SubscriptionPlan::findOrFail($request->validated()['plan_id']);
        $sub = Subscription::create([
            'user_id' => $request->user()->id,
            'plan_id' => $plan->id,
            'status' => 'active',
            'start_at' => now(),
            'end_at' => null,
            'renews_at' => now()->addMonths(1),
            'auto_renew' => true,
        ]);
        return (new SubscriptionResource($sub->load('plan')))->response()->setStatusCode(201);
    }

    public function cancel(Subscription $subscription) {
        $this->authorize('update', $subscription);
        $subscription->update([
            'status' => 'canceled',
            'cancel_at' => now(),
            'auto_renew' => false,
        ]);
        return new SubscriptionResource($subscription->fresh()->load('plan'));
    }
}
