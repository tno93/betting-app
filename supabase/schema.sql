-- BetEdge Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium')),
  subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'trialing')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences table
CREATE TABLE public.user_preferences (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  favorite_sports TEXT[] DEFAULT ARRAY[]::TEXT[],
  favorite_bookmakers TEXT[] DEFAULT ARRAY[]::TEXT[],
  default_stake DECIMAL(10, 2) DEFAULT 100.00,
  bankroll DECIMAL(10, 2) DEFAULT 1000.00,
  notifications_enabled BOOLEAN DEFAULT true,
  min_arbitrage_profit DECIMAL(5, 2) DEFAULT 1.00,
  min_ev_percentage DECIMAL(5, 2) DEFAULT 2.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table
CREATE TABLE public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved bets table
CREATE TABLE public.saved_bets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  event_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  sport_key TEXT NOT NULL,
  bookmaker TEXT NOT NULL,
  market TEXT NOT NULL,
  outcome TEXT NOT NULL,
  odds DECIMAL(10, 2) NOT NULL,
  stake DECIMAL(10, 2) NOT NULL,
  bet_type TEXT NOT NULL CHECK (bet_type IN ('arbitrage', 'positive_ev', 'standard')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'void')),
  placed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  settled_at TIMESTAMP WITH TIME ZONE,
  profit_loss DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Arbitrage opportunities cache (to reduce API calls)
CREATE TABLE public.arbitrage_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id TEXT NOT NULL,
  sport_key TEXT NOT NULL,
  market TEXT NOT NULL,
  profit_percentage DECIMAL(5, 2) NOT NULL,
  opportunity_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Positive EV cache
CREATE TABLE public.positive_ev_cache (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  event_id TEXT NOT NULL,
  sport_key TEXT NOT NULL,
  bookmaker TEXT NOT NULL,
  market TEXT NOT NULL,
  outcome TEXT NOT NULL,
  ev_percentage DECIMAL(5, 2) NOT NULL,
  opportunity_data JSONB NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- API usage tracking (to monitor The Odds API limits)
CREATE TABLE public.api_usage (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  endpoint TEXT NOT NULL,
  requests_used INTEGER NOT NULL,
  requests_remaining INTEGER NOT NULL,
  reset_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_saved_bets_user_id ON public.saved_bets(user_id);
CREATE INDEX idx_saved_bets_status ON public.saved_bets(status);
CREATE INDEX idx_saved_bets_placed_at ON public.saved_bets(placed_at DESC);
CREATE INDEX idx_arbitrage_cache_expires_at ON public.arbitrage_cache(expires_at);
CREATE INDEX idx_positive_ev_cache_expires_at ON public.positive_ev_cache(expires_at);
CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_bets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.arbitrage_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positive_ev_cache ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can view their own preferences" ON public.user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON public.user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON public.user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Saved bets policies
CREATE POLICY "Users can view their own saved bets" ON public.saved_bets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved bets" ON public.saved_bets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved bets" ON public.saved_bets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved bets" ON public.saved_bets
  FOR DELETE USING (auth.uid() = user_id);

-- Cache policies (read-only for authenticated users)
CREATE POLICY "Authenticated users can view arbitrage cache" ON public.arbitrage_cache
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can view positive EV cache" ON public.positive_ev_cache
  FOR SELECT TO authenticated USING (true);

-- Functions

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );

  -- Create default preferences
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_user_preferences_updated_at
  BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_saved_bets_updated_at
  BEFORE UPDATE ON public.saved_bets
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to clean expired cache
CREATE OR REPLACE FUNCTION public.clean_expired_cache()
RETURNS void AS $$
BEGIN
  DELETE FROM public.arbitrage_cache WHERE expires_at < NOW();
  DELETE FROM public.positive_ev_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- You can set up a cron job in Supabase to run this function periodically
-- Example: SELECT cron.schedule('clean-cache', '*/15 * * * *', 'SELECT public.clean_expired_cache()');
