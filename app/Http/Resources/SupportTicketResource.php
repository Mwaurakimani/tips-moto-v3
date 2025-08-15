<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SupportTicketResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'subject' => $this->subject,
            'status' => $this->status,
            'priority' => $this->priority,
            'messages' => SupportMessageResource::collection($this->whenLoaded('messages')),
            'created_at' => optional($this->created_at)->toISOString(),
        ];
    }
}
