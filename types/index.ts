// MITIGATOR Domain Models

export type RiskLevel = 'low' | 'moderate' | 'elevated' | 'high' | 'critical';
export type MarketStatus = 'open' | 'closed' | 'pre-market' | 'after-hours';
export type SourceTier =
  | 'CANONICAL'
  | 'PRIMARY'
  | 'VERIFIED'
  | 'SECONDARY'
  | 'SOCIAL'
  | 'UNCONFIRMED'
  | 'CONFLICTING';

export interface UnderlyingSecurity {
  ticker: string;
  exchange: string;
  isin: string;
  sector: string;
  industry: string;
  marketCap: number;
  dividendYield: number | null;
  beta: number;
  peRatio: number | null;
  eps: number | null;
  sharesOutstanding: number;
}

export interface Issuer {
  name: string;
  entity: string;
  custodian: string;
  auditedBy: string;
}

export interface OracleConfig {
  provider: string;
  feed: string;
  status: 'healthy' | 'stale' | 'down';
  lastUpdate: string;
  confidence: number;
}

export interface TokenizedAsset {
  symbol: string;
  name: string;
  tokenSymbol: string;
  tokenMint: string;
  chain: 'solana';
  issuer: Issuer;
  oracle: OracleConfig;
  underlying: UnderlyingSecurity;
  verificationStatus: 'verified' | 'pending' | 'flagged';
  totalSupply: number;
  backingRatio: number;
}

export interface MarketQuote {
  symbol: string;
  price: number;
  change24h: number;
  changePct24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  bid: number;
  ask: number;
  spread: number;
  marketStatus: MarketStatus;
  timestamp: string;
}

export interface HistoricalBar {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export type HistoricalDataset = 'equity' | 'token';

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  importance: 'low' | 'medium' | 'high';
  sourceTier: SourceTier;
  relatedSymbols: string[];
}

export interface Filing {
  id: string;
  type: '10-K' | '10-Q' | '8-K' | 'S-1' | 'DEF 14A' | '13F' | '4';
  title: string;
  filedAt: string;
  url: string;
  sourceTier: SourceTier;
}

export type SocialPlatform = 'X' | 'Reddit' | 'Stocktwits';

export interface SocialPost {
  id: string;
  author: string;
  handle: string;
  avatar: string;
  platform: SocialPlatform;
  content: string;
  postedAt: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  engagement: { likes: number; replies: number; reposts: number };
  sourceTier: SourceTier;
  verified: boolean;
  evidenceAttached: boolean;
}

export type TimelineEventType =
  | 'earnings'
  | 'filing'
  | 'dividend'
  | 'split'
  | 'news'
  | 'macro'
  | 'sentiment'
  | 'risk_change'
  | 'liquidity_change'
  | 'onchain_divergence';

export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  title: string;
  description: string;
  timestamp: string;
  importance: 'low' | 'medium' | 'high';
  impact: 'positive' | 'negative' | 'neutral';
  confidence: number;
  source: string;
  sourceTier: SourceTier;
}

export interface RiskFactor {
  key: string;
  label: string;
  category: string;
  weight: number;
  score: number;
  trend: 'up' | 'down' | 'flat';
  description: string;
}

export interface RiskScore {
  symbol: string;
  overall: number;
  level: RiskLevel;
  confidence: number;
  trend: 'up' | 'down' | 'flat';
  timestamp: string;
  freshness: 'live' | 'recent' | 'stale';
  factors: RiskFactor[];
}

export interface Position {
  symbol: string;
  name: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  marketValue: number;
  costBasis: number;
  pnl: number;
  pnlPct: number;
  allocation: number;
  riskScore: number;
  sector: string;
}

export interface Portfolio {
  totalValue: number;
  cash: number;
  totalPnl: number;
  totalPnlPct: number;
  dailyPnl: number;
  dailyPnlPct: number;
  costBasis: number;
  riskBudget: number;
  riskBudgetUsed: number;
  concentration: { symbol: string; weight: number }[];
  sectorExposure: { sector: string; weight: number }[];
  correlation: { a: string; b: string; value: number }[];
  drawdown: number;
  maxDrawdown: number;
  positions: Position[];
}

export interface ExecutionQuote {
  venue: string;
  venueType: 'AMM' | 'RFQ' | 'Aggregator';
  expectedPrice: number;
  expectedReceived: number;
  spread: number;
  priceImpact: number;
  slippage: number;
  liquidity: number;
  fee: number;
  feePct: number;
  quoteAge: number;
  routeComplexity: 'low' | 'medium' | 'high';
  settlement: 'instant' | 't+1' | 't+2';
  quoteType: 'indicative' | 'executable';
  route: string[];
}

export interface Strategy {
  id: string;
  name: string;
  creator: string;
  description: string;
  roi: number;
  drawdown: number;
  volatility: number;
  sharpe: number;
  winRate: number;
  tradeFrequency: number;
  concentration: number;
  holdingPeriod: string;
  methodology: string;
  followers: number;
  copiers: number;
  riskLevel: RiskLevel;
  verified: boolean;
}

export interface Trade {
  id: string;
  symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  executedAt: string;
  venue: string;
  fee: number;
  slippage: number;
  pnl: number;
  status: 'filled' | 'pending' | 'cancelled';
}

export type AlertType =
  | 'price'
  | 'news'
  | 'sentiment'
  | 'risk'
  | 'liquidity'
  | 'price_divergence'
  | 'corporate_action'
  | 'earnings'
  | 'portfolio_concentration'
  | 'strategy'
  | 'natural_language';

export interface Alert {
  id: string;
  type: AlertType;
  symbol: string;
  condition: string;
  threshold: number;
  current: number;
  triggered: boolean;
  triggeredAt: string | null;
  createdAt: string;
  active: boolean;
}

export interface AIInsightSection {
  label: string;
  content: string;
  sources: { label: string; tier: SourceTier }[];
  confidence: number;
}

export interface AIInsight {
  id: string;
  query: string;
  verdict: string;
  confidence: number;
  sections: AIInsightSection[];
  timestamp: string;
  modelVersion: string;
}

export interface ProvenanceRecord {
  id: string;
  dataPoint: string;
  provider: string;
  endpoint: string;
  retrievedAt: string;
  publishedAt: string;
  freshness: 'live' | 'recent' | 'stale' | 'delayed';
  confidence: number;
  verification: 'verified' | 'partial' | 'unverified' | 'conflicting';
  sourceTier: SourceTier;
  notes: string;
}

export interface Asset {
  tokenizedAsset: TokenizedAsset;
  quote: MarketQuote;
  riskScore: RiskScore;
  sourceConfidence: number;
  liquidityScore: number;
  sentimentScore: number;
  volatility: number;
  dividend: boolean;
}

export interface AgentInfo {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'idle' | 'error';
  lastRun: string;
  dataSources: string[];
  confidence: number;
  findings: string[];
  alerts: number;
}

export interface RoboProfile {
  id: string;
  name: string;
  description: string;
  riskLevel: RiskLevel;
  expectedReturn: number;
  maxDrawdown: number;
  allocation: { symbol: string; weight: number }[];
  enabled: boolean;
}
