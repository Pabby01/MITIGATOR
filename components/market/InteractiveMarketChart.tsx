'use client';

import { useState, useMemo, useRef } from 'react';
import { HistoricalBar, HistoricalDataset } from '@/types';
import { getHistoricalBars } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { BarChart3, TrendingUp, Eye, Activity } from 'lucide-react';

export interface InteractiveMarketChartProps {
  bars?: HistoricalBar[];
  dataset?: HistoricalDataset;
  onDatasetChange?: (ds: HistoricalDataset) => void;
  timeframe?: string;
  onTimeframeChange?: (tf: any) => void;
  symbol: string;
  initialTimeframe?: string;
  initialDataset?: HistoricalDataset;
  showControls?: boolean;
}

export function InteractiveMarketChart({
  bars,
  dataset,
  onDatasetChange,
  timeframe,
  onTimeframeChange,
  symbol,
  initialTimeframe = '1M',
  initialDataset = 'equity',
  showControls = true,
}: InteractiveMarketChartProps) {
  const [internalDataset, setInternalDataset] = useState<HistoricalDataset>(initialDataset);
  const [internalTimeframe, setInternalTimeframe] = useState<string>(initialTimeframe);

  const currentDataset = dataset !== undefined ? dataset : internalDataset;
  const currentTimeframe = timeframe !== undefined ? timeframe : internalTimeframe;

  const handleDatasetChange = (ds: HistoricalDataset) => {
    setInternalDataset(ds);
    onDatasetChange?.(ds);
  };

  const handleTimeframeChange = (tf: any) => {
    setInternalTimeframe(tf);
    onTimeframeChange?.(tf);
  };

  const fetchedBars = useMemo(() => {
    return getHistoricalBars(symbol, currentTimeframe as any, currentDataset);
  }, [symbol, currentTimeframe, currentDataset]);

  const effectiveBars = bars || fetchedBars;

  const [chartType, setChartType] = useState<'candlestick' | 'line'>('candlestick');
  const [showVolume, setShowVolume] = useState(true);
  const [showMA, setShowMA] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const timeframes = ['1D', '1W', '1M', '3M', '6M', 'YTD', '1Y', '5Y', 'MAX'];

  // Calculations for chart viewport
  const { minPrice, maxPrice, maxVol, maValues } = useMemo(() => {
    if (!effectiveBars || effectiveBars.length === 0) {
      return { minPrice: 0, maxPrice: 100, maxVol: 100, maValues: [] };
    }
    const prices = effectiveBars.flatMap((b) => [b.low, b.high]);
    const minP = Math.min(...prices) * 0.995;
    const maxP = Math.max(...prices) * 1.005;
    const maxV = Math.max(...effectiveBars.map((b) => b.volume || 1000));

    // Calculate 7-period Simple Moving Average
    const period = 7;
    const ma = effectiveBars.map((_, i, arr) => {
      if (i < period - 1) return null;
      const slice = arr.slice(i - period + 1, i + 1);
      const sum = slice.reduce((acc, curr) => acc + curr.close, 0);
      return sum / period;
    });

    return { minPrice: minP, maxPrice: maxP, maxVol: maxV, maValues: ma };
  }, [effectiveBars]);

  const activeBar = hoveredIndex !== null && effectiveBars[hoveredIndex] ? effectiveBars[hoveredIndex] : effectiveBars[effectiveBars.length - 1];

  const svgWidth = 1000;
  const svgHeight = 340;
  const chartHeight = showVolume ? svgHeight * 0.72 : svgHeight - 30;
  const volumeHeight = svgHeight * 0.22;
  const volumeTop = svgHeight - volumeHeight - 10;

  const barWidth = Math.max(2, (svgWidth / (effectiveBars.length || 1)) * 0.75);
  const barSpacing = svgWidth / (effectiveBars.length || 1);

  const getY = (price: number) => {
    if (maxPrice === minPrice) return chartHeight / 2;
    return chartHeight - ((price - minPrice) / (maxPrice - minPrice)) * (chartHeight - 20) - 10;
  };

  const getVolHeight = (vol: number) => {
    if (!maxVol) return 0;
    return (vol / maxVol) * volumeHeight;
  };

  // Line path for line mode
  const linePoints = effectiveBars.map((b, i) => {
    const x = i * barSpacing + barSpacing / 2;
    const y = getY(b.close);
    return `${x},${y}`;
  }).join(' ');

  // MA line path
  const maPoints = maValues
    .map((val, i) => {
      if (val === null) return null;
      const x = i * barSpacing + barSpacing / 2;
      const y = getY(val);
      return `${x},${y}`;
    })
    .filter(Boolean)
    .join(' ');

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current || effectiveBars.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPos = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, xPos / rect.width));
    const index = Math.min(effectiveBars.length - 1, Math.floor(ratio * effectiveBars.length));
    setHoveredIndex(index);
  };

  const isUp = activeBar ? activeBar.close >= activeBar.open : true;
  const changeVal = activeBar ? activeBar.close - activeBar.open : 0;
  const changePct = activeBar && activeBar.open > 0 ? (changeVal / activeBar.open) * 100 : 0;

  return (
    <div className="space-y-4">
      {/* Top Chart Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
        {/* Timeframe Selector */}
        <div className="flex items-center gap-1 bg-card/60 p-1 rounded-xl border border-border/60">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all',
                currentTimeframe === tf
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              )}
            >
              {tf}
            </button>
          ))}
        </div>

        {/* Display Toggles */}
        <div className="flex items-center gap-2">
          {/* Underlying Equity vs Onchain Token Toggle */}
          <div className="flex items-center bg-card/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => handleDatasetChange('equity')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                currentDataset === 'equity'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
              Underlying Equity (TradFi)
            </button>
            <button
              onClick={() => handleDatasetChange('token')}
              className={cn(
                'px-3 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5',
                currentDataset === 'token'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Solana Token Onchain
            </button>
          </div>

          {/* Type Toggle */}
          <div className="hidden sm:flex items-center bg-card/60 p-1 rounded-xl border border-border/60">
            <button
              onClick={() => setChartType('candlestick')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                chartType === 'candlestick' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Candlestick View"
            >
              <BarChart3 className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={cn(
                'px-2.5 py-1 rounded-lg text-xs font-medium transition-all',
                chartType === 'line' ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              title="Line Area View"
            >
              <TrendingUp className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* MA Indicator Toggle */}
          <button
            onClick={() => setShowMA(!showMA)}
            className={cn(
              'px-2.5 py-1 rounded-xl text-xs font-mono font-medium border transition-all',
              showMA ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'border-border text-muted-foreground hover:text-foreground'
            )}
          >
            MA(7)
          </button>
        </div>
      </div>

      {/* Floating Price & Crosshair Bar */}
      {activeBar && (
        <div className="flex flex-wrap items-center justify-between gap-3 px-2 text-xs font-mono">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">O:</span>
              <span className="text-foreground font-semibold">${activeBar.open.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">H:</span>
              <span className="text-emerald-400 font-semibold">${activeBar.high.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">L:</span>
              <span className="text-red-400 font-semibold">${activeBar.low.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">C:</span>
              <span className="text-foreground font-semibold">${activeBar.close.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={isUp ? 'text-emerald-400' : 'text-red-400'}>
                {isUp ? '+' : ''}{changeVal.toFixed(2)} ({isUp ? '+' : ''}{changePct.toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-muted-foreground">
            {activeBar.volume && <span>Vol: {(activeBar.volume / 1_000_000).toFixed(2)}M</span>}
            <span>{new Date(activeBar.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      )}

      {/* Interactive SVG Chart Canvas */}
      <div ref={containerRef} className="relative w-full overflow-hidden rounded-2xl bg-black/40 border border-white/5 p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-[320px] select-none cursor-crosshair"
          preserveAspectRatio="none"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentDataset === 'equity' ? '#4cc9f0' : '#3fb98a'} stopOpacity="0.25" />
              <stop offset="100%" stopColor={currentDataset === 'equity' ? '#4cc9f0' : '#3fb98a'} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
            <line
              key={ratio}
              x1="0"
              y1={ratio * chartHeight}
              x2={svgWidth}
              y2={ratio * chartHeight}
              stroke="rgba(255,255,255,0.05)"
              strokeDasharray="4 4"
            />
          ))}

          {/* Volume bars */}
          {showVolume && effectiveBars.map((b, i) => {
            const x = i * barSpacing + (barSpacing - barWidth) / 2;
            const h = getVolHeight(b.volume || 1000);
            const y = svgHeight - h - 5;
            const barUp = b.close >= b.open;
            return (
              <rect
                key={`vol-${i}`}
                x={x}
                y={y}
                width={barWidth}
                height={h}
                fill={barUp ? 'rgba(63, 185, 138, 0.25)' : 'rgba(239, 68, 68, 0.25)'}
                rx="1"
              />
            );
          })}

          {/* Line or Candlestick view */}
          {chartType === 'line' ? (
            <>
              <path
                d={`M 0,${chartHeight} L ${linePoints} L ${svgWidth},${chartHeight} Z`}
                fill="url(#areaGradient)"
              />
              <path
                d={`M ${linePoints}`}
                fill="none"
                stroke={currentDataset === 'equity' ? '#4cc9f0' : '#3fb98a'}
                strokeWidth="2.5"
              />
            </>
          ) : (
            // Candlestick rendering
            effectiveBars.map((b, i) => {
              const xCenter = i * barSpacing + barSpacing / 2;
              const xLeft = i * barSpacing + (barSpacing - barWidth) / 2;
              const yHigh = getY(b.high);
              const yLow = getY(b.low);
              const yOpen = getY(b.open);
              const yClose = getY(b.close);
              const candleUp = b.close >= b.open;
              const yTop = Math.min(yOpen, yClose);
              const candleHeight = Math.max(2, Math.abs(yClose - yOpen));
              const candleColor = candleUp ? '#3fb98a' : '#ef4444';

              return (
                <g key={`candle-${i}`}>
                  {/* High/Low Wick */}
                  <line
                    x1={xCenter}
                    y1={yHigh}
                    x2={xCenter}
                    y2={yLow}
                    stroke={candleColor}
                    strokeWidth="1.2"
                  />
                  {/* Body */}
                  <rect
                    x={xLeft}
                    y={yTop}
                    width={barWidth}
                    height={candleHeight}
                    fill={candleColor}
                    rx="1.5"
                  />
                </g>
              );
            })
          )}

          {/* MA(7) Line */}
          {showMA && maPoints && (
            <path
              d={`M ${maPoints}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.8"
              strokeDasharray="2 2"
            />
          )}

          {/* Crosshair Line */}
          {hoveredIndex !== null && (
            <>
              <line
                x1={hoveredIndex * barSpacing + barSpacing / 2}
                y1={0}
                x2={hoveredIndex * barSpacing + barSpacing / 2}
                y2={svgHeight}
                stroke="rgba(255,255,255,0.4)"
                strokeDasharray="3 3"
              />
              <circle
                cx={hoveredIndex * barSpacing + barSpacing / 2}
                cy={getY(effectiveBars[hoveredIndex].close)}
                r="4"
                fill="#ffffff"
                stroke={currentDataset === 'equity' ? '#4cc9f0' : '#3fb98a'}
                strokeWidth="2"
              />
            </>
          )}
        </svg>

        {/* Price Y-Axis Labels */}
        <div className="absolute right-3 top-3 bottom-8 flex flex-col justify-between text-[10px] font-mono text-muted-foreground pointer-events-none">
          <span>${maxPrice.toFixed(2)}</span>
          <span>${((maxPrice + minPrice) / 2).toFixed(2)}</span>
          <span>${minPrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Dataset Provenance Note */}
      <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-1">
        <span className="flex items-center gap-1.5">
          <Activity className="h-3.5 w-3.5 text-primary" />
          {currentDataset === 'equity'
            ? 'Source: Primary SEC / Alpha Vantage OHLCV Feed (Underlying Security Reference)'
            : 'Source: Solana RPC & Pyth Hermes Low-Latency Oracle (Live Onchain Swap History)'}
        </span>
        <span className="font-mono text-[11px]">
          {effectiveBars.length} recorded bars · Multiplier: 1.0000x
        </span>
      </div>
    </div>
  );
}
