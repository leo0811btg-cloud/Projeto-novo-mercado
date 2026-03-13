import React, { useState } from 'react';
import { Search, TrendingUp, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onSearch: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center overflow-hidden bg-primary pt-24 pb-16 sm:pb-24">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[linear-gradient(to_top,rgba(15,23,42,1),transparent)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 text-secondary text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.25em] mb-6 sm:mb-10 shadow-2xl">
            <Zap className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-secondary" />
            Market Intelligence & Price Analytics
          </div>
          
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-bold text-white mb-6 sm:mb-8 tracking-tight leading-[1.1] sm:leading-[0.95] max-w-5xl mx-auto">
            A inteligência por trás da sua <span className="text-secondary italic font-serif">economia.</span>
          </h1>
          
          <p className="text-white/60 text-base sm:text-xl md:text-2xl mb-10 sm:mb-16 max-w-3xl mx-auto font-medium leading-relaxed px-2 sm:px-4">
            Conectamos consumidores e mercados através de dados em tempo real, 
            impulsionando o varejo de Dourados com transparência e tecnologia.
          </p>
        </motion.div>
        
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          onSubmit={handleSubmit} 
          className="max-w-4xl mx-auto relative group"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/5 backdrop-blur-3xl rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] overflow-hidden p-2 sm:p-2.5 border border-white/10 group-focus-within:border-secondary/50 group-focus-within:shadow-[0_32px_64px_-16px_rgba(245,158,11,0.15)] transition-all duration-500 gap-2 sm:gap-0">
            <div className="flex items-center flex-grow bg-white rounded-[1.5rem] px-4 sm:px-6 py-1">
              <Search className="h-5 w-5 sm:h-6 sm:w-6 text-primary/30" />
              <input
                type="text"
                className="w-full px-3 sm:px-4 py-3.5 sm:py-5 text-primary focus:outline-none text-base sm:text-xl font-semibold placeholder:text-primary/20"
                placeholder="Pesquisar preços..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-secondary text-primary px-8 sm:px-14 py-4 sm:py-5 rounded-[1.5rem] font-bold text-base sm:text-lg hover:bg-white transition-all duration-500 shadow-xl active:scale-95 sm:ml-3"
            >
              Analisar
            </button>
          </div>
        </motion.form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-20 flex flex-wrap justify-center gap-12 text-white/30"
        >
          <div className="flex flex-col items-center gap-3">
            <ShieldCheck className="h-7 w-7 text-secondary/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Dados Auditados</span>
          </div>
          <div className="h-12 w-[1px] bg-white/5 hidden sm:block" />
          <div className="flex flex-col items-center gap-3">
            <TrendingUp className="h-7 w-7 text-secondary/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Market Insights</span>
          </div>
          <div className="h-12 w-[1px] bg-white/5 hidden sm:block" />
          <div className="flex flex-col items-center gap-3">
            <Zap className="h-7 w-7 text-secondary/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Real-time Sync</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
