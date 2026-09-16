import React from 'react';
import { cn } from '@/lib/utils';

/**
 * Official logos directly from the official company websites:
 * - Phantom: https://phantom.com
 * - Solflare: https://solflare.com (2024/2025 official rebrand)
 * - Backpack: https://backpack.exchange
 */

export function PhantomLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <img
      src="/wallets/phantom.png"
      alt="Phantom official logo"
      className={cn('object-contain rounded-xl flex-shrink-0', className)}
      loading="eager"
    />
  );
}

export function SolflareLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <img
      src="/wallets/solflare.svg"
      alt="Solflare official logo"
      className={cn('object-contain rounded-xl flex-shrink-0', className)}
      loading="eager"
    />
  );
}

export function BackpackLogo({ className = 'h-7 w-7' }: { className?: string }) {
  return (
    <img
      src="/wallets/backpack.png"
      alt="Backpack official logo"
      className={cn('object-contain rounded-xl flex-shrink-0', className)}
      loading="eager"
    />
  );
}
