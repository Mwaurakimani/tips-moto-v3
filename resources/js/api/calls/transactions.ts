// resources/js/api/calls/transactions.ts
import { api } from '../client';
import { unwrap, unwrapPaginated } from '../http';
import type { Transaction, Paginated } from '../types';

export async function getTransactions(params?: { page?: number; perPage?: number }): Promise<Paginated<Transaction>> {
    const res = await api.get('/api/transactions', { params });
    return unwrapPaginated<Transaction>(res.data);
}
export async function getTransactionById(id: number | string): Promise<Transaction> {
    const res = await api.get(`/api/transactions/${id}`);
    return unwrap<Transaction>(res.data);
}
