import { NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

export async function GET() {
  // Generate a secure random nonce (32 hex characters)
  const nonce = randomBytes(16).toString('hex');
  
  return NextResponse.json({ nonce });
}
