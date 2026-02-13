'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import DeployForm from '@/components/DeployForm';
import FAQSection from '@/components/FAQSection';
import { useToast } from '@/hooks/use-toast';

// Force dynamic rendering since we use client-side features
export const dynamic = 'force-dynamic';

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sdkProvider, setSdkProvider] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Dynamically import SDK to avoid SSR issues
    const initSDK = async () => {
      try {
        const { createBaseAccountSDK } = await import('@base-org/account');
        const sdk = createBaseAccountSDK({
          appName: 'BaseClaw',
          appLogoUrl: 'https://baseclawbot.vercel.app/assets/blue crab icon.png',
        });
        setSdkProvider(sdk.getProvider());
      } catch (error) {
        console.error('Failed to initialize SDK:', error);
      }
    };
    initSDK();
  }, []);

  const signInWithBase = async () => {
    if (!sdkProvider) {
      toast({
        title: "Error",
        description: "SDK not initialized yet. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Get nonce from backend
      const nonceResponse = await fetch('/api/auth/nonce');
      const { nonce } = await nonceResponse.json();

      // 2. Switch to Base Mainnet
      await sdkProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x2105' }], // Base Mainnet
      });

      // 3. Connect and authenticate
      const { accounts } = await sdkProvider.request({
        method: 'wallet_connect',
        params: [
          {
            version: '1',
            capabilities: {
              signInWithEthereum: {
                nonce,
                chainId: '0x2105', // Base Mainnet - 8453
              },
            },
          },
        ],
      });

      const { address } = accounts[0];
      const { message, signature } = accounts[0].capabilities.signInWithEthereum;

      // 4. Verify signature on backend
      const verifyResponse = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature }),
      });

      const verifyResult = await verifyResponse.json();

      if (verifyResult.ok) {
        setIsSignedIn(true);
        setUserAddress(address);
        toast({
          title: "Success",
          description: `Signed in as ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      } else {
        throw new Error(verifyResult.error || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Failed to authenticate:', error);
      toast({
        title: "Authentication Failed",
        description: error?.message || "Failed to sign in with Base",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src="/assets/blue crab icon.png" 
              alt="BaseClaw" 
              width={32} 
              height={32} 
              className="w-8 h-8 object-contain"
            />
            <span className="text-lg font-bold text-primary tracking-tight">BaseClaw</span>
          </div>
          
          <div className="flex items-center gap-3">
            {isSignedIn && userAddress ? (
              <span className="text-xs font-mono text-muted-foreground">
                {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
              </span>
            ) : (
              <button
                onClick={signInWithBase}
                disabled={isLoading || !sdkProvider}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="w-4 h-4 bg-white rounded-sm flex-shrink-0" />
                <span>{isLoading ? 'Signing in...' : 'Sign in with Base'}</span>
              </button>
            )}
            
            <a 
              href="https://base.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors hidden sm:block"
            >
              Built on Base
            </a>
          </div>
        </div>
      </nav>

      <HeroSection />
      
      <div className="relative z-10 px-3 sm:px-4 md:px-6">
        <DeployForm />
      </div>

      <FAQSection />

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center">
        <p className="text-xs text-muted-foreground">
          © 2025 BaseClaw · Powered by Base L2 · 
          <a href="#" className="text-primary hover:underline ml-1">Docs</a>
        </p>
      </footer>
    </div>
  );
}
