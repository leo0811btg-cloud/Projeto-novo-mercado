import React, { useEffect, useState } from 'react';
import Hero from '../components/Hero';
import MarketCard from '../components/MarketCard';
import { Market, Offer } from '../types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingBasket, Beef, Milk, Sparkles, Coffee, Apple, Zap } from 'lucide-react';

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
    <div className="min-h-screen bg-[#f8fafc]">
      <Hero onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-0 sm:-mt-10 relative z-20 pb-16 sm:pb-24">
        {/* Categories Section */}
        <section className="mb-12 sm:mb-20">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat, idx) => (
              <motion.button
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                onClick={() => handleSearch(cat.name)}
                className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all group border border-gray-100 flex flex-col items-center gap-2 sm:gap-3"
              >
                <div className={`p-3 sm:p-4 rounded-2xl ${cat.color} group-hover:scale-110 transition-transform`}>
                  <cat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span className="font-bold text-gray-700 text-xs sm:text-sm">{cat.name}</span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Featured Markets */}
        <section className="mb-16 sm:mb-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Mercados Parceiros</h2>
              <p className="text-gray-500 font-medium mt-1 sm:mt-2 text-sm sm:text-base">Os melhores estabelecimentos de Dourados em um só lugar.</p>
            </div>
            <button onClick={() => navigate('/mercados')} className="flex items-center gap-2 text-[#1E3A8A] font-bold hover:gap-3 transition-all text-sm sm:text-base">
              Ver todos <span className="text-xl">→</span>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {markets.map(market => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </section>

        {/* Hot Offers Section */}
        <section className="mb-16 sm:mb-24">
          <div className="bg-white rounded-[32px] sm:rounded-[40px] shadow-2xl shadow-blue-900/5 overflow-hidden border border-gray-100">
            <div className="bg-gradient-to-r from-[#F97316] to-orange-400 px-6 sm:px-10 py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
                  <Zap className="h-6 w-6 sm:h-8 sm:w-8 fill-white" />
                  Ofertas Imperdíveis
                </h2>
                <p className="text-orange-50 font-medium mt-1 text-sm sm:text-base">Preços que você só encontra aqui hoje.</p>
              </div>
              <button 
                onClick={() => navigate('/search')}
                className="w-full sm:w-auto bg-white text-[#F97316] px-8 py-3 rounded-2xl font-bold hover:bg-orange-50 transition-colors shadow-lg"
              >
                Ver Todas as Ofertas
              </button>
            </div>
            
            <div className="p-6 sm:p-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {offers.map((offer, idx) => (
                  <motion.div 
                    key={offer.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="group relative bg-gray-50 rounded-3xl p-6 hover:bg-white hover:shadow-xl transition-all border border-transparent hover:border-gray-100"
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter">
                        Oferta
                      </div>
                    </div>
                    <div className="h-40 bg-white rounded-2xl mb-6 overflow-hidden flex items-center justify-center p-4">
                      <img 
                        src={offer.image_url} 
                        alt={offer.product_name} 
                        className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" 
                      />
                    </div>
                    <div className="space-y-1 mb-4">
                      <h3 className="font-bold text-gray-900 text-lg leading-tight line-clamp-2 h-12">{offer.product_name}</h3>
                      <div className="flex items-center gap-2 text-gray-400">
                        <ShoppingBasket className="h-3 w-3" />
                        <span className="text-xs font-bold uppercase tracking-wider">{offer.market_name}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-tighter">Por apenas</span>
                        <span className="text-2xl font-black text-[#1E3A8A]">R$ {offer.price.toFixed(2)}</span>
                      </div>
                      <button className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-[#F97316] hover:bg-[#F97316] hover:text-white transition-all">
                        <Zap className="h-5 w-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative rounded-[32px] sm:rounded-[40px] overflow-hidden bg-[#1E3A8A] py-12 sm:py-20 px-6 sm:px-10 text-center">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 sm:mb-6 tracking-tight leading-tight">
              Economize até 30% nas suas <br className="hidden sm:block" /> compras do mês! 💰
            </h2>
            <p className="text-blue-100 text-base sm:text-lg mb-8 sm:mb-10 font-medium opacity-80">
              Junte-se a milhares de douradenses que já estão economizando todos os dias com o PreçoCerto.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a 
                href="https://chat.whatsapp.com/your-group-link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full sm:w-auto bg-green-500 text-white px-8 sm:px-10 py-4 rounded-2xl font-bold hover:bg-green-600 transition shadow-xl shadow-green-900/20 flex items-center justify-center gap-3"
              >
                <Zap className="h-5 w-5 fill-white" />
                Entrar no Grupo WhatsApp
              </a>
              <button className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 sm:px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition">
                Saiba Mais
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
