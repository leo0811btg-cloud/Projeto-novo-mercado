import React from 'react';
import { Offer } from '../types';
import { ShoppingCart, TrendingDown, Store, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface PriceTableProps {
  offers: Offer[];
}

export default function PriceTable({ offers }: PriceTableProps) {
  if (offers.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-[32px] shadow-sm border border-gray-100">
        <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="h-10 w-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhuma oferta encontrada</h3>
        <p className="text-gray-500 max-w-xs mx-auto">Tente buscar por outro produto ou limpe os filtros aplicados.</p>
      </div>
    );
  }

  // Group offers by product to find min/max for highlighting
  const productGroups = offers.reduce((acc, offer) => {
    if (!acc[offer.product_id]) {
      acc[offer.product_id] = [];
    }
    acc[offer.product_id].push(offer);
    return acc;
  }, {} as Record<number, Offer[]>);

  const isCheapest = (offer: Offer) => {
    const group = productGroups[offer.product_id];
    if (!group || group.length === 1) return false;
    const minPrice = Math.min(...group.map(o => o.price));
    return offer.price === minPrice;
  };

  return (
    <div className="space-y-4">
      {offers.map((offer, idx) => (
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className={`group relative bg-white rounded-[24px] sm:rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all border-2 ${
            isCheapest(offer) ? 'border-green-100 bg-green-50/30' : 'border-transparent'
          }`}
        >
          {isCheapest(offer) && (
            <div className="absolute -top-3 left-4 sm:left-6">
              <div className="bg-green-500 text-white text-[9px] sm:text-[10px] font-black px-2 sm:px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1">
                <TrendingDown className="h-3 w-3" />
                Melhor Preço
              </div>
            </div>
          )}

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 sm:gap-6">
            {/* Product Info */}
            <div className="flex items-center gap-3 sm:gap-4 flex-grow">
              <div className="h-16 w-16 sm:h-20 sm:w-20 bg-white rounded-2xl p-2 shadow-sm border border-gray-100 flex-shrink-0">
                <img className="h-full w-full object-contain" src={offer.image_url} alt={offer.product_name} />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 leading-tight line-clamp-2">{offer.product_name}</h3>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">{offer.brand}</p>
              </div>
            </div>

            {/* Market Info */}
            <div className="flex items-center gap-3 px-4 sm:px-6 py-2 sm:py-3 bg-gray-50 rounded-2xl">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-white rounded-xl flex items-center justify-center text-[#1E3A8A] font-black shadow-sm border border-gray-100 overflow-hidden text-sm sm:text-base">
                {offer.market_logo ? (
                  <img src={offer.market_logo} alt={offer.market_name} className="h-full w-full object-contain p-1" />
                ) : (
                  offer.market_name?.[0]
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Mercado</span>
                <span className="text-xs sm:text-sm font-bold text-gray-700">{offer.market_name}</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between md:gap-8 pt-2 sm:pt-0">
              <div className="flex flex-col">
                <span className="text-[9px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest">Preço</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[10px] sm:text-xs font-bold text-[#1E3A8A]">R$</span>
                  <span className={`text-2xl sm:text-3xl font-black ${isCheapest(offer) ? 'text-green-600' : 'text-[#1E3A8A]'}`}>
                    {offer.price.toFixed(2)}
                  </span>
                </div>
              </div>
              
              <button className={`p-3 sm:p-4 rounded-2xl transition-all ${
                isCheapest(offer) 
                  ? 'bg-green-500 text-white shadow-lg shadow-green-200 hover:bg-green-600' 
                  : 'bg-[#1E3A8A] text-white shadow-lg shadow-blue-200 hover:bg-blue-800'
              }`}>
                <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Válido até: {new Date(offer.valid_until).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-1">
                <Store className="h-3 w-3" />
                Dourados - MS
              </div>
            </div>
            <div className="hidden sm:block">
              Atualizado em: {new Date(offer.created_at).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
