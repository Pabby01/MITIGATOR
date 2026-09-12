'use client';

import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { ExternalLink, Radio, TrendingUp, Layers, Maximize2 } from 'lucide-react';

interface TradingViewChartProps {
  symbol?: string;
  className?: string;
  height?: number | string;
  showDexScreenerToggle?: boolean;
}

const SYMBOL_MAP: Record<string, { tv: string; name: string; dexPair?: string }> = {
  NVDA: { tv: 'NASDAQ:NVDA', name: 'NVIDIA Corporation' },
  NVDAx: { tv: 'NASDAQ:NVDA', name: 'NVIDIA Corporation' },
  AAPL: { tv: 'NASDAQ:AAPL', name: 'Apple Inc.' },
  AAPLx: { tv: 'NASDAQ:AAPL', name: 'Apple Inc.' },
  TSLA: { tv: 'NASDAQ:TSLA', name: 'Tesla, Inc.' },
  TSLAx: { tv: 'NASDAQ:TSLA', name: 'Tesla, Inc.' },
  MSFT: { tv: 'NASDAQ:MSFT', name: 'Microsoft Corporation' },
  MSFTx: { tv: 'NASDAQ:MSFT', name: 'Microsoft Corporation' },
  AMZN: { tv: 'NASDAQ:AMZN', name: 'Amazon.com, Inc.' },
  AMZNx: { tv: 'NASDAQ:AMZN', name: 'Amazon.com, Inc.' },
  GOOGL: { tv: 'NASDAQ:GOOGL', name: 'Alphabet Inc.' },
  GOOGLx: { tv: 'NASDAQ:GOOGL', name: 'Alphabet Inc.' },
  META: { tv: 'NASDAQ:META', name: 'Meta Platforms, Inc.' },
  METAx: { tv: 'NASDAQ:META', name: 'Meta Platforms, Inc.' },
  COIN: { tv: 'NASDAQ:COIN', name: 'Coinbase Global, Inc.' },
  COINx: { tv: 'NASDAQ:COIN', name: 'Coinbase Global, Inc.' },
  SPY: { tv: 'AMEX:SPY', name: 'SPDR S&P 500 ETF Trust' },
  SPYx: { tv: 'AMEX:SPY', name: 'SPDR S&P 500 ETF Trust' },
  SOL: { tv: 'COINBASE:SOLUSD', name: 'Solana / USD' },
};

export function TradingViewChart({
  symbol = 'NVDAx',
  className = '',
  height = 520,
  showDexScreenerToggle = true,
}: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFeed, setActiveFeed] = useState<'tradingview' | 'dexscreener'>('tradingview');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const cleanSymbol = symbol.replace(/x$/, '');
  const config = SYMBOL_MAP[symbol] || SYMBOL_MAP[cleanSymbol] || {
    tv: `NASDAQ:${cleanSymbol.toUpperCase()}`,
    name: symbol,
  };

  const tvSymbol = config.tv;

  useEffect(() => {
    if (activeFeed !== 'tradingview') return;

    const container = containerRef.current;
    if (!container) return;

    // Clear previous widget
    container.innerHTML = '';

    // Create TradingView widget script element
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: tvSymbol,
      interval: 'D',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1', // Candlestick
      locale: 'en',
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: 'https://www.tradingview.com',
      backgroundColor: 'rgba(9, 13, 20, 1)',
      gridColor: 'rgba(255, 255, 255, 0.04)',
      hide_side_toolbar: false,
      hide_top_toolbar: false,
      studies: [
        'STD;SMA',
        'STD;RSI',
        'STD;Volume',
      ],
      toolbar_bg: '#0c1017',
    });

    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'tradingview-widget-container__widget';
    widgetContainer.style.height = '100%';
    widgetContainer.style.width = '100%';

    container.appendChild(widgetContainer);
    container.appendChild(script);

    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [tvSymbol, activeFeed]);

  return (
    <div
      className={cn(
        'relative rounded-2xl border border-border/80 bg-[#090d14] overflow-hidden flex flex-col',
        isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : '',
        className
      )}
      style={{ height: isFullscreen ? 'calc(100vh - 32px)' : height }}
    >
      {/* Chart Toolbar Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/70 bg-[#0c1017]/90 backdrop-blur z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm text-foreground flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {tvSymbol}
            </span>
            <span className="text-xs text-muted-foreground hidden sm:inline">
              ({config.name})
            </span>
          </div>

          {showDexScreenerToggle && (
            <div className="flex items-center bg-muted/40 p-0.5 rounded-lg border border-border/60 text-xs">
              <button
                onClick={() => setActiveFeed('tradingview')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5',
                  activeFeed === 'tradingview'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <TrendingUp className="h-3 w-3" />
                Live TradingView
              </button>
              <button
                onClick={() => setActiveFeed('dexscreener')}
                className={cn(
                  'px-2.5 py-1 rounded-md font-medium transition-colors flex items-center gap-1.5',
                  activeFeed === 'dexscreener'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Layers className="h-3 w-3" />
                Solana DEX Pool
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded flex items-center gap-1">
            <Radio className="h-2.5 w-2.5 animate-pulse" /> Real-time Feed
          </span>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
          <a
            href={`https://www.tradingview.com/symbols/${encodeURIComponent(tvSymbol)}/`}
            target="_blank"
            rel="noopener noreferrer"
            title="Open on TradingView"
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Chart Body */}
      <div className="flex-1 w-full relative bg-[#090d14] min-h-[300px]">
        {activeFeed === 'tradingview' ? (
          <div
            ref={containerRef}
            className="tradingview-widget-container h-full w-full"
            style={{ minHeight: '300px' }}
          >
            <div className="tradingview-widget-container__widget h-full w-full" />
          </div>
        ) : (
          <div className="h-full w-full flex flex-col">
            <iframe
              src={`https://dexscreener.com/solana/58o15u4n7CQ3Crxyh19p84L28wN157K9Xn21XoXmQW9v?embed=1&theme=dark&trades=0&info=0`}
              title="Solana DEX Pair Stream"
              className="w-full flex-1 border-0"
              style={{ minHeight: '400px' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
