import React from 'react';
import { Offer } from '../types';
import { ShoppingCart, TrendingDown, Store, Calendar, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
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
    <div className="space-y-6">
      {offers.map((offer, idx) => (
        <motion.div
          key={offer.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={`group relative bg-white rounded-[2.5rem] p-6 sm:p-8 transition-all duration-500 border ${
            isCheapest(offer) 
              ? 'border-secondary/20 bg-secondary/[0.02] shadow-[0_32px_64px_-16px_rgba(245,158,11,0.1)]' 
              : 'border-primary/5 hover:border-primary/10 hover:shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)]'
          }`}
        >
          {isCheapest(offer) && (
            <div className="absolute -top-3 left-8 sm:left-10">
              <div className="bg-secondary text-white text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg flex items-center gap-2">
                <TrendingDown className="h-3.5 w-3.5" />
                Melhor Preço
              </div>
            </div>
          )}

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-6 sm:gap-10">
            {/* Product Info */}
            <div className="flex items-center gap-4 sm:gap-8 flex-grow">
              <div className="h-20 w-20 sm:h-32 sm:w-32 bg-white rounded-2xl sm:rounded-[2rem] p-3 sm:p-4 shadow-sm border border-primary/5 flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                <img className="h-full w-full object-contain" src={offer.image_url} alt={offer.product_name} />
              </div>
              <div className="space-y-1 sm:space-y-2">
                <h3 className="text-lg sm:text-2xl font-bold text-primary leading-tight line-clamp-2 transition-colors group-hover:text-secondary">{offer.product_name}</h3>
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-[9px] sm:text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">{offer.brand}</span>
                  <div className="h-1 w-1 bg-primary/10 rounded-full" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em]">Dourados - MS</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row lg:flex-row items-center justify-between lg:justify-start gap-4 sm:gap-10">
              {/* Market Info */}
              <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 rounded-2xl border border-transparent group-hover:border-primary/5 transition-all flex-grow lg:flex-grow-0">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary font-black shadow-sm border border-primary/5 overflow-hidden flex-shrink-0">
                  {offer.market_logo ? (
                    <img src={offer.market_logo} alt={offer.market_name} className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <Store className="h-5 w-5 text-primary/20" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-[8px] sm:text-[10px] text-primary/30 font-bold uppercase tracking-widest">Estabelecimento</span>
                  <span className="text-xs sm:text-sm font-bold text-primary truncate max-w-[100px] sm:max-w-none">{offer.market_name}</span>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex items-center gap-4 sm:gap-12">
                <div className="flex flex-col items-end lg:items-start">
                  <span className="text-[8px] sm:text-[10px] text-primary/30 font-bold uppercase tracking-widest">Valor</span>
                  <div className="flex items-baseline gap-0.5 sm:gap-1">
                    <span className="text-[10px] sm:text-xs font-bold text-primary/40">R$</span>
                    <span className={`text-2xl sm:text-5xl font-bold tracking-tighter ${isCheapest(offer) ? 'text-secondary' : 'text-primary'}`}>
                      {offer.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                
                <button className={`p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] transition-all duration-500 ${
                  isCheapest(offer) 
                    ? 'bg-secondary text-white shadow-2xl shadow-secondary/20 hover:scale-110' 
                    : 'bg-primary text-white shadow-2xl shadow-primary/20 hover:bg-secondary'
                }`}>
                  <ArrowRight className="h-5 w-5 sm:h-7 sm:w-7" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div className="mt-8 pt-6 border-t border-primary/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-primary/20">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                Validade: {new Date(offer.valid_until).toLocaleDateString('pt-BR')}
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5" />
                Sincronizado: {new Date(offer.created_at).toLocaleDateString('pt-BR')}
              </div>
            </div>
            <div className="flex items-center gap-2 text-secondary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Dados Auditados
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
