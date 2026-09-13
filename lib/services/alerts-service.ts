import { getSupabase, isSupabaseConfigured } from './supabase';

export interface UserAlert {
  id: string;
  userAddress: string;
  type: 'price' | 'risk' | 'news' | 'sentiment' | 'liquidity' | 'peg_divergence' | 'corporate_action';
  symbol: string;
  condition: 'above' | 'below';
  threshold: number;
  currentValue: number;
  triggered: boolean;
  triggeredAt: string | null;
  active: boolean;
  createdAt: string;
  notes?: string;
}

const STORAGE_KEY_ALERTS = 'mitigator_user_alerts_';

const DEFAULT_ALERTS: UserAlert[] = [
  {
    id: 'alert-seed-1',
    userAddress: 'guest',
    type: 'price',
    symbol: 'NVDAx',
    condition: 'above',
    threshold: 190.0,
    currentValue: 184.22,
    triggered: false,
    triggeredAt: null,
    active: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    notes: 'Breakout above $190 key resistance level',
  },
  {
    id: 'alert-seed-2',
    userAddress: 'guest',
    type: 'risk',
    symbol: 'TSLAx',
    condition: 'below',
    threshold: 65,
    currentValue: 74,
    triggered: false,
    triggeredAt: null,
    active: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    notes: 'MITIGATOR Risk score deterioration alert',
  },
  {
    id: 'alert-seed-3',
    userAddress: 'guest',
    type: 'peg_divergence',
    symbol: 'AAPLx',
    condition: 'above',
    threshold: 0.15,
    currentValue: 0.03,
    triggered: false,
    triggeredAt: null,
    active: true,
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    notes: 'Onchain Token-2022 depeg circuit breaker',
  },
];

/**
 * Fetch all alerts for a user
 */
export async function getUserAlerts(userAddress: string = 'guest'): Promise<UserAlert[]> {
  let localAlerts: UserAlert[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_ALERTS}${userAddress}`);
      if (stored) localAlerts = JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load local alerts:', e);
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_alerts')
          .select('*')
          .eq('user_address', userAddress);

        if (data && !error && data.length > 0) {
          return data;
        }
      } catch (err) {
        console.warn('[Alerts] Supabase fetch error:', err);
      }
    }
  }

  return localAlerts.length > 0 ? localAlerts : DEFAULT_ALERTS;
}

/**
 * Create a new user alert
 */
export async function createUserAlert(
  alert: Omit<UserAlert, 'id' | 'createdAt' | 'triggered' | 'triggeredAt'>
): Promise<UserAlert> {
  const newAlert: UserAlert = {
    ...alert,
    id: `alert-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    triggered: false,
    triggeredAt: null,
  };

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('user_alerts').insert(newAlert);
      } catch (err) {
        console.warn('[Alerts] Failed to insert alert to Supabase:', err);
      }
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = await getUserAlerts(alert.userAddress);
      const updated = [newAlert, ...existing];
      localStorage.setItem(`${STORAGE_KEY_ALERTS}${alert.userAddress}`, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save alert locally:', e);
    }
  }

  return newAlert;
}

/**
 * Delete a user alert
 */
export async function deleteUserAlert(userAddress: string = 'guest', alertId: string): Promise<boolean> {
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('user_alerts').delete().eq('id', alertId);
      } catch (err) {
        console.warn('[Alerts] Supabase delete error:', err);
      }
    }
  }

  if (typeof window !== 'undefined') {
    try {
      const existing = await getUserAlerts(userAddress);
      const filtered = existing.filter((a) => a.id !== alertId);
      localStorage.setItem(`${STORAGE_KEY_ALERTS}${userAddress}`, JSON.stringify(filtered));
    } catch (e) {
      console.warn('Failed to delete alert locally:', e);
    }
  }

  return true;
}

/**
 * Toggle an alert active/inactive
 */
export async function toggleUserAlert(userAddress: string = 'guest', alertId: string): Promise<UserAlert | null> {
  const alerts = await getUserAlerts(userAddress);
  const target = alerts.find((a) => a.id === alertId);
  if (!target) return null;

  target.active = !target.active;

  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_KEY_ALERTS}${userAddress}`, JSON.stringify(alerts));
  }

  return target;
}

/**
 * Evaluate active alerts against live Pyth streaming prices and MITIGATOR scores
 */
export async function evaluateLiveAlerts(
  userAddress: string = 'guest',
  prices: Record<string, number>,
  scores?: Record<string, number>
): Promise<{ alerts: UserAlert[]; newlyTriggeredCount: number }> {
  const alerts = await getUserAlerts(userAddress);
  let newlyTriggeredCount = 0;

  const evaluated = alerts.map((a) => {
    if (!a.active) return a;

    let currentVal = a.currentValue;
    const cleanSym = a.symbol.replace(/x$/, '');

    if (a.type === 'price') {
      const livePrice = prices[a.symbol] || prices[cleanSym];
      if (livePrice !== undefined) {
        currentVal = livePrice;
        const isTriggered =
          a.condition === 'above' ? livePrice >= a.threshold : livePrice <= a.threshold;

        if (isTriggered && !a.triggered) {
          newlyTriggeredCount++;
          return {
            ...a,
            currentValue: livePrice,
            triggered: true,
            triggeredAt: new Date().toISOString(),
          };
        }
      }
    } else if (a.type === 'risk') {
      const liveScore = scores?.[a.symbol] || scores?.[cleanSym] || 82;
      currentVal = liveScore;
      const isTriggered =
        a.condition === 'above' ? liveScore >= a.threshold : liveScore <= a.threshold;

      if (isTriggered && !a.triggered) {
        newlyTriggeredCount++;
        return {
          ...a,
          currentValue: liveScore,
          triggered: true,
          triggeredAt: new Date().toISOString(),
        };
      }
    }

    return {
      ...a,
      currentValue: currentVal,
    };
  });

  if (typeof window !== 'undefined' && newlyTriggeredCount > 0) {
    localStorage.setItem(`${STORAGE_KEY_ALERTS}${userAddress}`, JSON.stringify(evaluated));
  }

  return { alerts: evaluated, newlyTriggeredCount };
}
