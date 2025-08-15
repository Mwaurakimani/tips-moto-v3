// resources/js/api/client.ts
import axios from 'axios';

/**
 * Shared Axios client for SPA + Sanctum.
 * - baseURL from VITE_API_BASE or '/'
 * - withCredentials: true (cookies)
 */
export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE ?? '/',
    withCredentials: true,
});

/** Call once before auth-protected requests */
export async function ensureCsrf(): Promise<void> {
    await api.get('/sanctum/csrf-cookie');
}
