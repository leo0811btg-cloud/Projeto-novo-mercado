import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, TrendingDown, Store, MapPin, ChevronRight, Info, Zap, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { Offer, Market } from '../types';

const CESTA_BASICA = [
  'Arroz', 'Feijão', 'Açúcar', 'Café', 'Leite', 'Óleo de soja', 'Farinha de trigo', 
  'Farinha de mandioca', 'Macarrão', 'Sal', 'Carne', 'Manteiga', 'Margarina', 
  'Pão', 'Batata', 'Tomate', 'Banana'
];

const COMPLEMENTARES = [
  'Ovos', 'Frango', 'Detergente', 'Sabão em pó', 'Água sanitária', 
  'Papel higiênico', 'Creme dental', 'Sabonete'
];

const ALL_ITEMS = [...CESTA_BASICA, ...COMPLEMENTARES];

interface BestPriceResult {
  productKeyword: string;
  bestOffer: Offer | null;
  allOffers: Offer[];
}

export default function BestBuy() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<BestPriceResult[]>([]);
  const [singleMarketBest, setSingleMarketBest] = useState<{ market: Market; total: number; itemsCount: number } | null>(null);
  const [showSingleMarketModal, setShowSingleMarketModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [offersRes, marketsRes] = await Promise.all([
        fetch('/api/offers'),
        fetch('/api/markets')
      ]);
      
      const allOffers: Offer[] = await offersRes.json();
      const allMarkets: Market[] = await marketsRes.json();
      
      setOffers(allOffers);
      setMarkets(allMarkets);
      processBestBuy(allOffers, allMarkets);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const processBestBuy = (allOffers: Offer[], allMarkets: Market[]) => {
    // 1. Find best price for each item in the list
    const bestPrices: BestPriceResult[] = ALL_ITEMS.map(keyword => {
      const itemOffers = allOffers.filter(o => 
        o.product_name?.toLowerCase().includes(keyword.toLowerCase())
      );
      
      if (itemOffers.length === 0) return { productKeyword: keyword, bestOffer: null, allOffers: [] };
      
      const sorted = [...itemOffers].sort((a, b) => a.price - b.price);
      return {
        productKeyword: keyword,
        bestOffer: sorted[0],
        allOffers: sorted
      };
    }).filter(r => r.bestOffer !== null);

    setResults(bestPrices);

    // 2. Find best single market for the whole basket
    const marketTotals = allMarkets.map(market => {
      let total = 0;
      let itemsCount = 0;
      
      ALL_ITEMS.forEach(keyword => {
        const marketOffers = allOffers.filter(o => 
          o.market_id === market.id && 
          o.product_name?.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (marketOffers.length > 0) {
          const bestInMarket = [...marketOffers].sort((a, b) => a.price - b.price)[0];
          total += bestInMarket.price;
          itemsCount++;
        }
      });
      
      return { market, total, itemsCount };
    }).filter(m => m.itemsCount > 0);

    if (marketTotals.length > 0) {
      const bestSingle = marketTotals.sort((a, b) => {
        if (b.itemsCount !== a.itemsCount) return b.itemsCount - a.itemsCount;
        return a.total - b.total;
      })[0];
      setSingleMarketBest(bestSingle);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-primary"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="h-8 w-8 text-secondary animate-pulse" />
            </div>
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-serif italic text-primary mb-2">Analisando o Mercado</h2>
            <p className="text-primary/40 font-bold tracking-widest text-[10px] uppercase">Market Intelligence Engine</p>
          </div>
        </div>
      </div>
    );
  }

  const totalBest = results.reduce((acc, r) => acc + (r.bestOffer?.price || 0), 0);
  const totalWorst = results.reduce((acc, r) => {
    if (r.allOffers.length === 0) return acc;
    const worst = [...r.allOffers].sort((a, b) => b.price - a.price)[0];
    return acc + worst.price;
  }, 0);
  const economy = totalWorst - totalBest;

  const roteiro = results.reduce((acc, r) => {
    if (!r.bestOffer) return acc;
    const marketId = r.bestOffer.market_id;
    if (!acc[marketId]) {
      acc[marketId] = {
        marketName: r.bestOffer.market_name || 'Mercado',
        marketLogo: r.bestOffer.market_logo,
        items: []
      };
    }
    acc[marketId].items.push({
      name: r.bestOffer.product_name,
      price: r.bestOffer.price
    });
    return acc;
  }, {} as Record<number, { marketName: string; marketLogo?: string; items: { name: string; price: number }[] }>);

  const singleMarketItems = singleMarketBest ? ALL_ITEMS.map(keyword => {
    const marketOffers = offers.filter(o => 
      o.market_id === singleMarketBest.market.id && 
      o.product_name?.toLowerCase().includes(keyword.toLowerCase())
    );
    return marketOffers.length > 0 ? [...marketOffers].sort((a, b) => a.price - b.price)[0] : null;
  }).filter(o => o !== null) : [];

  return (
    <div className="min-h-screen bg-gray-50/50 pb-24">
      {/* Hero Section */}
      <div className="bg-primary pt-40 pb-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(59,130,246,0.15),transparent_70%)]"></div>
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full translate-x-1/2 translate-y-1/2 blur-[120px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-3 bg-white/5 backdrop-blur-xl px-5 py-2.5 rounded-full text-secondary text-[11px] font-bold uppercase tracking-[0.2em] mb-8 border border-white/10"
          >
            <TrendingDown className="h-4 w-4" />
            Market Intelligence Report
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-serif italic text-white mb-8 tracking-tight"
          >
            Melhor <span className="text-secondary not-italic font-sans font-black">Compra</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/60 max-w-2xl mx-auto font-medium"
          >
            Otimização algorítmica de cesta básica. Encontramos a combinação perfeita de mercados para maximizar seu poder de compra.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        {/* Economy Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8 sm:gap-10"
          >
            <div className="space-y-4 sm:space-y-6 text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">Análise de Economia</h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center justify-center sm:justify-start gap-3 text-primary/40 font-bold text-xs sm:text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary/20"></div>
                  Custo de Oportunidade: <span className="text-primary opacity-60">R$ {totalWorst.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-3 text-secondary font-black text-xs sm:text-sm">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  Investimento Otimizado: <span>R$ {totalBest.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-primary p-8 sm:p-10 rounded-3xl sm:rounded-[2.5rem] text-center min-w-[200px] sm:min-w-[240px] shadow-2xl shadow-primary/20 relative overflow-hidden group w-full sm:w-auto">
              <div className="absolute inset-0 bg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="text-[9px] sm:text-[10px] font-black text-secondary uppercase tracking-[0.2em] block mb-2 relative z-10 group-hover:text-white transition-colors">Economia Gerada</span>
              <div className="text-4xl sm:text-5xl font-black text-white relative z-10">R$ {economy.toFixed(2)}</div>
              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-secondary relative z-10 group-hover:text-white transition-colors">
                <Zap className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-current animate-pulse" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">Retorno Imediato</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[3rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-secondary/10 p-2.5 rounded-xl">
                  <Info className="h-5 w-5 text-secondary" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/30">Insight Estratégico</span>
              </div>
              <h3 className="text-2xl font-bold text-primary mb-4 leading-tight">Conveniência vs. Economia</h3>
              {singleMarketBest ? (
                <div className="space-y-5">
                  <p className="text-primary/60 text-sm font-medium leading-relaxed">
                    Para uma jornada de compra única, o <span className="text-primary font-bold">{singleMarketBest.market.name}</span> apresenta a melhor eficiência para {singleMarketBest.itemsCount} itens.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                    <div className="text-[10px] font-bold text-primary/30 uppercase tracking-widest mb-1">Total Consolidado</div>
                    <div className="text-3xl font-black text-primary">R$ {singleMarketBest.total.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <p className="text-primary/40 text-sm italic">Processando dados de parceiros estratégicos...</p>
              )}
            </div>
            <button 
              onClick={() => setShowSingleMarketModal(true)}
              className="mt-8 w-full bg-primary text-white font-bold py-5 rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 active:scale-[0.98] text-sm"
            >
              Ver Detalhes do Mercado Único
            </button>
          </motion.div>
        </div>

        {/* Smart Route / Roteiro */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-5">
              <div className="bg-secondary p-4 rounded-2xl shadow-lg shadow-secondary/20">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-primary tracking-tight">Logística de Economia</h2>
                <p className="text-primary/40 font-medium">Roteiro otimizado para múltiplos pontos de venda.</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(roteiro).map(([marketId, data], idx) => {
              const marketData = data as { marketName: string; marketLogo?: string; items: { name: string; price: number }[] };
              return (
                <motion.div 
                  key={marketId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[2.5rem] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transition-all duration-500"
                >
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 overflow-hidden group-hover:scale-110 transition-transform duration-500">
                      {marketData.marketLogo ? (
                        <img src={marketData.marketLogo} alt={marketData.marketName} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Store className="h-7 w-7 text-primary/20" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Checkpoint {idx + 1}</span>
                      <h3 className="text-xl font-bold text-primary">{marketData.marketName}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    {marketData.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-primary/60 font-semibold">{item.name}</span>
                        <span className="font-bold text-primary">R$ {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-8 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">Subtotal Alocado</span>
                    <span className="text-2xl font-black text-primary">
                      R$ {marketData.items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Detailed Comparison Table */}
        <section>
          <div className="flex items-center gap-5 mb-10">
            <div className="bg-primary p-4 rounded-2xl shadow-lg shadow-primary/20">
              <ShoppingCart className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-primary tracking-tight">Matriz de Preços</h2>
              <p className="text-primary/40 font-medium">Comparativo granular de SKUs por parceiro estratégico.</p>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-10 py-8 font-black text-[10px] text-primary/30 uppercase tracking-[0.2em]">Ativo / Produto</th>
                    <th className="px-10 py-8 font-black text-[10px] text-primary/30 uppercase tracking-[0.2em]">Market Leader</th>
                    <th className="px-10 py-8 font-black text-[10px] text-primary/30 uppercase tracking-[0.2em]">Best Quote</th>
                    <th className="px-10 py-8 font-black text-[10px] text-primary/30 uppercase tracking-[0.2em]">Benchmark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {results.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 bg-gray-50 rounded-2xl p-2.5 border border-gray-100 flex-shrink-0 group-hover:scale-110 transition-transform duration-500">
                            <img src={result.bestOffer?.image_url} alt={result.productKeyword} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="font-bold text-primary text-lg group-hover:text-secondary transition-colors duration-300">{result.bestOffer?.product_name}</div>
                            <div className="text-[10px] text-primary/30 font-bold uppercase tracking-widest">{result.productKeyword}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                            <img src={result.bestOffer?.market_logo} alt={result.bestOffer?.market_name} className="w-full h-full object-contain p-1" />
                          </div>
                          <span className="font-bold text-primary/70">{result.bestOffer?.market_name}</span>
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-xl font-black text-xl border border-green-100">
                          <TrendingDown className="h-4 w-4" />
                          R$ {result.bestOffer?.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-10 py-8">
                        <div className="flex flex-wrap gap-2.5">
                          {result.allOffers.slice(1, 4).map((o, i) => (
                            <div key={i} className="text-[10px] font-bold text-primary/40 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                              {o.market_name}: R$ {o.price.toFixed(2)}
                            </div>
                          ))}
                          {result.allOffers.length > 4 && (
                            <div className="text-[9px] font-black text-primary/20 uppercase tracking-widest flex items-center">
                              +{result.allOffers.length - 4} quotes
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Single Market Modal */}
        {showSingleMarketModal && singleMarketBest && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-[3.5rem] w-full max-w-3xl overflow-hidden shadow-[0_64px_128px_-32px_rgba(0,0,0,0.3)]"
            >
              <div className="p-10 bg-primary text-white flex items-center justify-between relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_70%)]"></div>
                <div className="flex items-center gap-6 relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-xl">
                    <img src={singleMarketBest.market.logo} alt={singleMarketBest.market.name} className="w-full h-full object-contain p-2" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-serif italic tracking-tight">{singleMarketBest.market.name}</h2>
                    <p className="text-secondary text-[10px] font-black uppercase tracking-[0.2em]">Consolidated Basket Report</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSingleMarketModal(false)}
                  className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all relative z-10"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-10 max-h-[50vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {singleMarketItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-gray-50 rounded-[1.5rem] border border-gray-100 group hover:bg-white hover:shadow-xl hover:border-transparent transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl p-2 border border-gray-100 group-hover:scale-110 transition-transform">
                          <img src={item?.image_url} alt={item?.product_name} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-primary/70 text-sm">{item?.product_name}</span>
                      </div>
                      <span className="font-black text-primary">R$ {item?.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-10 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-black text-primary/30 uppercase tracking-[0.2em] block mb-2">Total Consolidado</span>
                  <div className="text-4xl font-black text-primary">R$ {singleMarketBest.total.toFixed(2)}</div>
                </div>
                <button className="w-full sm:w-auto bg-secondary text-primary px-12 py-5 rounded-2xl font-black shadow-2xl shadow-secondary/20 hover:bg-secondary/90 transition-all text-sm uppercase tracking-widest">
                  Gerar Rota de Compra
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty State / Warning */}
        {results.length === 0 && (
          <div className="bg-white rounded-[3rem] p-24 text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-gray-100">
            <div className="bg-secondary/10 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
              <AlertCircle className="h-12 w-12 text-secondary" />
            </div>
            <h2 className="text-3xl font-bold text-primary mb-4 tracking-tight">Dados em Processamento</h2>
            <p className="text-primary/40 font-medium max-w-md mx-auto leading-relaxed">
              Nossa rede de parceiros estratégicos está atualizando os índices de preços. O relatório de inteligência estará disponível em instantes.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
