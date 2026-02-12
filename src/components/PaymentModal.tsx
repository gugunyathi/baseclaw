import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Loader2, Copy, ExternalLink } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const PAYMENT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18';
const USDC_AMOUNT = 12;

type DeployStage = 'confirm' | 'processing' | 'deploying' | 'success';

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  formData: {
    email: string;
    walletAddress: string;
    llmModel: string;
    channel: string;
    telegramToken: string;
  };
}

const PaymentModal = ({ open, onClose, formData }: PaymentModalProps) => {
  const [stage, setStage] = useState<DeployStage>('confirm');
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handlePay = async () => {
    setStage('processing');
    
    // Simulate payment detection (2s)
    await new Promise((r) => setTimeout(r, 2000));
    
    setStage('deploying');
    
    // Simulate deployment progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + Math.random() * 15;
      });
    }, 500);

    try {
      // Save to database
      const { error } = await supabase.from('deployments').insert({
        email: formData.email,
        wallet_address: formData.walletAddress,
        llm_provider: formData.llmModel,
        llm_api_key_encrypted: 'managed_by_baseclaw',
        telegram_bot_token_encrypted: formData.telegramToken || null,
        deployment_status: 'pending_manual_deploy',
        payment_tx_hash: '0x_simulated_' + Date.now(),
      });

      if (error) throw error;

      // Send confirmation email via edge function
      try {
        await supabase.functions.invoke('send-confirmation-email', {
          body: {
            email: formData.email,
            walletAddress: formData.walletAddress,
            llmModel: formData.llmModel,
          },
        });
      } catch (emailErr) {
        console.warn('Email send failed (non-blocking):', emailErr);
      }

      // Wait for progress to finish
      await new Promise((r) => setTimeout(r, 4000));
      clearInterval(interval);
      setProgress(100);
      
      setTimeout(() => setStage('success'), 500);
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to save deployment. Please try again.',
        variant: 'destructive',
      });
      clearInterval(interval);
      setStage('confirm');
      setProgress(0);
    }
  };

  const handleClose = () => {
    setStage('confirm');
    setProgress(0);
    onClose();
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(PAYMENT_ADDRESS);
    toast({ title: 'Copied!', description: 'Payment address copied to clipboard.' });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {stage === 'confirm' && 'Confirm Payment'}
            {stage === 'processing' && 'Processing Payment...'}
            {stage === 'deploying' && 'Deploying Your Agent...'}
            {stage === 'success' && 'Deployment Complete! 🎉'}
          </DialogTitle>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {stage === 'confirm' && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 pt-2"
            >
              <div className="rounded-lg bg-secondary/50 p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="text-foreground font-bold font-mono">{USDC_AMOUNT} USDC</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network</span>
                  <span className="text-foreground font-mono">Base (L2)</span>
                </div>
                <div className="border-t border-border pt-3">
                  <p className="text-xs text-muted-foreground mb-1">Send to:</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs font-mono text-primary break-all">
                      {PAYMENT_ADDRESS}
                    </code>
                    <button onClick={copyAddress} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                For this demo, clicking &quot;Pay&quot; simulates a payment. On-chain USDC integration coming soon.
              </p>

              <Button onClick={handlePay} className="w-full py-5 font-bold glow-cyan">
                Pay {USDC_AMOUNT} USDC
              </Button>
            </motion.div>
          )}

          {stage === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-8 gap-4"
            >
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">Detecting payment on Base...</p>
            </motion.div>
          )}

          {stage === 'deploying' && (
            <motion.div
              key="deploying"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 py-6"
            >
              <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <p className="text-sm text-center text-muted-foreground">
                Spinning up your BaseClaw instance... {Math.round(Math.min(progress, 100))}%
              </p>
              <p className="text-xs text-center text-muted-foreground/60">
                Estimated: 45–90 seconds
              </p>
            </motion.div>
          )}

          {stage === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center py-6 gap-4"
            >
              <CheckCircle2 className="w-14 h-14 text-accent" />
              <div className="text-center space-y-2">
                <p className="text-foreground font-semibold">Your agent is live!</p>
                <p className="text-sm text-muted-foreground">
                  Check <span className="text-foreground">{formData.email}</span> for your Telegram link & dashboard credentials.
                </p>
              </div>
              <p className="text-xs text-muted-foreground/60 text-center">
                We&apos;ll manually deploy your instance within 24h and email your credentials.
              </p>
              <Button onClick={handleClose} variant="outline" className="mt-2">
                Close
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
