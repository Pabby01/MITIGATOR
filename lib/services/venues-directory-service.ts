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
  | 'Swiss DLT Compliant (FINMA)'
  | 'SEC US Registered Transfer Agent'
  | 'BaFin Regulated (Germany)'
  | 'VARA Dubai Licensed'
  | 'Self-Custodial Smart Contracts'
  | 'FinCEN MSB Registered';

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
      'Solana-built platform democratizing tokenized African equities and high-yield real-world assets. Partnered with GetEquity to bring access to the Dangote Petroleum Refinery pre-IPO allocations on Solana with sub-second settlement.',
    category: 'RWA Protocol',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'app.nectarfi.finance',
    logoUrl: 'https://www.google.com/s2/favicons?domain=nectarfi.finance&sz=128',
    brandColor: '#F59E0B',
    websiteUrl: 'https://nectarfi.finance',
    appUrl: 'https://app.nectarfi.finance',
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
    domain: 'busha.co',
    logoUrl: 'https://www.google.com/s2/favicons?domain=busha.co&sz=128',
    brandColor: '#16A34A',
    websiteUrl: 'https://busha.co',
    appUrl: 'https://app.busha.co',
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
    domain: 'quidax.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=quidax.com&sz=128',
    brandColor: '#7C3AED',
    websiteUrl: 'https://quidax.com',
    appUrl: 'https://app.quidax.com',
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
      'Pioneered micro-investing in Nigeria. Allows fractional shares in over 10,000 stocks listed on the NYSE, NASDAQ, and Nigerian Exchange (NGX), utilizing high-speed crypto rails for deposit settlement.',
    category: 'Fintech & Wealth App',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'troveapp.co',
    logoUrl: 'https://www.google.com/s2/favicons?domain=troveapp.co&sz=128',
    brandColor: '#3B82F6',
    websiteUrl: 'https://troveapp.co',
    appUrl: 'https://app.troveapp.co',
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
    appUrl: 'https://app.canza.io',
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
    id: 'flincap',
    name: 'Flincap',
    tagline: 'African Institutional OTC Liquidity Engine for Solana Assets',
    description:
      'High-volume OTC liquidity provider powering fintechs, stockbrokers, and digital banks across Nigeria and Africa with instant on/off ramps to Solana USDC and tokenized securities.',
    category: 'Exchange & On-Ramp',
    country: 'Nigeria',
    countryCode: 'NG',
    region: 'Africa',
    flag: '🇳🇬',
    domain: 'flincap.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=flincap.com&sz=128',
    brandColor: '#4F46E5',
    websiteUrl: 'https://flincap.com',
    appUrl: 'https://app.flincap.com',
    solanaNetworks: ['mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'Sub-minute Institutional OTC',
    },
    supportedAssets: ['USDC (Solana)', 'SOL', 'NGN Large-Block Liquidity'],
    paymentMethods: ['NGN High-Value Bank Transfer', 'Solana USDC', 'SWIFT Wire'],
    pricingAndFees: {
      tradingFee: '0.05% - 0.12% OTC spread',
      depositFee: 'Free',
      withdrawalFee: 'Zero for wholesale',
      minTradeAmount: '$500 (₦850,000)',
    },
    kycRequirement: 'Full KYC (ID + Proof of Address)',
    regulation: {
      status: 'FinCEN MSB Registered',
      jurisdiction: 'Nigeria & International',
    },
    rating: 4.7,
    reviewCount: 520,
    featured: false,
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
    appUrl: 'https://dshares.dinari.com',
    solanaNetworks: ['devnet', 'mainnet-beta'],
    solanaFeatures: {
      nativeSolana: true,
      supportsUsdcSolana: true,
      token2022Compliant: true,
      settlementSpeed: 'Instant On-Chain / T+1 Custody Verification',
    },
    supportedAssets: ['AAPL.d', 'TSLA.d', 'NVDA.d', 'MSFT.d', 'SPY.d', 'QQQ.d', 'GOOGL.d'],
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
    websiteUrl: 'https://belo.app',
    appUrl: 'https://app.belo.app',
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
