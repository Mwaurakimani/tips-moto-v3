// resources/js/api/calls/support.ts
import { api } from '../client';
import { unwrap, unwrapPaginated } from '../http';
import type { SupportTicket, SupportMessage, Paginated } from '../types';

export async function getTickets(params?: { page?: number; perPage?: number }): Promise<Paginated<SupportTicket>> {
    const res = await api.get('/api/support/tickets', { params });
    return unwrapPaginated<SupportTicket>(res.data);
}
export async function createTicket(payload: { subject: string; message: string }): Promise<SupportTicket> {
    const res = await api.post('/api/support/tickets', payload);
    return unwrap<SupportTicket>(res.data);
}
export async function postTicketMessage(ticketId: number | string, payload: { message: string }): Promise<SupportMessage> {
    const res = await api.post(`/api/support/tickets/${ticketId}/message`, payload);
    return unwrap<SupportMessage>(res.data);
}
