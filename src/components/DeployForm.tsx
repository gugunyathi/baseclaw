import { useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import { Bot, Key, Mail, Send, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PaymentModal from './PaymentModal';

const LLM_PROVIDERS = [
  { value: 'anthropic', label: 'Anthropic Claude' },
  { value: 'openai', label: 'OpenAI GPT' },
  { value: 'google', label: 'Google Gemini' },
];

const DeployForm = () => {
  const { isConnected, address } = useAccount();
  const [llmProvider, setLlmProvider] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [email, setEmail] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const isFormValid = isConnected && llmProvider && apiKey && email;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-lg mx-auto mt-10"
      >
        <div className="glass rounded-xl p-6 md:p-8 space-y-5">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Configure Your Agent
          </h2>

          {/* LLM Provider */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">LLM Provider</label>
            <Select value={llmProvider} onValueChange={setLlmProvider}>
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Select LLM provider..." />
              </SelectTrigger>
              <SelectContent>
                {LLM_PROVIDERS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* API Key */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Key className="w-3.5 h-3.5" /> API Key
            </label>
            <div className="relative">
              <Input
                type={showApiKey ? 'text' : 'password'}
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="bg-secondary/50 border-border pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Telegram Token */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Send className="w-3.5 h-3.5" /> Telegram Bot Token
              <span className="text-xs text-muted-foreground/60 ml-1">(optional)</span>
            </label>
            <Input
              type="password"
              placeholder="123456:ABC-DEF..."
              value={telegramToken}
              onChange={(e) => setTelegramToken(e.target.value)}
              className="bg-secondary/50 border-border font-mono text-sm"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" /> Email Address
            </label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-secondary/50 border-border"
            />
          </div>

          {/* Deploy Button */}
          <Button
            onClick={() => setShowPayment(true)}
            disabled={!isFormValid}
            className="w-full py-6 text-base font-bold glow-cyan disabled:opacity-40 disabled:shadow-none"
          >
            Pay & Deploy My Claw 🦀
          </Button>

          {!isConnected && (
            <p className="text-xs text-center text-muted-foreground">
              Connect your wallet above to continue
            </p>
          )}
        </div>
      </motion.div>

      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        formData={{
          email,
          walletAddress: address || '',
          llmProvider,
          apiKey,
          telegramToken,
        }}
      />
    </>
  );
};

export default DeployForm;
