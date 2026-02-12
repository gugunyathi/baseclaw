import { motion } from 'framer-motion';
import { Zap, Shield, Clock } from 'lucide-react';

const features = [
  { icon: Zap, label: 'Instant Deploy' },
  { icon: Shield, label: 'Private & Secure' },
  { icon: Clock, label: 'Runs 24/7' },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 pt-20 sm:pt-24 pb-12 sm:pb-16">
      {/* Background mesh */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" />
      
      {/* Grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(hsl(190 100% 50%) 1px, transparent 1px), linear-gradient(90deg, hsl(190 100% 50%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 max-w-5xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
          <span className="text-sm font-mono text-primary">Powered by Base L2</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 sm:mb-6">
          <span className="text-foreground">Launch your </span>
          <span className="text-primary glow-text">BaseClaw</span>
          <br />
          <span className="text-primary glow-text">AI Agent </span>
          <span className="text-foreground whitespace-nowrap">in 60 seconds</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed px-2">
          Deploy your private <span className="text-foreground font-semibold">BaseClaw</span> instance. 
          Pay once with USDC on Base (~$12). No servers, no SSH. Runs 24/7.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-6 sm:mt-10">
          {features.map((f, i) => (
            <motion.div
              key={f.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-2 text-muted-foreground"
            >
              <f.icon className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{f.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
