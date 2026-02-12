import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const faqs = [
  {
    q: 'What is OpenClaw?',
    a: 'OpenClaw is an open-source AI agent framework. BaseClaw lets you deploy your own private instance with one click—no DevOps required.',
  },
  {
    q: 'Why USDC on Base?',
    a: 'Base is a fast, low-cost Ethereum L2. USDC payments are instant, permissionless, and have near-zero gas fees (~$0.01).',
  },
  {
    q: 'How long does deployment take?',
    a: 'After payment confirmation, your agent is typically live within 60–90 seconds. You\'ll receive an email with access credentials.',
  },
  {
    q: 'Can I bring my own LLM API key?',
    a: 'Yes! We support Anthropic Claude, OpenAI GPT, and Google Gemini. Your API key is encrypted and used exclusively for your instance.',
  },
  {
    q: 'Is my data private?',
    a: 'Absolutely. Each deployment is an isolated instance. Your conversations, API keys, and data are never shared or accessible by others.',
  },
  {
    q: 'What if I need help?',
    a: 'Reach out via the Telegram support group or email support@baseclaw.xyz. We typically respond within a few hours.',
  },
];

const FAQSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-20 px-4 pb-20"
    >
      <h2 className="text-2xl font-bold text-foreground text-center mb-8">
        Frequently Asked Questions
      </h2>
      <Accordion type="single" collapsible className="space-y-2">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`faq-${i}`}
            className="glass rounded-lg px-5 border-none"
          >
            <AccordionTrigger className="text-sm font-medium text-foreground hover:text-primary hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </motion.section>
  );
};

export default FAQSection;
