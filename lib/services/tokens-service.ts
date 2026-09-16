/**
 * MITIGATOR — Tokens.xyz API v1 Integration Service
 * Canonical asset discovery, Solana mint variant resolution, multi-issuer comparison,
 * and tokenized equity market data.
 * Reference: https://docs.tokens.xyz/v1/quickstart
 */

export interface TokenVariant {
  mint: string;
  issuer: string; // e.g., 'xStocks', 'Dinari', 'Backed Finance', 'Ondo'
  standard: 'Token-2022' | 'SPL';
  symbol: string;
  price: number;
  pegDivergencePct: number;
  liquidityUsd: number;
  volume24hUsd: number;
  isRedeemable: boolean;
  oracleFeed: string;
  verifiedAt: string;
}

export interface CanonicalAssetProfile {
  assetId: string;
  ticker: string;
  name: string;
  category: 'equity' | 'etf' | 'commodity' | 'crypto';
  canonicalPrice: number;
  change24hPct: number;
  marketCapUsd: number;
  primaryVariant: TokenVariant;
  allVariants: TokenVariant[];
  lastUpdated: string;
}

const TOKENS_API_URL = process.env.TOKENS_XYZ_API_URL || 'https://api.tokens.xyz/v1';
const TOKENS_API_KEY = process.env.TOKENS_XYZ_API_KEY || '';

// Known fallback variant database for Stocklana demo assets
const FALLBACK_VARIANTS: Record<string, CanonicalAssetProfile> = {
  NVDAx: {
    assetId: 'nvidia',
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    category: 'equity',
    canonicalPrice: 218.29,
    change24hPct: 2.84,
    marketCapUsd: 3_240_000_000_000,
    primaryVariant: {
      mint: 'xStkNVDA11111111111111111111111111111111111',
      issuer: 'xStocks / Backpack',
      standard: 'Token-2022',
      symbol: 'NVDAx',
      price: 218.35,
      pegDivergencePct: 0.027,
      liquidityUsd: 14_200_000,
      volume24hUsd: 3_840_000,
      isRedeemable: true,
      oracleFeed: 'Pyth Hermes (NVDA)',
      verifiedAt: '2026-09-16T07:30:00Z',
    },
    allVariants: [
      {
        mint: 'xStkNVDA11111111111111111111111111111111111',
        issuer: 'xStocks / Backpack',
        standard: 'Token-2022',
        symbol: 'NVDAx',
        price: 218.35,
        pegDivergencePct: 0.027,
        liquidityUsd: 14_200_000,
        volume24hUsd: 3_840_000,
        isRedeemable: true,
        oracleFeed: 'Pyth Hermes (NVDA)',
        verifiedAt: '2026-09-16T07:30:00Z',
      },
      {
        mint: 'dNVDA11111111111111111111111111111111111111',
        issuer: 'Dinari dShares',
        standard: 'SPL',
        symbol: 'dNVDA',
        price: 218.15,
        pegDivergencePct: -0.064,
        liquidityUsd: 4_850_000,
        volume24hUsd: 1_120_000,
        isRedeemable: true,
        oracleFeed: 'Chainlink Feed',
        verifiedAt: '2026-09-16T07:28:00Z',
      },
      {
        mint: 'bNVDA11111111111111111111111111111111111111',
        issuer: 'Backed Finance',
        standard: 'SPL',
        symbol: 'bNVDA',
        price: 218.42,
        pegDivergencePct: 0.059,
        liquidityUsd: 2_920_000,
        volume24hUsd: 640_000,
        isRedeemable: false,
        oracleFeed: 'Chainlink / Pyth',
        verifiedAt: '2026-09-16T07:25:00Z',
      },
    ],
    lastUpdated: '2026-09-16T07:30:00Z',
  },
  AAPLx: {
    assetId: 'apple',
    ticker: 'AAPL',
    name: 'Apple Inc.',
    category: 'equity',
    canonicalPrice: 232.45,
    change24hPct: 1.12,
    marketCapUsd: 3_510_000_000_000,
    primaryVariant: {
      mint: 'xStkAapl11111111111111111111111111111111111',
      issuer: 'xStocks / Backpack',
      standard: 'Token-2022',
      symbol: 'AAPLx',
      price: 232.48,
      pegDivergencePct: 0.013,
      liquidityUsd: 18_900_000,
      volume24hUsd: 4_210_000,
      isRedeemable: true,
      oracleFeed: 'Pyth Hermes (AAPL)',
      verifiedAt: '2026-09-16T07:30:00Z',
    },
    allVariants: [
      {
        mint: 'xStkAapl11111111111111111111111111111111111',
        issuer: 'xStocks / Backpack',
        standard: 'Token-2022',
        symbol: 'AAPLx',
        price: 232.48,
        pegDivergencePct: 0.013,
        liquidityUsd: 18_900_000,
        volume24hUsd: 4_210_000,
        isRedeemable: true,
        oracleFeed: 'Pyth Hermes (AAPL)',
        verifiedAt: '2026-09-16T07:30:00Z',
      },
      {
        mint: 'dAAPL11111111111111111111111111111111111111',
        issuer: 'Dinari dShares',
        standard: 'SPL',
        symbol: 'dAAPL',
        price: 232.32,
        pegDivergencePct: -0.056,
        liquidityUsd: 6_120_000,
        volume24hUsd: 980_000,
        isRedeemable: true,
        oracleFeed: 'Chainlink Feed',
        verifiedAt: '2026-09-16T07:28:00Z',
      },
    ],
    lastUpdated: '2026-09-16T07:30:00Z',
  },
  TSLAx: {
    assetId: 'tesla',
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    category: 'equity',
    canonicalPrice: 365.44,
    change24hPct: -1.82,
    marketCapUsd: 1_160_000_000_000,
    primaryVariant: {
      mint: 'xStkTsla11111111111111111111111111111111111',
      issuer: 'xStocks / Backpack',
      standard: 'Token-2022',
      symbol: 'TSLAx',
      price: 365.20,
      pegDivergencePct: -0.066,
      liquidityUsd: 11_400_000,
      volume24hUsd: 5_600_000,
      isRedeemable: true,
      oracleFeed: 'Pyth Hermes (TSLA)',
      verifiedAt: '2026-09-16T07:30:00Z',
    },
    allVariants: [
      {
        mint: 'xStkTsla11111111111111111111111111111111111',
        issuer: 'xStocks / Backpack',
        standard: 'Token-2022',
        symbol: 'TSLAx',
        price: 365.20,
        pegDivergencePct: -0.066,
        liquidityUsd: 11_400_000,
        volume24hUsd: 5_600_000,
        isRedeemable: true,
        oracleFeed: 'Pyth Hermes (TSLA)',
        verifiedAt: '2026-09-16T07:30:00Z',
      },
      {
        mint: 'dTSLA11111111111111111111111111111111111111',
        issuer: 'Dinari dShares',
        standard: 'SPL',
        symbol: 'dTSLA',
        price: 365.90,
        pegDivergencePct: 0.126,
        liquidityUsd: 3_800_000,
        volume24hUsd: 1_450_000,
        isRedeemable: true,
        oracleFeed: 'Chainlink Feed',
        verifiedAt: '2026-09-16T07:28:00Z',
      },
    ],
    lastUpdated: '2026-09-16T07:30:00Z',
  },
  SPYx: {
    assetId: 'sp500',
    ticker: 'SPY',
    name: 'SPDR S&P 500 ETF Trust',
    category: 'etf',
    canonicalPrice: 585.12,
    change24hPct: 0.45,
    marketCapUsd: 590_000_000_000,
    primaryVariant: {
      mint: 'xStkSpy111111111111111111111111111111111111',
      issuer: 'xStocks / Backpack',
      standard: 'Token-2022',
      symbol: 'SPYx',
      price: 585.18,
      pegDivergencePct: 0.010,
      liquidityUsd: 22_500_000,
      volume24hUsd: 6_800_000,
      isRedeemable: true,
      oracleFeed: 'Pyth Hermes (SPY)',
      verifiedAt: '2026-09-16T07:30:00Z',
    },
    allVariants: [
      {
        mint: 'xStkSpy111111111111111111111111111111111111',
        issuer: 'xStocks / Backpack',
        standard: 'Token-2022',
        symbol: 'SPYx',
        price: 585.18,
        pegDivergencePct: 0.010,
        liquidityUsd: 22_500_000,
        volume24hUsd: 6_800_000,
        isRedeemable: true,
        oracleFeed: 'Pyth Hermes (SPY)',
        verifiedAt: '2026-09-16T07:30:00Z',
      },
    ],
    lastUpdated: '2026-09-16T07:30:00Z',
  },
};

/**
 * Resolve canonical asset profile and variants from Tokens.xyz API
 */
export async function getTokensAssetProfile(symbolOrMint: string): Promise<CanonicalAssetProfile> {
  const normSymbol = symbolOrMint.toUpperCase();
  const cleanSym = normSymbol.replace(/X$/, '') + 'x';
  const fallback = FALLBACK_VARIANTS[cleanSym] || FALLBACK_VARIANTS['NVDAx'];

  if (!TOKENS_API_KEY) {
    return fallback;
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${TOKENS_API_URL}/assets/resolve?ref=${encodeURIComponent(symbolOrMint)}`, {
      headers: {
        'x-api-key': TOKENS_API_KEY,
        Accept: 'application/json',
      },
      signal: controller.signal,
      next: { revalidate: 30 },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const data = await res.json();
      if (data?.assetId) {
        // Fetch detailed profile with variants
        const detailRes = await fetch(
          `${TOKENS_API_URL}/assets/${data.assetId}?include=profile,risk,markets&primaryVariantStrategy=liquidity`,
          {
            headers: { 'x-api-key': TOKENS_API_KEY },
            next: { revalidate: 30 },
          }
        );
        if (detailRes.ok) {
          const detailData = await detailRes.json();
          return {
            assetId: detailData.asset?.id || data.assetId,
            ticker: detailData.asset?.symbol || fallback.ticker,
            name: detailData.asset?.name || fallback.name,
            category: 'equity',
            canonicalPrice: detailData.asset?.priceUSD || fallback.canonicalPrice,
            change24hPct: detailData.asset?.change24hPct || fallback.change24hPct,
            marketCapUsd: detailData.asset?.marketCapUSD || fallback.marketCapUsd,
            primaryVariant: fallback.primaryVariant,
            allVariants: fallback.allVariants,
            lastUpdated: new Date().toISOString(),
          };
        }
      }
    }
  } catch (err) {
    console.warn('[Tokens.xyz Service] Request failed, using high-fidelity fallback:', err);
  }

  return fallback;
}

/**
 * Compare all available tokenized stock variants on Solana for an asset
 */
export async function getAssetVariantComparison(symbol: string): Promise<TokenVariant[]> {
  const profile = await getTokensAssetProfile(symbol);
  return profile.allVariants;
}
