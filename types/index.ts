// Core Types for BetEdge App

export interface User {
  id: string;
  email: string;
  full_name?: string;
  subscription_tier: 'free' | 'premium';
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trialing';
  stripe_customer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Bookmaker {
  key: string;
  title: string;
  last_update: string;
}

export interface Market {
  key: string;
  last_update: string;
  outcomes: Outcome[];
}

export interface Outcome {
  name: string;
  price: number; // Decimal odds (e.g., 2.5)
  point?: number; // For spread/totals
}

export interface OddsEvent {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: Array<{
    key: string;
    title: string;
    last_update: string;
    markets: Market[];
  }>;
}

export interface ArbitrageOpportunity {
  id: string;
  event: OddsEvent;
  market: string;
  profit_percentage: number;
  total_stake: number;
  bets: Array<{
    bookmaker: string;
    outcome: string;
    odds: number;
    stake: number;
    potential_return: number;
  }>;
  expires_at: string;
  created_at: string;
}

export interface PositiveEVBet {
  id: string;
  event: OddsEvent;
  bookmaker: string;
  market: string;
  outcome: string;
  odds: number;
  fair_odds: number;
  ev_percentage: number;
  confidence: 'high' | 'medium' | 'low';
  suggested_stake: number;
  created_at: string;
}

export interface BettingCalculation {
  stake: number;
  odds: number;
  potential_profit: number;
  potential_return: number;
  implied_probability: number;
}

export interface SavedBet {
  id: string;
  user_id: string;
  event_id: string;
  bookmaker: string;
  market: string;
  outcome: string;
  odds: number;
  stake: number;
  bet_type: 'arbitrage' | 'positive_ev' | 'standard';
  status: 'pending' | 'won' | 'lost' | 'void';
  placed_at: string;
  settled_at?: string;
  profit_loss?: number;
}

export interface UserPreferences {
  user_id: string;
  favorite_sports: string[];
  favorite_bookmakers: string[];
  default_stake: number;
  bankroll: number;
  notifications_enabled: boolean;
  min_arbitrage_profit: number; // percentage
  min_ev_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface OddsAPIResponse {
  data: OddsEvent[];
  remaining_requests: number;
  used_requests: number;
}

export interface SupabaseResponse<T> {
  data: T | null;
  error: Error | null;
}

// Sport Configuration
export interface Sport {
  key: string;
  group: string;
  title: string;
  description: string;
  active: boolean;
  has_outrights: boolean;
}

// Available markets
export type MarketType = 'h2h' | 'spreads' | 'totals' | 'outrights';

// Subscription tiers
export interface SubscriptionTier {
  name: 'free' | 'premium';
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    max_arbitrage_opportunities: number;
    max_ev_opportunities: number;
    real_time_updates: boolean;
    historical_data_days: number;
    alerts_enabled: boolean;
  };
}
