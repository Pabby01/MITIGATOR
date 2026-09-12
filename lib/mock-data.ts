import type {
  Asset,
  TokenizedAsset,
  MarketQuote,
  RiskScore,
  RiskFactor,
  HistoricalBar,
  HistoricalDataset,
  NewsItem,
  Filing,
  SocialPost,
  TimelineEvent,
  Portfolio,
  Position,
  ExecutionQuote,
  Strategy,
  Trade,
  Alert,
  AIInsight,
  ProvenanceRecord,
  AgentInfo,
  RoboProfile,
} from '@/types';

// ─── Asset Universe ──────────────────────────────────────────────

const assetMeta: Record<
  string,
  {
    name: string;
    tokenSymbol: string;
    sector: string;
    industry: string;
    marketCap: number;
    price: number;
    changePct: number;
    beta: number;
    pe: number;
    eps: number;
    dividendYield: number | null;
    sharesOutstanding: number;
    score: number;
    sentiment: number;
    volatility: number;
    liquidity: number;
  }
> = {
  NVDAx: {
    name: 'NVIDIA Corporation',
    tokenSymbol: 'NVDAx',
    sector: 'Technology',
    industry: 'Semiconductors',
    marketCap: 4_530_000_000_000,
    price: 184.22,
    changePct: 3.82,
    beta: 1.68,
    pe: 67.4,
    eps: 2.73,
    dividendYield: 0.03,
    sharesOutstanding: 24_580_000_000,
    score: 84,
    sentiment: 72,
    volatility: 42,
    liquidity: 88,
  },
  AAPLx: {
    name: 'Apple Inc.',
    tokenSymbol: 'AAPLx',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    marketCap: 3_410_000_000_000,
    price: 226.87,
    changePct: 1.24,
    beta: 1.25,
    pe: 34.8,
    eps: 6.52,
    dividendYield: 0.44,
    sharesOutstanding: 15_040_000_000,
    score: 78,
    sentiment: 65,
    volatility: 28,
    liquidity: 92,
  },
  TSLAx: {
    name: 'Tesla, Inc.',
    tokenSymbol: 'TSLAx',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    marketCap: 812_000_000_000,
    price: 248.5,
    changePct: -2.14,
    beta: 2.31,
    pe: 71.2,
    eps: 3.49,
    dividendYield: null,
    sharesOutstanding: 3_188_000_000,
    score: 61,
    sentiment: 48,
    volatility: 58,
    liquidity: 76,
  },
  AMZNx: {
    name: 'Amazon.com, Inc.',
    tokenSymbol: 'AMZNx',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    marketCap: 1_870_000_000_000,
    price: 174.33,
    changePct: 0.87,
    beta: 1.15,
    pe: 43.6,
    eps: 4.0,
    dividendYield: null,
    sharesOutstanding: 10_730_000_000,
    score: 81,
    sentiment: 68,
    volatility: 32,
    liquidity: 85,
  },
  GOOGLx: {
    name: 'Alphabet Inc.',
    tokenSymbol: 'GOOGLx',
    sector: 'Communication Services',
    industry: 'Internet Content',
    marketCap: 2_080_000_000_000,
    price: 163.12,
    changePct: 2.05,
    beta: 1.04,
    pe: 24.1,
    eps: 6.77,
    dividendYield: null,
    sharesOutstanding: 12_760_000_000,
    score: 79,
    sentiment: 64,
    volatility: 30,
    liquidity: 82,
  },
  SPYx: {
    name: 'SPDR S&P 500 ETF',
    tokenSymbol: 'SPYx',
    sector: 'Financial',
    industry: 'Index ETF',
    marketCap: 530_000_000_000,
    price: 547.63,
    changePct: 0.42,
    beta: 1.0,
    pe: 26.3,
    eps: 20.82,
    dividendYield: 1.32,
    sharesOutstanding: 968_000_000,
    score: 92,
    sentiment: 70,
    volatility: 16,
    liquidity: 98,
  },
  QQQx: {
    name: 'Invesco QQQ Trust',
    tokenSymbol: 'QQQx',
    sector: 'Financial',
    industry: 'Index ETF',
    marketCap: 290_000_000_000,
    price: 472.18,
    changePct: 0.91,
    beta: 1.18,
    pe: 29.7,
    eps: 15.9,
    dividendYield: 0.68,
    sharesOutstanding: 614_000_000,
    score: 88,
    sentiment: 71,
    volatility: 22,
    liquidity: 95,
  },
};

function buildTokenizedAsset(symbol: string): TokenizedAsset {
  const m = assetMeta[symbol];
  return {
    symbol,
    name: m.name,
    tokenSymbol: m.tokenSymbol,
    tokenMint: `${symbol.toLowerCase()}_mint_address_on_solana`,
    chain: 'solana',
    issuer: {
      name: 'xStocks',
      entity: 'Backed Finance',
      custodian: 'Ankura Trust',
      auditedBy: 'ChainSecurity',
    },
    oracle: {
      provider: 'Pyth',
      feed: `${symbol}/USD`,
      status: 'healthy',
      lastUpdate: new Date().toISOString(),
      confidence: 0.98,
    },
    underlying: {
      ticker: symbol.replace('x', ''),
      exchange: 'NASDAQ',
      isin: `US${symbol}ISIN000`,
      sector: m.sector,
      industry: m.industry,
      marketCap: m.marketCap,
      dividendYield: m.dividendYield,
      beta: m.beta,
      peRatio: m.pe,
      eps: m.eps,
      sharesOutstanding: m.sharesOutstanding,
    },
    verificationStatus: 'verified',
    totalSupply: 0,
    backingRatio: 1.0,
  };
}

function buildQuote(symbol: string): MarketQuote {
  const m = assetMeta[symbol];
  const spread = m.price * 0.0008;
  return {
    symbol,
    price: m.price,
    change24h: m.price * (m.changePct / 100),
    changePct24h: m.changePct,
    volume24h: m.liquidity * 1_200_000,
    high24h: m.price * 1.015,
    low24h: m.price * 0.985,
    bid: m.price - spread / 2,
    ask: m.price + spread / 2,
    spread,
    marketStatus: 'open',
    timestamp: new Date().toISOString(),
  };
}

function buildRiskFactors(symbol: string, overall: number): RiskFactor[] {
  const m = assetMeta[symbol];
  const variance = (base: number) =>
    Math.max(0, Math.min(100, base + (symbol === 'TSLAx' ? -15 : 0)));
  return [
    {
      key: 'market_quality',
      label: 'Market Quality',
      category: 'Market',
      weight: 15,
      score: variance(overall + 4),
      trend: 'up',
      description: 'Order book depth, spread quality, and price discovery efficiency.',
    },
    {
      key: 'fundamental',
      label: 'Fundamental / Business',
      category: 'Fundamental',
      weight: 15,
      score: variance(overall - 2),
      trend: 'flat',
      description: 'Revenue growth, margins, balance sheet, and competitive moat.',
    },
    {
      key: 'news_sentiment',
      label: 'News & Sentiment',
      category: 'News',
      weight: 15,
      score: variance(m.sentiment + 10),
      trend: 'up',
      description: 'Aggregate news sentiment and social signal analysis.',
    },
    {
      key: 'event_catalyst',
      label: 'Event / Catalyst',
      category: 'Event',
      weight: 10,
      score: variance(overall - 6),
      trend: 'flat',
      description: 'Upcoming earnings, ex-dividend dates, and corporate actions.',
    },
    {
      key: 'liquidity_execution',
      label: 'Liquidity & Execution',
      category: 'Liquidity',
      weight: 15,
      score: variance(m.liquidity),
      trend: 'up',
      description: 'Onchain liquidity, AMM pool depth, and expected slippage.',
    },
    {
      key: 'token_onchain',
      label: 'Token / Onchain Integrity',
      category: 'Token',
      weight: 15,
      score: variance(90),
      trend: 'flat',
      description: 'Token verification, oracle health, and backing ratio.',
    },
    {
      key: 'portfolio_fit',
      label: 'Portfolio Fit',
      category: 'Portfolio',
      weight: 10,
      score: variance(overall + 2),
      trend: 'flat',
      description: 'Diversification impact and correlation with existing positions.',
    },
    {
      key: 'data_confidence',
      label: 'Data Confidence',
      category: 'Data',
      weight: 5,
      score: variance(88),
      trend: 'flat',
      description: 'Source reliability, freshness, and cross-verification status.',
    },
  ];
}

function buildRiskScore(symbol: string): RiskScore {
  const m = assetMeta[symbol];
  const level =
    m.score >= 85 ? 'low' : m.score >= 70 ? 'moderate' : m.score >= 55 ? 'elevated' : m.score >= 40 ? 'high' : 'critical';
  return {
    symbol,
    overall: m.score,
    level,
    confidence: 0.87,
    trend: m.changePct > 0 ? 'up' : 'down',
    timestamp: new Date().toISOString(),
    freshness: 'live',
    factors: buildRiskFactors(symbol, m.score),
  };
}

export function getAsset(symbol: string): Asset {
  const m = assetMeta[symbol];
  return {
    tokenizedAsset: buildTokenizedAsset(symbol),
    quote: buildQuote(symbol),
    riskScore: buildRiskScore(symbol),
    sourceConfidence: 0.87,
    liquidityScore: m.liquidity,
    sentimentScore: m.sentiment,
    volatility: m.volatility,
    dividend: m.dividendYield !== null,
  };
}

export const ALL_SYMBOLS = Object.keys(assetMeta);

export function getAllAssets(): Asset[] {
  return ALL_SYMBOLS.map(getAsset);
}

// ─── Historical Data Generation ──────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function getHistoricalBars(
  symbol: string,
  timeframe: '1D' | '1W' | '1M' | '3M' | '6M' | 'YTD' | '1Y' | '5Y' | 'MAX' = '1M',
  dataset: HistoricalDataset = 'equity'
): HistoricalBar[] {
  const m = assetMeta[symbol];
  const now = Date.now();
  const config: Record<string, { count: number; interval: number }> = {
    '1D': { count: 78, interval: 5 * 60 * 1000 },
    '1W': { count: 84, interval: 60 * 60 * 1000 },
    '1M': { count: 30, interval: 24 * 60 * 60 * 1000 },
    '3M': { count: 90, interval: 24 * 60 * 60 * 1000 },
    '6M': { count: 126, interval: 24 * 60 * 60 * 1000 },
    YTD: { count: 180, interval: 24 * 60 * 60 * 1000 },
    '1Y': { count: 252, interval: 24 * 60 * 60 * 1000 },
    '5Y': { count: 260, interval: 7 * 24 * 60 * 60 * 1000 },
    MAX: { count: 300, interval: 12 * 7 * 24 * 60 * 60 * 1000 },
  };
  const { count, interval } = config[timeframe];
  const rand = seededRandom(symbol.charCodeAt(0) * 1000 + count);
  const volatility = m.volatility / 100;
  const tokenPremium = dataset === 'token' ? 0.002 : 0;
  const bars: HistoricalBar[] = [];
  let price = m.price * 0.65;
  for (let i = 0; i < count; i++) {
    const ts = now - (count - i) * interval;
    const drift = 0.0008;
    const shock = (rand() - 0.5) * 2 * volatility * 0.015;
    const change = drift + shock + tokenPremium;
    const open = price;
    const close = price * (1 + change);
    const high = Math.max(open, close) * (1 + rand() * 0.005);
    const low = Math.min(open, close) * (1 - rand() * 0.005);
    const volume = Math.floor(m.liquidity * 50000 * (0.5 + rand()));
    bars.push({ timestamp: ts, open, high, low, close, volume });
    price = close;
  }
  // Force last close to current price
  if (bars.length > 0) {
    bars[bars.length - 1].close = m.price;
    bars[bars.length - 1].high = Math.max(bars[bars.length - 1].high, m.price);
    bars[bars.length - 1].low = Math.min(bars[bars.length - 1].low, m.price);
  }
  return bars;
}

// ─── News ────────────────────────────────────────────────────────

export function getNews(symbol: string): NewsItem[] {
  const m = assetMeta[symbol];
  const baseNews: Record<string, { headline: string; summary: string; sentiment: 'positive' | 'negative' | 'neutral'; importance: 'low' | 'medium' | 'high' }[]> = {
    NVDAx: [
      { headline: 'NVIDIA announces next-gen Blackwell GPU architecture at GTC', summary: 'CEO Jensen Huang unveiled the Blackwell B200 GPU, claiming 2.5x performance over Hopper with significant cost-per-token reductions for AI inference.', sentiment: 'positive', importance: 'high' },
      { headline: 'NVIDIA Q4 revenue beats estimates, data center segment up 73% YoY', summary: 'The company reported $39.3B in Q4 revenue, exceeding consensus estimates of $38.1B, driven by sustained AI infrastructure demand.', sentiment: 'positive', importance: 'high' },
      { headline: 'Analysts raise price targets after Blackwell unveiling', summary: 'Multiple sell-side analysts revised targets upward, citing the companys dominant position in AI training and inference compute.', sentiment: 'positive', importance: 'medium' },
      { headline: 'Export restrictions on advanced chips to China may impact sales', summary: 'New US government export controls could limit H200/B200 sales to certain regions, though the company has prepared compliant variants.', sentiment: 'negative', importance: 'medium' },
    ],
    AAPLx: [
      { headline: 'Apple Intelligence rollout expands to additional markets', summary: 'The companys AI feature suite is now available in more languages and regions, potentially driving iPhone upgrade cycles.', sentiment: 'positive', importance: 'medium' },
      { headline: 'Apple Services revenue hits all-time high', summary: 'Services segment reached $25.3B in the latest quarter, with App Store and subscription growth continuing to accelerate.', sentiment: 'positive', importance: 'medium' },
    ],
    TSLAx: [
      { headline: 'Tesla deliveries miss estimates amid production transition', summary: 'Q3 vehicle deliveries came in below consensus, as the Model Y refresh production ramp impacted output volumes.', sentiment: 'negative', importance: 'high' },
      { headline: 'FSD adoption rate increases with v12 rollout', summary: 'The latest Full Self-Driving version shows improved user uptake, though regulatory scrutiny remains a headwind.', sentiment: 'positive', importance: 'medium' },
    ],
    AMZNx: [
      { headline: 'AWS cloud revenue accelerates on AI workload demand', summary: 'AWS reported 19% YoY growth, with management citing AI inference and training as significant revenue drivers.', sentiment: 'positive', importance: 'high' },
      { headline: 'Amazon announces new multi-billion AI investment plan', summary: 'The company plans significant capital expenditure on data center infrastructure to meet enterprise AI demand.', sentiment: 'positive', importance: 'medium' },
    ],
    GOOGLx: [
      { headline: 'Google Gemini model updates show strong benchmark results', summary: 'The latest Gemini 2.0 model demonstrates competitive performance across reasoning and multimodal benchmarks.', sentiment: 'positive', importance: 'medium' },
      { headline: 'DOJ antitrust ruling may force Chrome divestiture', summary: 'A federal judge ruled that Google holds a monopoly in search, with potential remedies including Chrome separation.', sentiment: 'negative', importance: 'high' },
    ],
    SPYx: [
      { headline: 'S&P 500 hits new record close on dovish Fed signals', summary: 'The broad market index reached a fresh all-time high following signals of potential rate cuts in the coming quarter.', sentiment: 'positive', importance: 'medium' },
    ],
    QQQx: [
      { headline: 'Nasdaq-100 outperforms as mega-cap tech rallies', summary: 'The tech-heavy index gained on strength in semiconductor and AI-related stocks, closing near record levels.', sentiment: 'positive', importance: 'medium' },
    ],
  };
  const news = baseNews[symbol] || baseNews['NVDAx'];
  return news.map((n, i) => ({
    id: `${symbol}-news-${i}`,
    headline: n.headline,
    summary: n.summary,
    source: ['Bloomberg', 'Reuters', 'WSJ', 'CNBC', 'Seeking Alpha'][i % 5],
    url: '#',
    publishedAt: new Date(Date.now() - (i + 1) * 3 * 60 * 60 * 1000).toISOString(),
    sentiment: n.sentiment,
    importance: n.importance,
    sourceTier: i < 2 ? 'PRIMARY' : 'VERIFIED',
    relatedSymbols: [symbol],
  }));
}

// ─── SEC Filings ──────────────────────────────────────────────────

export function getFilings(symbol: string): Filing[] {
  const base: Record<string, { type: Filing['type']; title: string }[]> = {
    NVDAx: [
      { type: '10-K', title: 'Annual Report - Fiscal Year 2025' },
      { type: '10-Q', title: 'Quarterly Report - Q4 FY2025' },
      { type: '8-K', title: 'Current Report - GTC Blackwell Announcement' },
    ],
    AAPLx: [
      { type: '10-K', title: 'Annual Report - Fiscal Year 2024' },
      { type: '10-Q', title: 'Quarterly Report - Q3 FY2025' },
    ],
    TSLAx: [
      { type: '10-Q', title: 'Quarterly Report - Q3 2025' },
      { type: '8-K', title: 'Current Report - Delivery Numbers' },
    ],
  };
  const filings = base[symbol] || base['NVDAx'];
  return filings.map((f, i) => ({
    id: `${symbol}-filing-${i}`,
    type: f.type,
    title: f.title,
    filedAt: new Date(Date.now() - (i + 1) * 14 * 24 * 60 * 60 * 1000).toISOString(),
    url: '#',
    sourceTier: 'CANONICAL' as const,
  }));
}

// ─── Social Posts ─────────────────────────────────────────────────

export function getSocialPosts(symbol: string): SocialPost[] {
  const posts = [
    {
      author: 'QuantResearcher',
      handle: '@quant_research',
      content: `$${symbol.replace('x', '')} showing strong momentum with RSI at 62. The Blackwell cycle should drive sustained data center demand. My model suggests 15-20% upside to next resistance.`,
      sentiment: 'bullish' as const,
      platform: 'X' as const,
      verified: true,
      evidenceAttached: true,
      likes: 342,
      replies: 47,
      reposts: 28,
    },
    {
      author: 'DegenTrader99',
      handle: '@degentrader99',
      content: `Not sure about this one at these levels. Valuation feels stretched. P/E of 67 is pricing in perfection.`,
      sentiment: 'bearish' as const,
      platform: 'Stocktwits' as const,
      verified: false,
      evidenceAttached: false,
      likes: 89,
      replies: 23,
      reposts: 5,
    },
    {
      author: 'MacroAnalyst',
      handle: '@macro_analyst',
      content: `The export restriction risk is real but overblown. Compliant variants are already shipping. Net impact to revenue is maybe 3-4%.`,
      sentiment: 'bullish' as const,
      platform: 'X' as const,
      verified: true,
      evidenceAttached: true,
      likes: 156,
      replies: 31,
      reposts: 12,
    },
    {
      author: 'r_wallstreetbets',
      handle: 'r/wallstreetbets',
      content: `YOLO 50k into ${symbol} calls. This thing is going to the moon. 🚀`,
      sentiment: 'bullish' as const,
      platform: 'Reddit' as const,
      verified: false,
      evidenceAttached: false,
      likes: 1247,
      replies: 203,
      reposts: 45,
    },
  ];
  return posts.map((p, i) => ({
    id: `${symbol}-social-${i}`,
    author: p.author,
    handle: p.handle,
    avatar: '',
    platform: p.platform,
    content: p.content,
    postedAt: new Date(Date.now() - (i + 1) * 45 * 60 * 1000).toISOString(),
    sentiment: p.sentiment,
    engagement: { likes: p.likes, replies: p.replies, reposts: p.reposts },
    sourceTier: p.platform === 'X' && p.verified ? 'SOCIAL' : ('UNCONFIRMED' as const),
    verified: p.verified,
    evidenceAttached: p.evidenceAttached,
  }));
}

// ─── Timeline Events ──────────────────────────────────────────────

export function getTimelineEvents(symbol: string): TimelineEvent[] {
  const events: { type: TimelineEvent['type']; title: string; description: string; importance: 'low' | 'medium' | 'high'; impact: 'positive' | 'negative' | 'neutral' }[] = [
    { type: 'earnings', title: 'Q4 Earnings Beat', description: 'Revenue $39.3B vs $38.1B estimate. EPS $4.92 vs $4.75 estimate.', importance: 'high', impact: 'positive' },
    { type: 'news', title: 'Blackwell Announcement', description: 'Next-gen GPU architecture unveiled at GTC keynote.', importance: 'high', impact: 'positive' },
    { type: 'filing', title: '10-K Filed', description: 'Annual report filed with SEC. Revenue up 126% YoY.', importance: 'medium', impact: 'neutral' },
    { type: 'sentiment', title: 'Sentiment Shift', description: 'Social sentiment shifted from neutral to bullish following GTC.', importance: 'medium', impact: 'positive' },
    { type: 'risk_change', title: 'Risk Score Update', description: 'MITIGATOR Score increased from 79 to 84.', importance: 'medium', impact: 'positive' },
    { type: 'liquidity_change', title: 'Liquidity Improvement', description: 'Onchain liquidity increased 12% after new pool deployment.', importance: 'low', impact: 'positive' },
    { type: 'onchain_divergence', title: 'Token Price Divergence', description: 'Token price deviated 0.3% from oracle price. Resolved within 2 minutes.', importance: 'low', impact: 'neutral' },
    { type: 'macro', title: 'FOMC Rate Decision', description: 'Federal Reserve held rates steady. Dovish tone in statement.', importance: 'medium', impact: 'positive' },
  ];
  return events.map((e, i) => ({
    id: `${symbol}-timeline-${i}`,
    type: e.type,
    title: e.title,
    description: e.description,
    timestamp: new Date(Date.now() - (i + 1) * 2 * 24 * 60 * 60 * 1000).toISOString(),
    importance: e.importance,
    impact: e.impact,
    confidence: e.type === 'filing' ? 1.0 : e.type === 'earnings' ? 0.95 : 0.8,
    source: e.type === 'filing' ? 'SEC EDGAR' : e.type === 'macro' ? 'FRED' : 'NewsAPI',
    sourceTier: e.type === 'filing' ? 'CANONICAL' : e.type === 'earnings' ? 'PRIMARY' : 'VERIFIED',
  }));
}

// ─── Portfolio ────────────────────────────────────────────────────

export function getPortfolio(): Portfolio {
  const positions: Position[] = [
    buildPosition('NVDAx', 85, 142.3),
    buildPosition('AAPLx', 42, 198.5),
    buildPosition('TSLAx', 28, 215.0),
    buildPosition('AMZNx', 35, 161.2),
    buildPosition('GOOGLx', 48, 148.7),
    buildPosition('SPYx', 12, 520.0),
  ];
  const totalValue = positions.reduce((s, p) => s + p.marketValue, 0);
  const costBasis = positions.reduce((s, p) => s + p.costBasis, 0);
  const totalPnl = totalValue - costBasis;
  const cash = 5240.82;
  return {
    totalValue: totalValue + cash,
    cash,
    totalPnl,
    totalPnlPct: (totalPnl / costBasis) * 100,
    dailyPnl: totalValue * 0.0182,
    dailyPnlPct: 1.82,
    costBasis,
    riskBudget: 100,
    riskBudgetUsed: 62,
    concentration: positions
      .map((p) => ({ symbol: p.symbol, weight: (p.marketValue / totalValue) * 100 }))
      .sort((a, b) => b.weight - a.weight),
    sectorExposure: [
      { sector: 'Technology', weight: 58 },
      { sector: 'Consumer Cyclical', weight: 22 },
      { sector: 'Communication Services', weight: 12 },
      { sector: 'Financial', weight: 8 },
    ],
    correlation: [
      { a: 'NVDAx', b: 'AAPLx', value: 0.72 },
      { a: 'NVDAx', b: 'TSLAx', value: 0.48 },
      { a: 'AAPLx', b: 'AMZNx', value: 0.65 },
      { a: 'GOOGLx', b: 'AAPLx', value: 0.78 },
      { a: 'SPYx', b: 'NVDAx', value: 0.81 },
    ],
    drawdown: -4.2,
    maxDrawdown: -12.8,
    positions,
  };
}

function buildPosition(symbol: string, qty: number, avgCost: number): Position {
  const m = assetMeta[symbol];
  const marketValue = qty * m.price;
  const costBasis = qty * avgCost;
  return {
    symbol,
    name: m.name,
    quantity: qty,
    avgCost,
    currentPrice: m.price,
    marketValue,
    costBasis,
    pnl: marketValue - costBasis,
    pnlPct: ((marketValue - costBasis) / costBasis) * 100,
    allocation: 0,
    riskScore: m.score,
    sector: m.sector,
  };
}

// ─── Execution Quotes ─────────────────────────────────────────────

export function getExecutionQuotes(symbol: string, amount: number): ExecutionQuote[] {
  const m = assetMeta[symbol];
  const basePrice = m.price;
  const baseReceived = amount / basePrice;
  const venues: { venue: string; type: 'AMM' | 'RFQ' | 'Aggregator'; spreadPct: number; impactPct: number; feePct: number; liquidity: number; routeComplexity: 'low' | 'medium' | 'high'; settlement: 'instant' | 't+1' | 't+2'; route: string[] }[] = [
    { venue: 'Jupiter', type: 'Aggregator', spreadPct: 0.05, impactPct: 0.08, feePct: 0.0, liquidity: 95, routeComplexity: 'medium', settlement: 'instant', route: ['Jupiter Router', 'Orca Whirlpool', 'Settle'] },
    { venue: 'Raydium', type: 'AMM', spreadPct: 0.12, impactPct: 0.15, feePct: 0.25, liquidity: 78, routeComplexity: 'low', settlement: 'instant', route: ['Raydium CLMM', 'Settle'] },
    { venue: 'Orca', type: 'AMM', spreadPct: 0.08, impactPct: 0.10, feePct: 0.20, liquidity: 82, routeComplexity: 'low', settlement: 'instant', route: ['Orca Whirlpool', 'Settle'] },
    { venue: 'Meteora', type: 'AMM', spreadPct: 0.10, impactPct: 0.12, feePct: 0.22, liquidity: 75, routeComplexity: 'low', settlement: 'instant', route: ['Meteora DAMM', 'Settle'] },
    { venue: 'xChange RFQ', type: 'RFQ', spreadPct: 0.03, impactPct: 0.02, feePct: 0.10, liquidity: 88, routeComplexity: 'medium', settlement: 't+1', route: ['RFQ Quote', 'Maker Fill', 'Settle'] },
  ];
  return venues.map((v) => {
    const expectedPrice = basePrice * (1 + v.spreadPct / 100 + v.impactPct / 100);
    const expectedReceived = amount / expectedPrice;
    const slippage = ((baseReceived - expectedReceived) / baseReceived) * 100;
    return {
      venue: v.venue,
      venueType: v.type,
      expectedPrice,
      expectedReceived,
      spread: basePrice * (v.spreadPct / 100),
      priceImpact: v.impactPct,
      slippage,
      liquidity: v.liquidity,
      fee: amount * (v.feePct / 100),
      feePct: v.feePct,
      quoteAge: Math.floor(Math.random() * 8 + 1),
      routeComplexity: v.routeComplexity,
      settlement: v.settlement,
      quoteType: v.type === 'RFQ' ? 'executable' : 'indicative',
      route: v.route,
    };
  });
}

// ─── Strategies ───────────────────────────────────────────────────

export function getStrategies(): Strategy[] {
  return [
    {
      id: 'strat-1',
      name: 'AI Momentum Alpha',
      creator: '0xQuant...4f2a',
      description: 'Momentum-based strategy targeting high-conviction tokenized stocks with MITIGATOR Score above 75.',
      roi: 34.2,
      drawdown: -8.4,
      volatility: 22,
      sharpe: 1.84,
      winRate: 68,
      tradeFrequency: 4.2,
      concentration: 35,
      holdingPeriod: '2-7 days',
      methodology: 'Score-weighted momentum with volatility scaling and event blackout periods.',
      followers: 1284,
      copiers: 342,
      riskLevel: 'moderate',
      verified: true,
    },
    {
      id: 'strat-2',
      name: 'Dividend Harvest Pro',
      creator: '0xIncome...8c1d',
      description: 'Systematic dividend capture with DCA re-entry. Focus on dividend-paying tokenized stocks.',
      roi: 18.6,
      drawdown: -4.2,
      volatility: 12,
      sharpe: 1.52,
      winRate: 82,
      tradeFrequency: 1.8,
      concentration: 22,
      holdingPeriod: '15-45 days',
      methodology: 'Ex-dividend date tracking with position sizing based on yield and MITIGATOR Score.',
      followers: 876,
      copiers: 198,
      riskLevel: 'low',
      verified: true,
    },
    {
      id: 'strat-3',
      name: 'Mean Reversion Bot',
      creator: '0xRevert...2b9e',
      description: 'Statistical mean reversion on RSI extremes with tight risk stops.',
      roi: 27.8,
      drawdown: -11.2,
      volatility: 28,
      sharpe: 1.42,
      winRate: 61,
      tradeFrequency: 8.5,
      concentration: 28,
      holdingPeriod: '1-3 days',
      methodology: 'Bollinger Band + RSI reversion with ATR-based stops and maximum 2% risk per trade.',
      followers: 542,
      copiers: 127,
      riskLevel: 'elevated',
      verified: false,
    },
  ];
}

// ─── Paper Trading ───────────────────────────────────────────────

export function getPaperTrades(): Trade[] {
  return [
    { id: 'paper-1', symbol: 'NVDAx', side: 'buy', amount: 1500, price: 178.42, executedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), venue: 'Jupiter', fee: 0, slippage: 0.08, pnl: 87.0, status: 'filled' },
    { id: 'paper-2', symbol: 'AAPLx', side: 'buy', amount: 1000, price: 224.12, executedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), venue: 'Orca', fee: 2.5, slippage: 0.10, pnl: 112.5, status: 'filled' },
    { id: 'paper-3', symbol: 'TSLAx', side: 'sell', amount: 800, price: 252.8, executedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), venue: 'Raydium', fee: 2.0, slippage: 0.15, pnl: -34.4, status: 'filled' },
    { id: 'paper-4', symbol: 'AMZNx', side: 'buy', amount: 1200, price: 171.22, executedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), venue: 'Jupiter', fee: 0, slippage: 0.08, pnl: 37.32, status: 'filled' },
  ];
}

// ─── Alerts ──────────────────────────────────────────────────────

export function getAlerts(): Alert[] {
  return [
    { id: 'alert-1', type: 'price', symbol: 'NVDAx', condition: 'above', threshold: 190, current: 184.22, triggered: false, triggeredAt: null, createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), active: true },
    { id: 'alert-2', type: 'risk', symbol: 'TSLAx', condition: 'above', threshold: 70, current: 61, triggered: false, triggeredAt: null, createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), active: true },
    { id: 'alert-3', type: 'news', symbol: 'NVDAx', condition: 'high_importance', threshold: 1, current: 2, triggered: true, triggeredAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(), active: true },
    { id: 'alert-4', type: 'sentiment', symbol: 'AAPLx', condition: 'above', threshold: 75, current: 65, triggered: false, triggeredAt: null, createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), active: true },
    { id: 'alert-5', type: 'portfolio_concentration', symbol: 'NVDAx', condition: 'above', threshold: 30, current: 28, triggered: false, triggeredAt: null, createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(), active: true },
  ];
}

// ─── AI Insight ───────────────────────────────────────────────────

export function getAIInsight(symbol: string, amount: number): AIInsight {
  const m = assetMeta[symbol];
  return {
    id: `ai-${symbol}-${Date.now()}`,
    query: `Should I buy $${amount.toLocaleString()} of ${symbol}?`,
    verdict: m.score >= 75 ? 'Favorable with mitigation' : m.score >= 60 ? 'Caution advised' : 'High risk — reconsider',
    confidence: 0.82,
    timestamp: new Date().toISOString(),
    modelVersion: 'mitigator-v2.1',
    sections: [
      {
        label: 'VERDICT',
        content: m.score >= 75
          ? `${symbol} shows strong trade readiness with a MITIGATOR Score of ${m.score}. Recommend a phased entry to manage execution risk.`
          : `${symbol} has a MITIGATOR Score of ${m.score}, indicating elevated risk. Consider a smaller position with DCA.`,
        sources: [{ label: 'MITIGATOR Risk Engine', tier: 'VERIFIED' }],
        confidence: 0.88,
      },
      {
        label: 'THESIS',
        content: `${m.name} operates in the ${m.sector} sector with a market cap of $${(m.marketCap / 1e12).toFixed(2)}T. The tokenized version is fully backed and verified by xStocks with a healthy Pyth oracle feed.`,
        sources: [
          { label: 'xStocks', tier: 'CANONICAL' },
          { label: 'Pyth', tier: 'PRIMARY' },
        ],
        confidence: 0.95,
      },
      {
        label: 'COUNTER-THESIS',
        content: `Beta of ${m.beta} suggests ${m.beta > 1.3 ? 'high' : 'moderate'} sensitivity to market movements. Current P/E of ${m.pe} is ${m.pe > 50 ? 'elevated relative to sector peers' : 'within historical range'}.`,
        sources: [{ label: 'Alpha Vantage', tier: 'VERIFIED' }],
        confidence: 0.80,
      },
      {
        label: 'KEY RISKS',
        content: `Volatility at ${m.volatility}%. Liquidity score ${m.liquidity}. ${m.liquidity < 80 ? 'Liquidity may be insufficient for large orders without slippage.' : 'Liquidity is adequate for this position size.'}`,
        sources: [{ label: 'Solana RPC', tier: 'VERIFIED' }],
        confidence: 0.85,
      },
      {
        label: 'CATALYSTS',
        content: `Upcoming earnings and product cycle events. Social sentiment at ${m.sentiment}/100. News sentiment is ${m.sentiment > 60 ? 'positive' : 'mixed'}.`,
        sources: [
          { label: 'NewsAPI', tier: 'VERIFIED' },
          { label: 'X', tier: 'SOCIAL' },
        ],
        confidence: 0.72,
      },
      {
        label: 'PORTFOLIO IMPACT',
        content: `Adding $${amount.toLocaleString()} would increase ${m.sector} exposure. Current allocation suggests ${amount > 1500 ? 'reducing initial size' : 'this is within acceptable range'}.`,
        sources: [{ label: 'MITIGATOR Portfolio Engine', tier: 'VERIFIED' }],
        confidence: 0.90,
      },
      {
        label: 'LIQUIDITY',
        content: `Estimated slippage for $${amount.toLocaleString()} order: ~0.08-0.15% across venues. Jupiter aggregator offers best routing.`,
        sources: [{ label: 'Jupiter', tier: 'VERIFIED' }],
        confidence: 0.78,
      },
      {
        label: 'MITIGATION',
        content: amount > 1500
          ? `Consider splitting: $${Math.round(amount * 0.375).toLocaleString()} now, $${Math.round(amount * 0.625).toLocaleString()} via DCA over 3 entries. Set max slippage to 0.50%.`
          : `Position size is reasonable. Set max slippage to 0.50% and use Jupiter for best execution.`,
        sources: [{ label: 'MITIGATOR Risk Engine', tier: 'VERIFIED' }],
        confidence: 0.86,
      },
      {
        label: 'EXECUTION',
        content: `Jupiter offers the best expected price with 0.05% spread. xChange RFQ provides executable quotes with lower slippage for larger orders.`,
        sources: [
          { label: 'Jupiter', tier: 'VERIFIED' },
          { label: 'xChange', tier: 'SECONDARY' },
        ],
        confidence: 0.75,
      },
      {
        label: 'CONFIDENCE',
        content: `Overall confidence in this analysis: 82%. Data freshness is live. Oracle status is healthy. Token verification is confirmed.`,
        sources: [
          { label: 'Pyth', tier: 'PRIMARY' },
          { label: 'xStocks', tier: 'CANONICAL' },
        ],
        confidence: 0.82,
      },
    ],
  };
}

// ─── Provenance ───────────────────────────────────────────────────

export function getProvenanceRecords(symbol: string): ProvenanceRecord[] {
  return [
    { id: 'prov-1', dataPoint: 'Current Price', provider: 'Pyth', endpoint: '/price_feeds', retrievedAt: new Date().toISOString(), publishedAt: new Date(Date.now() - 2000).toISOString(), freshness: 'live', confidence: 0.99, verification: 'verified', sourceTier: 'PRIMARY', notes: 'Oracle price feed updated 2s ago' },
    { id: 'prov-2', dataPoint: 'Token Supply', provider: 'Solana RPC', endpoint: '/getTokenSupply', retrievedAt: new Date().toISOString(), publishedAt: new Date(Date.now() - 5000).toISOString(), freshness: 'live', confidence: 1.0, verification: 'verified', sourceTier: 'CANONICAL', notes: 'Onchain supply verified via RPC' },
    { id: 'prov-3', dataPoint: 'Company Financials', provider: 'SEC EDGAR', endpoint: '/submissions', retrievedAt: new Date(Date.now() - 3600000).toISOString(), publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), freshness: 'recent', confidence: 1.0, verification: 'verified', sourceTier: 'CANONICAL', notes: 'Latest 10-K filing' },
    { id: 'prov-4', dataPoint: 'News Headlines', provider: 'NewsAPI', endpoint: '/v2/everything', retrievedAt: new Date(Date.now() - 600000).toISOString(), publishedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), freshness: 'recent', confidence: 0.85, verification: 'verified', sourceTier: 'VERIFIED', notes: 'Aggregated from multiple sources' },
    { id: 'prov-5', dataPoint: 'Social Sentiment', provider: 'X API', endpoint: '/2/tweets/search', retrievedAt: new Date(Date.now() - 300000).toISOString(), publishedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(), freshness: 'recent', confidence: 0.65, verification: 'unverified', sourceTier: 'SOCIAL', notes: 'Social signal — not verified fact' },
    { id: 'prov-6', dataPoint: 'Liquidity Depth', provider: 'Jupiter', endpoint: '/quote', retrievedAt: new Date().toISOString(), publishedAt: new Date().toISOString(), freshness: 'live', confidence: 0.92, verification: 'verified', sourceTier: 'VERIFIED', notes: 'AMM pool depth estimate' },
    { id: 'prov-7', dataPoint: 'Historical Price (Equity)', provider: 'Alpha Vantage', endpoint: '/TIME_SERIES_DAILY', retrievedAt: new Date(Date.now() - 3600000).toISOString(), publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), freshness: 'recent', confidence: 0.95, verification: 'verified', sourceTier: 'VERIFIED', notes: 'Underlying equity OHLCV' },
    { id: 'prov-8', dataPoint: 'Historical Price (Token)', provider: 'Solana RPC', endpoint: '/getSignaturesForAddress', retrievedAt: new Date().toISOString(), publishedAt: new Date().toISOString(), freshness: 'live', confidence: 0.98, verification: 'verified', sourceTier: 'CANONICAL', notes: 'Onchain token swap history' },
  ];
}

// ─── AI Agents ────────────────────────────────────────────────────

export function getAgents(): AgentInfo[] {
  return [
    { id: 'agent-research', name: 'Research Agent', role: 'Fundamental analysis and business model evaluation', status: 'active', lastRun: new Date(Date.now() - 2 * 60 * 1000).toISOString(), dataSources: ['SEC EDGAR', 'Company IR', 'Alpha Vantage'], confidence: 0.88, findings: ['NVDA data center revenue up 73% YoY', 'Blackwell architecture positions NVDA for sustained AI demand'], alerts: 0 },
    { id: 'agent-news', name: 'News Agent', role: 'Real-time news monitoring and sentiment analysis', status: 'active', lastRun: new Date(Date.now() - 30 * 1000).toISOString(), dataSources: ['NewsAPI', 'GDELT'], confidence: 0.82, findings: ['2 high-importance articles in last 24h', 'Sentiment shifted positive after GTC'], alerts: 1 },
    { id: 'agent-filings', name: 'Filings Agent', role: 'SEC filing monitoring and extraction', status: 'idle', lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), dataSources: ['SEC EDGAR'], confidence: 0.95, findings: ['Latest 10-K filed 14 days ago', 'No new filings in last 24h'], alerts: 0 },
    { id: 'agent-social', name: 'Social Agent', role: 'Social sentiment aggregation and narrative detection', status: 'active', lastRun: new Date(Date.now() - 60 * 1000).toISOString(), dataSources: ['X API', 'Reddit', 'Stocktwits'], confidence: 0.68, findings: ['Bullish sentiment at 72/100', 'Emerging narrative: Blackwell supply chain'], alerts: 0 },
    { id: 'agent-risk', name: 'Risk Agent', role: 'Multi-factor risk scoring and monitoring', status: 'active', lastRun: new Date(Date.now() - 15 * 1000).toISOString(), dataSources: ['MITIGATOR Engine', 'Pyth', 'Solana RPC'], confidence: 0.87, findings: ['NVDAx score improved to 84', 'TSLAx liquidity risk elevated'], alerts: 2 },
    { id: 'agent-execution', name: 'Execution Agent', role: 'Venue comparison and routing analysis', status: 'idle', lastRun: new Date(Date.now() - 5 * 60 * 1000).toISOString(), dataSources: ['Jupiter', 'Raydium', 'Orca', 'Meteora'], confidence: 0.78, findings: ['Jupiter best routing for < $5k orders', 'xChange RFQ better for > $10k'], alerts: 0 },
    { id: 'agent-portfolio', name: 'Portfolio Agent', role: 'Portfolio risk and rebalancing analysis', status: 'active', lastRun: new Date(Date.now() - 3 * 60 * 1000).toISOString(), dataSources: ['MITIGATOR Engine'], confidence: 0.90, findings: ['Tech sector concentration at 58%', 'Consider diversification'], alerts: 1 },
    { id: 'agent-strategy', name: 'Strategy Agent', role: 'Strategy monitoring and signal generation', status: 'idle', lastRun: new Date(Date.now() - 15 * 60 * 1000).toISOString(), dataSources: ['MITIGATOR Engine'], confidence: 0.75, findings: ['Momentum signal active on NVDAx', 'No new DCA triggers'], alerts: 0 },
    { id: 'agent-alerts', name: 'Alerts Agent', role: 'Alert monitoring and notification', status: 'active', lastRun: new Date(Date.now() - 10 * 1000).toISOString(), dataSources: ['All Sources'], confidence: 0.92, findings: ['3 active alerts', '1 triggered in last 24h'], alerts: 1 },
  ];
}

// ─── Robo Profiles ────────────────────────────────────────────────

export function getRoboProfiles(): RoboProfile[] {
  return [
    { id: 'robo-conservative', name: 'Conservative', description: 'Capital preservation with steady income. Focus on low-volatility, high-liquidity assets.', riskLevel: 'low', expectedReturn: 8.4, maxDrawdown: -6.2, allocation: [{ symbol: 'SPYx', weight: 50 }, { symbol: 'QQQx', weight: 25 }, { symbol: 'AAPLx', weight: 15 }, { symbol: 'GOOGLx', weight: 10 }], enabled: false },
    { id: 'robo-balanced', name: 'Balanced', description: 'Balanced growth with moderate risk. Diversified across sectors with score-weighted allocation.', riskLevel: 'moderate', expectedReturn: 14.2, maxDrawdown: -10.5, allocation: [{ symbol: 'NVDAx', weight: 20 }, { symbol: 'AAPLx', weight: 20 }, { symbol: 'AMZNx', weight: 15 }, { symbol: 'SPYx', weight: 25 }, { symbol: 'GOOGLx', weight: 10 }, { symbol: 'QQQx', weight: 10 }], enabled: false },
    { id: 'robo-growth', name: 'Growth', description: 'Growth-oriented with higher conviction positions. Targets high MITIGATOR Score assets.', riskLevel: 'elevated', expectedReturn: 22.8, maxDrawdown: -16.4, allocation: [{ symbol: 'NVDAx', weight: 30 }, { symbol: 'AMZNx', weight: 20 }, { symbol: 'GOOGLx', weight: 15 }, { symbol: 'AAPLx', weight: 15 }, { symbol: 'QQQx', weight: 20 }], enabled: false },
    { id: 'robo-momentum', name: 'Momentum', description: 'Momentum-driven with frequent rebalancing. Rides trends with tight stops.', riskLevel: 'high', expectedReturn: 28.4, maxDrawdown: -22.1, allocation: [{ symbol: 'NVDAx', weight: 35 }, { symbol: 'AAPLx', weight: 20 }, { symbol: 'AMZNx', weight: 15 }, { symbol: 'QQQx', weight: 30 }], enabled: false },
    { id: 'robo-dividend', name: 'Dividend', description: 'Dividend-focused with yield optimization. Targets dividend-paying tokenized stocks.', riskLevel: 'low', expectedReturn: 10.8, maxDrawdown: -7.8, allocation: [{ symbol: 'SPYx', weight: 40 }, { symbol: 'QQQx', weight: 20 }, { symbol: 'AAPLx', weight: 25 }, { symbol: 'NVDAx', weight: 15 }], enabled: false },
  ];
}

// ─── Community Posts (for community page) ─────────────────────────

export function getCommunityPosts(symbol: string) {
  const social = getSocialPosts(symbol);
  return social.map((s) => ({
    ...s,
    type: s.sentiment === 'bullish' ? 'Trade Idea' : s.sentiment === 'bearish' ? 'Analysis' : 'Question',
  }));
}
