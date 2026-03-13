import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MarketCard from '../components/MarketCard';
import { Market, Offer } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBasket, Beef, Milk, Sparkles, Coffee, Apple, Zap, Store, TrendingUp } from 'lucide-react';

export default function Home() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/markets')
      .then(res => res.json())
      .then(data => setMarkets(data));

    fetch('/api/offers?limit=8')
      .then(res => res.json())
      .then(data => setOffers(data));
  }, []);

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const categories = [
    { name: 'Açougue', icon: Beef, color: 'bg-red-50 text-red-600' },
    { name: 'Laticínios', icon: Milk, color: 'bg-blue-50 text-blue-600' },
    { name: 'Hortifruti', icon: Apple, color: 'bg-green-50 text-green-600' },
    { name: 'Limpeza', icon: Sparkles, color: 'bg-purple-50 text-purple-600' },
    { name: 'Bebidas', icon: Coffee, color: 'bg-orange-50 text-orange-600' },
    { name: 'Mercearia', icon: ShoppingBasket, color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <Hero onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-0 sm:-mt-16 relative z-20 pb-20 sm:pb-32">
        {/* Categories Section */}
        <section className="mb-12 sm:mb-24">
          <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-6">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleSearch(cat.name)}
                className="bg-white p-4 sm:p-8 rounded-2xl sm:rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-all duration-500 group border border-gray-100/50 flex flex-col items-center gap-3 sm:gap-4"
              >
                <div className={`p-3 sm:p-5 rounded-xl sm:rounded-2xl ${cat.color} group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  <cat.icon className="h-5 w-5 sm:h-7 sm:w-7" />
                </div>
                <span className="font-bold text-primary/80 text-[10px] sm:text-sm tracking-tight truncate w-full">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Cesta Básica Section */}
        <section className="mb-16 sm:mb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-3">
                <Zap className="h-3 w-3 fill-secondary" />
                Essential Analytics
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-primary tracking-tight leading-tight">Cesta Básica Inteligente</h2>
              <p className="text-primary/40 font-medium mt-2 sm:mt-3 text-sm sm:text-lg max-w-xl">Monitoramento em tempo real dos itens essenciais em Dourados.</p>
            </div>
            <button 
              onClick={() => navigate('/melhor-compra')} 
              className="group flex items-center justify-center gap-3 bg-primary text-white px-6 py-4 rounded-xl sm:rounded-2xl font-bold hover:bg-primary/90 transition-all text-sm sm:text-base shadow-xl shadow-primary/10"
            >
              Relatório de Economia <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-5">
            {['Arroz', 'Feijão', 'Óleo', 'Leite', 'Café', 'Açúcar'].map((item, idx) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => handleSearch(item)}
                className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] shadow-sm border border-gray-100 flex flex-col items-center gap-3 sm:gap-4 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-secondary/5 rounded-xl sm:rounded-2xl flex items-center justify-center group-hover:bg-secondary/10 transition-colors">
                  <ShoppingBasket className="h-5 w-5 sm:h-7 sm:w-7 text-secondary" />
                </div>
                <span className="font-bold text-primary/70 text-[10px] sm:text-sm tracking-tight">{item}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Featured Markets */}
        <section className="mb-20 sm:mb-32">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 sm:mb-12 gap-6">
            <div>
              <h2 className="text-4xl sm:text-5xl font-bold text-primary tracking-tight">Parceiros Estratégicos</h2>
              <p className="text-primary/40 font-medium mt-3 text-sm sm:text-lg">Estabelecimentos que investem em transparência e competitividade.</p>
            </div>
            <button onClick={() => navigate('/mercados')} className="text-primary font-bold hover:text-secondary transition-colors text-sm sm:text-base flex items-center gap-2">
              Ver Ecossistema Completo <span>→</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {markets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </section>

        {/* Hot Offers Section */}
        <section className="mb-20 sm:mb-32">
          <div className="bg-primary rounded-[3rem] sm:rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(15,23,42,0.3)] overflow-hidden border border-white/5">
            <div className="bg-[linear-gradient(135deg,var(--color-primary),#2563EB)] px-8 sm:px-16 py-10 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-10">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary text-[10px] font-bold uppercase tracking-widest mb-4 animate-pulse">
                  <Zap className="h-3 w-3 fill-secondary" />
                  Ofertas Imperdíveis
                </div>
                <h2 className="text-4xl sm:text-6xl font-bold text-white tracking-tight leading-[0.95]">
                  Economia <br /> <span className="text-secondary italic font-serif">Garantida.</span>
                </h2>
                <p className="text-white/70 font-medium mt-6 text-lg sm:text-xl leading-relaxed">Encontre os melhores preços de Dourados com inteligência e rapidez.</p>
              </div>
              <button 
                onClick={() => navigate('/search')}
                className="w-full lg:w-auto bg-secondary text-white px-10 py-5 rounded-2xl font-bold hover:bg-white hover:text-primary transition-all duration-500 shadow-[0_20px_40px_-10px_rgba(249,115,22,0.4)] text-lg active:scale-95"
              >
                Ver Ofertas Agora
              </button>
            </div>
            
            <div className="p-8 sm:p-16 pt-0">
              <div className="flex overflow-x-auto pb-12 snap-x snap-mandatory no-scrollbar -mx-8 px-8 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
                {offers.map((offer, idx) => (
                  <motion.div 
                    key={offer.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="min-w-[280px] sm:min-w-0 snap-center group relative bg-white/5 rounded-[2.5rem] p-8 hover:bg-white transition-all duration-500 border border-white/5 hover:border-transparent hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]"
                  >
                    <div className="absolute top-6 right-6 z-10">
                      <div className="bg-secondary text-white text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest shadow-lg">
                        Destaque
                      </div>
                    </div>
                    <div className="h-48 bg-white rounded-3xl mb-8 overflow-hidden flex items-center justify-center p-6 shadow-inner">
                      <img 
                        src={offer.image_url} 
                        alt={offer.product_name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700" 
                      />
                    </div>
                    <div className="space-y-2 mb-6">
                      <h3 className="font-bold text-white group-hover:text-primary text-xl leading-tight line-clamp-2 h-14 transition-colors">{offer.product_name}</h3>
                      <div className="flex items-center gap-2 text-white/50 group-hover:text-primary/40 transition-colors">
                        <Store className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em]">{offer.market_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/10 group-hover:border-primary/10 transition-colors">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 group-hover:text-primary/40 font-bold uppercase tracking-widest transition-colors">Melhor Preço</span>
                        <span className="text-3xl font-bold text-secondary group-hover:text-primary transition-colors tracking-tighter">R$ {offer.price.toFixed(2)}</span>
                      </div>
                      <button className="bg-secondary p-4 rounded-2xl shadow-xl shadow-secondary/20 text-white hover:scale-110 transition-all">
                        <Zap className="h-6 w-6 fill-white" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-[3rem] sm:rounded-[4rem] overflow-hidden bg-primary py-16 sm:py-28 px-8 sm:px-16 text-center shadow-[0_40px_80px_-20px_rgba(15,23,42,0.4)]">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)]" />
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-secondary text-[10px] font-bold uppercase tracking-widest mb-8">
              <TrendingUp className="h-3 w-3" />
              Join the Ecosystem
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-[0.95]">
              O futuro do varejo <br /> em Dourados é <span className="text-secondary italic font-serif">digital.</span>
            </h2>
            <p className="text-white/50 text-lg sm:text-2xl mb-12 sm:mb-16 font-medium leading-relaxed max-w-2xl mx-auto">
              Seja você um consumidor em busca de economia ou um mercado buscando expansão, o PreçoCerto é sua ferramenta definitiva.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <a 
                href="https://chat.whatsapp.com/your-group-link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-500 text-white px-10 py-5 rounded-2xl font-bold hover:bg-green-600 transition-all duration-500 shadow-2xl shadow-green-900/40 flex items-center justify-center gap-4 text-lg"
              >
                <Zap className="h-6 w-6 fill-white" />
                Comunidade Exclusiva
              </a>
              <button className="w-full sm:w-auto bg-white/5 backdrop-blur-2xl text-white border border-white/10 px-10 py-5 rounded-2xl font-bold hover:bg-white/10 transition-all duration-500 text-lg">
                Seja um Parceiro
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
