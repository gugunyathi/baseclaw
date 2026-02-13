'use client';

import { useState } from 'react';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import DeployForm from '@/components/DeployForm';
import FAQSection from '@/components/FAQSection';

// Force dynamic rendering since we use client-side features
export const dynamic = 'force-dynamic';

export default function Home() {
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
          
          <a 
            href="https://base.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-mono text-muted-foreground hover:text-primary transition-colors"
          >
            Built on Base
          </a>
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
