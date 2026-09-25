import { NextRequest, NextResponse } from 'next/server';

/**
 * MITIGATOR — Resilient Solana JSON-RPC Gateway & Proxy
 * Bypasses public RPC CORS & 403 Access Forbidden restrictions by relaying
 * web3 client calls through a multi-node fallback cluster on the server side.
 */

const MAINNET_ENDPOINTS = [
  process.env.SOLANA_MAINNET_RPC,
  'https://solana-rpc.publicnode.com',
  'https://api.mainnet-beta.solana.com',
].filter(Boolean) as string[];

const DEVNET_ENDPOINTS = [
  process.env.SOLANA_DEVNET_RPC,
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL,
  'https://api.devnet.solana.com',
  'https://solana-devnet-rpc.publicnode.com',
].filter(Boolean) as string[];

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const network = url.searchParams.get('network') || 'devnet';

  const candidates =
    network === 'mainnet-beta' ? MAINNET_ENDPOINTS : DEVNET_ENDPOINTS;

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { jsonrpc: '2.0', error: { code: -32700, message: 'Parse error: invalid JSON' }, id: null },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  let lastError: any = null;

  for (const endpoint of candidates) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const upstreamRes = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'MITIGATOR-Solana-Gateway/1.0',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
        cache: 'no-store',
      });

      clearTimeout(timeoutId);

      if (!upstreamRes.ok) {
        lastError = `HTTP ${upstreamRes.status} from ${endpoint}`;
        continue;
      }

      const data = await upstreamRes.json();

      // If upstream returned an RPC access forbidden error, try next fallback node
      if (data?.error?.code === 403 || data?.error?.message?.includes('forbidden')) {
        lastError = `RPC 403 forbidden from ${endpoint}`;
        continue;
      }

      return NextResponse.json(data, {
        status: 200,
        headers: CORS_HEADERS,
      });
    } catch (err: any) {
      lastError = err?.message || String(err);
    }
  }

  return NextResponse.json(
    {
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: `All Solana RPC nodes failed: ${lastError || 'Unknown gateway failure'}`,
      },
      id: body?.id ?? null,
    },
    { status: 502, headers: CORS_HEADERS }
  );
}
