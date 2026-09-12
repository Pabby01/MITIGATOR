'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type WalletProviderType = 'phantom' | 'solflare' | 'backpack';

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  shortAddress: string;
  walletType: WalletProviderType | null;
  balanceSol: number;
  balanceUsdc: number;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  isInstalled: (type: WalletProviderType) => boolean;
  connect: (type: WalletProviderType) => Promise<boolean>;
  disconnect: () => void;
  error: string | null;
  refreshBalance: () => Promise<void>;
}

const SolanaWalletContext = createContext<WalletState>({
  connected: false,
  connecting: false,
  address: null,
  shortAddress: '',
  walletType: null,
  balanceSol: 0,
  balanceUsdc: 0,
  isModalOpen: false,
  setIsModalOpen: () => {},
  isInstalled: () => false,
  connect: async () => false,
  disconnect: () => {},
  error: null,
  refreshBalance: async () => {},
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
      return data.result.value / 1e9; // convert lamports to SOL
    }
    return 0;
  } catch (err) {
    console.warn('[SolanaRPC] fetchLiveSolBalance error:', err);
    return 0;
  }
}

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [address, setAddress] = useState<string | null>(null);
  const [walletType, setWalletType] = useState<WalletProviderType | null>(null);
  const [balanceSol, setBalanceSol] = useState<number>(0);
  const [balanceUsdc, setBalanceUsdc] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Detect installed extensions safely in the browser
  const isInstalled = useCallback((type: WalletProviderType): boolean => {
    if (typeof window === 'undefined') return false;

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

  // Update on-chain balance when address changes
  const updateBalance = useCallback(async (pubkey: string) => {
    try {
      const sol = await fetchLiveSolBalance(pubkey);
      setBalanceSol(sol);
      // Query token accounts or default USDC
      setBalanceUsdc(0);
    } catch {
      setBalanceSol(0);
      setBalanceUsdc(0);
    }
  }, []);

  const refreshBalance = useCallback(async () => {
    if (address) {
      await updateBalance(address);
    }
  }, [address, updateBalance]);

  const connect = useCallback(async (type: WalletProviderType): Promise<boolean> => {
    setConnecting(true);
    setError(null);

    const win = window as any;

    try {
      let provider: any = null;

      if (type === 'phantom') {
        provider = win.phantom?.solana || win.solana;
        if (!provider || !provider.isPhantom) {
          window.open('https://phantom.app/', '_blank');
          throw new Error('Phantom wallet not detected. Please install Phantom extension from https://phantom.app/');
        }
      } else if (type === 'solflare') {
        provider = win.solflare;
        if (!provider || !provider.isSolflare) {
          window.open('https://solflare.com/', '_blank');
          throw new Error('Solflare wallet not detected. Please install Solflare extension from https://solflare.com/');
        }
      } else if (type === 'backpack') {
        provider = win.backpack;
        if (!provider) {
          window.open('https://backpack.app/', '_blank');
          throw new Error('Backpack wallet not detected. Please install Backpack extension from https://backpack.app/');
        }
      }

      // Request real wallet connection
      const response = await provider.connect();
      const pubkey = (response?.publicKey || provider.publicKey)?.toString();

      if (!pubkey) {
        throw new Error('Wallet connection rejected or public key not found');
      }

      setConnected(true);
      setAddress(pubkey);
      setWalletType(type);
      await updateBalance(pubkey);
      setConnecting(false);

      // Event listeners for wallet session lifecycle
      provider.on?.('disconnect', () => {
        disconnect();
      });
      provider.on?.('accountChanged', (newPubkey: any) => {
        if (newPubkey) {
          const pk = newPubkey.toString();
          setAddress(pk);
          updateBalance(pk);
        } else {
          disconnect();
        }
      });

      return true;
    } catch (err: any) {
      console.error('[SolanaWallet] Connect error:', err);
      setError(err?.message || 'Failed to connect wallet');
      setConnecting(false);
      return false;
    }
  }, [updateBalance]);

  const disconnect = useCallback(() => {
    if (typeof window !== 'undefined' && walletType) {
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

  // Eagerly check if the user previously authorized Phantom
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const win = window as any;
    const phantom = win.phantom?.solana || win.solana;

    if (phantom?.isPhantom && phantom.isConnected && phantom.publicKey) {
      const pk = phantom.publicKey.toString();
      setConnected(true);
      setAddress(pk);
      setWalletType('phantom');
      updateBalance(pk);
    }
  }, [updateBalance]);

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
        isModalOpen,
        setIsModalOpen,
        isInstalled,
        connect,
        disconnect,
        error,
        refreshBalance,
      }}
    >
      {children}
    </SolanaWalletContext.Provider>
  );
}

export function useSolanaWallet() {
  return useContext(SolanaWalletContext);
}
