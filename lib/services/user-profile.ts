import { getSupabase, isSupabaseConfigured } from './supabase';

export interface UserProfile {
  walletAddress: string;
  displayName: string;
  avatarUrl?: string;
  riskTolerance: 'conservative' | 'balanced' | 'aggressive';
  maxSlippagePct: number;
  maxOrderSizeUsd: number;
  watchlist: string[];
  email?: string;
  telegramHandle?: string;
  notifications: {
    pegDeviation: boolean;
    secFilings: boolean;
    riskDeterioration: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

const DEFAULT_PROFILE: Omit<UserProfile, 'walletAddress'> = {
  displayName: 'Solana Trader',
  riskTolerance: 'balanced',
  maxSlippagePct: 0.5,
  maxOrderSizeUsd: 5000,
  watchlist: ['NVDAx', 'TSLAx', 'AAPLx', 'MSFTx'],
  notifications: {
    pegDeviation: true,
    secFilings: true,
    riskDeterioration: true,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

/**
 * Load profile for a given wallet address.
 * Tries Supabase if configured; otherwise reads from browser localStorage.
 */
export async function getUserProfile(walletAddress: string): Promise<UserProfile> {
  if (!walletAddress) {
    return {
      walletAddress: 'guest',
      ...DEFAULT_PROFILE,
    };
  }

  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('wallet_address', walletAddress)
          .single();

        if (data && !error) {
          return {
            walletAddress: data.wallet_address,
            displayName: data.display_name || DEFAULT_PROFILE.displayName,
            avatarUrl: data.avatar_url,
            riskTolerance: data.risk_tolerance || DEFAULT_PROFILE.riskTolerance,
            maxSlippagePct: data.max_slippage_pct || DEFAULT_PROFILE.maxSlippagePct,
            maxOrderSizeUsd: data.max_order_size_usd || DEFAULT_PROFILE.maxOrderSizeUsd,
            watchlist: data.watchlist || DEFAULT_PROFILE.watchlist,
            email: data.email,
            telegramHandle: data.telegram_handle,
            notifications: data.notifications || DEFAULT_PROFILE.notifications,
            createdAt: data.created_at || new Date().toISOString(),
            updatedAt: data.updated_at || new Date().toISOString(),
          };
        }
      } catch (err) {
        console.warn('[Profile] Supabase query failed, falling back to local storage:', err);
      }
    }
  }

  // 2. Client-side localStorage fallback
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`mitigator_profile_${walletAddress}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore JSON parse error
    }
  }

  // Return default profile keyed to address
  return {
    walletAddress,
    ...DEFAULT_PROFILE,
    displayName: `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`,
  };
}

/**
 * Save / Update user profile
 */
export async function saveUserProfile(profile: UserProfile): Promise<boolean> {
  if (!profile.walletAddress) return false;

  profile.updatedAt = new Date().toISOString();

  // 1. Always sync to localStorage for instantaneous response
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`mitigator_profile_${profile.walletAddress}`, JSON.stringify(profile));
    } catch (e) {
      console.warn('[Profile] localStorage write error:', e);
    }
  }

  // 2. Upsert to Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { error } = await supabase.from('user_profiles').upsert({
          wallet_address: profile.walletAddress,
          display_name: profile.displayName,
          avatar_url: profile.avatarUrl,
          risk_tolerance: profile.riskTolerance,
          max_slippage_pct: profile.maxSlippagePct,
          max_order_size_usd: profile.maxOrderSizeUsd,
          watchlist: profile.watchlist,
          email: profile.email,
          telegram_handle: profile.telegramHandle,
          notifications: profile.notifications,
          updated_at: profile.updatedAt,
        });
        if (error) throw error;
        return true;
      } catch (err) {
        console.warn('[Profile] Supabase upsert error:', err);
      }
    }
  }

  return true;
}
