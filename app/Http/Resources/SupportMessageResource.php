<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class SupportMessageResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'sender_role' => $this->sender_role,
            'message' => $this->message,
            'attachments' => $this->attachments,
            'created_at' => optional($this->created_at)->toISOString(),
        ];
    }
}
