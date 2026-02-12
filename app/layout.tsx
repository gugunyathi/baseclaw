'use client';

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { config } from '@/lib/wagmi-config';
import "./globals.css";
import { useState } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <title>BaseClaw - Launch your AI Agent in 60 seconds</title>
        <meta name="description" content="Deploy your private OpenClaw instance. Pay once with USDC on Base. No servers, no SSH. Runs 24/7." />
      </head>
      <body>
        <WagmiProvider config={config}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme({
              accentColor: 'hsl(190, 100%, 50%)',
              accentColorForeground: 'hsl(220, 25%, 6%)',
              borderRadius: 'medium',
            })}>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                {children}
              </TooltipProvider>
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  );
}
