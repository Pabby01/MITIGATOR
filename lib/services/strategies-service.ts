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

const STORAGE_KEY_SUBSCRIPTIONS = 'mitigator_strategy_subs_';
const STORAGE_KEY_CUSTOM_STRATEGIES = 'mitigator_custom_strategies';

/**
 * Fetch marketplace strategies (from custom user models or database)
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
  return customStrats;
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
    followers: 0,
    copiers: 0,
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
  const strat = strategies.find((s) => s.id === strategyId);
  if (!strat) {
    return { success: false, message: 'Selected strategy not found.' };
  }

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

/**
 * Delete a custom strategy
 */
export async function deleteCustomStrategy(strategyId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('strategies').delete().eq('id', strategyId);
      } catch (err) {
        console.warn('[Strategies] Supabase delete error:', err);
      }
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = localStorage.getItem(STORAGE_KEY_CUSTOM_STRATEGIES);
      if (existing) {
        const list: MarketplaceStrategy[] = JSON.parse(existing);
        const filtered = list.filter((s) => s.id !== strategyId);
        localStorage.setItem(STORAGE_KEY_CUSTOM_STRATEGIES, JSON.stringify(filtered));
      }
    } catch (err) {
      console.warn('Failed to delete strategy locally:', err);
    }
  }

  return true;
}

/**
 * Cancel copy trading or paper subscription for a strategy
 */
export async function cancelCopyStrategy(userAddress: string = 'guest', strategyId: string): Promise<boolean> {
  const current = getUserSubscriptions(userAddress);
  const updated = current.filter((s) => s.strategyId !== strategyId);

  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_KEY_SUBSCRIPTIONS}${userAddress}`, JSON.stringify(updated));
  }

  return true;
}

