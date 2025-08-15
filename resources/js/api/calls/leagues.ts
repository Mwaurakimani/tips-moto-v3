// resources/js/api/calls/leagues.ts
import { api } from '../client';
import { unwrapPaginated } from '../http';
import type { League, Paginated } from '../types';

export async function getAllLeagues(params?: { page?: number; perPage?: number }): Promise<Paginated<League>> {
    const res = await api.get('/api/leagues', { params });
    return unwrapPaginated<League>(res.data);
}
