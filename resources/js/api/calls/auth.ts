// resources/js/api/calls/auth.ts
import { api, ensureCsrf } from '../client';
import type { User } from '../types';

export async function register(payload: { name: string; email: string; password: string; password_confirmation: string }): Promise<User> {
    await ensureCsrf();
    const res = await api.post('/register', payload, { headers: { Accept: 'application/json' } });
    return res.data;
}
export async function login(payload: { email: string; password: string }): Promise<User> {
    await ensureCsrf();
    const res = await api.post('/login', payload, { headers: { Accept: 'application/json' } });
    return res.data;
}
export async function me(): Promise<User> {
    const res = await api.get('/api/me', { headers: { Accept: 'application/json' } });
    return res.data;
}
export async function logout(): Promise<void> {
    await api.post('/logout', {}, { headers: { Accept: 'application/json' } });
}
