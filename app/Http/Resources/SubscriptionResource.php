<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SubscriptionResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'status' => $this->status,
            'start_at' => optional($this->start_at)->toISOString(),
            'end_at' => optional($this->end_at)->toISOString(),
            'renews_at' => optional($this->renews_at)->toISOString(),
            'cancel_at' => optional($this->cancel_at)->toISOString(),
            'auto_renew' => $this->auto_renew,
            'gateway' => $this->gateway,
            'plan' => new SubscriptionPlanResource($this->whenLoaded('plan')),
        ];
    }
}
