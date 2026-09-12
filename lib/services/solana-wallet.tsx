'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type WalletProviderType = 'phantom' | 'solflare' | 'backpack' | 'demo';

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  shortAddress: string;
  walletType: WalletProviderType | null;
  balanceSol: number;
  balanceUsdc: number;
  isInstalled: (type: WalletProviderType) => boolean;
  connect: (type: WalletProviderType) => Promise<boolean>;
  disconnect: () => void;
  error: string | null;
}

const DEMO_ADDRESS = '7xKf8m2P9qL1wNeR8VbYzXm4DcFgH6Jk3pQw';

const SolanaWalletContext = createContext<WalletState>({
  connected: false,
  connecting: false,
  address: null,
  shortAddress: '',
  walletType: null,
  balanceSol: 0,
  balanceUsdc: 0,
  isInstalled: () => false,
  connect: async () => false,
  disconnect: () => {},
  error: null,
});

export function formatShortAddress(addr: string | null): string {
  if (!addr) return '';
  if (addr.length <= 8) return addr;
  return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
}

/**
 * Direct Solana JSON-RPC balance query
 */
export async function fetchLiveSolBalance(pubkey: string): Promise<number> {
  try {
    const rpcUrl = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
    const res = await fetch(rpcUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [pubkey],
      }),
      cache: 'no-store',
    });
    if (!res.ok) return 0;
    const data = await res.json();
    if (data?.result?.value !== undefined) {
      return data.result.value / 1e9; // lamports to SOL
    }
    return 0;
  } catch (err) {
    console.warn('[SolanaRPC] fetchLiveSolBalance error:', err);
    return 0;
  }
}

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState<boolean>(true); // default to demo connected for seamless UX
  const [connecting, setConnecting] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(DEMO_ADDRESS);
  const [walletType, setWalletType] = useState<WalletProviderType | null>('demo');
  const [balanceSol, setBalanceSol] = useState<number>(54.2);
  const [balanceUsdc, setBalanceUsdc] = useState<number>(10450.0);
  const [error, setError] = useState<string | null>(null);

  // Detect installed extensions safely
  const isInstalled = useCallback((type: WalletProviderType): boolean => {
    if (typeof window === 'undefined') return false;
    if (type === 'demo') return true;

    const win = window as any;
    if (type === 'phantom') {
      return !!(win.phantom?.solana?.isPhantom || win.solana?.isPhantom);
    }
    if (type === 'solflare') {
      return !!win.solflare?.isSolflare;
    }
    if (type === 'backpack') {
      return !!win.backpack?.isBackpack;
    }
    return false;
  }, []);

  // Update balance when address changes
  const updateBalance = useCallback(async (pubkey: string, type: WalletProviderType) => {
    if (type === 'demo') {
      setBalanceSol(54.2);
      setBalanceUsdc(10450.0);
      return;
    }

    try {
      const sol = await fetchLiveSolBalance(pubkey);
      setBalanceSol(sol);
      // For demo display purposes, compute an estimated USDC reserve if 0
      setBalanceUsdc(sol > 0 ? Number((sol * 192.4).toFixed(2)) : 0);
    } catch {
      // fallback
      setBalanceSol(0);
      setBalanceUsdc(0);
    }
  }, []);

  const connect = useCallback(async (type: WalletProviderType): Promise<boolean> => {
    setConnecting(true);
    setError(null);

    if (type === 'demo') {
      setConnected(true);
      setAddress(DEMO_ADDRESS);
      setWalletType('demo');
      setBalanceSol(54.2);
      setBalanceUsdc(10450.0);
      setConnecting(false);
      return true;
    }

    const win = window as any;

    try {
      let provider: any = null;

      if (type === 'phantom') {
        provider = win.phantom?.solana || win.solana;
        if (!provider || !provider.isPhantom) {
          window.open('https://phantom.app/', '_blank');
          throw new Error('Phantom wallet is not installed. Redirecting to Phantom download...');
        }
      } else if (type === 'solflare') {
        provider = win.solflare;
        if (!provider || !provider.isSolflare) {
          window.open('https://solflare.com/', '_blank');
          throw new Error('Solflare wallet is not installed. Redirecting to Solflare download...');
        }
      } else if (type === 'backpack') {
        provider = win.backpack;
        if (!provider) {
          window.open('https://backpack.app/', '_blank');
          throw new Error('Backpack wallet is not installed. Redirecting to Backpack download...');
        }
      }

      const response = await provider.connect();
      const pubkey = (response?.publicKey || provider.publicKey)?.toString();

      if (!pubkey) {
        throw new Error('Could not retrieve public key from wallet');
      }

      setConnected(true);
      setAddress(pubkey);
      setWalletType(type);
      await updateBalance(pubkey, type);
      setConnecting(false);

      // Listen to disconnect or account changes
      provider.on?.('disconnect', () => {
        disconnect();
      });
      provider.on?.('accountChanged', (newPubkey: any) => {
        if (newPubkey) {
          const pk = newPubkey.toString();
          setAddress(pk);
          updateBalance(pk, type);
        } else {
          disconnect();
        }
      });

      return true;
    } catch (err: any) {
      console.error('[SolanaWallet] Connection failed:', err);
      setError(err?.message || 'Failed to connect wallet');
      setConnecting(false);
      return false;
    }
  }, [updateBalance]);

  const disconnect = useCallback(() => {
    if (typeof window !== 'undefined' && walletType && walletType !== 'demo') {
      const win = window as any;
      try {
        if (walletType === 'phantom') (win.phantom?.solana || win.solana)?.disconnect?.();
        if (walletType === 'solflare') win.solflare?.disconnect?.();
        if (walletType === 'backpack') win.backpack?.disconnect?.();
      } catch (err) {
        console.warn('Disconnect error:', err);
      }
    }
    setConnected(false);
    setAddress(null);
    setWalletType(null);
    setBalanceSol(0);
    setBalanceUsdc(0);
    setError(null);
  }, [walletType]);

  const shortAddress = formatShortAddress(address);

  return (
    <SolanaWalletContext.Provider
      value={{
        connected,
        connecting,
        address,
        shortAddress,
        walletType,
        balanceSol,
        balanceUsdc,
        isInstalled,
        connect,
        disconnect,
        error,
      }}
    >
      {children}
    </SolanaWalletContext.Provider>
  );
}

export function useSolanaWallet() {
  return useContext(SolanaWalletContext);
}
