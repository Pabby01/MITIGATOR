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

/**
 * Fetch all alerts for a user
 */
export async function getUserAlerts(userAddress: string = 'guest'): Promise<UserAlert[]> {
  let localAlerts: UserAlert[] = [];
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_ALERTS}${userAddress}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          localAlerts = parsed.filter((a) => a.id && !a.id.startsWith('alert-seed-'));
        }
      }
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

  return localAlerts;
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
