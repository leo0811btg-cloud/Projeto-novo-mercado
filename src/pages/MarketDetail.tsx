import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Market, Offer } from '../types';
import PriceTable from '../components/PriceTable';
import { 
  MapPin, 
  Phone, 
  Clock, 
  ChevronLeft, 
  Search, 
  Filter,
  UtensilsCrossed,
  Beer,
  Apple,
  Leaf,
  Package,
  Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const CATEGORIES = [
  { id: 'all', name: 'Todos', icon: Package },
  { id: 'Açougue', name: 'Açougue', icon: UtensilsCrossed },
  { id: 'Bebidas', name: 'Bebidas', icon: Beer },
  { id: 'Frutas', name: 'Frutas', icon: Apple },
  { id: 'Verduras', name: 'Verduras', icon: Leaf },
  { id: 'Alimentos', name: 'Alimentos', icon: Zap },
  { id: 'Limpeza', name: 'Limpeza', icon: Filter },
];

export default function MarketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [market, setMarket] = useState<Market | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    // Fetch market details
    fetch(`/api/markets/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          navigate('/');
        } else {
          setMarket(data);
        }
      });

    // Fetch offers for this market
    fetch(`/api/offers?markets=${id}`)
      .then(res => res.json())
      .then(data => {
        setOffers(data);
        setLoading(false);
      });
  }, [id, navigate]);

  const filteredOffers = offers.filter(offer => {
    const matchesCategory = selectedCategory === 'all' || offer.category === selectedCategory;
    const matchesSearch = offer.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         offer.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading && !market) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-[#1E3A8A]"></div>
      </div>
    );
  }

  if (!market) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Header */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden">
        <img 
          src={market.cover_image || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=1000&auto=format&fit=crop'} 
          alt={market.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 p-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div className="absolute bottom-8 left-0 right-0 px-4 sm:px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="h-20 w-20 sm:h-24 sm:w-24 bg-white rounded-3xl p-2 shadow-2xl flex-shrink-0 flex items-center justify-center overflow-hidden">
                {market.logo ? (
                  <img src={market.logo} alt={market.name} className="h-full w-full object-contain" />
                ) : (
                  <span className="text-3xl font-black text-[#1E3A8A]">{market.name[0]}</span>
                )}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-2">{market.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-blue-100/80 text-sm font-medium">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-[#F97316]" />
                    {market.address}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-[#F97316]" />
                    {market.hours}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <a 
                href={`tel:${market.phone}`}
                className="flex-grow sm:flex-grow-0 bg-white text-[#1E3A8A] px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition shadow-lg"
              >
                <Phone className="h-5 w-5" />
                {market.phone}
              </a>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Category Filter Bar */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">Ofertas do Dia</h2>
            <div className="relative hidden sm:block w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar no mercado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A8A]/10 focus:border-[#1E3A8A] shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all border-2 ${
                  selectedCategory === cat.id
                    ? 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-lg shadow-blue-900/20 scale-105'
                    : 'bg-white text-gray-500 border-transparent hover:border-gray-100 hover:bg-gray-50'
                }`}
              >
                <cat.icon className={`h-4 w-4 ${selectedCategory === cat.id ? 'text-[#F97316]' : 'text-gray-400'}`} />
                {cat.name}
              </button>
            ))}
          </div>

          {/* Mobile Search */}
          <div className="relative sm:hidden mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="O que você procura neste mercado?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl text-base focus:outline-none focus:ring-4 focus:ring-[#1E3A8A]/5 focus:border-[#1E3A8A] shadow-sm"
            />
          </div>
        </div>

        {/* Results */}
        <div className="relative">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20"
              >
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-100 border-t-[#1E3A8A]"></div>
                <p className="mt-4 text-gray-400 font-bold uppercase tracking-widest text-xs">Carregando ofertas...</p>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <PriceTable offers={filteredOffers} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
