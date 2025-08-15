// resources/js/api/calls/tips.ts
import { api } from '../client';
import { unwrap, unwrapPaginated } from '../http';
import type { Tip, Paginated } from '../types';

export async function getAllTips(params?: { free_today?: boolean; match_id?: number | string; page?: number; perPage?: number }): Promise<Paginated<Tip>> {
    const res = await api.get('/api/tips', { params });
    return unwrapPaginated<Tip>(res.data);
}
export async function getTipById(id: number | string): Promise<Tip> {
    const res = await api.get(`/api/tips/${id}`);
    return unwrap<Tip>(res.data);
}
export async function getFreeTipsToday(): Promise<Paginated<Tip>> {
    const res = await api.get('/api/tips', { params: { free_today: true } });
    return unwrapPaginated<Tip>(res.data);
}
export async function createTip(payload: Partial<Tip> & { match_id: number | string; prediction_type: Tip['prediction_type']; prediction_value: Tip['prediction_value']; pick_label: string; }): Promise<Tip> {
    const res = await api.post('/api/tips', payload);
    return unwrap<Tip>(res.data);
}
export async function updateTip(id: number | string, payload: Partial<Tip>): Promise<Tip> {
    const res = await api.put(`/api/tips/${id}`, payload);
    return unwrap<Tip>(res.data);
}
export async function deleteTip(id: number | string): Promise<void> {
    await api.delete(`/api/tips/${id}`);
}
