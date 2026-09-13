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
  const rpcEndpoints = [
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
    'https://api.devnet.solana.com',
    'https://api.mainnet-beta.solana.com',
  ].filter(Boolean) as string[];

  // Deduplicate endpoints
  const uniqueEndpoints = Array.from(new Set(rpcEndpoints));

  for (const rpcUrl of uniqueEndpoints) {
    try {
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
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.result?.value !== undefined && data.result.value > 0) {
        return data.result.value / 1e9; // convert lamports to SOL
      }
    } catch {
      // try next RPC endpoint
    }
  }
  return 0;
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

  // Helper to extract clean base58 string from any Solana PublicKey object
  const getPubkeyString = (obj: any): string | null => {
    if (!obj) return null;
    if (typeof obj === 'string') return obj;
    if (typeof obj.toBase58 === 'function') return obj.toBase58();
    if (typeof obj.toString === 'function') {
      const s = obj.toString();
      if (s && s !== '[object Object]') return s;
    }
    return null;
  };

  // Detect installed extensions safely in the browser
  const isInstalled = useCallback((type: WalletProviderType): boolean => {
    if (typeof window === 'undefined') return false;

    const win = window as any;
    if (type === 'phantom') {
      return !!(win.phantom?.solana?.isPhantom || win.solana?.isPhantom);
    }
    if (type === 'solflare') {
      return !!(win.solflare?.isSolflare || win.solflare || win.solana?.isSolflare);
    }
    if (type === 'backpack') {
      return !!(win.backpack?.isBackpack || win.backpack);
    }
    return false;
  }, []);

  // Update on-chain balance when address changes
  const updateBalance = useCallback(async (pubkey: string) => {
    try {
      const sol = await fetchLiveSolBalance(pubkey);
      setBalanceSol(sol);
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

  // Try silent reconnect on page mount if previously connected
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedType = localStorage.getItem('mitigator_connected_wallet_type') as WalletProviderType | null;
      if (savedType) {
        const win = window as any;
        const prov = savedType === 'phantom'
          ? (win.phantom?.solana || win.solana)
          : savedType === 'solflare'
          ? (win.solflare || win.solana)
          : win.backpack;

        if (prov && (prov.isConnected || prov.publicKey)) {
          const pk = getPubkeyString(prov.publicKey);
          if (pk) {
            setConnected(true);
            setAddress(pk);
            setWalletType(savedType);
            updateBalance(pk);
          }
        }
      }
    } catch (e) {
      console.warn('[SolanaWallet] Auto-connect check failed:', e);
    }
  }, [updateBalance]);

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
        provider = win.solflare || (win.solana?.isSolflare ? win.solana : null);
        if (!provider) {
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
      let pubkey = getPubkeyString(response?.publicKey) || getPubkeyString(provider.publicKey);

      // Handle async state update tick
      if (!pubkey && (provider.isConnected || provider.publicKey)) {
        await new Promise((r) => setTimeout(r, 80));
        pubkey = getPubkeyString(provider.publicKey);
      }

      if (!pubkey) {
        throw new Error('Wallet connection rejected or public key not found');
      }

      setConnected(true);
      setAddress(pubkey);
      setWalletType(type);
      try {
        localStorage.setItem('mitigator_connected_wallet_type', type);
      } catch {}

      await updateBalance(pubkey);
      setConnecting(false);

      // Event listeners for wallet session lifecycle
      provider.on?.('disconnect', () => {
        disconnect();
      });
      provider.on?.('accountChanged', (newPubkey: any) => {
        if (newPubkey) {
          const pk = getPubkeyString(newPubkey) || newPubkey.toString();
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
        localStorage.removeItem('mitigator_connected_wallet_type');
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
