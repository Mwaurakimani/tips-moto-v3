// resources/js/api/types.ts
export type ID = number | string;

export interface Sport { id: ID; name: string; }
export interface League { id: ID; name: string; country: string | null; slug: string; sport?: Sport; }
export interface Team { id: ID; name: string; short_name?: string | null; country?: string | null; logo_url?: string | null; }

export type MatchStatus = 'scheduled' | 'live' | 'finished' | 'postponed' | 'canceled';
export interface Match {
    id: ID; kickoff_at?: string | null; venue?: string | null; status: MatchStatus;
    score_home?: number | null; score_away?: number | null; league?: League; home_team?: Team; away_team?: Team;
}

export type PredictionType = '1_X_2' | '1X_X2_12' | 'GG-NG';
export type RiskLevel = 'low' | 'mid' | 'high';
export type TipResult = 'pending' | 'won' | 'lost' | 'void' | 'canceled';
export interface Tip {
    id: ID; prediction_type: PredictionType; prediction_value: -1 | 0 | 1; pick_label: string;
    odds?: number | null; bookmaker?: string | null; confidence?: number | null; risk_level?: RiskLevel | null;
    is_free?: boolean; free_for_date?: string | null; visibility?: 'public' | 'subscribers' | 'purchased';
    publish_at?: string | null; status?: 'pending' | 'settled'; result?: TipResult; settled_at?: string | null;
    notes?: string | null; match?: Match;
}

export type Interval = 'day' | 'week' | 'month' | 'year';
export interface SubscriptionPlan { id: ID; name: string; slug: string; price: number; currency: string; interval: Interval; interval_count: number; trial_days: number; features: Record<string, unknown>; is_active: boolean; }
export interface Subscription { id: ID; status: 'active' | 'canceled' | 'past_due' | 'expired'; start_at?: string | null; end_at?: string | null; renews_at?: string | null; cancel_at?: string | null; auto_renew: boolean; gateway?: string | null; plan?: SubscriptionPlan; }

export interface Transaction { id: ID; type: 'subscription' | 'tip_purchase' | 'refund' | string; amount: number; currency: string; status: 'pending' | 'completed' | 'failed'; provider?: string | null; provider_ref?: string | null; description?: string | null; created_at?: string; }

export interface NotificationItem { id: ID; title: string; body: string; type?: string | null; data?: Record<string, unknown> | null; read_at?: string | null; created_at?: string; }
export interface SupportMessage { id: ID; sender_role: 'user' | 'admin'; message: string; attachments?: unknown[] | null; created_at?: string; }
export interface SupportTicket { id: ID; subject: string; status: 'open' | 'pending' | 'closed'; priority?: 'low' | 'normal' | 'high'; created_at?: string; messages?: SupportMessage[]; }

export interface User { id: ID; name: string; email: string; }

export interface Paginated<T> {
    data: T[];
    links?: Record<string, unknown>;
    meta?: { current_page: number; from: number | null; last_page: number; links: Array<{ url: string | null; label: string; active: boolean }>; path: string; per_page: number; to: number | null; total: number; };
}
