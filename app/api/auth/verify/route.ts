import { NextRequest, NextResponse } from 'next/server';
import { createPublicClient, http } from 'viem';
import { base } from 'viem/chains';

// Simple in-memory nonce store (use Redis or DB in production)
const usedNonces = new Set<string>();

// Cleanup old nonces every hour (prevent memory leak)
setInterval(() => {
  usedNonces.clear();
}, 60 * 60 * 1000);

const client = createPublicClient({ 
  chain: base, 
  transport: http() 
});

export async function POST(request: NextRequest) {
  try {
    const { address, message, signature } = await request.json();

    if (!address || !message || !signature) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // 1. Extract and check nonce hasn't been reused
    const nonceMatch = message.match(/Nonce: ([a-zA-Z0-9]+)/);
    const nonce = nonceMatch?.[1];
    
    if (!nonce) {
      return NextResponse.json(
        { error: 'Invalid message format - no nonce found' },
        { status: 400 }
      );
    }

    if (usedNonces.has(nonce)) {
      return NextResponse.json(
        { error: 'Nonce already used' },
        { status: 400 }
      );
    }

    // 2. Verify signature (supports ERC-6492 for undeployed smart wallets)
    const valid = await client.verifyMessage({ 
      address: address as `0x${string}`,
      message, 
      signature: signature as `0x${string}`
    });

    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // 3. Mark nonce as used
    usedNonces.add(nonce);

    // 4. TODO: Create session / JWT here
    // For now, just return success
    return NextResponse.json({ 
      ok: true,
      address,
      message: 'Authentication successful'
    });

  } catch (error: any) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error?.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
