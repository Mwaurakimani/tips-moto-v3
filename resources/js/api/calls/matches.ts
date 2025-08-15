// resources/js/api/calls/matches.ts
import { api } from '../client';
import { unwrap, unwrapPaginated } from '../http';
import type { Match, Paginated, MatchStatus } from '../types';

export async function getAllMatches(params?: { status?: MatchStatus; page?: number; perPage?: number }): Promise<Paginated<Match>> {
    const res = await api.get('/api/matches', { params });
    return unwrapPaginated<Match>(res.data);
}
export async function getMatchById(id: number | string): Promise<Match> {
    const res = await api.get(`/api/matches/${id}`);
    return unwrap<Match>(res.data);
}
export async function updateMatch(id: number | string, payload: Partial<Pick<Match,'status'|'score_home'|'score_away'|'kickoff_at'>>): Promise<Match> {
    const res = await api.put(`/api/matches/${id}`, payload);
    return unwrap<Match>(res.data);
}
