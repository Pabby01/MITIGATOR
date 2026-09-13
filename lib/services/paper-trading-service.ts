import { getSupabase, isSupabaseConfigured } from './supabase';
import { getLivePythPrice, PYTH_FEED_IDS } from './pyth-service';
import { getLiveJupiterQuote } from './jupiter-service';

export interface PaperTradeRecord {
  id: string;
  userAddress: string;
  symbol: string;
  side: 'buy' | 'sell';
  amountUsd: number;
  quantity: number;
  executionPrice: number;
  currentPrice: number;
  venue: string;
  feeUsd: number;
  slippagePct: number;
  unrealizedPnl: number;
  unrealizedPnlPct: number;
  status: 'filled' | 'closed';
  timestamp: string;
}

export interface PaperPortfolioSummary {
  cashBalance: number;
  investedValue: number;
  totalPortfolioValue: number;
  totalRealizedPnl: number;
  totalUnrealizedPnl: number;
  totalPnlPct: number;
  winRate: number;
  openPositionsCount: number;
  totalTradesCount: number;
  avgSlippagePct: number;
  totalFeesUsd: number;
  trades: PaperTradeRecord[];
}

// User starting virtual balance
const DEFAULT_CASH = 100000;
const STORAGE_KEY_PREFIX = 'mitigator_paper_portfolio_';

/**
 * Retrieve the current paper portfolio for a wallet
 */
export async function getPaperPortfolio(userAddress: string = 'guest'): Promise<PaperPortfolioSummary> {
  const addr = userAddress || 'guest';
  let trades: PaperTradeRecord[] = [];
  let cashBalance = DEFAULT_CASH;

  // 1. Try Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('paper_trades')
          .select('*')
          .eq('user_address', addr)
          .order('timestamp', { ascending: false });

        if (data && !error && data.length > 0) {
          trades = data.map((d: any) => ({
            id: d.id,
            userAddress: d.user_address,
            symbol: d.symbol,
            side: d.side,
            amountUsd: Number(d.amount_usd),
            quantity: Number(d.quantity),
            executionPrice: Number(d.execution_price),
            currentPrice: Number(d.current_price || d.execution_price),
            venue: d.venue,
            feeUsd: Number(d.fee_usd),
            slippagePct: Number(d.slippage_pct),
            unrealizedPnl: Number(d.unrealized_pnl || 0),
            unrealizedPnlPct: Number(d.unrealized_pnl_pct || 0),
            status: d.status,
            timestamp: d.timestamp,
          }));
        }
      } catch (err) {
        console.warn('[PaperTrading] Supabase fetch error:', err);
      }
    }
  }

  // 2. Client-side LocalStorage
  if (!trades.length && typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${addr}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        const storedTrades: PaperTradeRecord[] = parsed.trades || [];
        // Filter out legacy demo trades
        trades = storedTrades.filter(
          (t) => t.id && !t.id.startsWith('paper-trade-')
        );
        cashBalance = parsed.cashBalance !== undefined ? parsed.cashBalance : DEFAULT_CASH;
      }
    } catch {
      // ignore
    }
  }

  // 3. Update active trades with live Pyth oracle prices
  let investedValue = 0;
  let totalUnrealizedPnl = 0;
  let totalFeesUsd = 0;
  let totalSlippage = 0;

  const enrichedTrades = await Promise.all(
    trades.map(async (t) => {
      totalFeesUsd += t.feeUsd;
      totalSlippage += t.slippagePct;

      if (t.status === 'filled') {
        try {
          const live = await getLivePythPrice(t.symbol);
          const cur = live.price || t.executionPrice;
          const diff = cur - t.executionPrice;
          const pnl = t.side === 'buy' ? diff * t.quantity : -diff * t.quantity;
          const pnlPct = (pnl / t.amountUsd) * 100;
          const currentPosVal = cur * t.quantity;

          investedValue += currentPosVal;
          totalUnrealizedPnl += pnl;

          return {
            ...t,
            currentPrice: cur,
            unrealizedPnl: Math.round(pnl * 100) / 100,
            unrealizedPnlPct: Math.round(pnlPct * 100) / 100,
          };
        } catch {
          investedValue += t.amountUsd;
          return t;
        }
      }
      return t;
    })
  );

  const totalPortfolioValue = cashBalance + investedValue;
  const totalRealizedPnl = 0;
  const totalPnl = totalRealizedPnl + totalUnrealizedPnl;
  const totalPnlPct = (totalPnl / DEFAULT_CASH) * 100;

  const filledTrades = enrichedTrades.filter((t) => t.status === 'filled');
  const winningTrades = enrichedTrades.filter((t) => t.unrealizedPnl > 0);
  const winRate = enrichedTrades.length ? Math.round((winningTrades.length / enrichedTrades.length) * 100) : 0;
  const avgSlippagePct = enrichedTrades.length ? totalSlippage / enrichedTrades.length : 0.0;

  return {
    cashBalance: Math.round(cashBalance * 100) / 100,
    investedValue: Math.round(investedValue * 100) / 100,
    totalPortfolioValue: Math.round(totalPortfolioValue * 100) / 100,
    totalRealizedPnl,
    totalUnrealizedPnl: Math.round(totalUnrealizedPnl * 100) / 100,
    totalPnlPct: Math.round(totalPnlPct * 100) / 100,
    winRate,
    openPositionsCount: filledTrades.length,
    totalTradesCount: enrichedTrades.length,
    avgSlippagePct: Math.round(avgSlippagePct * 100) / 100,
    totalFeesUsd: Math.round(totalFeesUsd * 100) / 100,
    trades: enrichedTrades,
  };
}

/**
 * Execute a new paper trade at real-time market oracle price
 */
export async function executePaperTrade(params: {
  userAddress: string;
  symbol: string;
  side: 'buy' | 'sell';
  amountUsd: number;
  venue?: string;
}): Promise<PaperTradeRecord> {
  const { userAddress = 'guest', symbol, side, amountUsd, venue = 'Jupiter' } = params;

  // 1. Fetch live Pyth Hermes oracle streaming price
  const feed = PYTH_FEED_IDS[symbol] || PYTH_FEED_IDS['NVDAx'];
  const pyth = await getLivePythPrice(symbol).catch(() => ({
    price: feed.fallbackPrice,
    conf: 0.02,
    stalenessMs: 120,
    isStale: false,
  }));
  const executionPrice = pyth.price > 0 ? pyth.price : feed.fallbackPrice;

  // 2. Fetch live Jupiter quote for simulated AMM slippage & fees
  const jup = await getLiveJupiterQuote(symbol, amountUsd).catch(() => null);
  const slippagePct = jup?.priceImpactPct ? Math.abs(jup.priceImpactPct) : 0.05;
  const feeUsd = jup?.feesSol ? jup.feesSol * 180 : 0.45;

  const quantity = Math.round((amountUsd / executionPrice) * 10000) / 10000;

  const trade: PaperTradeRecord = {
    id: `paper-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    userAddress,
    symbol,
    side,
    amountUsd,
    quantity,
    executionPrice,
    currentPrice: executionPrice,
    venue: venue || 'Jupiter DLMM',
    feeUsd,
    slippagePct,
    unrealizedPnl: 0,
    unrealizedPnlPct: 0,
    status: 'filled',
    timestamp: new Date().toISOString(),
  };

  // 3. Save to Supabase if configured
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('paper_trades').insert({
          id: trade.id,
          user_address: trade.userAddress,
          symbol: trade.symbol,
          side: trade.side,
          amount_usd: trade.amountUsd,
          quantity: trade.quantity,
          execution_price: trade.executionPrice,
          venue: trade.venue,
          fee_usd: trade.feeUsd,
          slippage_pct: trade.slippagePct,
          status: trade.status,
          timestamp: trade.timestamp,
        });
      } catch (err) {
        console.warn('[PaperTrading] Supabase insert error:', err);
      }
    }
  }

  // 4. Update LocalStorage
  if (typeof window !== 'undefined') {
    try {
      const current = await getPaperPortfolio(userAddress);
      const newCash = Math.max(0, current.cashBalance - amountUsd - feeUsd);
      const updatedTrades = [trade, ...current.trades];
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${userAddress}`,
        JSON.stringify({
          cashBalance: newCash,
          trades: updatedTrades,
        })
      );
    } catch (e) {
      console.warn('[PaperTrading] LocalStorage error:', e);
    }
  }

  return trade;
}

/**
 * Close/sell an open paper position
 */
export async function closePaperPosition(userAddress: string, tradeId: string): Promise<boolean> {
  const current = await getPaperPortfolio(userAddress);
  const trade = current.trades.find((t) => t.id === tradeId);
  if (!trade || trade.status === 'closed') return false;

  const pyth = await getLivePythPrice(trade.symbol);
  const exitPrice = pyth.price || trade.executionPrice;
  const realizedPnl = (exitPrice - trade.executionPrice) * trade.quantity;
  const returnedCash = trade.amountUsd + realizedPnl;

  trade.status = 'closed';
  trade.currentPrice = exitPrice;
  trade.unrealizedPnl = realizedPnl;

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${userAddress}`,
        JSON.stringify({
          cashBalance: current.cashBalance + returnedCash,
          trades: current.trades,
        })
      );
    } catch {
      // ignore
    }
  }

  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase
          .from('paper_trades')
          .update({ status: 'closed', unrealized_pnl: realizedPnl })
          .eq('id', tradeId);
      } catch (e) {
        console.warn('[PaperTrading] Supabase close error:', e);
      }
    }
  }

  return true;
}

/**
 * Reset paper portfolio back to initial $100,000 cash balance and clear all trades
 */
export async function resetPaperPortfolio(userAddress: string = 'guest'): Promise<PaperPortfolioSummary> {
  const addr = userAddress || 'guest';

  // 1. Clear in Supabase
  if (isSupabaseConfigured()) {
    const supabase = getSupabase();
    if (supabase) {
      try {
        await supabase.from('paper_trades').delete().eq('user_address', addr);
      } catch (e) {
        console.warn('[PaperTrading] Supabase reset error:', e);
      }
    }
  }

  // 2. Reset in LocalStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(
        `${STORAGE_KEY_PREFIX}${addr}`,
        JSON.stringify({
          cashBalance: DEFAULT_CASH,
          trades: [],
        })
      );
    } catch (e) {
      console.warn('[PaperTrading] LocalStorage reset error:', e);
    }
  }

  return {
    cashBalance: DEFAULT_CASH,
    investedValue: 0,
    totalPortfolioValue: DEFAULT_CASH,
    totalRealizedPnl: 0,
    totalUnrealizedPnl: 0,
    totalPnlPct: 0,
    winRate: 0,
    openPositionsCount: 0,
    totalTradesCount: 0,
    avgSlippagePct: 0,
    totalFeesUsd: 0,
    trades: [],
  };
}
