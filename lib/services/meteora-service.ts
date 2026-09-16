/**
 * MITIGATOR — Meteora DLMM (Dynamic Liquidity Market Maker) Service
 * Access dynamic fee pools, concentrated liquidity bins, volatility accumulator,
 * and peg stability metrics on Solana.
 * Reference: https://docs.meteora.ag/get-started
 */

export interface MeteoraDlmmPair {
  address: string;
  name: string;
  mintX: string;
  mintY: string;
  reserveXUsd: number;
  reserveYUsd: number;
  totalLiquidityUsd: number;
  baseFeePct: number;
  maxFeePct: number;
  currentDynamicFeePct: number;
  binStep: number;
  volatilityAccumulator: number;
  volume24hUsd: number;
  apr24hPct: number;
  isStablePeg: boolean;
}

export interface MeteoraDlmmQuote {
  venue: 'Meteora DLMM';
  pairAddress: string;
  inAmountUsd: number;
  outAmountTokens: number;
  outAmountFormatted: string;
  expectedPrice: number;
  priceImpactPct: number;
  dynamicFeePct: number;
  binWalkDistance: number;
  slippageBps: number;
}

const METEORA_API_URL = process.env.METEORA_API_URL || 'https://dlmm-api.meteora.ag';

// Known DLMM pairs / simulated tokenized equity pools
const FALLBACK_DLMM_PAIRS: Record<string, MeteoraDlmmPair> = {
  NVDAx: {
    address: 'MetNVDA111111111111111111111111111111111111',
    name: 'NVDAx-USDC DLMM',
    mintX: 'xStkNVDA11111111111111111111111111111111111',
    mintY: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    reserveXUsd: 4_200_000,
    reserveYUsd: 4_180_000,
    totalLiquidityUsd: 8_380_000,
    baseFeePct: 0.05,
    maxFeePct: 0.80,
    currentDynamicFeePct: 0.11,
    binStep: 10,
    volatilityAccumulator: 142,
    volume24hUsd: 2_940_000,
    apr24hPct: 18.4,
    isStablePeg: true,
  },
  AAPLx: {
    address: 'MetAAPL111111111111111111111111111111111111',
    name: 'AAPLx-USDC DLMM',
    mintX: 'xStkAapl11111111111111111111111111111111111',
    mintY: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    reserveXUsd: 5_100_000,
    reserveYUsd: 5_050_000,
    totalLiquidityUsd: 10_150_000,
    baseFeePct: 0.05,
    maxFeePct: 0.60,
    currentDynamicFeePct: 0.08,
    binStep: 10,
    volatilityAccumulator: 98,
    volume24hUsd: 3_120_000,
    apr24hPct: 14.2,
    isStablePeg: true,
  },
  TSLAx: {
    address: 'MetTSLA111111111111111111111111111111111111',
    name: 'TSLAx-USDC DLMM',
    mintX: 'xStkTsla11111111111111111111111111111111111',
    mintY: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    reserveXUsd: 3_400_000,
    reserveYUsd: 3_350_000,
    totalLiquidityUsd: 6_750_000,
    baseFeePct: 0.08,
    maxFeePct: 1.20,
    currentDynamicFeePct: 0.18,
    binStep: 20,
    volatilityAccumulator: 235,
    volume24hUsd: 4_100_000,
    apr24hPct: 24.8,
    isStablePeg: true,
  },
};

/**
 * Fetch Meteora DLMM pool information
 */
export async function getMeteoraDlmmPair(symbol: string): Promise<MeteoraDlmmPair> {
  const normSymbol = symbol.toUpperCase();
  const cleanSym = normSymbol.replace(/X$/, '') + 'x';
  const fallback = FALLBACK_DLMM_PAIRS[cleanSym] || FALLBACK_DLMM_PAIRS['NVDAx'];

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${METEORA_API_URL}/pair/all?limit=20`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        // Return matching pair if exists on-chain, or fallback
        const match = data.find((p: any) =>
          p.name?.toLowerCase().includes(cleanSym.toLowerCase())
        );
        if (match) {
          return {
            address: match.address,
            name: match.name,
            mintX: match.mint_x,
            mintY: match.mint_y,
            reserveXUsd: Number(match.reserve_x_amount || 0),
            reserveYUsd: Number(match.reserve_y_amount || 0),
            totalLiquidityUsd: Number(match.liquidity || fallback.totalLiquidityUsd),
            baseFeePct: Number(match.base_fee_percentage || 0.05),
            maxFeePct: Number(match.max_fee_percentage || 0.80),
            currentDynamicFeePct: Number(match.current_fee_percentage || fallback.currentDynamicFeePct),
            binStep: Number(match.bin_step || 10),
            volatilityAccumulator: Number(match.volatility_accumulator || fallback.volatilityAccumulator),
            volume24hUsd: Number(match.trade_volume_24h || fallback.volume24hUsd),
            apr24hPct: Number(match.apr || fallback.apr24hPct),
            isStablePeg: true,
          };
        }
      }
    }
  } catch (err) {
    // Fallback on timeout or network error
  }

  return fallback;
}

/**
 * Compute concentrated liquidity DLMM quote for tokenized stock
 */
export async function getMeteoraDlmmQuote(
  symbol: string,
  amountUsdc: number,
  slippageBps: number = 50,
  referencePrice: number = 218.29
): Promise<MeteoraDlmmQuote> {
  const pair = await getMeteoraDlmmPair(symbol);

  // Concentrated liquidity bin impact: smaller orders have nearly 0 impact; large orders walk bins
  const binWalk = Math.max(1, Math.floor(amountUsdc / 2_500));
  const priceImpact = Math.min(0.45, (binWalk * 0.009));
  const execPrice = referencePrice * (1 + priceImpact / 100);
  const outTokens = amountUsdc / execPrice;

  return {
    venue: 'Meteora DLMM',
    pairAddress: pair.address,
    inAmountUsd: amountUsdc,
    outAmountTokens: outTokens,
    outAmountFormatted: outTokens.toFixed(4),
    expectedPrice: Number(execPrice.toFixed(2)),
    priceImpactPct: Number(priceImpact.toFixed(3)),
    dynamicFeePct: pair.currentDynamicFeePct,
    binWalkDistance: binWalk,
    slippageBps,
  };
}
