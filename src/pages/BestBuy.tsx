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
    // (Only considering markets that have at least some items)
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
      // Sort by most items first, then by lowest total
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
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
          <p className="text-gray-500 font-bold animate-pulse">Calculando melhor economia...</p>
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

  // Group by market for the "Smart Map"
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
    <div className="min-h-screen bg-[#f8fafc] pb-20">
      {/* Hero Section */}
      <div className="bg-[#1E3A8A] pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#F97316] rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-blue-100 text-sm font-bold mb-6"
          >
            <TrendingDown className="h-4 w-4" />
            Inteligência de Preços
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            Melhor <span className="text-[#F97316]">Compra</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto font-medium"
          >
            Calculamos automaticamente onde comprar cada item da sua lista para garantir o menor preço total em Dourados.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {/* Economy Summary Card */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 bg-white rounded-[40px] p-8 sm:p-10 shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-8"
          >
            <div className="space-y-4 text-center sm:text-left">
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Economia Possível Hoje</h2>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center sm:justify-start gap-2 text-gray-500 font-bold">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  Total se comprasse no mais caro: <span className="text-gray-900">R$ {totalWorst.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 text-green-600 font-black">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Total nos melhores mercados: <span>R$ {totalBest.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 p-8 rounded-[32px] border-2 border-green-100 text-center min-w-[200px]">
              <span className="text-xs font-black text-green-600 uppercase tracking-widest block mb-1">Você economiza</span>
              <div className="text-4xl font-black text-green-700">R$ {economy.toFixed(2)}</div>
              <div className="mt-2 inline-flex items-center gap-1 bg-green-500 text-white text-[10px] font-black px-2 py-1 rounded-full uppercase">
                <Zap className="h-3 w-3 fill-white" />
                Melhor Escolha
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#1E3A8A] to-blue-900 rounded-[40px] p-8 shadow-xl text-white flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-300" />
                <span className="text-xs font-black uppercase tracking-widest text-blue-200">Dica de Ouro</span>
              </div>
              <h3 className="text-xl font-black mb-4 leading-tight">Prefere ir em apenas um mercado?</h3>
              {singleMarketBest ? (
                <div className="space-y-4">
                  <p className="text-blue-100 text-sm font-medium">
                    O mercado <span className="text-white font-bold">{singleMarketBest.market.name}</span> possui o melhor preço total para {singleMarketBest.itemsCount} itens da lista.
                  </p>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <div className="text-xs font-bold text-blue-200 uppercase mb-1">Total da Cesta</div>
                    <div className="text-2xl font-black">R$ {singleMarketBest.total.toFixed(2)}</div>
                  </div>
                </div>
              ) : (
                <p className="text-blue-100 text-sm">Ainda não temos dados suficientes para recomendar um mercado único.</p>
              )}
            </div>
            <button 
              onClick={() => setShowSingleMarketModal(true)}
              className="mt-6 w-full bg-[#F97316] text-white font-black py-4 rounded-2xl hover:bg-orange-600 transition-all shadow-lg shadow-orange-900/20 active:scale-95"
            >
              Comprar tudo no mesmo mercado
            </button>
          </motion.div>
        </div>

        {/* Smart Route / Roteiro */}
        <section className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-orange-100 p-3 rounded-2xl">
              <MapPin className="h-6 w-6 text-[#F97316]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">📍 Roteiro de Economia</h2>
              <p className="text-gray-500 font-medium">Siga este caminho para gastar o mínimo possível.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(roteiro).map(([marketId, data], idx) => {
              const marketData = data as { marketName: string; marketLogo?: string; items: { name: string; price: number }[] };
              return (
                <motion.div 
                  key={marketId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                      {marketData.marketLogo ? (
                        <img src={marketData.marketLogo} alt={marketData.marketName} className="w-full h-full object-contain p-1" />
                      ) : (
                        <Store className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Parada {idx + 1}</span>
                      <h3 className="font-black text-gray-900">{marketData.marketName}</h3>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {marketData.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 font-medium">{item.name}</span>
                        <span className="font-black text-[#1E3A8A]">R$ {item.price.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400">Subtotal</span>
                    <span className="text-lg font-black text-green-600">
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
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-100 p-3 rounded-2xl">
              <ShoppingCart className="h-6 w-6 text-[#1E3A8A]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">Comparativo Detalhado</h2>
              <p className="text-gray-500 font-medium">Veja os preços de cada item em todos os mercados.</p>
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-8 py-6 font-black text-xs text-gray-400 uppercase tracking-widest">Produto</th>
                    <th className="px-8 py-6 font-black text-xs text-gray-400 uppercase tracking-widest">Mercado Mais Barato</th>
                    <th className="px-8 py-6 font-black text-xs text-gray-400 uppercase tracking-widest">Melhor Preço</th>
                    <th className="px-8 py-6 font-black text-xs text-gray-400 uppercase tracking-widest">Outros Preços</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {results.map((result, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-50 rounded-xl p-2 border border-gray-100 flex-shrink-0">
                            <img src={result.bestOffer?.image_url} alt={result.productKeyword} className="w-full h-full object-contain" />
                          </div>
                          <div>
                            <div className="font-black text-gray-900 group-hover:text-[#1E3A8A] transition-colors">{result.bestOffer?.product_name}</div>
                            <div className="text-xs text-gray-400 font-bold uppercase tracking-widest">{result.productKeyword}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-gray-50 rounded-md overflow-hidden border border-gray-100 flex-shrink-0">
                            <img src={result.bestOffer?.market_logo} alt={result.bestOffer?.market_name} className="w-full h-full object-contain p-0.5" />
                          </div>
                          <span className="font-bold text-gray-700">{result.bestOffer?.market_name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl font-black text-lg border border-green-100">
                          <TrendingDown className="h-4 w-4" />
                          R$ {result.bestOffer?.price.toFixed(2)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-wrap gap-2">
                          {result.allOffers.slice(1, 4).map((o, i) => (
                            <div key={i} className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                              {o.market_name}: R$ {o.price.toFixed(2)}
                            </div>
                          ))}
                          {result.allOffers.length > 4 && (
                            <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest flex items-center">
                              +{result.allOffers.length - 4} mais
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[40px] w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 bg-[#1E3A8A] text-white flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    <img src={singleMarketBest.market.logo} alt={singleMarketBest.market.name} className="w-full h-full object-contain p-1" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight">{singleMarketBest.market.name}</h2>
                    <p className="text-blue-200 text-xs font-bold uppercase tracking-widest">Melhor Opção de Mercado Único</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowSingleMarketModal(false)}
                  className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <div className="space-y-4">
                  {singleMarketItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white rounded-lg p-1 border border-gray-100">
                          <img src={item?.image_url} alt={item?.product_name} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-bold text-gray-700">{item?.product_name}</span>
                      </div>
                      <span className="font-black text-[#1E3A8A]">R$ {item?.price.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Total da Compra</span>
                  <div className="text-3xl font-black text-[#1E3A8A]">R$ {singleMarketBest.total.toFixed(2)}</div>
                </div>
                <button className="bg-[#F97316] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-900/20 hover:bg-orange-600 transition-all">
                  Ir para o Mercado
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty State / Warning */}
        {results.length === 0 && (
          <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border border-gray-100">
            <div className="bg-orange-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-10 w-10 text-[#F97316]" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Ainda não temos ofertas suficientes</h2>
            <p className="text-gray-500 font-medium max-w-md mx-auto">
              Os mercados ainda estão cadastrando os preços da cesta básica. Volte em breve para ver o comparativo completo!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
