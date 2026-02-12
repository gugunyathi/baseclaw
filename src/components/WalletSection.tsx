import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Wallet } from 'lucide-react';

const WalletSection = () => {
  const { isConnected, address } = useAccount();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center gap-4"
    >
      {!isConnected && (
        <div className="flex items-center gap-2 text-muted-foreground mb-2">
          <Wallet className="w-4 h-4" />
          <span className="text-sm font-mono">Step 1: Connect your wallet</span>
        </div>
      )}

      <ConnectButton.Custom>
        {({ account, chain, openConnectModal, openAccountModal, mounted }) => {
          const connected = mounted && account && chain;

          return (
            <div
              {...(!mounted && {
                'aria-hidden': true,
                style: { opacity: 0, pointerEvents: 'none', userSelect: 'none' },
              })}
            >
              {!connected ? (
                <button
                  onClick={openConnectModal}
                  className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-bold text-lg glow-cyan hover:brightness-110 transition-all duration-200 cursor-pointer"
                >
                  Connect Base Wallet
                </button>
              ) : (
                <button
                  onClick={openAccountModal}
                  className="flex items-center gap-3 px-6 py-3 rounded-lg glass border-glow cursor-pointer hover:bg-secondary/50 transition-all"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                  <span className="font-mono text-sm text-foreground">
                    {account.displayName}
                  </span>
                  {account.displayBalance && (
                    <span className="text-sm text-muted-foreground">
                      ({account.displayBalance})
                    </span>
                  )}
                </button>
              )}
            </div>
          );
        }}
      </ConnectButton.Custom>

      {isConnected && address && (
        <p className="text-xs text-muted-foreground font-mono">
          Connected: {address.slice(0, 6)}...{address.slice(-4)}
        </p>
      )}
    </motion.div>
  );
};

export default WalletSection;
