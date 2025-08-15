// resources/js/api/calls/subscriptions.ts
import { api } from '../client';
import type { Subscription, SubscriptionPlan } from '../types';

export async function getPlans(): Promise<SubscriptionPlan[]> {
    const res = await api.get('/api/plans');
    return (res.data?.data ?? res.data) as SubscriptionPlan[];
}
export async function getMySubscriptions(): Promise<Subscription[]> {
    const res = await api.get('/api/subscriptions');
    return (res.data?.data ?? res.data) as Subscription[];
}
export async function createSubscription(payload: { plan_id: number | string }): Promise<Subscription> {
    const res = await api.post('/api/subscriptions', payload);
    return (res.data?.data ?? res.data) as Subscription;
}
export async function cancelSubscription(id: number | string): Promise<Subscription> {
    const res = await api.post(`/api/subscriptions/${id}/cancel`);
    return (res.data?.data ?? res.data) as Subscription;
}
