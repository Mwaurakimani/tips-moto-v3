// resources/js/api/calls/teams.ts
import { api } from '../client';
import { unwrapPaginated } from '../http';
import type { Team, Paginated } from '../types';

export async function getAllTeams(params?: { league_id?: number | string; page?: number; perPage?: number }): Promise<Paginated<Team>> {
    const res = await api.get('/api/teams', { params });
    return unwrapPaginated<Team>(res.data);
}
