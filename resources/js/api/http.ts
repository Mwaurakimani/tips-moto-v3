// resources/js/api/http.ts
import type { Paginated } from './types';

export function unwrap<T>(payload: any): T {
    if (payload && typeof payload === 'object' && 'data' in payload) {
        return payload.data as T;
    }
    return payload as T;
}

export function unwrapPaginated<T>(payload: any): Paginated<T> {
    return payload as Paginated<T>;
}
