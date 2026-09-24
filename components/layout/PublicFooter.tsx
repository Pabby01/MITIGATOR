import Link from 'next/link';
import { BrandLogo } from '@/components/shared/BrandLogo';
import { ArrowRight, ShieldCheck, ExternalLink, Zap } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="border-t border-border/40 bg-card/25 backdrop-blur-md pt-14 pb-10 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo size={28} glow />
              <span className="text-base font-bold tracking-tight text-foreground">MITIGATOR</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 border border-primary/25 text-primary">
                Stocklana 2026
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              Solana-native intelligence, 8-factor risk analysis, automated mitigation guardrails, and execution routing for tokenized equities. Know the risk before you trade.
            </p>
            <div className="flex items-center gap-3 pt-1">
              <Link
                href="/discover"
                className="inline-flex items-center gap-2 rounded-xl bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold hover:opacity-90 transition-all cursor-pointer"
              >
                <span>Launch App</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/risk-engine"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card/40 px-3.5 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                <span>Risk Methodology</span>
              </Link>
            </div>
          </div>

          {/* Solutions Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Solutions</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/markets" className="hover:text-foreground transition-colors">
                  Tokenized Markets
                </Link>
              </li>
              <li>
                <Link href="/intelligence-platform" className="hover:text-foreground transition-colors">
                  SEC EDGAR Intelligence
                </Link>
              </li>
              <li>
                <Link href="/risk-engine" className="hover:text-foreground transition-colors">
                  8-Factor Risk Engine
                </Link>
              </li>
              <li>
                <Link href="/smart-execution" className="hover:text-foreground transition-colors">
                  Smart Order Routing
                </Link>
              </li>
              <li>
                <Link href="/portfolio-analytics" className="hover:text-foreground transition-colors">
                  Portfolio Analytics
                </Link>
              </li>
              <li>
                <Link href="/data-provenance" className="hover:text-foreground transition-colors">
                  Data Provenance
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology Stack */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Technology</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span>Pyth Hermes Oracle</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span>Jupiter v6 Aggregation</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span>Raydium &amp; Meteora DLMM</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span>Solana Token-2022</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span>SEC EDGAR XBRL Feed</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-1 w-1 rounded-full bg-emerald-400" />
                <span>Autonomous AI Swarm</span>
              </li>
            </ul>
          </div>

          {/* Institutional Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Governance &amp; Trust</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link href="/data-provenance" className="hover:text-foreground transition-colors">
                  7-Tier Verification Model
                </Link>
              </li>
              <li>
                <Link href="/risk-engine" className="hover:text-foreground transition-colors">
                  Divergence &amp; Staleness Caps
                </Link>
              </li>
              <li>
                <Link href="/smart-execution" className="hover:text-foreground transition-colors">
                  DCA Staging Logic
                </Link>
              </li>
              <li>
                <Link href="/markets" className="hover:text-foreground transition-colors">
                  Canonical Issuer Directory
                </Link>
              </li>
              <li>
                <span className="text-emerald-400 font-mono text-[11px]">Non-Custodial Architecture</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p className="text-center md:text-left">
            © 2026 MITIGATOR. Built for Stocklana Hackathon. Non-custodial protocol. Not financial advice.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 sm:gap-6">
            <Link href="/markets" className="hover:text-foreground transition-colors">
              Markets
            </Link>
            <Link href="/risk-engine" className="hover:text-foreground transition-colors">
              Risk Engine
            </Link>
            <Link href="/data-provenance" className="hover:text-foreground transition-colors">
              Provenance
            </Link>
            <Link href="/discover" className="text-primary font-semibold hover:underline flex items-center gap-1">
              <span>Launch App</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
