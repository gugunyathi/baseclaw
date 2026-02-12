import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { base } from 'wagmi/chains';

export const config = getDefaultConfig({
  appName: 'BaseClaw',
  projectId: 'baseclaw-demo', // WalletConnect project ID placeholder
  chains: [base],
});
