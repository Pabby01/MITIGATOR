'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Loader2,
  ExternalLink,
  Building2,
  Scale,
} from 'lucide-react';
import { GlassPanel } from '@/components/shared/GlassPanel';
import { BackpackMintRedeemRequest } from '@/lib/services/backpack-securities-service';
import { cn } from '@/lib/utils';

interface BackpackMintRedeemModalProps {
  isOpen: boolean;
  onClose: () => void;
  userAddress: string;
}

export function BackpackMintRedeemModal({
  isOpen,
  onClose,
  userAddress,
}: BackpackMintRedeemModalProps) {
  const [tab, setTab] = useState<'mint' | 'redeem'>('mint');
  const [symbol, setSymbol] = useState('NVDAx');
  const [quantity, setQuantity] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [history, setHistory] = useState<BackpackMintRedeemRequest[]>([]);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const priceMap: Record<string, number> = {
    NVDAx: 124.8,
    AAPLx: 226.5,
    TSLAx: 218.4,
    MSFTx: 442.1,
    GOOGLx: 176.3,
  };

  const currentPrice = priceMap[symbol] || 120.0;
  const estimatedUsd = Number((quantity * currentPrice).toFixed(2));

  const loadHistory = () => {
    fetch(`/api/backpack?action=history&userAddress=${userAddress}`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.history) setHistory(data.history);
      })
      .catch((e) => console.warn('Failed to load history:', e));
  };

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen, userAddress]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (quantity <= 0) return;

    setIsSubmitting(true);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/backpack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: tab,
          userAddress,
          symbol,
          quantity,
          cashAmountUsd: estimatedUsd,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.request) {
          setHistory((prev) => [data.request, ...prev]);
          setSuccessMsg(
            tab === 'mint'
              ? `Successfully minted ${quantity} ${symbol} via Backpack Brokerage Custody!`
              : `Successfully redeemed ${quantity} ${symbol} for $${estimatedUsd.toLocaleString()} USDC!`
          );
        }
      }
    } catch (err) {
      console.error('Backpack mint/redeem failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-background/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-xl max-h-[90dvh] flex flex-col rounded-2xl hairline-card bg-card shadow-2xl border border-border overflow-hidden my-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/80 bg-card/60">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <Building2 className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-foreground">Backpack Primary Securities Gateway</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  1:1 CUSTODY
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                Direct primary issuance &amp; cash redemption backed by Backpack Financial LLC
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
          {/* Action Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-muted/40 border border-border">
            <button
              type="button"
              onClick={() => {
                setTab('mint');
                setSuccessMsg(null);
              }}
              className={cn(
                'py-2 text-xs font-semibold rounded-lg transition-all',
                tab === 'mint'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Primary Mint (Deposit USDC)
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('redeem');
                setSuccessMsg(null);
              }}
              className={cn(
                'py-2 text-xs font-semibold rounded-lg transition-all',
                tab === 'redeem'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Primary Redeem (Withdraw USDC)
            </button>
          </div>

          {/* Success Banner */}
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Target Security</label>
                <select
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full rounded-xl bg-background/60 border border-border px-3 py-2 text-xs sm:text-sm font-medium text-foreground outline-none focus:border-primary"
                >
                  <option value="NVDAx">NVDAx — NVIDIA Corp</option>
                  <option value="AAPLx">AAPLx — Apple Inc</option>
                  <option value="TSLAx">TSLAx — Tesla Inc</option>
                  <option value="MSFTx">MSFTx — Microsoft Corp</option>
                  <option value="GOOGLx">GOOGLx — Alphabet Inc</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-foreground block mb-1">Share Quantity</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  max="1000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(0.1, Number(e.target.value)))}
                  className="w-full rounded-xl bg-background/60 border border-border px-3 py-2 text-xs sm:text-sm font-mono font-medium text-foreground outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Custody Breakdown Box */}
            <div className="rounded-xl border border-border/80 bg-card/40 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Scale className="h-3.5 w-3.5 text-primary" /> Mark Price:
                </span>
                <span className="font-mono font-bold text-foreground">${currentPrice.toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>{tab === 'mint' ? 'Estimated USDC Capital:' : 'Estimated Settlement USDC:'}</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  ${estimatedUsd.toLocaleString()} USDC
                </span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground pt-1 border-t border-border/60">
                <span>Licensed Broker-Dealer Custodian:</span>
                <span className="font-medium text-foreground">Backpack Financial / State Street</span>
              </div>
              <div className="flex items-center justify-between text-muted-foreground">
                <span>Underlying Collateral Backing:</span>
                <span className="text-emerald-400 font-medium">1.0000 : 1.0000 Audited Share Trust</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Submitting to Backpack Securities Gateway...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>
                    {tab === 'mint'
                      ? `Confirm Primary Mint of ${quantity} ${symbol}`
                      : `Confirm Primary Redemption of ${quantity} ${symbol}`}
                  </span>
                </>
              )}
            </button>
          </form>

          {/* History */}
          <div className="space-y-2.5 pt-2 border-t border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Primary Issuance &amp; Redemption History ({history.length})
            </h4>

            {history.length === 0 ? (
              <div className="p-4 text-center text-xs text-muted-foreground font-mono border border-dashed border-border rounded-xl">
                No primary mints or redemptions yet.
              </div>
            ) : (
              <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
                {history.map((req) => (
                  <div
                    key={req.id}
                    className="p-3 rounded-xl border border-border/60 bg-card/40 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'text-[10px] uppercase font-bold font-mono px-1.5 py-0.5 rounded',
                            req.type === 'mint'
                              ? 'bg-primary/10 text-primary border border-primary/20'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          )}
                        >
                          {req.type}
                        </span>
                        <span className="font-bold text-foreground">{req.symbol}</span>
                        <span className="text-muted-foreground font-mono">{req.quantity} Shares</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                        {new Date(req.timestamp).toLocaleString()} · {req.custodian}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-foreground">
                        ${req.cashAmountUsd?.toLocaleString()} USDC
                      </span>
                      <span className="block text-[10px] text-emerald-400 font-mono font-semibold">
                        Settled 1:1
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
