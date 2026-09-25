'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type WalletProviderType = 'phantom' | 'solflare' | 'backpack';
export type SolanaNetwork = 'mainnet-beta' | 'devnet';

export const SOLANA_CONFIG = {
  devnet: {
    name: 'Solana Devnet',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
    fallbackRpcUrl: 'https://solana-devnet-rpc.publicnode.com',
    usdcMint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    explorer: (sig: string) => `https://solscan.io/tx/${sig}?cluster=devnet`,
  },
  'mainnet-beta': {
    name: 'Solana Mainnet',
    rpcUrl: process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC || 'https://solana-rpc.publicnode.com',
    fallbackRpcUrl: 'https://api.mainnet-beta.solana.com',
    usdcMint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    explorer: (sig: string) => `https://solscan.io/tx/${sig}`,
  },
};

export interface WalletState {
  connected: boolean;
  connecting: boolean;
  address: string | null;
  shortAddress: string;
  walletType: WalletProviderType | null;
  network: SolanaNetwork;
  setNetwork: (network: SolanaNetwork) => void;
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
  network: (process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork) || 'devnet',
  setNetwork: () => {},
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
 * Direct Solana JSON-RPC balance query with multi-node proxy failover
 */
export async function fetchLiveSolBalance(pubkey: string, network: SolanaNetwork = 'devnet'): Promise<number> {
  const proxyRpc = typeof window !== 'undefined' ? `${window.location.origin}/api/rpc?network=${network}` : null;
  const directPublicRpc = network === 'devnet' ? 'https://api.devnet.solana.com' : 'https://solana-rpc.publicnode.com';
  const customRpc = network === 'devnet' ? process.env.NEXT_PUBLIC_SOLANA_RPC_URL : process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC;
  const secondaryPublicRpc = network === 'devnet' ? 'https://solana-devnet-rpc.publicnode.com' : 'https://api.mainnet-beta.solana.com';

  const rpcEndpoints = [proxyRpc, customRpc, directPublicRpc, secondaryPublicRpc].filter(Boolean) as string[];
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
      if (data?.result?.value !== undefined) {
        return data.result.value / 1e9; // convert lamports to SOL
      }
    } catch {
      // try next RPC endpoint
    }
  }
  return 0;
}

/**
 * Direct Solana JSON-RPC query for SPL USDC balance with multi-node proxy failover
 */
export async function fetchLiveUsdcBalance(pubkey: string, network: SolanaNetwork = 'devnet'): Promise<number> {
  const config = SOLANA_CONFIG[network] || SOLANA_CONFIG['devnet'];
  const proxyRpc = typeof window !== 'undefined' ? `${window.location.origin}/api/rpc?network=${network}` : null;
  const directPublicRpc = network === 'devnet' ? 'https://api.devnet.solana.com' : 'https://solana-rpc.publicnode.com';
  const customRpc = network === 'devnet' ? process.env.NEXT_PUBLIC_SOLANA_RPC_URL : process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC;

  const rpcEndpoints = [proxyRpc, customRpc, config.rpcUrl, directPublicRpc, config.fallbackRpcUrl].filter(Boolean) as string[];
  const uniqueEndpoints = Array.from(new Set(rpcEndpoints));
  const USDC_MINT = config.usdcMint;

  for (const rpcUrl of uniqueEndpoints) {
    try {
      const res = await fetch(rpcUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 2,
          method: 'getTokenAccountsByOwner',
          params: [
            pubkey,
            { mint: USDC_MINT },
            { encoding: 'jsonParsed' },
          ],
        }),
        cache: 'no-store',
      });
      if (!res.ok) continue;
      const data = await res.json();
      const accounts = data?.result?.value;
      if (Array.isArray(accounts) && accounts.length > 0) {
        let total = 0;
        for (const acc of accounts) {
          const uiAmount = acc?.account?.data?.parsed?.info?.tokenAmount?.uiAmount;
          if (typeof uiAmount === 'number') total += uiAmount;
        }
        return total;
      }
    } catch {
      // try next endpoint
    }
  }
  return 0;
}

export function SolanaWalletProvider({ children }: { children: React.ReactNode }) {
  const initialNetwork: SolanaNetwork =
    (process.env.NEXT_PUBLIC_SOLANA_NETWORK as SolanaNetwork) || 'devnet';
  const [network, setNetworkState] = useState<SolanaNetwork>(initialNetwork);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mitigator_solana_network') as SolanaNetwork | null;
      if (saved === 'devnet' || saved === 'mainnet-beta') {
        setNetworkState(saved);
      }
    }
  }, []);

  const setNetwork = useCallback((net: SolanaNetwork) => {
    setNetworkState(net);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mitigator_solana_network', net);
    }
  }, []);
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
      const [sol, usdc] = await Promise.all([
        fetchLiveSolBalance(pubkey, network).catch(() => 0),
        fetchLiveUsdcBalance(pubkey, network).catch(() => 0),
      ]);
      setBalanceSol(sol);
      setBalanceUsdc(usdc);
    } catch {
      setBalanceSol(0);
      setBalanceUsdc(0);
    }
  }, [network]);

  // Re-fetch balance when network toggles
  useEffect(() => {
    if (address) {
      updateBalance(address);
    }
  }, [network, address, updateBalance]);

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
        network,
        setNetwork,
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
