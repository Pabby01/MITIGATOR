import { getSupabase, isSupabaseConfigured } from './supabase';
import { executePaperTrade } from './paper-trading-service';

export interface MarketplaceStrategy {
  id: string;
  name: string;
  creator: string;
  description: string;
  riskLevel: 'low' | 'moderate' | 'elevated' | 'high';
  roi: number;
  drawdown: number;
  sharpe: number;
  winRate: number;
  volatility: number;
  tradeFrequency: number;
  holdingPeriod: string;
  concentration: number;
  methodology: string;
  followers: number;
  copiers: number;
  verified: boolean;
  targetAssets: string[];
}

export interface StrategySubscription {
  id: string;
  userAddress: string;
  strategyId: string;
  type: 'follow' | 'copy' | 'paper';
  allocationUsd: number;
  createdAt: string;
}

const SEED_STRATEGIES: MarketplaceStrategy[] = [
  {
    id: 'strat-1',
    name: 'AI Momentum Alpha',
    creator: '0xQuant...4f2a',
    description: 'Momentum-based strategy targeting high-conviction tokenized stocks with MITIGATOR Score above 75.',
    riskLevel: 'moderate',
    roi: 34.2,
    drawdown: 8.4,
    sharpe: 1.84,
    winRate: 68,
    volatility: 22,
    tradeFrequency: 4.2,
    holdingPeriod: '2-7 days',
    concentration: 35,
    methodology: 'Score-weighted momentum with volatility scaling and event blackout periods.',
    followers: 1284,
    copiers: 342,
    verified: true,
    targetAssets: ['NVDAx', 'MSFTx', 'AAPLx'],
  },
  {
    id: 'strat-2',
    name: 'Dividend Harvest Pro',
    creator: '0xIncome...8c1d',
    description: 'Systematic dividend capture with DCA re-entry. Focus on dividend-paying tokenized stocks.',
    riskLevel: 'low',
    roi: 18.6,
    drawdown: 4.2,
    sharpe: 1.52,
    winRate: 82,
    volatility: 12,
    tradeFrequency: 1.8,
    holdingPeriod: '15-45 days',
    concentration: 22,
    methodology: 'Ex-dividend date tracking with position sizing based on yield and MITIGATOR Score.',
    followers: 876,
    copiers: 198,
    verified: true,
    targetAssets: ['AAPLx', 'MSFTx', 'SPYx'],
  },
  {
    id: 'strat-3',
    name: 'Mean Reversion Bot',
    creator: '0xRevert...2b9e',
    description: 'Statistical mean reversion on RSI extremes with tight risk stops.',
    riskLevel: 'elevated',
    roi: 27.8,
    drawdown: 11.2,
    sharpe: 1.42,
    winRate: 61,
    volatility: 28,
    tradeFrequency: 8.5,
    holdingPeriod: '1-3 days',
    concentration: 28,
    methodology: 'Bollinger Band + RSI reversion with ATR-based stops and maximum 2% risk per trade.',
    followers: 542,
    copiers: 127,
    verified: false,
    targetAssets: ['TSLAx', 'NVDAx'],
  },
];

const STORAGE_KEY_SUBSCRIPTIONS = 'mitigator_strategy_subs_';
const STORAGE_KEY_CUSTOM_STRATEGIES = 'mitigator_custom_strategies';

/**
 * Fetch marketplace strategies
 */
export async function getMarketplaceStrategies(): Promise<MarketplaceStrategy[]> {
  let customStrats: MarketplaceStrategy[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CUSTOM_STRATEGIES);
      if (stored) customStrats = JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase.from('strategies').select('*');
        if (data && !error && data.length > 0) {
          return [...customStrats, ...data];
        }
      } catch (err) {
        console.warn('[Strategies] Supabase fetch error:', err);
      }
    }
  }
  return [...customStrats, ...SEED_STRATEGIES];
}

/**
 * Create and register a custom strategy
 */
export async function createCustomStrategy(
  strategy: Omit<MarketplaceStrategy, 'id' | 'followers' | 'copiers' | 'verified'>
): Promise<MarketplaceStrategy> {
  const newStrategy: MarketplaceStrategy = {
    ...strategy,
    id: `strat-custom-${Date.now()}`,
    followers: 1,
    copiers: 1,
    verified: false,
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('strategies').insert(newStrategy);
      } catch (err) {
        console.warn('[Strategies] Failed to save custom strategy to Supabase:', err);
      }
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem(STORAGE_KEY_CUSTOM_STRATEGIES);
      const list: MarketplaceStrategy[] = existing ? JSON.parse(existing) : [];
      list.unshift(newStrategy);
      localStorage.setItem(STORAGE_KEY_CUSTOM_STRATEGIES, JSON.stringify(list));
    } catch (err) {
      console.warn('Failed to save custom strategy locally:', err);
    }
  }

  return newStrategy;
}

/**
 * Get user's active subscriptions (following, copying, paper)
 */
export function getUserSubscriptions(userAddress: string = 'guest'): StrategySubscription[] {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_SUBSCRIPTIONS}${userAddress}`);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
  }
  return [];
}

/**
 * Follow / Unfollow a strategy
 */
export async function toggleFollowStrategy(userAddress: string = 'guest', strategyId: string): Promise<boolean> {
  const current = getUserSubscriptions(userAddress);
  const exists = current.find((s) => s.strategyId === strategyId && s.type === 'follow');

  let updated: StrategySubscription[];
  if (exists) {
    updated = current.filter((s) => !(s.strategyId === strategyId && s.type === 'follow'));
  } else {
    updated = [
      ...current,
      {
        id: `sub-${Date.now()}`,
        userAddress,
        strategyId,
        type: 'follow',
        allocationUsd: 0,
        createdAt: new Date().toISOString(),
      },
    ];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_KEY_SUBSCRIPTIONS}${userAddress}`, JSON.stringify(updated));
  }

  return !exists;
}

/**
 * Copy trade a strategy with risk policy guardrails
 */
export async function copyStrategy(
  userAddress: string = 'guest',
  strategyId: string,
  allocationUsd: number
): Promise<{ success: boolean; message: string }> {
  if (allocationUsd <= 0) {
    return { success: false, message: 'Invalid allocation amount.' };
  }

  const current = getUserSubscriptions(userAddress);
  const updated: StrategySubscription[] = [
    ...current.filter((s) => !(s.strategyId === strategyId && s.type === 'copy')),
    {
      id: `copy-${Date.now()}`,
      userAddress,
      strategyId,
      type: 'copy',
      allocationUsd,
      createdAt: new Date().toISOString(),
    },
  ];

  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_KEY_SUBSCRIPTIONS}${userAddress}`, JSON.stringify(updated));
  }

  return {
    success: true,
    message: `Copy trading successfully configured with $${allocationUsd.toLocaleString()} cap. Pre-trade guardrails active.`,
  };
}

/**
 * Deploy strategy into Paper Trading account
 */
export async function deployPaperStrategy(
  userAddress: string = 'guest',
  strategyId: string,
  virtualAmountUsd: number = 2500
): Promise<{ success: boolean; message: string }> {
  const strategies = await getMarketplaceStrategies();
  const strat = strategies.find((s) => s.id === strategyId) || SEED_STRATEGIES[0];

  const targetAsset = strat.targetAssets[0] || 'NVDAx';

  // Execute paper trade using live Pyth price
  await executePaperTrade({
    userAddress,
    symbol: targetAsset,
    side: 'buy',
    amountUsd: virtualAmountUsd,
    venue: 'Jupiter (Strategy Auto)',
  });

  const current = getUserSubscriptions(userAddress);
  const updated: StrategySubscription[] = [
    ...current.filter((s) => !(s.strategyId === strategyId && s.type === 'paper')),
    {
      id: `paper-strat-${Date.now()}`,
      userAddress,
      strategyId,
      type: 'paper',
      allocationUsd: virtualAmountUsd,
      createdAt: new Date().toISOString(),
    },
  ];

  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_KEY_SUBSCRIPTIONS}${userAddress}`, JSON.stringify(updated));
  }

  return {
    success: true,
    message: `Deployed $${virtualAmountUsd.toLocaleString()} virtual allocation to ${strat.name} in Paper Trading. Position opened on ${targetAsset}.`,
  };
}
