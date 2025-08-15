<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SupportTicket;
use App\Models\SupportMessage;
use App\Http\Requests\SupportTicketStoreRequest;
use App\Http\Requests\SupportMessageRequest;
use App\Http\Resources\SupportTicketResource;
use App\Http\Resources\SupportMessageResource;
use Illuminate\Http\Request;

class SupportTicketController extends Controller
{
    public function index(Request $request) {
        $tickets = SupportTicket::with('messages')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')->paginate(20);
        return SupportTicketResource::collection($tickets);
    }

    public function store(SupportTicketStoreRequest $request) {
        $ticket = SupportTicket::create([
            'user_id' => $request->user()->id,
            'subject' => $request->validated()['subject'],
        ]);
        $msg = SupportMessage::create([
            'ticket_id' => $ticket->id,
            'sender_id' => $request->user()->id,
            'sender_role' => 'user',
            'message' => $request->validated()['message'],
        ]);
        return (new SupportTicketResource($ticket->load('messages')))->response()->setStatusCode(201);
    }

    public function message(SupportMessageRequest $request, SupportTicket $ticket) {
        $this->authorize('view', $ticket);
        $msg = SupportMessage::create([
            'ticket_id' => $ticket->id,
            'sender_id' => $request->user()->id,
            'sender_role' => 'user',
            'message' => $request->validated()['message'],
        ]);
        return (new SupportMessageResource($msg))->response()->setStatusCode(201);
    }
}
