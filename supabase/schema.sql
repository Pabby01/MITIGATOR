-- ====================================================================
-- MITIGATOR Solana Tokenized Equity Risk & Intelligence Engine
-- PostgreSQL / Supabase Production Database Schema
-- Stocklana Hackathon 2026
-- ====================================================================

-- 1. USER PROFILES
CREATE TABLE IF NOT EXISTS user_profiles (
  wallet_address TEXT PRIMARY KEY,
  display_name TEXT NOT NULL DEFAULT 'Solana Trader',
  avatar_url TEXT,
  risk_tolerance TEXT NOT NULL DEFAULT 'balanced' CHECK (risk_tolerance IN ('conservative', 'balanced', 'aggressive')),
  max_slippage_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.50,
  max_order_size_usd NUMERIC(12, 2) NOT NULL DEFAULT 5000.00,
  watchlist JSONB NOT NULL DEFAULT '["NVDAx", "TSLAx", "AAPLx", "MSFTx"]'::jsonb,
  email TEXT,
  telegram_handle TEXT,
  notifications JSONB NOT NULL DEFAULT '{"pegDeviation": true, "secFilings": true, "riskDeterioration": true}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_wallet ON user_profiles(wallet_address);

-- 2. COMMUNITY POSTS (Interactive Stock Discovery & Feeds)
CREATE TABLE IF NOT EXISTS community_posts (
  id TEXT PRIMARY KEY,
  symbol TEXT NOT NULL,
  author TEXT NOT NULL,
  author_address TEXT NOT NULL,
  handle TEXT NOT NULL,
  avatar TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  content TEXT NOT NULL,
  sentiment TEXT NOT NULL DEFAULT 'neutral' CHECK (sentiment IN ('bullish', 'bearish', 'neutral')),
  evidence_attached BOOLEAN NOT NULL DEFAULT false,
  source_tier TEXT NOT NULL DEFAULT 'user',
  likes INTEGER NOT NULL DEFAULT 0,
  replies INTEGER NOT NULL DEFAULT 0,
  reposts INTEGER NOT NULL DEFAULT 0,
  bookmarks INTEGER NOT NULL DEFAULT 0,
  liked_by JSONB NOT NULL DEFAULT '[]'::jsonb,
  reposted_by JSONB NOT NULL DEFAULT '[]'::jsonb,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_posts_symbol ON community_posts(symbol);
CREATE INDEX IF NOT EXISTS idx_community_posts_author ON community_posts(author_address);
CREATE INDEX IF NOT EXISTS idx_community_posts_posted_at ON community_posts(posted_at DESC);

-- 3. COMMUNITY COMMENTS (Thread Discussions)
CREATE TABLE IF NOT EXISTS community_comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  author TEXT NOT NULL,
  author_address TEXT NOT NULL,
  handle TEXT NOT NULL,
  avatar TEXT,
  verified BOOLEAN NOT NULL DEFAULT false,
  content TEXT NOT NULL,
  likes INTEGER NOT NULL DEFAULT 0,
  liked_by JSONB NOT NULL DEFAULT '[]'::jsonb,
  posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_community_comments_post_id ON community_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_community_comments_author ON community_comments(author_address);

-- 4. PAPER TRADES (Forward-Testing Simulation Journal)
CREATE TABLE IF NOT EXISTS paper_trades (
  id TEXT PRIMARY KEY,
  user_address TEXT NOT NULL,
  symbol TEXT NOT NULL,
  side TEXT NOT NULL CHECK (side IN ('buy', 'sell')),
  amount_usd NUMERIC(14, 2) NOT NULL,
  quantity NUMERIC(18, 6) NOT NULL,
  execution_price NUMERIC(14, 4) NOT NULL,
  current_price NUMERIC(14, 4),
  venue TEXT NOT NULL DEFAULT 'Jupiter DLMM',
  fee_usd NUMERIC(10, 4) NOT NULL DEFAULT 0,
  slippage_pct NUMERIC(6, 4) NOT NULL DEFAULT 0,
  unrealized_pnl NUMERIC(14, 2) DEFAULT 0,
  unrealized_pnl_pct NUMERIC(8, 4) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'filled' CHECK (status IN ('filled', 'closed')),
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_paper_trades_user ON paper_trades(user_address);
CREATE INDEX IF NOT EXISTS idx_paper_trades_status ON paper_trades(status);
CREATE INDEX IF NOT EXISTS idx_paper_trades_timestamp ON paper_trades(timestamp DESC);

-- 5. USER ALERTS (Risk & Price Triggers)
CREATE TABLE IF NOT EXISTS user_alerts (
  id TEXT PRIMARY KEY,
  user_address TEXT NOT NULL,
  symbol TEXT NOT NULL,
  type TEXT NOT NULL,
  condition TEXT NOT NULL,
  threshold NUMERIC(14, 4) NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_alerts_user ON user_alerts(user_address);

-- 6. QUANT STRATEGIES
CREATE TABLE IF NOT EXISTS strategies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  creator TEXT NOT NULL,
  description TEXT,
  risk_level TEXT NOT NULL DEFAULT 'moderate' CHECK (risk_level IN ('low', 'moderate', 'elevated', 'high')),
  roi NUMERIC(8, 2) DEFAULT 0,
  drawdown NUMERIC(8, 2) DEFAULT 0,
  sharpe NUMERIC(6, 2) DEFAULT 0,
  win_rate NUMERIC(6, 2) DEFAULT 0,
  volatility NUMERIC(6, 2) DEFAULT 0,
  trade_frequency NUMERIC(6, 2) DEFAULT 0,
  holding_period TEXT DEFAULT 'Active',
  concentration NUMERIC(6, 2) DEFAULT 0,
  methodology TEXT,
  followers INTEGER DEFAULT 0,
  copiers INTEGER DEFAULT 0,
  verified BOOLEAN DEFAULT false,
  target_assets JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategies_risk ON strategies(risk_level);

-- 7. STRATEGY SUBSCRIPTIONS (Copy & Paper Follows)
CREATE TABLE IF NOT EXISTS strategy_subscriptions (
  id TEXT PRIMARY KEY,
  user_address TEXT NOT NULL,
  strategy_id TEXT NOT NULL REFERENCES strategies(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('follow', 'copy', 'paper')),
  allocation_usd NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_strategy_subscriptions_user ON strategy_subscriptions(user_address);
CREATE INDEX IF NOT EXISTS idx_strategy_subscriptions_strategy ON strategy_subscriptions(strategy_id);

-- --------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE paper_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategy_subscriptions ENABLE ROW LEVEL SECURITY;

-- Public read access for community posts, comments, and public strategies
CREATE POLICY "Public can view community posts" ON community_posts FOR SELECT USING (true);
CREATE POLICY "Public can view community comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Public can view strategies" ON strategies FOR SELECT USING (true);

-- Insert & update policies (allowing client & API key interactions)
CREATE POLICY "Users can manage their profile" ON user_profiles FOR ALL USING (true);
CREATE POLICY "Users can create posts" ON community_posts FOR ALL USING (true);
CREATE POLICY "Users can create comments" ON community_comments FOR ALL USING (true);
CREATE POLICY "Users can manage their paper trades" ON paper_trades FOR ALL USING (true);
CREATE POLICY "Users can manage their alerts" ON user_alerts FOR ALL USING (true);
CREATE POLICY "Users can manage custom strategies" ON strategies FOR ALL USING (true);
CREATE POLICY "Users can manage their subscriptions" ON strategy_subscriptions FOR ALL USING (true);
