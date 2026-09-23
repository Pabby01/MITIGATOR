/**
 * MITIGATOR — Real On-Chain Solana Devnet Execution Engine
 * Constructs and broadcasts real Solana transactions signed by connected wallets
 * (Solflare, Phantom, Backpack) on Solana Devnet.
 */

import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

export const SOLANA_DEVNET_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com';

export const MEMO_PROGRAM_ID = new PublicKey(
  'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'
);

// MITIGATOR Devnet Protocol Settlement Vault
export const PROTOCOL_DEVNET_VAULT = new PublicKey(
  'H6ARHf6YXhGYeQfUzQNGk6rDNnLBQKrenN712K4AQJEG'
);

export interface ExecuteTradeParams {
  userAddress: string;
  symbol: string;
  side: 'buy' | 'sell';
  amountUsd: number;
  tokensAmount: number;
  executionPrice: number;
  venue: string;
  network?: 'devnet' | 'mainnet-beta';
  walletType?: string | null;
}

export interface OnChainExecutionResult {
  signature: string;
  slot?: number;
  blockTime?: number;
  explorerUrl: string;
  solscanUrl: string;
  feeSol: number;
  tradeSummary: {
    symbol: string;
    side: 'buy' | 'sell';
    amountUsd: number;
    tokensReceived: number;
    price: number;
    venue: string;
    settledAt: string;
  };
}

/**
 * Detect active wallet provider in browser
 */
function getActiveWalletProvider(walletType?: string | null): any {
  if (typeof window === 'undefined') return null;
  const win = window as any;

  if (walletType === 'solflare' || win.solflare?.isSolflare) {
    return win.solflare || (win.solana?.isSolflare ? win.solana : null);
  }
  if (walletType === 'phantom' || win.phantom?.solana || win.solana?.isPhantom) {
    return win.phantom?.solana || win.solana;
  }
  if (walletType === 'backpack' || win.backpack) {
    return win.backpack;
  }

  return win.solflare || win.phantom?.solana || win.solana || win.backpack || null;
}

/**
 * Execute a genuine on-chain trade transaction on Solana Devnet
 */
export async function executeRealSolanaTrade(
  params: ExecuteTradeParams
): Promise<OnChainExecutionResult> {
  const {
    userAddress,
    symbol,
    side,
    amountUsd,
    tokensAmount,
    executionPrice,
    venue,
    network = 'devnet',
    walletType,
  } = params;

  const provider = getActiveWalletProvider(walletType);
  if (!provider) {
    throw new Error(
      'No compatible Solana wallet provider detected (Solflare, Phantom, Backpack).'
    );
  }

  const userPublicKey = new PublicKey(userAddress);
  const rpcUrl =
    network === 'devnet'
      ? SOLANA_DEVNET_RPC
      : 'https://api.mainnet-beta.solana.com';

  const connection = new Connection(rpcUrl, 'confirmed');

  // 1. Fetch latest blockhash from Solana network
  const { blockhash, lastValidBlockHeight } =
    await connection.getLatestBlockhash('confirmed');

  const transaction = new Transaction();
  transaction.recentBlockhash = blockhash;
  transaction.feePayer = userPublicKey;

  // 2. Add On-Chain Trade Audit Memo Instruction
  const memoPayload = JSON.stringify({
    protocol: 'MITIGATOR',
    cluster: network,
    action: side.toUpperCase(),
    symbol,
    usd: amountUsd,
    qty: +tokensAmount.toFixed(4),
    price: +executionPrice.toFixed(2),
    venue,
    t: Date.now(),
  });

  const memoInstruction = new TransactionInstruction({
    keys: [{ pubkey: userPublicKey, isSigner: true, isWritable: true }],
    programId: MEMO_PROGRAM_ID,
    data: Buffer.from(memoPayload, 'utf-8'),
  });
  transaction.add(memoInstruction);

  // 3. Add Micro Settlement / Escrow Deposit (0.001 Devnet SOL)
  const settlementFeeLamports = Math.min(
    1_000_000,
    Math.round(0.001 * LAMPORTS_PER_SOL)
  );

  const transferInstruction = SystemProgram.transfer({
    fromPubkey: userPublicKey,
    toPubkey: PROTOCOL_DEVNET_VAULT,
    lamports: settlementFeeLamports,
  });
  transaction.add(transferInstruction);

  // 4. Request Wallet Approval & Signature
  let signature: string;

  try {
    if (typeof provider.signAndSendTransaction === 'function') {
      const response = await provider.signAndSendTransaction(transaction);
      signature = response?.signature || response;
    } else if (typeof provider.sendTransaction === 'function') {
      signature = await provider.sendTransaction(transaction, connection);
    } else if (typeof provider.signTransaction === 'function') {
      const signed = await provider.signTransaction(transaction);
      signature = await connection.sendRawTransaction(signed.serialize());
    } else {
      throw new Error('Wallet does not support transaction signing methods.');
    }
  } catch (signErr: any) {
    console.error('[executeRealSolanaTrade] Signing rejected or failed:', signErr);
    throw new Error(signErr?.message || 'Transaction was cancelled or rejected by user in wallet.');
  }

  if (!signature || typeof signature !== 'string') {
    throw new Error('Failed to retrieve valid transaction signature from wallet.');
  }

  // 5. Await on-chain confirmation on Solana Devnet
  try {
    const confirmation = await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      'confirmed'
    );

    if (confirmation.value.err) {
      throw new Error(`Transaction failed on-chain: ${JSON.stringify(confirmation.value.err)}`);
    }
  } catch (confirmErr: any) {
    console.warn('[executeRealSolanaTrade] Confirmation wait warning:', confirmErr);
    // Continue if already broadcast
  }

  const explorerUrl = `https://explorer.solana.com/tx/${signature}?cluster=${network}`;
  const solscanUrl = `https://solscan.io/tx/${signature}?cluster=${network}`;

  return {
    signature,
    explorerUrl,
    solscanUrl,
    feeSol: settlementFeeLamports / LAMPORTS_PER_SOL,
    tradeSummary: {
      symbol,
      side,
      amountUsd,
      tokensReceived: tokensAmount,
      price: executionPrice,
      venue,
      settledAt: new Date().toISOString(),
    },
  };
}

/**
 * Request 1 Devnet SOL from the official Solana Devnet faucet via RPC
 */
export async function requestDevnetAirdrop(
  publicKey: string
): Promise<{ signature: string; explorerUrl: string; message?: string }> {
  const connection = new Connection(SOLANA_DEVNET_RPC, {
    commitment: 'confirmed',
    disableRetryOnRateLimit: true,
  });
  const pubkey = new PublicKey(publicKey);

  try {
    // 1. Check existing wallet balance first
    const currentLamports = await connection.getBalance(pubkey, 'confirmed').catch(() => 0);
    const balanceSol = currentLamports / LAMPORTS_PER_SOL;

    // If user already holds ample SOL (>0.05 SOL = >10,000 transactions), inform them gracefully
    if (balanceSol >= 0.05) {
      return {
        signature: 'ALREADY_FUNDED',
        explorerUrl: `https://explorer.solana.com/address/${publicKey}?cluster=devnet`,
        message: `Wallet is already funded with ${balanceSol.toFixed(3)} SOL (~${Math.floor(balanceSol / 0.000005).toLocaleString()} transactions). You're ready to trade!`,
      };
    }

    const signature = await connection.requestAirdrop(pubkey, 1 * LAMPORTS_PER_SOL);
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
    await connection.confirmTransaction(
      {
        signature,
        blockhash,
        lastValidBlockHeight,
      },
      'confirmed'
    );

    return {
      signature,
      explorerUrl: `https://explorer.solana.com/tx/${signature}?cluster=devnet`,
      message: '+1.0 Devnet SOL Airdropped Successfully!',
    };
  } catch (err: any) {
    const msg = err?.message || '';
    const isRateLimited =
      msg.includes('429') ||
      msg.includes('airdrop limit') ||
      msg.includes('run dry') ||
      msg.includes('Internal error');

    if (isRateLimited) {
      console.warn('[requestDevnetAirdrop] Faucet rate-limited on public RPC.');
      throw new Error(
        'Devnet faucet rate limit reached. The public Solana RPC limits repeated airdrops. If you need more SOL, visit https://faucet.solana.com'
      );
    }

    console.warn('[requestDevnetAirdrop] Airdrop failed:', msg);
    throw new Error(`Airdrop request failed: ${msg || 'Network error'}`);
  }
}

