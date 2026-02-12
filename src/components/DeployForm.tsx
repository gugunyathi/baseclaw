import { useState } from 'react';
import { useAccount } from 'wagmi';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Bot, Mail, MessageCircle, Sparkles, Zap, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PaymentModal from './PaymentModal';

const LLM_MODELS = [
  { 
    value: 'claude-opus-4.5', 
    label: 'Claude Opus 4.5',
    iconPath: '/assets/claude icon.png'
  },
  { 
    value: 'gpt-5.2', 
    label: 'GPT-5.2',
    iconPath: '/assets/openai licon.png'
  },
  { 
    value: 'gemini-3-flash', 
    label: 'Gemini 3 Flash',
    iconPath: '/assets/gemini icon.png'
  },
];

const CHANNELS = [
  { 
    value: 'telegram', 
    label: 'Telegram', 
    available: true,
    iconPath: '/assets/Telegram icon.png'
  },
  { 
    value: 'discord', 
    label: 'Discord', 
    available: false,
    iconPath: '/assets/discord icon.png'
  },
  { 
    value: 'whatsapp', 
    label: 'WhatsApp', 
    available: false,
    iconPath: '/assets/whatsapp icon.png'
  },
];

const DeployForm = () => {
  const { isConnected, address } = useAccount();
  const [llmModel, setLlmModel] = useState('');
  const [channel, setChannel] = useState('');
  const [telegramToken, setTelegramToken] = useState('');
  const [email, setEmail] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const isFormValid = isConnected && llmModel && channel && email;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full max-w-3xl mx-auto mt-6 sm:mt-10 px-1"
      >
        <div className="glass rounded-xl p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-5">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            Configure Your Agent
          </h2>

          {/* Model Selection */}
          <div className="space-y-3">
            <label className="text-base font-medium text-foreground">
              Which model do you want as your Agent&apos;s default model?
            </label>
            <div className="flex gap-3">
              {LLM_MODELS.map((model) => (
                <button
                  key={model.value}
                  onClick={() => setLlmModel(model.value)}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all whitespace-nowrap
                    ${llmModel === model.value 
                      ? 'border-primary bg-primary/10 text-foreground' 
                      : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                    }
                  `}
                >
                  <Image 
                    src={model.iconPath} 
                    alt={model.label}
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                  />
                  <span className="font-medium">{model.label}</span>
                  {llmModel === model.value && (
                    <Check className="w-4 h-4 text-primary ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Channel Selection */}
          <div className="space-y-3">
            <label className="text-base font-medium text-foreground">
              Which channel do you want to use for sending messages?
            </label>
            <div className="flex flex-wrap gap-3">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.value}
                  onClick={() => ch.available && setChannel(ch.value)}
                  disabled={!ch.available}
                  className={`
                    flex items-center gap-2 px-4 py-3 rounded-lg border-2 transition-all
                    ${!ch.available 
                      ? 'border-border bg-secondary/20 text-muted-foreground/40 cursor-not-allowed' 
                      : channel === ch.value 
                        ? 'border-primary bg-primary/10 text-foreground' 
                        : 'border-border bg-secondary/30 text-muted-foreground hover:border-primary/50'
                    }
                  `}
                >
                  <Image 
                    src={ch.iconPath} 
                    alt={ch.label}
                    width={20}
                    height={20}
                    className={`w-5 h-5 object-contain ${!ch.available ? 'opacity-40' : ''}`}
                  />
                  <span className="font-medium">{ch.label}</span>
                  {!ch.available && (
                    <span className="text-xs ml-1">(Coming soon)</span>
                  )}
                  {channel === ch.value && ch.available && (
                    <Check className="w-4 h-4 text-primary ml-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Telegram Token - only show if Telegram is selected */}
          {channel === 'telegram' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Telegram Bot Token
              </label>
              <Input
                type="password"
                placeholder="123456:ABC-DEF..."
                value={telegramToken}
                onChange={(e) => setTelegramToken(e.target.value)}
                className="bg-secondary/50 border-border font-mono text-sm"
              />
            </div>
          )}

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
          llmModel,
          channel,
          telegramToken,
        }}
      />
    </>
  );
};

export default DeployForm;
