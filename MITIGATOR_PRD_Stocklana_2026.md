# MITIGATOR — Product Requirements Document

**Stocklana 2026 Hackathon • Version 1.0 • September 2026**

> AI-powered pre-trade intelligence, risk mitigation, social intelligence, and execution for tokenized stocks on Solana


## 1. Executive Summary

- MITIGATOR is a Solana-native trading intelligence platform for tokenized stocks. Its central promise is simple: before a user buys or sells a tokenized stock, MITIGATOR combines verified market, fundamental, news, social, event, portfolio, token, oracle, and onchain-liquidity data to explain the opportunity and risk, recommend mitigation actions, compare available execution venues, and let the user execute with explicit guardrails.
- The product is intentionally broader than a stock screener. It is a complete intelligence-to-execution loop: Discover → Research → Verify → Analyze → Score Risk → Simulate → Mitigate → Compare Execution → Execute → Monitor → Discuss → Learn. All planned features remain in scope: AI trading, AI copilot, paper trading, portfolio/risk management, recurring buys and DCA, copy trading/strategies, social stock timelines, alerts, robo portfolios, market watch, long-range charts, cross-venue execution, cross-chain expansion, and autonomous-agent workflows.
- The key product distinction is that MITIGATOR does not treat AI as a stock-price oracle. AI is the reasoning and explanation layer over structured, provenance-aware data. Every important claim shown to a user should be traceable to a source, timestamp, confidence level, and—where possible—corroborating sources.

## 2. Product Vision

- Vision: become the risk-aware intelligence and execution layer for the tokenized-equity economy.
- Mission: make every tokenized-stock trade explainable, comparable, verifiable, and risk-aware before a wallet signature is requested.
- Core positioning: “Don't just trade. Understand the risk first.”
- Secondary product line: “Research. Risk. Route. Execute.”

## 3. Problem Statement

- Tokenized stocks make equity exposure composable and tradable onchain, but they introduce a combined information problem. A trader must understand the underlying company and market while also evaluating token integrity, price reference, corporate-action mechanics, liquidity, spread, price impact, venue quality, and portfolio concentration.
- Existing brokerage-style experiences generally optimize for access and execution. Research terminals optimize for information. DeFi interfaces optimize for swaps. MITIGATOR combines these layers into one pre-trade decision workflow and makes the reasoning visible.
- The product must avoid the false assumption that “more data automatically means more reliable data.” Reliability comes from source quality, freshness, independence, corroboration, conflict detection, provenance, and confidence-weighted fusion.

## 4. Target Users

- Primary: crypto-native retail investors who want exposure to tokenized equities but do not want to manually research financial news, filings, liquidity, token mechanics, and execution venues.
- Secondary: active traders who want fast multi-source intelligence, venue comparison, alerts, and guarded execution.
- Advanced: strategy builders, copy traders, quant/AI users, and portfolio managers who want programmable research, simulation, and agent-assisted execution.
- Future: DAOs, fintech apps, wallets, brokers, and institutional users who want MITIGATOR's risk/intelligence APIs.

## 5. Product Principles

- Evidence before opinion — AI claims must be grounded in retrieved data.
- Source provenance everywhere — users can inspect where a signal came from.
- Risk before execution — the system analyzes the proposed order, not just the asset.
- Solana-native by design — wallet, onchain state, liquidity, routing and transaction verification are first-class.
- Explainability over black-box predictions — show the factors behind every score.
- Human approval for live execution — autonomous recommendations can be simulated; live trades require explicit user authorization/signature.
- Fast path for experts, guided path for beginners — progressive disclosure.
- 3D where it creates attention or comprehension; conventional charts and tables where precision matters.
- Never conflate underlying-equity history with token/onchain history.

## 6. Full Feature Scope

- A. Market Intelligence: asset discovery, watchlists, live prices, historical market watch, technical indicators, fundamentals, earnings, analyst/consensus data where licensed, macro indicators, sector comparisons, volatility, correlation, drawdown, valuation, and market status.
- B. AI Intelligence: AI pre-trade brief, bullish/bearish thesis, risk explanation, catalyst detection, “why not?” analysis, scenario analysis, portfolio-aware recommendations, natural-language copilot, trade-plan generation, strategy construction, autonomous monitoring, and agent workflows.
- C. Risk & Mitigation: MITIGATOR Score, market risk, event risk, news risk, liquidity risk, onchain/token risk, portfolio concentration risk, correlation risk, execution risk, order-size simulation, slippage limits, DCA plans, position-size suggestions, stop/alert policies, and policy-based trade blocking.
- D. Execution: multi-venue price comparison, Jupiter routing, xChange RFQ where onboarding/access permits, Raydium/Orca/Meteora liquidity discovery, quote freshness, spread, expected slippage, price impact, route quality, wallet signing, transaction confirmation, execution receipts, and post-trade monitoring.
- E. Social Intelligence: stock-specific public timeline, user posts, sentiment, verified-account indicators, source reputation, citations, X integration, Reddit/Stocktwits/other permitted public sources, discussion threads, reactions, spam controls, misinformation flags, and AI summaries.
- F. Social Trading: strategy profiles, trader/strategy performance, risk-adjusted metrics, transparent holdings, copy/follow strategies, copy-size adjustment based on the user's own risk limits, and paper-copy mode.
- G. Portfolio: wallet portfolio, cost basis, P&L, allocation, sector exposure, correlation, drawdown, risk budget, recurring buys, DCA, robo portfolios, alerts, rebalancing suggestions, and simulation.
- H. Market Watch: multi-year charts, 1D/1W/1M/3M/6M/YTD/1Y/5Y/MAX, candlesticks, volume, volatility, drawdowns, event/news overlays, sentiment overlays, MITIGATOR Score history, compare assets, normalized performance, and underlying-vs-token history labeling.
- I. Cross-chain: Solana first; architecture supports future Ethereum, Arbitrum, Base, TON and other supported tokenized-stock networks without redesigning the domain model.
- J. Alerts: price, news, sentiment, risk-score, liquidity, price-divergence, corporate-action, earnings, portfolio concentration, strategy, and custom natural-language alerts.
- K. Education & Trust: source-quality badges, data freshness, conflict indicators, token verification, issuer information, risk disclosures, methodology pages, and audit-friendly event logs.

## 7. Core User Journey

- 1. User connects a Solana wallet or starts in read-only/paper mode.
- 2. User searches for an asset such as NVDAx, AAPLx, SPYx, or TSLAx.
- 3. MITIGATOR resolves the canonical asset, issuer, underlying ticker, Solana mint/deployment, oracle/reference sources, market status, and corporate-action/multiplier state.
- 4. User sees a 3D asset hero plus a conventional precision chart and MITIGATOR Score.
- 5. User opens Intelligence to inspect news, filings, fundamentals, social discussion, catalysts, and the AI thesis.
- 6. User opens Risk to see factor-level scoring and evidence.
- 7. User enters a proposed order. MITIGATOR calculates portfolio impact, liquidity impact, expected slippage, venue availability, event risk, and recommended mitigation.
- 8. User chooses a mitigation plan or overrides it with explicit acknowledgement.
- 9. MITIGATOR compares execution venues and produces a quote/route.
- 10. User signs the transaction. The app verifies confirmation and stores an execution receipt.
- 11. Portfolio and alerts update. The stock's social timeline and user's activity can continue the discussion.

## 8. MITIGATOR Score & Risk Engine

- The MITIGATOR Score is a dynamic, explainable score from 0–100. Higher is better for overall trade readiness; a separate risk severity scale is shown so users are not forced to interpret one number.
- Recommended factor model: Market Quality 15%; Fundamental/Business 15%; News & Sentiment 15%; Event/Catalyst Risk 10%; Liquidity & Execution 15%; Token/Onchain Integrity 15%; Portfolio Fit 10%; Data Confidence 5%.
- The engine must expose both the score and its evidence. Each factor contains: value, normalized score, direction, source list, timestamp, freshness, confidence, and explanation.
- Trade-level risk must differ from asset-level risk. A liquid stock can become a high-risk trade if the user's proposed order is too large, creates concentration, crosses a major event, or encounters poor execution conditions.
- Risk states: LOW, MODERATE, ELEVATED, HIGH, CRITICAL. The exact thresholds should be configurable and versioned.
- Every scoring-model change must be versioned so historical scores can be reproduced.

## 9. AI System

- The AI layer consumes structured evidence packets rather than raw untrusted web text. Each packet contains source ID, source tier, publication timestamp, retrieval timestamp, content hash/reference, ticker/entity mapping, sentiment/event tags, and confidence.
- AI functions: Research Agent, News Agent, Filing Agent, Social Agent, Risk Agent, Execution Agent, Portfolio Agent, Strategy Agent, Alert Agent, and Orchestrator/Copilot.
- AI output schema: summary, thesis, counter-thesis, evidence, uncertainty, catalysts, invalidation conditions, risk flags, mitigation actions, execution recommendation, and citations.
- The AI must not invent prices, filings, events, quotes, liquidity, or trade confirmations. If evidence is missing or conflicting, it must say so.
- Live autonomous trading is gated by policy: max order value, max daily loss, max position size, allowed assets, allowed venues, max slippage, minimum data confidence, and event blackout windows.

## 10. Verified Data & Source Architecture

- MITIGATOR will use a source registry rather than a loose collection of scrapers. Every provider is registered with: provider name, category, legal/access method, API endpoint, authentication mode, update cadence, fields, historical depth, license/terms status, reliability tier, failover provider, and validation rules.
- Tier 0 — canonical/onchain/issuer: xStocks official API and documentation; Solana RPC/onchain token metadata; Pyth price feeds; issuer proof-of-reserves and multiplier data where available.
- Tier 1 — primary authoritative financial sources: SEC EDGAR filings and XBRL; company investor-relations releases; official exchange/market-status data; Federal Reserve/FRED and other official macroeconomic releases.
- Tier 2 — licensed/structured aggregators: Finnhub, Alpha Vantage, NewsAPI and other providers selected after checking entitlement, licensing, rate limits, historical depth and permitted use.
- Tier 3 — public social and alternative sources: X API, Reddit API, Stocktwits or other permitted feeds, public social pages, blogs, forums and media. These are signal sources, not truth sources.
- Social/news scraping is allowed only where the source's terms, robots/access controls, licensing and applicable law permit it. Prefer official APIs or licensed feeds. MITIGATOR must preserve the original source URL/ID and never present social chatter as verified fact.
- Source fusion: corroborate material claims across independent sources. The system should down-weight duplicate syndications and detect conflicting reports. A claim repeated by 30 sites that all copied one article is still one information source.
- Freshness and conflict rules: stale quotes are rejected for execution; stale news is labeled; conflicting high-impact claims create an “Unconfirmed/Conflicting” state; critical execution data requires a current venue/quote response.

## 11. Recommended Data Provider Matrix

- xStocks — canonical tokenized-stock asset metadata, asset price data, oracle information, multiplier/corporate-action state, proof-of-reserves information, and xChange RFQ/availability where access is enabled.
- Pyth — independent price-reference/oracle layer and price confidence/staleness checks where the relevant feed exists.
- Solana RPC — token/account/transaction state and confirmation evidence.
- SEC EDGAR — filings, XBRL financial data, insider/ownership filings and primary regulatory evidence.
- FRED — macroeconomic time series and release calendar context.
- Alpha Vantage or Finnhub — long-range historical OHLCV, indicators, fundamentals/news/alternative data subject to plan/licensing.
- NewsAPI/GDELT — broad news discovery and historical/global coverage; use source scoring and corroboration rather than treating all publishers equally.
- X API — real-time/public posts and account/post discovery subject to API access and pricing. Use official API access rather than unauthorized scraping where possible.
- Raydium, Orca, Meteora — onchain pool/liquidity/quote information where supported; verify pool identity and token mint before using data.
- Jupiter — routing/quote/execution layer where supported for the target assets.
- xChange — issuer-side atomic RFQ path where onboarding and API credentials permit it.

## 12. Data Verification & Provenance Requirements

- Every displayed data point must carry an internal provenance object: provider, endpoint, retrieved_at, published_at (if applicable), asset ID, source tier, freshness window, confidence, and checksum/content reference where practical.
- Canonical entity resolution: map company ticker → underlying security → token symbol → Solana mint → issuer → oracle feed(s) → supported venues. Never rely on ticker text alone.
- Price verification: compare token/venue price against independent reference data; calculate deviation; flag abnormal divergence; never use a wrapped-token accounting exchange rate as a market price.
- News verification: classify primary vs secondary reporting, detect duplicates, extract claims, and require corroboration for high-impact claims before raising a high-confidence alert.
- Social verification: label posts as opinion, reported claim, official statement, or unverified chatter. Official company/issuer/regulator accounts receive higher source authority but are still timestamped and attributed.
- Execution verification: quote must be fresh, route must be reproducible, expected output must be shown, slippage/price impact must be calculated, and transaction confirmation must be independently verified onchain.

## 13. Stock Market Timeline & Social Timeline

- Every stock page includes a unified timeline with two synchronized modes: Market Timeline and Community Timeline.
- Market Timeline overlays price/volume with earnings, filings, dividends, splits, major news, macro events, risk-score changes, liquidity events, and notable onchain deviations.
- Community Timeline contains user thoughts, questions, trade theses, replies, reactions, sentiment, and linked evidence. Posts can be attached to an asset and optionally to a time window or event.
- Users can filter by Verified Sources, News, Filings, Company, Analysts, Community, AI Signals, and Onchain Events.
- A post can be marked as “Evidence attached” only when it references a source. Users may still publish opinions without evidence, but the UI clearly distinguishes opinion from verified information.
- AI summarizes the conversation periodically: consensus, disagreement, emerging narratives, misinformation/low-quality clusters, and notable changes in sentiment.
- Anti-abuse: rate limits, duplicate-content detection, spam scoring, report/block tools, moderation queue, and clear financial-risk disclosures.

## 14. Historical Market Watch & Charts

- The Market Watch experience must support long-range analysis: 1D, 1W, 1M, 3M, 6M, YTD, 1Y, 5Y and MAX where source coverage exists.
- Charts: candlestick/line, volume, relative performance, drawdown, volatility, moving averages, RSI/MACD where appropriate, correlation, and normalized performance comparisons.
- Event overlays: earnings, filings, dividends, splits, major news, macro releases, and AI-detected regime changes.
- Dual history model: Underlying Equity History and Token/Onchain History are separate series. If the token launched later than the underlying security, the UI explicitly labels the earlier history as underlying-equity context.
- The user can compare up to 5 assets and normalize them to 100 at a selected start date.

## 15. Multi-Venue Execution

- Execution screen compares available routes using expected received amount, quoted price, spread, price impact, estimated slippage, liquidity/depth, fees, quote age, route complexity, and settlement characteristics.
- Jupiter is the default routing layer for supported swaps. Raydium/Orca/Meteora can contribute venue/liquidity information and direct execution where appropriate. xChange is used for issuer RFQ where available and authorized.
- The UI must distinguish indicative/reference price from executable quote.
- Quote lifecycle: request → validate → display expiry → user confirmation → wallet signature → broadcast → confirmation → receipt.
- Guardrails: max slippage, max price impact, minimum received, max order value, approved assets, approved venues, and user-specific risk policy.

## 16. AI Trading, Paper Trading & Autonomous Agents

- Paper Trading is a first-class environment with simulated wallet balances, realistic quote/fee/slippage assumptions, trade journal, P&L, drawdown, win rate, exposure and risk-adjusted performance.
- AI Trading Agent can scan eligible assets, rank opportunities, construct a proposed portfolio, simulate trades, and monitor positions. Live execution is disabled by default until the user explicitly enables a policy.
- Robo Portfolios support configurable objectives such as Conservative, Balanced, Growth, Momentum, Dividend/Income where data supports the strategy, and Custom.
- Recurring buys/DCA allow schedules, amount, target assets, maximum price/slippage, event blackout windows, and automatic pause conditions.
- Autonomous policies include kill switch, daily loss cap, position cap, maximum trade count, data-confidence minimum, and mandatory human approval for defined risk classes.

## 17. Copy Trading & Strategy Marketplace

- Users can create or follow strategies. A strategy profile shows transparent historical performance, drawdown, volatility, risk score, asset concentration, holding period, trade frequency, and methodology.
- Copy trading is risk-aware rather than blind. MITIGATOR calculates the user's recommended copy size based on available capital, current exposure, correlation and personal risk policy.
- Strategy actions can be simulated before following live.
- Strategy provenance: every performance number must be generated from recorded fills/quotes, not self-reported claims.
- Leaderboards rank by risk-adjusted performance, consistency and transparency—not raw ROI alone.

## 18. Portfolio & Risk Management

- Portfolio dashboard: total value, cash/stablecoin, holdings, P&L, realized/unrealized P&L, allocation, sector exposure, correlation, concentration, drawdown, risk budget, and upcoming catalysts.
- Position risk cards show current score, thesis, invalidation conditions, news/event changes, liquidity, and recommended actions.
- Scenario simulator: “What happens if NVDA drops 10%?”, “What if earnings miss?”, “What if liquidity falls 40%?”
- Rebalancing recommendations must show before/after allocation and expected risk change.
- Alerts can trigger on price, drawdown, concentration, score deterioration, liquidity, news, sentiment, and event proximity.

## 19. 3D / Modern UI Direction

- Visual goal: a premium, cinematic, futuristic financial interface that immediately distinguishes MITIGATOR from generic dashboards while retaining institutional-grade information density.
- Hero: interactive 3D asset visualization using React Three Fiber/WebGL or CSS 3D. A tokenized-stock “orb”/glass object can display price, score and live market state. Keep 3D decorative and interactive—not the only way to access information.
- Market overview: layered glass panels, depth, soft bloom, subtle particle/market-grid background, animated price pulses, floating data cards, and responsive micro-interactions.
- Risk visualization: 3D radial/ring visualization for factor health plus conventional numeric breakdown. Use motion to reveal changes rather than constant animation.
- Stock page: 3D hero + precision chart + intelligence panels + timeline. The chart remains conventional so exact prices and dates are readable.
- Color language: near-black/deep graphite base, electric green for healthy/positive states, amber for caution, red for critical, cool violet/cyan as restrained accent colors. Avoid neon overload.
- Motion: 150–250ms UI transitions, spring-based card movement, chart transitions, wallet state animations, and a strong but short hero entrance. Respect prefers-reduced-motion.
- Performance: lazy-load WebGL, use instancing where needed, cap DPR, avoid heavy 3D on mobile, provide 2D fallback, and target fast first contentful render.
- Design principle: “3D for attention; 2D for decisions.”

## 20. Primary Screens

- Landing / cinematic product hero.
- Discover / global tokenized-stock market.
- Market Watch / multi-asset dashboard.
- Asset Search / command palette.
- Stock Detail / 3D hero, chart, intelligence, risk, timeline, execution.
- AI Copilot / persistent contextual assistant.
- Pre-Trade Analysis / MITIGATOR brief.
- Trade Simulator / scenario and order-impact analysis.
- Execution Router / venue comparison and quote.
- Wallet / positions and transaction history.
- Portfolio / allocation and risk.
- Alerts Center.
- Community / stock-specific social timeline.
- Strategy Marketplace / copy trading.
- Paper Trading / simulated portfolio.
- Robo Portfolio Builder.
- AI Agent Console / autonomous policies and monitoring.
- Data Provenance / source inspector.
- Settings / risk policy, data preferences, API/provider status.

## 21. Suggested Frontend Architecture

- React + TypeScript + Vite. Tailwind CSS + shadcn/ui for the conventional interface. React Three Fiber/Three.js for the 3D layer. Recharts or Lightweight Charts for financial charts. TanStack Query for server state. Zustand for lightweight client state. Wallet Adapter for Solana wallet connection.
- Route structure: /, /discover, /markets, /asset/:symbol, /trade/:symbol, /portfolio, /paper, /strategies, /community, /alerts, /agent, /settings.
- Component domains: market, asset, intelligence, risk, execution, portfolio, social, strategy, agent, provenance, 3d.
- Design system tokens must be centralized so the visual language can be tuned rapidly during the hackathon.

## 22. Backend & Data Architecture

- Node.js + TypeScript backend with a modular service architecture. Recommended modules: asset-service, market-data-service, news-service, filing-service, social-service, sentiment-service, risk-service, portfolio-service, execution-service, alert-service, strategy-service, ai-orchestrator, provenance-service.
- PostgreSQL/Supabase is the system of record. Redis can be added for quotes, rate limits and short-lived jobs. A queue/worker layer handles ingestion, deduplication, enrichment and AI processing.
- Event-driven pipeline: provider ingestion → normalization → entity resolution → validation → enrichment → scoring → storage → API/WebSocket → UI.
- All provider adapters implement the same internal interface so providers can be swapped without changing the UI or risk engine.

## 23. Core Data Model

- users: id, profile, preferences, risk_policy.
- wallets: user_id, chain, address, label, verified_at.
- assets: id, symbol, name, underlying_symbol, issuer, chain, mint, token_standard, status.
- asset_deployments: asset_id, chain, mint/address, decimals, multiplier, verified_at.
- providers: id, name, tier, category, access_method, terms_status, reliability_score.
- market_quotes: asset_id, provider_id, bid, ask, last, volume, timestamp, freshness, confidence.
- historical_bars: asset_id/underlying_id, timeframe, OHLCV, source, timestamp.
- news_items: source, URL/ID, title, body_hash, published_at, retrieved_at, entities, sentiment, credibility.
- filings: company, CIK, form, accession, filed_at, period, extracted_metrics, URL.
- social_posts: platform, author, post_id, asset_id, text_hash, published_at, sentiment, source_class, credibility.
- risk_scores: asset_id, trade_id, model_version, factor_scores, total_score, confidence, evidence_refs, created_at.
- quotes/executions: venue, route, quote_id, amount, expected_output, slippage, price_impact, expiry, tx_signature, status.
- strategies, strategy_positions, followers, paper_trades, alerts, timeline_events, ai_runs, provenance_records.

## 24. API Surface

- GET /assets, /assets/:symbol, /assets/:symbol/market, /assets/:symbol/history
- GET /assets/:symbol/news, /filings, /social, /events, /risk, /provenance
- POST /ai/analyze, /ai/simulate, /ai/portfolio, /ai/strategy
- POST /trade/quote, /trade/simulate, /trade/execute
- GET /execution/venues/:symbol
- GET /portfolio, /portfolio/risk, /portfolio/scenarios
- GET/POST /strategies, /strategies/:id/follow, /strategies/:id/simulate
- GET/POST /alerts
- GET/POST /timeline/:assetId/posts
- GET /providers/status, /providers/:id/provenance
- WebSocket/SSE channels for prices, alerts, AI signals, execution status, and community updates.

## 25. Security, Safety & Trust

- Never store private keys. Transactions are signed by the user's wallet. Server-side signing is prohibited for the consumer app unless a future institutional custody product explicitly adds it.
- Use strict allowlists for executable asset mints and venue programs. Verify program IDs and token mints before constructing transactions.
- AI has no direct authority to bypass risk policy. The policy engine sits between AI recommendations and execution.
- Rate-limit social ingestion and user posting. Sanitize all user content.
- Protect API keys server-side; never expose provider secrets in the frontend.
- Log all live trade decisions: user request, data snapshot IDs, model version, risk score, mitigation, quote, user approval, wallet signature, transaction confirmation.
- Display financial-risk disclaimers and clearly distinguish information from personalized financial advice.

## 26. Non-Functional Requirements

- Performance: primary dashboard interactive as early as possible; lazy-load 3D and heavy charts.
- Reliability: graceful provider degradation; a single failed provider must not take down the asset page.
- Data freshness: live quote paths must display quote age and reject stale execution data.
- Observability: provider health, ingestion lag, AI latency, WebSocket health, quote failure rate, and transaction success rate.
- Accessibility: keyboard navigation, semantic labels, reduced-motion support, readable contrast.
- Responsive: desktop-first for hackathon judging, but functional mobile layout for core asset/risk/execute flows.
- Auditability: every score and AI answer can be traced to evidence and model version.

## 27. Hackathon Acceptance Criteria

- A judge can connect a Solana wallet, search an xStock, inspect verified asset metadata, see a multi-year market chart, read a source-backed AI brief, inspect a stock-specific community timeline, enter a trade size, see portfolio and execution risk, compare available execution paths, apply mitigation, sign a real or test transaction, and see the resulting position.
- A judge can ask the AI copilot a natural-language question and receive an answer containing evidence/source references and uncertainty.
- A judge can inspect the data provenance panel and understand which source produced each major data point.
- A judge can switch to paper trading and simulate a strategy without risking funds.
- A judge can view copy/strategy performance and see how MITIGATOR adjusts the recommended copy size to the user's portfolio risk.
- The application remains visually polished under the full feature set, with 3D used as an attention layer rather than a usability obstacle.

## 28. Seven-Day Delivery Plan

- Day 1 — Foundation: React/TS/Vite, design system, routes, wallet, database, asset registry, provider registry, xStocks ingestion, canonical entity mapping.
- Day 2 — Market & Asset Intelligence: live quotes, historical market-watch charts, asset detail, underlying-vs-token history, filings/news ingestion, source provenance UI.
- Day 3 — MITIGATOR Engine: risk factors, scoring model, evidence packets, AI research brief, counter-thesis, event risk, portfolio-aware order simulation.
- Day 4 — Execution: Jupiter routing, xChange integration path if access is available, venue comparison, quote freshness, slippage/price-impact calculator, wallet signing, transaction confirmation.
- Day 5 — Social & Portfolio: stock timelines, community posts, sentiment aggregation, portfolio dashboard, alerts, paper trading, trade journal.
- Day 6 — Advanced Intelligence: AI copilot, strategy marketplace, risk-aware copy trading, DCA/recurring buys, robo portfolios, autonomous policy console, scenario simulator.
- Day 7 — Killer Experience: 3D hero, motion polish, provenance explorer, error states, responsive pass, demo seed data, end-to-end QA, submission video, pitch deck, live demo rehearsal.

## 29. Demo Script

- Opening: “Buying a tokenized stock takes seconds. Knowing whether you should buy it—and how to buy it safely—is the hard part.”
- Search NVDAx. Show the 3D asset hero and MITIGATOR Score.
- Open Intelligence. Show recent news, a filing, social conversation, and upcoming event. Click a source to prove provenance.
- Ask: “Should I buy $2,000 of NVDAx?” AI explains the thesis, risk, and counter-thesis.
- Open trade simulator. Show portfolio concentration, event risk, liquidity, and estimated price impact.
- MITIGATOR recommends a smaller first order plus DCA. Click Apply Mitigation.
- Open execution comparison. Show Jupiter/xChange/other supported venues with quote age and expected output.
- Sign the transaction. Confirm on Solana. Show the updated portfolio and alert creation.
- Finish with the community timeline and ask the copilot: “What changed around NVDAx today?”
- Closing: “MITIGATOR doesn't tell you what to blindly buy. It tells you what you're buying, what can go wrong, how to mitigate it, and where to execute.”

## 30. Success Metrics

- Activation: wallet connection and first asset analysis.
- Research depth: percentage of asset sessions that open risk, provenance, or intelligence views.
- Trade readiness: percentage of simulated trades with a completed risk/mitigation review.
- Execution quality: quote-to-execution success rate, average price impact, average slippage vs benchmark.
- AI quality: grounded-answer rate, citation coverage, unsupported-claim rate, user feedback.
- Data quality: source freshness, provider uptime, conflict detection, duplicate-news rate.
- Community: posts per active asset, evidence-attached post ratio, engagement, moderation rate.
- Strategy: paper-copy adoption, risk-adjusted performance, drawdown, and strategy transparency.
- Hackathon: time-to-understand for a new judge, end-to-end demo completion rate, and visual/UX evaluation.

## 31. Risks & Mitigations

- Data licensing risk → use official APIs/licensed feeds, maintain provider terms registry, and isolate adapters.
- Social misinformation → source classes, credibility scoring, corroboration, conflict labels, and evidence links.
- AI hallucination → structured evidence packets, citations, schema validation, confidence thresholds, and no execution authority.
- Liquidity manipulation → independent reference price, pool-quality checks, abnormal-volume detection, minimum-liquidity policies.
- Token/corporate-action errors → canonical asset mapping and multiplier-aware accounting. Never assume raw Solana balance equals displayed economic balance for xStocks.
- Execution failure → quote expiry, transaction simulation where supported, retry/requote flow, and clear user status.
- Over-complexity → progressive disclosure: the judge sees a simple score first, then can drill into the underlying evidence.
- 3D performance → lazy loading, reduced-motion mode, 2D fallback, and strict GPU budgets.

## 32. Definition of Done

- MITIGATOR is “done” for the Stocklana submission when the complete primary journey works end-to-end on Solana; all major data claims have provenance; the AI can explain its reasoning with evidence; the risk engine can analyze a proposed trade; at least one real execution path can be demonstrated; paper trading works; social timeline and multi-year charts are functional; the portfolio updates after execution; and the 3D interface is polished enough to create immediate visual differentiation without sacrificing usability.

## 33. Primary Research Sources

- **xStocks Developer Documentation** — https://docs.xstocks.fi/developers — Canonical developer source for asset data, price data, multipliers, oracle information and xChange.
- **xStocks xChange Integration** — https://docs.xstocks.fi/developers/xchange-atomic-rfq — Atomic RFQ availability and Solana execution flow.
- **xStocks Multipliers** — https://docs.xstocks.fi/developers/multipliers — Corporate-action multiplier mechanics.
- **xStocks Product / How It Works** — https://docs.xstocks.fi/docs/how-xstocks-work — Tokenized equity structure and primary/secondary market model.
- **Pyth Price Feeds** — https://docs.pyth.network/price-feeds — Independent price-feed architecture and provider coverage.
- **Solana** — https://solana.com/ — Solana capital-markets and network context.
- **Jupiter Developers** — https://dev.jup.ag/ — Solana routing/swap developer documentation.
- **Raydium Docs** — https://docs.raydium.io/ — Solana liquidity, SDK and API documentation.
- **Orca Whirlpools SDK** — https://dev.orca.so/developers/sdks/overview — Solana concentrated-liquidity SDK documentation.
- **SEC EDGAR APIs** — https://www.sec.gov/search-filings/edgar-application-programming-interfaces — Primary regulatory filing and XBRL APIs.
- **FRED** — https://fred.stlouisfed.org/ — Official macroeconomic data.
- **Alpha Vantage API** — https://www.alphavantage.co/documentation/ — Historical market data, fundamentals and market-intelligence API options.
- **Finnhub** — https://finnhub.io/ — Market, fundamentals and alternative-data API options.
- **NewsAPI** — https://newsapi.org/ — Broad structured news search API.
- **GDELT** — https://www.gdeltproject.org/ — Large-scale global news/event dataset and analysis tools.
- **X Developer Platform** — https://docs.x.com/overview — Official X data/API access.