import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PriceTable from '../components/PriceTable';
import { Offer, Market, Product } from '../types';
import { Search as SearchIcon, Filter, X, SlidersHorizontal, Check, ChevronDown, ChevronUp } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f8fafc] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight">
            Resultados para <span className="text-[#F97316]">"{query || 'Todos os produtos'}"</span>
          </h1>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="relative flex-grow">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                name="q"
                defaultValue={query}
                type="text"
                className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-2xl bg-white border border-gray-100 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] outline-none transition-all font-medium text-base"
                placeholder="O que você procura?"
              />
            </div>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center justify-center gap-2 bg-white text-gray-700 px-5 py-3 sm:py-4 rounded-2xl font-bold border border-gray-100 shadow-sm hover:bg-gray-50 transition"
              >
                <SlidersHorizontal className="h-5 w-5" />
              </button>
              <button type="submit" className="flex-grow sm:flex-grow-0 bg-[#1E3A8A] text-white px-8 sm:px-10 py-3 sm:py-4 rounded-2xl font-bold hover:bg-blue-800 transition shadow-lg shadow-blue-900/10">
                Buscar
              </button>
            </div>
          </form>
        </div>

        <div className="flex flex-col md:flex-row gap-8 relative">
          {/* Mobile Filters Overlay */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] md:hidden bg-black/50 backdrop-blur-sm"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white shadow-2xl overflow-hidden flex flex-col"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                    <h2 className="text-2xl font-black text-gray-900">Filtros</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
                      <X className="h-6 w-6 text-gray-500" />
                    </button>
                  </div>
                  <div className="flex-grow overflow-y-auto p-6 custom-scrollbar">
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
            <div className="sticky top-28 bg-white p-6 rounded-[32px] shadow-sm border border-gray-100 max-h-[calc(100vh-140px)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center mb-6 text-gray-900 font-black text-xl border-b border-gray-100 pb-4">
                <Filter className="h-5 w-5 mr-2 text-[#F97316]" />
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
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                {loading ? 'Sincronizando preços...' : `${offers.length} ofertas encontradas`}
              </p>
            </div>
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
                <div className="relative">
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-100 border-t-[#1E3A8A]"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-2 w-2 bg-[#F97316] rounded-full animate-ping"></div>
                  </div>
                </div>
                <p className="mt-6 text-gray-400 font-bold uppercase tracking-widest text-xs">Buscando as melhores ofertas...</p>
              </div>
            ) : (
              <PriceTable offers={offers} />
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
    <div className="space-y-6">
      {/* Sort Section */}
      <div>
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">Ordenar por</h3>
        <div className="space-y-2">
          {[
            { id: 'price_asc', label: 'Menor Preço' },
            { id: 'price_desc', label: 'Maior Preço' },
            { id: 'date_desc', label: 'Mais Recentes' }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setSort(opt.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                sort === opt.id 
                  ? 'bg-blue-50 text-[#1E3A8A] border-2 border-blue-100' 
                  : 'text-gray-500 hover:bg-gray-50 border-2 border-transparent'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-100 my-4"></div>

      {/* Markets Section */}
      <div>
        <button 
          onClick={() => toggleSection('markets')}
          className="w-full flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-3 hover:text-gray-600 transition"
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
              <div className="space-y-2 pb-2">
                {markets.map(market => (
                  <label key={market.id} className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="relative flex items-center flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={selectedMarkets.includes(market.id.toString())}
                        onChange={() => toggleFilter('markets', market.id.toString())}
                        className="peer h-5 w-5 rounded-lg border-2 border-gray-200 text-[#1E3A8A] focus:ring-0 transition-all cursor-pointer opacity-0 absolute" 
                      />
                      <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                        selectedMarkets.includes(market.id.toString())
                          ? 'bg-[#1E3A8A] border-[#1E3A8A]'
                          : 'border-gray-200 group-hover:border-gray-300'
                      }`}>
                        {selectedMarkets.includes(market.id.toString()) && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <span className={`ml-3 text-sm font-bold transition-colors ${
                      selectedMarkets.includes(market.id.toString()) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
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

      <div className="border-t border-gray-100 my-4"></div>

      {/* Categories Section */}
      <div>
        <button 
          onClick={() => toggleSection('categories')}
          className="w-full flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-3 hover:text-gray-600 transition"
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
              <div className="space-y-2 pb-2">
                {categories.map(category => (
                  <label key={category} className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                    <div className="relative flex items-center flex-shrink-0">
                      <input 
                        type="checkbox" 
                        checked={selectedCategories.includes(category)}
                        onChange={() => toggleFilter('categories', category)}
                        className="peer h-5 w-5 rounded-lg border-2 border-gray-200 text-[#1E3A8A] focus:ring-0 transition-all cursor-pointer opacity-0 absolute" 
                      />
                      <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                        selectedCategories.includes(category)
                          ? 'bg-[#1E3A8A] border-[#1E3A8A]'
                          : 'border-gray-200 group-hover:border-gray-300'
                      }`}>
                        {selectedCategories.includes(category) && <Check className="h-3 w-3 text-white" />}
                      </div>
                    </div>
                    <span className={`ml-3 text-sm font-bold transition-colors ${
                      selectedCategories.includes(category) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
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

      <div className="border-t border-gray-100 my-4"></div>

      {/* Products Section */}
      <div>
        <button 
          onClick={() => toggleSection('products')}
          className="w-full flex items-center justify-between text-xs font-black text-gray-400 uppercase tracking-widest mb-3 hover:text-gray-600 transition"
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
              <div className="mb-3 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Buscar produto..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#1E3A8A]"
                />
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map(product => (
                    <label key={product.id} className="flex items-center group cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition">
                      <div className="relative flex items-center flex-shrink-0">
                        <input 
                          type="checkbox" 
                          checked={selectedProducts.includes(product.id.toString())}
                          onChange={() => toggleFilter('products', product.id.toString())}
                          className="peer h-5 w-5 rounded-lg border-2 border-gray-200 text-[#1E3A8A] focus:ring-0 transition-all cursor-pointer opacity-0 absolute" 
                        />
                        <div className={`h-5 w-5 rounded-lg border-2 transition-all flex items-center justify-center ${
                          selectedProducts.includes(product.id.toString())
                            ? 'bg-[#F97316] border-[#F97316]'
                            : 'border-gray-200 group-hover:border-gray-300'
                        }`}>
                          {selectedProducts.includes(product.id.toString()) && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </div>
                      <div className="ml-3 flex flex-col">
                        <span className={`text-sm font-bold transition-colors ${
                          selectedProducts.includes(product.id.toString()) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
                        }`}>
                          {product.name}
                        </span>
                        <span className="text-xs text-gray-400">{product.brand}</span>
                      </div>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 text-center py-4">Nenhum produto encontrado.</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pt-6 border-t border-gray-100 sticky bottom-0 bg-white pb-2">
        <button 
          onClick={clearFilters}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-sm hover:bg-black transition shadow-lg"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
  );
}
