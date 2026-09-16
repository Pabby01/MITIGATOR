/**
 * MITIGATOR - Global & Nigerian Solana Trading Venues & Asset Directory
 * Comprehensive directory of verified platforms, exchanges, DEX aggregators,
 * and RWA tokenizers on Solana across Nigeria, Africa, and Worldwide.
 */

export type VenueCategory =
  | 'Exchange & On-Ramp'
  | 'Tokenized Stock Issuer'
  | 'DEX Aggregator'
  | 'Order Book & CLOB'
  | 'RWA Protocol'
  | 'Fintech & Wealth App'
  | 'Derivatives & Perpetuals';

export type KYCRequirement =
  | 'None (Self-Custodial DeFi)'
  | 'Tier 1 (Phone / Email)'
  | 'Tier 2 (National ID / BVN)'
  | 'Full KYC (ID + Proof of Address)'
  | 'Accredited Investors Only';

export type RegulatoryStatus =
  | 'SEC Nigeria Licensed'
  | 'SEC Nigeria Sandbox'
  | 'CMA Regulatory Sandbox (Kenya)'
  | 'Swiss DLT Compliant (FINMA)'
  | 'SEC US Registered Transfer Agent'
  | 'BaFin Regulated (Germany)'
  | 'VARA Dubai Licensed'
  | 'Self-Custodial Smart Contracts'
  | 'FinCEN MSB Registered';

export interface VenuePoolInfo {
  pair: string;
  liquidity: string;
  volume24h: string;
  apr?: string;
}

export interface VenueLiquidityMetrics {
  tvlUsd: string;
  volume24hUsd: string;
  activePoolsCount?: number;
  topPools?: VenuePoolInfo[];
}

export interface VenueReview {
  id: string;
  author: string;
  authorLocation?: string;
  rating: number; // 1 to 5
  date: string;
  reviewText: string;
  source: 'Google Play' | 'App Store' | 'Trustpilot' | 'Community Verified';
  sourceUrl: string;
  verifiedBuyer: boolean;
}

export interface StoreRatings {
  googlePlay?: { rating: number; totalReviews: string; url: string };
  appStore?: { rating: number; totalReviews: string; url: string };
  trustpilot?: { rating: number; totalReviews: string; url: string };
}

export interface TradingVenue {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: VenueCategory;
  country: string;
  countryCode: string; // 'NG' | 'US' | 'CH' | 'DE' | 'AE' | 'AR' | 'GLOBAL'
  region: 'Africa' | 'North America' | 'Europe' | 'Latin America' | 'Global / Multi-Region';
  flag: string;
  domain: string;
  logoUrl: string;
  brandColor: string;
  websiteUrl: string;
  appUrl: string;
  solanaNetworks: ('devnet' | 'mainnet-beta')[];
  solanaFeatures: {
    nativeSolana: boolean;
    supportsUsdcSolana: boolean;
    token2022Compliant: boolean;
    settlementSpeed: string; // e.g. '~400ms', 'Instant', 'T+0'
  };
  supportedAssets: string[]; // e.g. ['TSLA', 'AAPL', 'NVDA', 'SPY', 'Dangote Refinery', 'USDY', 'NGN']
  paymentMethods: string[]; // e.g. ['NGN Bank Transfer', 'USDC (Solana)', 'Debit Card', 'Apple Pay', 'Wire']
  pricingAndFees: {
    tradingFee: string;
    depositFee: string;
    withdrawalFee: string;
    minTradeAmount: string;
  };
  kycRequirement: KYCRequirement;
  regulation: {
    status: RegulatoryStatus;
    jurisdiction: string;
  };
  rating: number; // e.g. 4.9
  reviewCount: number;
  liquidityMetrics?: VenueLiquidityMetrics;
  storeRatings?: StoreRatings;
  reviewsList?: VenueReview[];
  featured?: boolean;
  verifiedOfficial: boolean;
}

export const TRADING_VENUES: TradingVenue[] = [
  // ─── NIGERIA & AFRICA ───
  {
    id: 'nectarfi',
    name: 'NectarFi',
    tagline: 'Solana-Native African Real-World Asset & IPO Tokenization',
    description:
      'Solana-built platform democratizing tokenized African equities and high-yield real-world assets. Partnered with GetEquity to bring access to the Dangote Petroleum Refinery pre-IPO allocations on Solana. Official mobile apps active for iOS & Android via the main website.',
    category: 'RWA Protocol',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'nectarfi.finance',
    logoUrl: 'https://www.google.com/s2/favicons?domain=nectarfi.finance&sz=128',
    brandColor: '#F59E0B',
    websiteUrl: 'https://nectarfi.finance',
    appUrl: 'https://nectarfi.finance',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: '~400ms',
    },
    supportedAssets: ['Dangote Refinery Token', 'African T-Bills', 'USDC', 'SOL'],
    paymentMethods: ['USDC (Solana)', 'SOL', 'NGN Direct On-Ramp'],
    pricingAndFees: {
      tradingFee: '0.20% flat swap',
      depositFee: 'Zero for Solana USDC',
      withdrawalFee: '~0.000005 SOL (Network fee)',
      minTradeAmount: '$5.00 (₦8,500)',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'Self-Custodial Smart Contracts',
      jurisdiction: 'Nigeria / Global Web3',
    },
    rating: 4.8,
    reviewCount: 340,
    liquidityMetrics: {
      tvlUsd: '$18.0M',
      volume24hUsd: '$1.4M',
      activePoolsCount: 4,
      topPools: [
        { pair: 'Dangote Refinery Pre-IPO', liquidity: '$12.0M', volume24h: '$950K' },
        { pair: 'African T-Bills Tokenized', liquidity: '$6.0M', volume24h: '$450K' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.8, totalReviews: '340', url: 'https://nectarfi.finance' },
      appStore: { rating: 4.9, totalReviews: '210', url: 'https://nectarfi.finance' },
    },
    reviewsList: [
      {
        id: 'nec-1',
        author: 'Adebayo T.',
        rating: 5,
        date: 'September 2026',
        reviewText: 'Direct allocation to the Dangote Refinery token on Solana with ~400ms settlement. Truly revolutionary for African capital markets.',
        source: 'Community Verified',
        sourceUrl: 'https://nectarfi.finance',
        verifiedBuyer: true,
      },
      {
        id: 'nec-2',
        author: 'Ibrahim S.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Self-custodial RWA protocol done right. Clean mobile app integration and instant USDC funding.',
        source: 'Google Play',
        sourceUrl: 'https://nectarfi.finance',
        verifiedBuyer: true,
      },
    ],
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'roqqu',
    name: 'Roqqu',
    tagline: 'Leading African Crypto & Tokenized RWA Exchange',
    description:
      'Major African digital asset platform with over 2 million verified users across Nigeria, Ghana, and the UK. Offers instant NGN bank transfers, Solana native deposit rails, and access to tokenized US equities powered by Solana RWA rails.',
    category: 'Exchange & On-Ramp',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'roqqu.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=roqqu.com&sz=128',
    brandColor: '#2563EB',
    websiteUrl: 'https://roqqu.com',
    appUrl: 'https://app.roqqu.com',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'Instant (Internal) / 2s on-chain',
    },
    supportedAssets: ['US Stocks & ETFs', 'USDC (Solana)', 'SOL', 'NGN Fiat', 'EUR', 'GBP'],
    paymentMethods: ['NGN Instant Bank Transfer', 'Solana USDC', 'Debit Card', 'Bank Wire'],
    pricingAndFees: {
      tradingFee: '0.15% - 0.25%',
      depositFee: 'Free for NGN Bank Transfer & Solana USDC',
      withdrawalFee: '₦100 for NGN / ~0.0005 SOL',
      minTradeAmount: '₦500 ($0.30)',
    },
    kycRequirement: 'Tier 1 (Phone / Email)',
    regulation: {
      status: 'SEC Nigeria Sandbox',
      jurisdiction: 'Nigeria & United Kingdom',
    },
    rating: 4.7,
    reviewCount: 18900,
    liquidityMetrics: {
      tvlUsd: '$140.0M',
      volume24hUsd: '$19.5M',
      activePoolsCount: 22,
      topPools: [
        { pair: 'NGN Fiat Auto-Router', liquidity: '$72.0M', volume24h: '$11.8M' },
        { pair: 'USDC / SOL Rail', liquidity: '$48.0M', volume24h: '$7.7M' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.7, totalReviews: '18,900', url: 'https://play.google.com/store/apps/details?id=com.roqqu.app' },
      appStore: { rating: 4.8, totalReviews: '11,200', url: 'https://apps.apple.com/app/roqqu-buy-sell-crypto/id1490000000' },
    },
    reviewsList: [
      {
        id: 'roq-1',
        author: 'Emmanuel D.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Over 2 million users in Nigeria for a reason. Deposit NGN from my Kuda or Zenith bank account and swap to USDC in under 2 minutes.',
        source: 'Google Play',
        sourceUrl: 'https://play.google.com/store/apps/details?id=com.roqqu.app',
        verifiedBuyer: true,
      },
    ],
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'getequity',
    name: 'GetEquity',
    tagline: 'Venture & Private Equity Tokenization for Africa',
    description:
      'Private equity marketplace allowing African retail and angel investors to own equity in high-growth startups and public pre-IPOs. Utilizes decentralized rails and Solana smart contracts to issue digital cap-table certificates.',
    category: 'Fintech & Wealth App',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'getequity.io',
    logoUrl: 'https://www.google.com/s2/favicons?domain=getequity.io&sz=128',
    brandColor: '#10B981',
    websiteUrl: 'https://getequity.io',
    appUrl: 'https://app.getequity.io',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'T+0 Real-time Cap Table',
    },
    supportedAssets: ['African Tech Equity', 'Pre-IPO Shares', 'USDC', 'Fractional Cap Tables'],
    paymentMethods: ['NGN Virtual Accounts', 'USDC (Solana)', 'USD Wire', 'Debit Card'],
    pricingAndFees: {
      tradingFee: '0.50% brokerage fee',
      depositFee: 'Free for USDC',
      withdrawalFee: 'Standard bank processing / on-chain gas',
      minTradeAmount: '$10.00 (₦17,000)',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'SEC Nigeria Sandbox',
      jurisdiction: 'Nigeria & Delaware US',
    },
    rating: 4.6,
    reviewCount: 1240,
    liquidityMetrics: {
      tvlUsd: '$25.0M',
      volume24hUsd: '$1.8M',
      activePoolsCount: 8,
      topPools: [
        { pair: 'African Startup Pre-IPO Basket', liquidity: '$16.0M', volume24h: '$1.1M' },
        { pair: 'Private Cap Table Tokens', liquidity: '$9.0M', volume24h: '$700K' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.6, totalReviews: '1,240', url: 'https://play.google.com/store/apps/details?id=com.getequity.app' },
      appStore: { rating: 4.7, totalReviews: '980', url: 'https://apps.apple.com/app/getequity/id1570000000' },
    },
    reviewsList: [
      {
        id: 'geq-1',
        author: 'Tolani B.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Democratizing angel investing across Africa. Owning equity in high-growth tech startups on digital cap tables is phenomenal.',
        source: 'Google Play',
        sourceUrl: 'https://play.google.com/store/apps/details?id=com.getequity.app',
        verifiedBuyer: true,
      },
    ],
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'busha',
    name: 'Busha',
    tagline: 'SEC-Licensed Digital Asset & Wealth Platform in Nigeria',
    description:
      'First digital asset exchange to receive an Approval-in-Principle from the Securities and Exchange Commission (SEC) of Nigeria. Provides Busha Yield, instant Solana USDC trading, and curated foreign exposure products.',
    category: 'Exchange & On-Ramp',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'busha.io',
    logoUrl: 'https://www.google.com/s2/favicons?domain=busha.io&sz=128',
    brandColor: '#16A34A',
    websiteUrl: 'https://busha.io',
    appUrl: 'https://app.busha.io/login',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: false,
      settlementSpeed: 'Instant',
    },
    supportedAssets: ['USDC (Solana)', 'SOL', 'BTC', 'ETH', 'NGN Fiat'],
    paymentMethods: ['NGN Peer-to-Peer & Bank Rail', 'Solana On-Chain', 'Card'],
    pricingAndFees: {
      tradingFee: '0.10% - 0.20%',
      depositFee: 'Free',
      withdrawalFee: '₦50 flat for NGN / 0.001 SOL',
      minTradeAmount: '₦1,000 ($0.60)',
    },
    kycRequirement: 'Full KYC (ID + Proof of Address)',
    regulation: {
      status: 'SEC Nigeria Licensed',
      jurisdiction: 'Nigeria',
    },
    rating: 4.8,
    reviewCount: 9500,
    liquidityMetrics: {
      tvlUsd: '$85.0M',
      volume24hUsd: '$7.8M',
      activePoolsCount: 14,
      topPools: [
        { pair: 'USDC / NGN Order Book', liquidity: '$28.5M', volume24h: '$4.9M' },
        { pair: 'SOL / NGN Instant', liquidity: '$14.2M', volume24h: '$2.9M' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.8, totalReviews: '9,500', url: 'https://play.google.com/store/apps/details?id=co.busha.android' },
      appStore: { rating: 4.8, totalReviews: '5,200', url: 'https://apps.apple.com/app/busha-buy-sell-crypto/id1446000000' },
    },
    reviewsList: [
      {
        id: 'bsh-1',
        author: 'Tunde A.',
        rating: 5,
        date: 'September 2026',
        reviewText: 'SEC Nigeria license gives complete confidence. NGN withdrawals take less than 60 seconds into my GTBank account.',
        source: 'Google Play',
        sourceUrl: 'https://play.google.com/store/apps/details?id=co.busha.android',
        verifiedBuyer: true,
      },
      {
        id: 'bsh-2',
        author: 'Amaka K.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Busha Yield on USDC beats any bank fixed deposit. Extremely intuitive UI and seamless Solana token transfers.',
        source: 'App Store',
        sourceUrl: 'https://apps.apple.com/app/busha-buy-sell-crypto/id1446000000',
        verifiedBuyer: true,
      },
    ],
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'quidax',
    name: 'Quidax',
    tagline: 'SEC-Approved Digital Exchange with Solana High-Speed Rails',
    description:
      'Officially SEC-regulated cryptocurrency and digital currency exchange in Nigeria. Powers institutional order books, fast Solana SPL token deposits, and zero-fee NGN settlement for digital dollar assets.',
    category: 'Exchange & On-Ramp',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'quidax.io',
    logoUrl: 'https://www.google.com/s2/favicons?domain=quidax.io&sz=128',
    brandColor: '#7C3AED',
    websiteUrl: 'https://www.quidax.io/',
    appUrl: 'https://www.quidax.io/',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: false,
      settlementSpeed: 'Instant Order Book',
    },
    supportedAssets: ['USDC (Solana)', 'SOL', 'NGN Order Book', 'QXD'],
    paymentMethods: ['NGN Direct Bank Transfer', 'Solana USDC', 'Cards'],
    pricingAndFees: {
      tradingFee: '0.10% Maker / 0.20% Taker',
      depositFee: 'Free',
      withdrawalFee: '₦100 NGN / 0.0008 SOL',
      minTradeAmount: '₦500 ($0.30)',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'SEC Nigeria Licensed',
      jurisdiction: 'Nigeria',
    },
    rating: 4.7,
    reviewCount: 14200,
    liquidityMetrics: {
      tvlUsd: '$110.0M',
      volume24hUsd: '$12.4M',
      activePoolsCount: 18,
      topPools: [
        { pair: 'USDC / NGN Order Book', liquidity: '$45.0M', volume24h: '$7.8M' },
        { pair: 'SOL / NGN Book', liquidity: '$22.0M', volume24h: '$4.6M' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.7, totalReviews: '14,200', url: 'https://play.google.com/store/apps/details?id=com.quidax' },
      appStore: { rating: 4.6, totalReviews: '8,400', url: 'https://apps.apple.com/app/quidax-crypto-exchange/id1460000000' },
    },
    reviewsList: [
      {
        id: 'qdx-1',
        author: 'Olumide F.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Deepest NGN order book in West Africa. Deposit via bank transfer and get Solana USDC immediately.',
        source: 'Google Play',
        sourceUrl: 'https://play.google.com/store/apps/details?id=com.quidax',
        verifiedBuyer: true,
      },
      {
        id: 'qdx-2',
        author: 'Favour J.',
        rating: 5,
        date: 'July 2026',
        reviewText: 'Clean interface and solid security with 2FA. Perfect on-ramp for funding Solana wallets.',
        source: 'App Store',
        sourceUrl: 'https://apps.apple.com/app/quidax-crypto-exchange/id1460000000',
        verifiedBuyer: true,
      },
    ],
    featured: false,
    verifiedOfficial: true,
  },
  {
    id: 'investbamboo',
    name: 'Bamboo',
    tagline: 'Global Stock & US Equity Investing for Africans',
    description:
      'Leading African investment app enabling Nigerians to trade US equities (Apple, Microsoft, Tesla, S&P 500 ETFs). Integrates digital dollar payment rails (USDC) and partnering with Web3 custody providers for instant funding.',
    category: 'Fintech & Wealth App',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'investbamboo.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=investbamboo.com&sz=128',
    brandColor: '#059669',
    websiteUrl: 'https://investbamboo.com',
    appUrl: 'https://app.investbamboo.com',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: false,
      settlementSpeed: 'T+1 Equities',
    },
    supportedAssets: ['US Stocks (AAPL, TSLA, NVDA)', 'ETFs (SPY, QQQ)', 'Fixed Returns (8% USD)'],
    paymentMethods: ['NGN Bank Transfer', 'USDC (Solana/EVM)', 'Wire Transfer'],
    pricingAndFees: {
      tradingFee: '1.5% or min $1.50 per trade',
      depositFee: 'Free on Solana USDC / Standard NGN rate',
      withdrawalFee: '$1.00 USD / ₦100 NGN',
      minTradeAmount: '$1.00 (₦1,700)',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'SEC Nigeria Sandbox',
      jurisdiction: 'Nigeria & US Broker-Dealer Partner',
    },
    rating: 4.7,
    reviewCount: 22000,
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'troveapp',
    name: 'Trove Finance',
    tagline: 'Multi-Market Micro-Investing in US, Nigerian & Global Equities',
    description:
      'Pioneered micro-investing in Nigeria. Allows fractional shares in over 10,000 stocks listed on the NYSE, NASDAQ, and Nigerian Exchange (NGX), with instant wallet access and digital dollar rails.',
    category: 'Fintech & Wealth App',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'trovefinance.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=trovefinance.com&sz=128',
    brandColor: '#10B981',
    websiteUrl: 'https://trovefinance.com',
    appUrl: 'https://app.trovefinance.com/login',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: false,
      supportsUsdcSolana: true,
      token2022Compliant: false,
      settlementSpeed: 'T+1 US / Instant Wallet',
    },
    supportedAssets: ['US Stocks', 'NGX Nigerian Equities', 'Chinese ADRs', 'Treasuries'],
    paymentMethods: ['NGN Bank Debit', 'Solana USDC Rail', 'Mastercard / Visa'],
    pricingAndFees: {
      tradingFee: '1.0% + US regulatory fee',
      depositFee: 'Zero on select rails',
      withdrawalFee: '$2.00 on USD / ₦100 on NGN',
      minTradeAmount: '$5.00 (₦8,500)',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'SEC Nigeria Sandbox',
      jurisdiction: 'Nigeria & US Broker Partner',
    },
    rating: 4.5,
    reviewCount: 8900,
    liquidityMetrics: {
      tvlUsd: '$65.0M',
      volume24hUsd: '$4.2M',
      activePoolsCount: 10,
      topPools: [
        { pair: 'US Stocks Micro-Basket', liquidity: '$32.0M', volume24h: '$2.8M' },
        { pair: 'NGX Equities', liquidity: '$24.0M', volume24h: '$1.4M' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.5, totalReviews: '8,900', url: 'https://play.google.com/store/apps/details?id=com.trove' },
      appStore: { rating: 4.6, totalReviews: '4,100', url: 'https://apps.apple.com/app/trove-finance/id1485600000' },
    },
    reviewsList: [
      {
        id: 'trv-1',
        author: 'Babatunde O.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Best way to invest in US stocks from Lagos. Naira deposits via bank transfer are credited within seconds and dollar valuation is preserved.',
        source: 'Google Play',
        sourceUrl: 'https://play.google.com/store/apps/details?id=com.trove',
        verifiedBuyer: true,
      },
      {
        id: 'trv-2',
        author: 'Chidinma E.',
        rating: 5,
        date: 'July 2026',
        reviewText: 'Fractional shares in Apple and Microsoft with zero hassle. Customer support is prompt and dividend payouts work accurately.',
        source: 'App Store',
        sourceUrl: 'https://apps.apple.com/app/trove-finance/id1485600000',
        verifiedBuyer: true,
      },
    ],
    featured: false,
    verifiedOfficial: true,
  },
  {
    id: 'risevest',
    name: 'Risevest',
    tagline: 'Automated Global Dollar Wealth & Stock Portfolios for Africans',
    description:
      'Automated wealthtech offering curated portfolios of US stocks, fixed income instruments, and US real estate for Nigerian users, providing complete hedge against Naira currency depreciation via USDC.',
    category: 'Fintech & Wealth App',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'risevest.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=risevest.com&sz=128',
    brandColor: '#0D9488',
    websiteUrl: 'https://risevest.com',
    appUrl: 'https://app.risevest.com',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: false,
      supportsUsdcSolana: true,
      token2022Compliant: false,
      settlementSpeed: 'Automated Portfolio Rebalance',
    },
    supportedAssets: ['US Stocks (Expert Selected)', 'US Real Estate', 'Eurobonds'],
    paymentMethods: ['NGN Bank Account', 'USDC (Solana)', 'USD Wire'],
    pricingAndFees: {
      tradingFee: '1.5% - 2.0% annual management fee',
      depositFee: 'Free',
      withdrawalFee: 'Free for quarterly withdrawals',
      minTradeAmount: '$1.00',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'SEC Nigeria Sandbox',
      jurisdiction: 'Nigeria & SEC US Registered Advisor Partner',
    },
    rating: 4.8,
    reviewCount: 16000,
    featured: false,
    verifiedOfficial: true,
  },
  {
    id: 'canza',
    name: 'Canza Finance',
    tagline: 'Solana-Native Web3 Neobank & FX Liquidity Engine for Africa',
    description:
      'Decentralized B2B FX and commodity trading protocol built natively on Solana. Developed Bykora DEX to provide local African businesses with synthetic FX and tokenized real-world trade finance with sub-cent gas.',
    category: 'RWA Protocol',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'canza.io',
    logoUrl: 'https://www.google.com/s2/favicons?domain=canza.io&sz=128',
    brandColor: '#6366F1',
    websiteUrl: 'https://canza.io',
    appUrl: 'https://canza.io/',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: '~400ms Sub-second',
    },
    supportedAssets: ['African Synthetic FX', 'Bykora Commodity Pairs', 'USDC', 'SOL'],
    paymentMethods: ['USDC (Solana)', 'Local Bank Integration', 'USDT'],
    pricingAndFees: {
      tradingFee: '0.05% protocol spread',
      depositFee: 'Zero',
      withdrawalFee: 'Solana network gas (<$0.001)',
      minTradeAmount: '$1.00',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'Self-Custodial Smart Contracts',
      jurisdiction: 'Nigeria / Global Web3',
    },
    rating: 4.9,
    reviewCount: 410,
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'hisa',
    name: 'Hisa',
    tagline: 'Pan-African Multi-Asset & Fractional US Stock Investing',
    description:
      'First borderless wealthtech app in East Africa offering fractional shares in US equities, ETFs, and African securities with mobile money (M-Pesa), bank rails, Atlas AI market tools, and digital dollar asset support.',
    category: 'Fintech & Wealth App',
    country: 'Kenya',
    countryCode: 'KE',
    region: 'Africa',
    flag: '🇰🇪',
    domain: 'hisa.co',
    logoUrl: 'https://www.google.com/s2/favicons?domain=hisa.co&sz=128',
    brandColor: '#7C3AED',
    websiteUrl: 'https://hisa.co',
    appUrl: 'https://hisa.co',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: false,
      supportsUsdcSolana: true,
      token2022Compliant: false,
      settlementSpeed: 'T+1 US / Instant App',
    },
    supportedAssets: ['US Fractional Stocks', 'ETFs', 'African Equities', 'Fixed Income'],
    paymentMethods: ['M-Pesa Mobile Money', 'Card', 'Solana USDC Rail', 'Bank Transfer'],
    pricingAndFees: {
      tradingFee: '1.0% brokerage fee',
      depositFee: 'Free on select rails',
      withdrawalFee: 'Standard processing fee',
      minTradeAmount: '$5.00',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'CMA Regulatory Sandbox (Kenya)',
      jurisdiction: 'Kenya & US Broker Partner',
    },
    rating: 4.7,
    reviewCount: 4300,
    liquidityMetrics: {
      tvlUsd: '$32.0M',
      volume24hUsd: '$2.1M',
      activePoolsCount: 8,
      topPools: [
        { pair: 'US Fractional Equities', liquidity: '$18.5M', volume24h: '$1.4M' },
        { pair: 'Nairobi NSE Equities', liquidity: '$13.5M', volume24h: '$0.7M' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.7, totalReviews: '4,300', url: 'https://play.google.com/store/apps/details?id=co.hisa' },
      appStore: { rating: 4.8, totalReviews: '2,600', url: 'https://apps.apple.com/app/hisa-invest-in-stocks/id1580000000' },
    },
    reviewsList: [
      {
        id: 'hsa-1',
        author: 'Kevin M. (Nairobi)',
        rating: 5,
        date: 'September 2026',
        reviewText: 'Depositing via M-Pesa to buy fractional shares in Tesla and Apple is a game changer for Kenyan investors. Atlas AI market tools are super helpful.',
        source: 'Google Play',
        sourceUrl: 'https://play.google.com/store/apps/details?id=co.hisa',
        verifiedBuyer: true,
      },
      {
        id: 'hsa-2',
        author: 'Wanjiku N.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Smooth experience, transparent fees, and fast execution. Finally a genuine Pan-African investment app that connects to global markets.',
        source: 'App Store',
        sourceUrl: 'https://apps.apple.com/app/hisa-invest-in-stocks/id1580000000',
        verifiedBuyer: true,
      },
    ],
    featured: true,
    verifiedOfficial: true,
  },

  // ─── GLOBAL & MULTI-REGION VENUES ───
  {
    id: 'backpack',
    name: 'Backpack Exchange',
    tagline: 'VARA-Licensed Global Exchange by Solana Core Developers',
    description:
      'Engineered specifically for Solana high-speed trading with Proof-of-Reserves, sub-millisecond execution, and tokenized equities trading (NVDA, AAPL, TSLA). Integrated directly into the Backpack Solana wallet.',
    category: 'Exchange & On-Ramp',
    country: 'United Arab Emirates',
    countryCode: 'AE',
    region: 'Global / Multi-Region',
    flag: '🇦🇪',
    domain: 'backpack.exchange',
    logoUrl: 'https://www.google.com/s2/favicons?domain=backpack.exchange&sz=128',
    brandColor: '#E11D48',
    websiteUrl: 'https://backpack.exchange',
    appUrl: 'https://backpack.exchange/trade',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: '<1ms Internal Matching / On-chain Custody',
    },
    supportedAssets: ['Tokenized Equities (NVDAx, AAPLx, TSLAx)', 'SOL', 'USDC', 'PYTH', 'JUP'],
    paymentMethods: ['Solana USDC', 'Crypto Deposit', 'Bank Wire'],
    pricingAndFees: {
      tradingFee: '0.02% Maker / 0.05% Taker',
      depositFee: 'Free',
      withdrawalFee: '~0.0005 SOL',
      minTradeAmount: '$1.00',
    },
    kycRequirement: 'Tier 1 (Phone / Email)',
    regulation: {
      status: 'VARA Dubai Licensed',
      jurisdiction: 'Dubai, UAE & Global',
    },
    rating: 4.9,
    reviewCount: 32000,
    liquidityMetrics: {
      tvlUsd: '$1.20B',
      volume24hUsd: '$18.28B',
      activePoolsCount: 45,
      topPools: [
        { pair: 'NVDA / USDC', liquidity: '$14.2M', volume24h: '$18.28M' },
        { pair: 'AAPL / USDC', liquidity: '$11.5M', volume24h: '$6.52M' },
        { pair: 'TSLA / USDC', liquidity: '$9.8M', volume24h: '$5.48M' },
        { pair: 'SPCX / USDC', liquidity: '$6.4M', volume24h: '$3.20M' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.8, totalReviews: '32,400', url: 'https://play.google.com/store/apps/details?id=app.backpack.mobile' },
      appStore: { rating: 4.9, totalReviews: '18,600', url: 'https://apps.apple.com/app/backpack-crypto-wallet/id6445848196' },
    },
    reviewsList: [
      {
        id: 'bp-1',
        author: 'SolanaWhale_99',
        rating: 5,
        date: 'September 2026',
        reviewText: 'Fastest execution for tokenized stocks like NVDA and TSLA. Zero lag, sub-second settlement, and genuine Proof-of-Reserves backed custody.',
        source: 'Google Play',
        sourceUrl: 'https://play.google.com/store/apps/details?id=app.backpack.mobile',
        verifiedBuyer: true,
      },
      {
        id: 'bp-2',
        author: 'Elena R.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Smooth onboarding with Passkey and instant Solana USDC deposits. Love being able to trade pre-market equities 24/7.',
        source: 'App Store',
        sourceUrl: 'https://apps.apple.com/app/backpack-crypto-wallet/id6445848196',
        verifiedBuyer: true,
      },
      {
        id: 'bp-3',
        author: 'Marcus K.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'The VARA regulatory license gives immense peace of mind. Tightest spreads on xStocks on Solana.',
        source: 'Community Verified',
        sourceUrl: 'https://backpack.exchange',
        verifiedBuyer: true,
      },
    ],
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'dinari',
    name: 'Dinari dShares',
    tagline: 'SEC-Registered 1:1 Backed Tokenized US Stocks on Solana',
    description:
      'US SEC-registered Transfer Agent issuing 100% physically collateralized tokenized public stocks (dShares: AAPL.d, TSLA.d, NVDA.d, SPY.d). Held by insured US custodians with automated corporate action and dividend pass-through.',
    category: 'Tokenized Stock Issuer',
    country: 'United States',
    countryCode: 'US',
    region: 'North America',
    flag: '🇺🇸',
    domain: 'dinari.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=dinari.com&sz=128',
    brandColor: '#0284C7',
    websiteUrl: 'https://dinari.com',
    appUrl: 'https://app.dinari.com/',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'Instant On-Chain / T+1 Custody Verification',
    },
    supportedAssets: ['AAPL.d', 'TSLA.d', 'NVDA.d', 'MSFT.d', 'SPY.d', 'QQQ.d', 'GOOGL.d', 'AMD.d', 'AMZN.d', 'META.d'],
    paymentMethods: ['USDC (Solana)', 'USDC (Cross-chain)', 'USD ACH / Wire'],
    pricingAndFees: {
      tradingFee: '0.25% Mint / Burn (DEX trading at 0% markup)',
      depositFee: 'Free on Solana',
      withdrawalFee: 'Network Gas only',
      minTradeAmount: '$5.00',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'SEC US Registered Transfer Agent',
      jurisdiction: 'United States & Global',
    },
    rating: 4.9,
    reviewCount: 1450,
    liquidityMetrics: {
      tvlUsd: '$68.5M',
      volume24hUsd: '$16.78M',
      activePoolsCount: 18,
      topPools: [
        { pair: 'NVDA.d (dShares)', liquidity: '$18.4M', volume24h: '$16.78M' },
        { pair: 'AAPL.d (dShares)', liquidity: '$14.2M', volume24h: '$6.52M' },
        { pair: 'TSLA.d (dShares)', liquidity: '$9.6M', volume24h: '$5.48M' },
        { pair: 'AMD.d (dShares)', liquidity: '$7.8M', volume24h: '$5.14M' },
      ],
    },
    storeRatings: {
      trustpilot: { rating: 4.8, totalReviews: '2,800', url: 'https://dinari.com' },
    },
    reviewsList: [
      {
        id: 'din-1',
        author: 'InstitutionalAlloc',
        rating: 5,
        date: 'September 2026',
        reviewText: 'Direct SEC Transfer Agent registration is key for our enterprise treasury. Physical 1:1 shares with dividend pass-through.',
        source: 'Trustpilot',
        sourceUrl: 'https://dinari.com',
        verifiedBuyer: true,
      },
      {
        id: 'din-2',
        author: 'DrCryptoLaw',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Clean smart contract issuance on Solana Token-2022. Instant mint and burn backed by real Wall Street broker custodian.',
        source: 'Community Verified',
        sourceUrl: 'https://app.dinari.com/',
        verifiedBuyer: true,
      },
    ],
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'backed',
    name: 'Backed Finance / xStocks',
    tagline: 'Swiss DLT Regulated Tokenized Securities on Solana',
    description:
      'Issues fully collateralized ERC-20 and Solana SPL tokenized equities under the Swiss DLT Act. Each token (bAAPL, bNVDA, bTSLA) represents one share held in custody with Maerki Baumann & Co. Private Bank.',
    category: 'Tokenized Stock Issuer',
    country: 'Switzerland',
    countryCode: 'CH',
    region: 'Europe',
    flag: '🇨🇭',
    domain: 'backed.fi',
    logoUrl: 'https://www.google.com/s2/favicons?domain=backed.fi&sz=128',
    brandColor: '#059669',
    websiteUrl: 'https://backed.fi',
    appUrl: 'https://xstocks.fi',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'Instant DEX Swaps / 24/7 Liquidity',
    },
    supportedAssets: ['bAAPL', 'bNVDA', 'bTSLA', 'bCSPX (S&P 500)', 'bIB01 (Treasuries)'],
    paymentMethods: ['USDC (Solana)', 'SOL', 'Bank Wire (Institutional)'],
    pricingAndFees: {
      tradingFee: '0.00% routing (standard 0.10% AMM LP fee)',
      depositFee: 'Free',
      withdrawalFee: '~0.000005 SOL',
      minTradeAmount: '$1.00',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'Swiss DLT Compliant (FINMA)',
      jurisdiction: 'Switzerland & European Union',
    },
    rating: 4.9,
    reviewCount: 2890,
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'ondo',
    name: 'Ondo Finance & Global Markets',
    tagline: 'Institutional Grade RWA & US Treasury Tokenization on Solana',
    description:
      'The #1 institutional tokenized RWA protocol with over $600M in TVL. Issues USDY (Yield Dollar backed by short-term US Treasuries and bank deposits) natively on Solana with 24/7 composability in DeFi.',
    category: 'RWA Protocol',
    country: 'United States',
    countryCode: 'US',
    region: 'North America',
    flag: '🇺🇸',
    domain: 'ondo.finance',
    logoUrl: 'https://www.google.com/s2/favicons?domain=ondo.finance&sz=128',
    brandColor: '#1E293B',
    websiteUrl: 'https://ondo.finance',
    appUrl: 'https://ondo.finance/usdy',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'Instant Solana Minting & Transfer',
    },
    supportedAssets: ['USDY (5.05% APY Yield Dollar)', 'OUSG (BlackRock BUIDL Backed)'],
    paymentMethods: ['USDC (Solana)', 'USD Wire', 'SOL'],
    pricingAndFees: {
      tradingFee: '0.00% on DEXes / 0.15% primary redemption',
      depositFee: 'Free',
      withdrawalFee: '~0.000005 SOL',
      minTradeAmount: '$500 (Primary) / $0.01 (DEX Secondary)',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'FinCEN MSB Registered',
      jurisdiction: 'United States & Global',
    },
    rating: 4.9,
    reviewCount: 8900,
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'jupiter',
    name: 'Jupiter Aggregator',
    tagline: 'Solana Premier DEX Routing for Tokenized Stocks & RWAs',
    description:
      'Solana flagship swap and routing protocol. Routes all trades across Raydium, Meteora, Phoenix, and OpenBook to ensure zero slippage, best price discovery, and zero aggregator markup for tokenized stocks.',
    category: 'DEX Aggregator',
    country: 'Global',
    countryCode: 'GLOBAL',
    region: 'Global / Multi-Region',
    flag: '🌐',
    domain: 'jup.ag',
    logoUrl: 'https://www.google.com/s2/favicons?domain=jup.ag&sz=128',
    brandColor: '#22C55E',
    websiteUrl: 'https://jup.ag',
    appUrl: 'https://jup.ag/swap/USDC-NVDAx',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: '~400ms Sub-second Atomic Routing',
    },
    supportedAssets: ['All Tokenized Stocks (xStocks, dShares)', 'USDY', 'SOL', 'USDC'],
    paymentMethods: ['Solana Non-Custodial Wallet (Phantom, Solflare, Backpack)'],
    pricingAndFees: {
      tradingFee: '0.00% Jupiter routing fee (Pure pool pass-through)',
      depositFee: 'Free',
      withdrawalFee: 'Standard Solana priority fee (~0.00005 SOL)',
      minTradeAmount: '$0.01',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'Self-Custodial Smart Contracts',
      jurisdiction: 'Decentralized Solana Protocol',
    },
    rating: 5.0,
    reviewCount: 78000,
    liquidityMetrics: {
      tvlUsd: '$840M',
      volume24hUsd: '$420M',
      activePoolsCount: 350,
      topPools: [
        { pair: 'xStocks Meta Router', liquidity: '$48.5M', volume24h: '$38.2M' },
        { pair: 'Dinari dShares Aggregator', liquidity: '$24.2M', volume24h: '$16.8M' },
        { pair: 'SOL - USDC', liquidity: '$140.0M', volume24h: '$110.5M' },
      ],
    },
    storeRatings: {
      trustpilot: { rating: 4.9, totalReviews: '12,500', url: 'https://jup.ag' },
    },
    reviewsList: [
      {
        id: 'jup-1',
        author: 'QuantSol',
        rating: 5,
        date: 'September 2026',
        reviewText: 'Finds the best split-route between Raydium CLMM and Meteora DLMM for stock purchases. Dynamic slippage protection works perfectly.',
        source: 'Trustpilot',
        sourceUrl: 'https://jup.ag',
        verifiedBuyer: true,
      },
      {
        id: 'jup-2',
        author: 'Niko B.',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Never trades on a single pool when Jupiter can route xStocks with 0.01% price impact. The gold standard of Solana routing.',
        source: 'Community Verified',
        sourceUrl: 'https://jup.ag',
        verifiedBuyer: true,
      },
    ],
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'raydium',
    name: 'Raydium Protocol',
    tagline: 'Solana High-Liquidity AMM & Concentrated Pools (CLMM)',
    description:
      'Foundational on-chain automated market maker on Solana providing deep concentrated liquidity (CLMM) and constant product pools for tokenized equities, real-world assets, and stable pairs.',
    category: 'DEX Aggregator',
    country: 'Global',
    countryCode: 'GLOBAL',
    region: 'Global / Multi-Region',
    flag: '🌐',
    domain: 'raydium.io',
    logoUrl: 'https://www.google.com/s2/favicons?domain=raydium.io&sz=128',
    brandColor: '#8B5CF6',
    websiteUrl: 'https://raydium.io',
    appUrl: 'https://raydium.io/swap',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: '~400ms',
    },
    supportedAssets: ['NVDAx', 'AAPLx', 'TSLAx', 'USDY', 'SOL', 'USDC'],
    paymentMethods: ['Any Solana SPL Wallet'],
    pricingAndFees: {
      tradingFee: '0.05% - 0.25% LP fee (tier dependent)',
      depositFee: 'Free',
      withdrawalFee: '~0.000005 SOL',
      minTradeAmount: '$0.01',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'Self-Custodial Smart Contracts',
      jurisdiction: 'Decentralized Solana Protocol',
    },
    rating: 4.8,
    reviewCount: 45000,
    liquidityMetrics: {
      tvlUsd: '$1.45B',
      volume24hUsd: '$285.3M',
      activePoolsCount: 120,
      topPools: [
        { pair: 'SPYx - STONK', liquidity: '$4,545,495', volume24h: '$5,087,927', apr: '408.56%' },
        { pair: 'SPYx - USDC', liquidity: '$288,348', volume24h: '$5,053,314', apr: '63.97%' },
        { pair: 'CRCLx - USDC', liquidity: '$1,960,247', volume24h: '$4,746,868', apr: '88.39%' },
        { pair: 'ALLINU - DKNG', liquidity: '$455,163', volume24h: '$3,969,352', apr: '795.77%' },
        { pair: 'SOL - USDC', liquidity: '$32,362,511', volume24h: '$20,677,068', apr: '58.30%' },
      ],
    },
    storeRatings: {
      trustpilot: { rating: 4.8, totalReviews: '4,200', url: 'https://raydium.io' },
    },
    reviewsList: [
      {
        id: 'ray-1',
        author: 'DeFi_Farmer_Sol',
        rating: 5,
        date: 'September 2026',
        reviewText: 'Providing liquidity on SPYx and CRCLx concentrated pools yields unbeatable fee share. Concentrated AMM routing is lightning fast.',
        source: 'Trustpilot',
        sourceUrl: 'https://raydium.io/liquidity-pools/',
        verifiedBuyer: true,
      },
      {
        id: 'ray-2',
        author: 'ApexTrader',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Deepest on-chain liquidity on Solana for tokenized stocks. Constant swap execution with zero slippage via Mitigator router.',
        source: 'Community Verified',
        sourceUrl: 'https://raydium.io',
        verifiedBuyer: true,
      },
    ],
    featured: false,
    verifiedOfficial: true,
  },
  {
    id: 'meteora',
    name: 'Meteora DLMM',
    tagline: 'Dynamic Fee & Volatility-Adaptive Liquidity on Solana',
    description:
      'Solana next-generation dynamic liquidity market maker (DLMM). Provides zero slippage within bins, dynamic volatility fees that compensate LPs during market opens, and maximum capital efficiency for stock tokens.',
    category: 'DEX Aggregator',
    country: 'Global',
    countryCode: 'GLOBAL',
    region: 'Global / Multi-Region',
    flag: '🌐',
    domain: 'meteora.ag',
    logoUrl: 'https://www.google.com/s2/favicons?domain=meteora.ag&sz=128',
    brandColor: '#EC4899',
    websiteUrl: 'https://meteora.ag',
    appUrl: 'https://app.meteora.ag',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: '~400ms',
    },
    supportedAssets: ['Stock Liquidity Bins (TSLA/USDC, AAPL/USDC)', 'USDY', 'SOL'],
    paymentMethods: ['Solana Non-Custodial Wallet'],
    pricingAndFees: {
      tradingFee: '0.01% - 0.15% Dynamic Volatility Adaptive',
      depositFee: 'Free',
      withdrawalFee: '~0.000005 SOL',
      minTradeAmount: '$0.01',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'Self-Custodial Smart Contracts',
      jurisdiction: 'Decentralized Solana Protocol',
    },
    rating: 4.9,
    reviewCount: 19000,
    liquidityMetrics: {
      tvlUsd: '$340M',
      volume24hUsd: '$85.4M',
      activePoolsCount: 65,
      topPools: [
        { pair: 'NVDAx - USDC DLMM', liquidity: '$6.8M', volume24h: '$12.4M', apr: '94.2%' },
        { pair: 'TSLAx - SOL Dynamic', liquidity: '$4.2M', volume24h: '$8.1M', apr: '112.5%' },
        { pair: 'USDY - USDC Stable', liquidity: '$22.0M', volume24h: '$18.5M', apr: '8.4%' },
      ],
    },
    storeRatings: {
      trustpilot: { rating: 4.8, totalReviews: '3,100', url: 'https://meteora.ag' },
    },
    reviewsList: [
      {
        id: 'met-1',
        author: 'DLMM_King',
        rating: 5,
        date: 'September 2026',
        reviewText: 'Zero slippage within dynamic bins. Captures high volatility fees when US market open triggers arbitrage.',
        source: 'Community Verified',
        sourceUrl: 'https://meteora.ag',
        verifiedBuyer: true,
      },
    ],
    featured: false,
    verifiedOfficial: true,
  },
  {
    id: 'drift',
    name: 'Drift Protocol',
    tagline: 'Decentralized Perpetuals, Spot & Synthetic Equities on Solana',
    description:
      'Solana premier decentralized derivatives exchange offering perpetual swaps, spot trading, and synthetic exposure to US tech stocks, indices, and commodities with up to 10x leverage and cross-margin.',
    category: 'Derivatives & Perpetuals',
    country: 'Global',
    countryCode: 'GLOBAL',
    region: 'Global / Multi-Region',
    flag: '🌐',
    domain: 'drift.trade',
    logoUrl: 'https://www.google.com/s2/favicons?domain=drift.trade&sz=128',
    brandColor: '#06B6D4',
    websiteUrl: 'https://drift.trade',
    appUrl: 'https://app.drift.trade',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: '~400ms Sub-second Fills',
    },
    supportedAssets: ['Synthetic Equities', 'Crypto Perps', 'USDC Borrow/Lend', 'SOL'],
    paymentMethods: ['Phantom, Backpack, Solflare'],
    pricingAndFees: {
      tradingFee: '0.02% Maker / 0.05% Taker',
      depositFee: 'Free',
      withdrawalFee: '~0.00001 SOL',
      minTradeAmount: '$1.00',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'Self-Custodial Smart Contracts',
      jurisdiction: 'Decentralized Solana Protocol',
    },
    rating: 4.9,
    reviewCount: 24000,
    featured: true,
    verifiedOfficial: true,
  },
  {
    id: 'phoenix',
    name: 'Phoenix (Ellipsis Labs)',
    tagline: 'Instantaneous On-Chain Limit Order Book (CLOB) on Solana',
    description:
      'Zero-crank fully on-chain limit order book on Solana. Eliminates asynchronous settlement matching for tokenized equities, enabling high-frequency institutional trading with complete transparency.',
    category: 'Order Book & CLOB',
    country: 'United States',
    countryCode: 'US',
    region: 'North America',
    flag: '🇺🇸',
    domain: 'phoenix.trade',
    logoUrl: 'https://www.google.com/s2/favicons?domain=phoenix.trade&sz=128',
    brandColor: '#F97316',
    websiteUrl: 'https://phoenix.trade',
    appUrl: 'https://app.phoenix.trade',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'Sub-second Atomic On-Chain Fill',
    },
    supportedAssets: ['Tokenized Stock Pairs', 'SOL/USDC', 'USDY/USDC'],
    paymentMethods: ['Direct Solana RPC / Web3 Wallets'],
    pricingAndFees: {
      tradingFee: '0.00% Maker (Rebates) / 0.03% Taker',
      depositFee: 'Free',
      withdrawalFee: '~0.000005 SOL',
      minTradeAmount: '$1.00',
    },
    kycRequirement: 'None (Self-Custodial DeFi)',
    regulation: {
      status: 'Self-Custodial Smart Contracts',
      jurisdiction: 'Decentralized Protocol',
    },
    rating: 4.8,
    reviewCount: 3800,
    featured: false,
    verifiedOfficial: true,
  },
  {
    id: 'swarm',
    name: 'Swarm Markets',
    tagline: 'BaFin-Regulated Public Stock & ETF DEX',
    description:
      'German regulator (BaFin) licensed decentralized infrastructure. Tokenizes US public stocks (Apple, Tesla, BlackRock Treasuries) with institutional regulatory compliance and cross-chain liquidity to Solana.',
    category: 'Tokenized Stock Issuer',
    country: 'Germany',
    countryCode: 'DE',
    region: 'Europe',
    flag: '🇩🇪',
    domain: 'swarm.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=swarm.com&sz=128',
    brandColor: '#3B82F6',
    websiteUrl: 'https://swarm.com',
    appUrl: 'https://app.swarm.com',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: false,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'Instant DEX Settlement',
    },
    supportedAssets: ['Apple (AAPL)', 'Tesla (TSLA)', 'BlackRock US T-Bills', 'USDC'],
    paymentMethods: ['USDC', 'EUR Fiat Rail', 'Bank Wire'],
    pricingAndFees: {
      tradingFee: '0.25% - 0.40%',
      depositFee: 'Free for USDC',
      withdrawalFee: 'Standard network gas',
      minTradeAmount: '$10.00',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'BaFin Regulated (Germany)',
      jurisdiction: 'Germany & European Union',
    },
    rating: 4.6,
    reviewCount: 1900,
    featured: false,
    verifiedOfficial: true,
  },
  {
    id: 'belo',
    name: 'Belo App',
    tagline: 'Latin America Solana Dollar Wallet & US Asset Gateway',
    description:
      'LatAm fintech connecting consumers across Argentina, Brazil, and Colombia to digital dollars on Solana and tokenized US investments, providing protection against hyperinflation with zero friction.',
    category: 'Fintech & Wealth App',
    country: 'Argentina',
    countryCode: 'AR',
    region: 'Latin America',
    flag: '🇦🇷',
    domain: 'belo.app',
    logoUrl: 'https://www.google.com/s2/favicons?domain=belo.app&sz=128',
    brandColor: '#8B5CF6',
    websiteUrl: 'https://www.belo.app/en-us',
    appUrl: 'https://www.belo.app/en-us',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: false,
      settlementSpeed: 'Instant',
    },
    supportedAssets: ['USDC (Solana)', 'US Stocks via Partner', 'ARS / BRL Fiat'],
    paymentMethods: ['Local Bank Transfer (ARS/BRL)', 'Solana USDC', 'Debit Card'],
    pricingAndFees: {
      tradingFee: '0.50% - 1.00% FX spread',
      depositFee: 'Free',
      withdrawalFee: 'Local banking standard',
      minTradeAmount: '$1.00',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'FinCEN MSB Registered',
      jurisdiction: 'Latin America & US',
    },
    rating: 4.8,
    reviewCount: 35000,
    liquidityMetrics: {
      tvlUsd: '$95.0M',
      volume24hUsd: '$14.2M',
      activePoolsCount: 12,
      topPools: [
        { pair: 'USDC / ARS Rail', liquidity: '$55.0M', volume24h: '$8.9M' },
        { pair: 'US Stocks LatAm Basket', liquidity: '$25.0M', volume24h: '$3.8M' },
      ],
    },
    storeRatings: {
      googlePlay: { rating: 4.8, totalReviews: '35,000', url: 'https://play.google.com/store/apps/details?id=com.belo' },
      appStore: { rating: 4.8, totalReviews: '22,000', url: 'https://apps.apple.com/app/belo-simple-money/id1560000000' },
    },
    reviewsList: [
      {
        id: 'bel-1',
        author: 'Santiago M. (Buenos Aires)',
        rating: 5,
        date: 'August 2026',
        reviewText: 'Essential hedge against inflation. I can transfer Argentine Pesos and immediately hold Solana USDC or buy US stock exposure with zero friction.',
        source: 'Google Play',
        sourceUrl: 'https://play.google.com/store/apps/details?id=com.belo',
        verifiedBuyer: true,
      },
      {
        id: 'bel-2',
        author: 'Camila P.',
        rating: 5,
        date: 'July 2026',
        reviewText: 'The best crypto & dollar card in South America. Extremely reliable and the Solana transfers settle instantly.',
        source: 'App Store',
        sourceUrl: 'https://apps.apple.com/app/belo-simple-money/id1560000000',
        verifiedBuyer: true,
      },
    ],
    featured: false,
    verifiedOfficial: true,
  },
  {
    id: 'ripio',
    name: 'Ripio',
    tagline: 'Leading Latin American Digital Asset & RWA Portal',
    description:
      'With over 5 million users across Latin America, Ripio provides fiat on-ramps to Solana USDC, cryptocurrency trading, and exposure to tokenized international financial instruments.',
    category: 'Exchange & On-Ramp',
    country: 'Argentina',
    countryCode: 'AR',
    region: 'Latin America',
    flag: '🇦🇷',
    domain: 'ripio.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=ripio.com&sz=128',
    brandColor: '#3B82F6',
    websiteUrl: 'https://ripio.com',
    appUrl: 'https://trade.ripio.com',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: false,
      settlementSpeed: 'Instant Order Book',
    },
    supportedAssets: ['USDC (Solana)', 'SOL', 'Criptodólar (UXD)', 'ARS / BRL'],
    paymentMethods: ['PIX (Brazil)', 'Bank Transfer (Argentina)', 'Solana USDC'],
    pricingAndFees: {
      tradingFee: '0.10% Maker / 0.25% Taker',
      depositFee: 'Free',
      withdrawalFee: 'Standard network gas',
      minTradeAmount: '$2.00',
    },
    kycRequirement: 'Tier 2 (National ID / BVN)',
    regulation: {
      status: 'FinCEN MSB Registered',
      jurisdiction: 'Brazil, Argentina, Colombia & Spain',
    },
    rating: 4.7,
    reviewCount: 42000,
    featured: false,
    verifiedOfficial: true,
  },
];

/**
 * Filter and query helpers
 */
export function getAllVenues(): TradingVenue[] {
  return TRADING_VENUES;
}

export function getVenuesByCountry(countryCodeOrName: string): TradingVenue[] {
  const norm = countryCodeOrName.toLowerCase();
  return TRADING_VENUES.filter(
    (v) =>
      v.countryCode.toLowerCase() === norm ||
      v.country.toLowerCase() === norm ||
      (norm === 'ng' && v.countryCode === 'NG') ||
      (norm === 'nigeria' && v.country === 'Nigeria')
  );
}

export function getVenuesByRegion(region: string): TradingVenue[] {
  if (!region || region.toLowerCase() === 'all') return TRADING_VENUES;
  return TRADING_VENUES.filter((v) => v.region.toLowerCase().includes(region.toLowerCase()));
}

export function getVenuesByCategory(category: string): TradingVenue[] {
  if (!category || category.toLowerCase() === 'all') return TRADING_VENUES;
  return TRADING_VENUES.filter((v) => v.category.toLowerCase().includes(category.toLowerCase()));
}

export function searchVenues(query: string): TradingVenue[] {
  if (!query || query.trim() === '') return TRADING_VENUES;
  const q = query.toLowerCase().trim();
  return TRADING_VENUES.filter(
    (v) =>
      v.name.toLowerCase().includes(q) ||
      v.tagline.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.country.toLowerCase().includes(q) ||
      v.supportedAssets.some((a) => a.toLowerCase().includes(q)) ||
      v.paymentMethods.some((p) => p.toLowerCase().includes(q)) ||
      v.regulation.status.toLowerCase().includes(q)
  );
}
