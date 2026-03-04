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
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#1E3A8A]">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-[#F97316] rounded-full blur-[120px] opacity-20 animate-pulse" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-400 rounded-full blur-[120px] opacity-20" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-100 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-6 sm:mb-8">
            <Zap className="h-3 w-3 text-[#F97316]" />
            Economia Real em Dourados
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
            Economize de verdade <br className="hidden sm:block" />
            nos mercados de <span className="text-[#F97316] relative">
              Dourados
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#F97316]/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
              </svg>
            </span>
          </h1>
          
          <p className="text-blue-100 text-base sm:text-lg md:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto font-medium opacity-90 px-4">
            A plataforma número 1 para comparar preços, encontrar tabloides e economizar tempo nas suas compras do mês.
          </p>
        </motion.div>
        
        <motion.form 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="max-w-3xl mx-auto relative group px-4 sm:px-0"
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white rounded-3xl sm:rounded-2xl shadow-2xl overflow-hidden p-2 border-4 border-white/10 group-focus-within:border-[#F97316]/30 transition-all gap-2 sm:gap-0">
            <div className="flex items-center flex-grow">
              <div className="pl-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <input
                type="text"
                className="w-full px-4 py-3 sm:py-4 text-gray-800 focus:outline-none text-base sm:text-lg font-medium"
                placeholder="O que você quer comprar?"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="bg-[#F97316] text-white px-6 sm:px-10 py-4 rounded-2xl sm:rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/40 active:scale-95"
            >
              Comparar
            </button>
          </div>
        </motion.form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 flex flex-wrap justify-center gap-8 text-blue-100/60"
        >
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-sm font-semibold">Preços Verificados</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <span className="text-sm font-semibold">Atualizado Diariamente</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
