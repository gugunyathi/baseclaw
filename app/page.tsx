'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import DeployForm from '@/components/DeployForm';
import FAQSection from '@/components/FAQSection';
import { SignInWithBaseButton } from '@base-org/account-ui/react';
import { useToast } from '@/hooks/use-toast';

// Force dynamic rendering since we use client-side features
export const dynamic = 'force-dynamic';

export default function Home() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userAddress, setUserAddress] = useState<string>('');
  const [sdk, setSdk] = useState<any>(null);
  const { toast } = useToast();

  // Initialize SDK on client side only
  useEffect(() => {
    const initSDK = async () => {
      const { createBaseAccountSDK } = await import('@base-org/account');
      const sdkInstance = createBaseAccountSDK({
        appName: 'BaseClaw',
        appLogoUrl: 'https://baseclawbot.vercel.app/assets/blue%20crab%20icon.png',
      });
      setSdk(sdkInstance);
    };
    initSDK();
  }, []);

  const signInWithBase = async () => {
    if (!sdk) {
      toast({
        title: 'Loading...',
        description: 'SDK is still initializing. Please try again.',
      });
      return;
    }

    try {
      // Simple wallet connect (opens wallet popup)
      await sdk.getProvider().request({ method: 'wallet_connect' });
      
      // Get the connected address
      const accounts: any = await sdk.getProvider().request({ 
        method: 'eth_accounts' 
      });
      
      if (accounts && accounts.length > 0) {
        const address = accounts[0];
        setIsSignedIn(true);
        setUserAddress(address);

        toast({
          title: 'Signed in successfully!',
          description: `Connected as ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
    } catch (error: any) {
      console.error('Sign in failed:', error);
      toast({
        title: 'Sign in failed',
        description: error?.message || 'Unable to sign in with Base',
        variant: 'destructive',
      });
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
            {isSignedIn ? (
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </span>
                <div className="w-2 h-2 rounded-full bg-green-500" />
              </div>
            ) : (
              <SignInWithBaseButton
                colorScheme="light"
                align="center"
                variant="solid"
                onClick={signInWithBase}
              />
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
