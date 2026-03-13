import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PriceTable from '../components/PriceTable';
import { Offer, Market, Product } from '../types';
import { Search as SearchIcon, Filter, X, SlidersHorizontal, Check, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const selectedMarkets = searchParams.get('markets')?.split(',').filter(Boolean) || [];
  const selectedProducts = searchParams.get('products')?.split(',').filter(Boolean) || [];
  const selectedCategories = searchParams.get('categories')?.split(',').filter(Boolean) || [];
  
  const [offers, setOffers] = useState<Offer[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [sort, setSort] = useState('price_asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    // Fetch filter options
    fetch('/api/markets').then(res => res.json()).then(setMarkets);
    fetch('/api/products').then(res => res.json()).then(setProducts);
    fetch('/api/categories').then(res => res.json()).then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (sort) params.set('sort', sort);
    if (selectedMarkets.length > 0) params.set('markets', selectedMarkets.join(','));
    if (selectedProducts.length > 0) params.set('products', selectedProducts.join(','));
    if (selectedCategories.length > 0) params.set('categories', selectedCategories.join(','));

    fetch(`/api/offers?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setOffers(data);
        setLoading(false);
      });
  }, [query, sort, selectedMarkets.join(','), selectedProducts.join(','), selectedCategories.join(',')]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newQuery = formData.get('q') as string;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('q', newQuery);
    setSearchParams(newParams);
  };

  const toggleFilter = (type: 'markets' | 'products' | 'categories', id: string) => {
    let current: string[];
    if (type === 'markets') current = selectedMarkets;
    else if (type === 'products') current = selectedProducts;
    else current = selectedCategories;

    const next = current.includes(id) 
      ? current.filter(i => i !== id) 
      : [...current, id];
    
    const newParams = new URLSearchParams(searchParams);
    if (next.length > 0) {
      newParams.set(type, next.join(','));
    } else {
      newParams.delete(type);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams({ q: query });
  };

  return (
    <div className="min-h-screen bg-white py-12 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        {/* Search Header */}
        <div className="mb-10 sm:mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-6xl font-bold text-primary tracking-tight leading-[1.1] sm:leading-[0.95] mb-4 sm:mb-6">
                Análise de <br className="hidden sm:block" /> <span className="text-secondary italic font-serif">Mercado.</span>
              </h1>
              <p className="text-primary/40 font-medium text-base sm:text-xl leading-relaxed">
                Resultados detalhados para <span className="text-primary font-bold">"{query || 'Todos os produtos'}"</span>.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-grow group">
              <SearchIcon className="absolute left-5 sm:left-6 top-1/2 transform -translate-y-1/2 text-primary/30 h-5 w-5 sm:h-6 sm:w-6 group-focus-within:text-secondary transition-colors" />
              <input
                name="q"
                defaultValue={query}
                type="text"
                className="w-full pl-12 sm:pl-16 pr-5 sm:pr-6 py-4 sm:py-5 rounded-2xl sm:rounded-3xl bg-primary/5 border border-primary/5 focus:bg-white focus:ring-4 focus:ring-secondary/10 focus:border-secondary outline-none transition-all font-medium text-base sm:text-lg text-primary placeholder:text-primary/20"
                placeholder="O que você procura?"
              />
            </div>
            <div className="flex gap-3 sm:gap-4">
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-3 bg-white text-primary px-5 py-4 rounded-2xl font-bold border border-primary/10 shadow-sm hover:bg-primary/5 transition-all"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
              <button type="submit" className="flex-grow sm:flex-grow-0 bg-primary text-white px-8 sm:px-12 py-4 sm:py-5 rounded-2xl sm:rounded-3xl font-bold hover:bg-secondary hover:text-primary transition-all duration-500 shadow-2xl shadow-primary/20 text-base sm:text-lg">
                Analisar
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-12 relative">
          {/* Mobile Filters Overlay */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] md:hidden bg-primary/40 backdrop-blur-md"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute right-0 top-0 bottom-0 w-[90%] max-w-sm bg-white shadow-2xl overflow-hidden flex flex-col"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-8 border-b border-primary/5 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-3xl font-bold text-primary tracking-tight">Filtros</h2>
                    <button onClick={() => setShowFilters(false)} className="p-3 bg-primary/5 rounded-2xl hover:bg-primary/10 transition-all">
                      <X className="h-6 w-6 text-primary" />
                    </button>
                  </div>
                  <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
                    <FiltersContent 
                      sort={sort} 
                      setSort={setSort} 
                      markets={markets}
                      products={products}
                      categories={categories}
                      selectedMarkets={selectedMarkets}
                      selectedProducts={selectedProducts}
                      selectedCategories={selectedCategories}
                      toggleFilter={toggleFilter}
                      clearFilters={clearFilters}
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <div className="sticky top-28 bg-white p-8 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] border border-primary/5 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center mb-8 text-primary font-bold text-2xl border-b border-primary/5 pb-6">
                <Filter className="h-6 w-6 mr-3 text-secondary" />
                Filtros
              </div>
              <FiltersContent 
                sort={sort} 
                setSort={setSort} 
                markets={markets}
                products={products}
                categories={categories}
                selectedMarkets={selectedMarkets}
                selectedProducts={selectedProducts}
                selectedCategories={selectedCategories}
                toggleFilter={toggleFilter}
                clearFilters={clearFilters}
              />
            </div>
          </div>

          {/* Results */}
          <div className="flex-grow">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 bg-secondary rounded-full animate-pulse" />
                <p className="text-primary/40 font-bold uppercase tracking-[0.2em] text-[10px]">
                  {loading ? 'Sincronizando Ecossistema...' : `${offers.length} Insights Identificados`}
                </p>
              </div>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 bg-primary/5 rounded-[3rem] border border-primary/5">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-primary/5 border-t-secondary"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-secondary animate-pulse fill-secondary" />
                  </div>
                </div>
                <p className="mt-8 text-primary/40 font-bold uppercase tracking-[0.2em] text-[10px]">Processando Inteligência de Mercado...</p>
              </div>
            ) : (
              <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(15,23,42,0.08)] border border-primary/5 overflow-hidden">
                <PriceTable offers={offers} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface FiltersContentProps {
  sort: string;
  setSort: (s: string) => void;
  markets: Market[];
  products: Product[];
  categories: string[];
  selectedMarkets: string[];
  selectedProducts: string[];
  selectedCategories: string[];
  toggleFilter: (type: 'markets' | 'products' | 'categories', id: string) => void;
  clearFilters: () => void;
}

function FiltersContent({ 
  sort, 
  setSort, 
  markets, 
  products, 
  categories,
  selectedMarkets, 
  selectedProducts, 
  selectedCategories,
  toggleFilter,
  clearFilters 
}: FiltersContentProps) {
  const [productSearch, setProductSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState<string | null>('markets');

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.brand.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* Sort Section */}
      <div>
        <h3 className="text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em] mb-6">Ordenar por</h3>
        <div className="space-y-3">
          {[
            { id: 'price_asc', label: 'Menor Preço' },
            { id: 'price_desc', label: 'Maior Preço' },
            { id: 'date_desc', label: 'Mais Recentes' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSort(opt.id)}
              className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                sort === opt.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-primary/60 hover:bg-primary/5'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-primary/5"></div>

      {/* Markets Section */}
      <div>
        <button 
          onClick={() => toggleSection('markets')}
          className="w-full flex items-center justify-between text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em] mb-6 hover:text-primary transition-colors"
        >
          <span>Mercados</span>
          {expandedSection === 'markets' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        <AnimatePresence>
          {(expandedSection === 'markets' || selectedMarkets.length > 0) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-4">
                {markets.map(market => (
                  <label key={market.id} className="flex items-center group cursor-pointer p-3 hover:bg-primary/5 rounded-2xl transition-all">
                    <div className="relative flex items-center flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={selectedMarkets.includes(market.id.toString())}
                        onChange={() => toggleFilter('markets', market.id.toString())}
                        className="peer h-6 w-6 rounded-xl border-2 border-primary/10 text-secondary focus:ring-0 transition-all cursor-pointer opacity-0 absolute" 
                      />
                      <div className={`h-6 w-6 rounded-xl border-2 transition-all flex items-center justify-center ${
                        selectedMarkets.includes(market.id.toString())
                          ? 'bg-secondary border-secondary shadow-lg shadow-secondary/20'
                          : 'border-primary/10 group-hover:border-primary/20'
                      }`}>
                        {selectedMarkets.includes(market.id.toString()) && <Check className="h-3.5 w-3.5 text-primary font-bold" />}
                      </div>
                    </div>
                    <span className={`ml-4 text-sm font-bold transition-colors ${
                      selectedMarkets.includes(market.id.toString()) ? 'text-primary' : 'text-primary/40 group-hover:text-primary/60'
                    }`}>
                      {market.name}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px bg-primary/5"></div>

      {/* Categories Section */}
      <div>
        <button 
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em] mb-6 hover:text-primary transition-colors"
        >
          <span>Categorias</span>
          {expandedSection === 'categories' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        <AnimatePresence>
          {(expandedSection === 'categories' || selectedCategories.length > 0) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-3 pb-4">
                {categories.map(category => (
                  <label key={category} className="flex items-center group cursor-pointer p-3 hover:bg-primary/5 rounded-2xl transition-all">
                    <div className="relative flex items-center flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleFilter('categories', category)}
                        className="peer h-6 w-6 rounded-xl border-2 border-primary/10 text-secondary focus:ring-0 transition-all cursor-pointer opacity-0 absolute" 
                      />
                      <div className={`h-6 w-6 rounded-xl border-2 transition-all flex items-center justify-center ${
                        selectedCategories.includes(category)
                          ? 'bg-secondary border-secondary shadow-lg shadow-secondary/20'
                          : 'border-primary/10 group-hover:border-primary/20'
                      }`}>
                        {selectedCategories.includes(category) && <Check className="h-3.5 w-3.5 text-primary font-bold" />}
                      </div>
                    </div>
                    <span className={`ml-4 text-sm font-bold transition-colors ${
                      selectedCategories.includes(category) ? 'text-primary' : 'text-primary/40 group-hover:text-primary/60'
                    }`}>
                      {category}
                    </span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="h-px bg-primary/5"></div>

      {/* Products Section */}
      <div>
        <button 
          onClick={() => toggleSection('products')}
          className="w-full flex items-center justify-between text-[10px] font-bold text-primary/30 uppercase tracking-[0.2em] mb-6 hover:text-primary transition-colors"
        >
          <span>Produtos</span>
          {expandedSection === 'products' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
        
        <AnimatePresence>
          {(expandedSection === 'products' || selectedProducts.length > 0) && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-6 relative group">
                <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-primary/20 group-focus-within:text-secondary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Filtrar produtos..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-primary/5 border border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:ring-4 focus:ring-secondary/10 focus:border-secondary transition-all"
                />
              </div>
              
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <label key={product.id} className="flex items-center group cursor-pointer p-3 hover:bg-primary/5 rounded-2xl transition-all">
                      <div className="relative flex items-center flex-shrink-0">
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.includes(product.id.toString())}
                          onChange={() => toggleFilter('products', product.id.toString())}
                          className="peer h-6 w-6 rounded-xl border-2 border-primary/10 text-secondary focus:ring-0 transition-all cursor-pointer opacity-0 absolute" 
                        />
                        <div className={`h-6 w-6 rounded-xl border-2 transition-all flex items-center justify-center ${
                          selectedProducts.includes(product.id.toString())
                            ? 'bg-secondary border-secondary shadow-lg shadow-secondary/20'
                            : 'border-primary/10 group-hover:border-primary/20'
                        }`}>
                          {selectedProducts.includes(product.id.toString()) && <Check className="h-3.5 w-3.5 text-primary font-bold" />}
                        </div>
                      </div>
                      <div className="ml-4 flex flex-col">
                        <span className={`text-sm font-bold transition-colors ${
                          selectedProducts.includes(product.id.toString()) ? 'text-primary' : 'text-primary/40 group-hover:text-primary/60'
                        }`}>
                          {product.name}
                        </span>
                        <span className="text-[10px] font-bold text-primary/20 uppercase tracking-widest">{product.brand}</span>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-primary/20 text-center py-8 italic">Nenhum insight encontrado.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-10 sticky bottom-0 bg-white pb-2">
        <button 
          onClick={clearFilters}
          className="w-full bg-primary text-white py-5 rounded-3xl font-bold text-sm hover:bg-secondary hover:text-primary transition-all duration-500 shadow-2xl shadow-primary/20"
        >
          Resetar Parâmetros
        </button>
      </div>
    </div>
  );
}
