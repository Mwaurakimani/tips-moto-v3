// resources/js/api/calls/notifications.ts
import { api } from '../client';
import { unwrap, unwrapPaginated } from '../http';
import type { NotificationItem, Paginated } from '../types';

export async function getNotifications(params?: { page?: number; perPage?: number }): Promise<Paginated<NotificationItem>> {
    const res = await api.get('/api/notifications', { params });
    return unwrapPaginated<NotificationItem>(res.data);
}
export async function markNotificationRead(id: number | string): Promise<NotificationItem> {
    const res = await api.post(`/api/notifications/${id}/read`);
    return unwrap<NotificationItem>(res.data);
}
