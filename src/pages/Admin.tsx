import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, LogOut, Package, Store, Tag, ChevronRight, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'markets' | 'offers' | 'tabloides'>('dashboard');
  const [markets, setMarkets] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [tabloides, setTabloides] = useState<any[]>([]);

  // Tabloide form state
  const [tabloideTitle, setTabloideTitle] = useState('');
  const [tabloideUrl, setTabloideUrl] = useState('');
  const [tabloideExpiry, setTabloideExpiry] = useState('');
  const [tabloideMarketId, setTabloideMarketId] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data);
        setIsLoggedIn(true);
      } else {
        alert('Usuário ou senha incorretos');
      }
    } catch (error) {
      alert('Erro ao conectar ao servidor');
    }
  };

  useEffect(() => {
    if (isLoggedIn && user?.role === 'admin') {
      fetchMarkets();
      fetchOffers();
      fetchTabloides();
    }
  }, [isLoggedIn, user]);

  const fetchMarkets = async () => {
    const res = await fetch('/api/markets');
    const data = await res.json();
    setMarkets(data);
  };

  const fetchOffers = async () => {
    const res = await fetch('/api/offers');
    const data = await res.json();
    setOffers(data);
  };

  const fetchTabloides = async () => {
    const res = await fetch('/api/tabloides');
    const data = await res.json();
    setTabloides(data);
  };

  const handleDeleteMarket = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este mercado? Todas as ofertas dele também serão removidas.')) {
      await fetch(`/api/markets/${id}`, { method: 'DELETE' });
      fetchMarkets();
      fetchOffers();
    }
  };

  const handleDeleteOffer = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir esta oferta?')) {
      await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      fetchOffers();
    }
  };

  const handleDeleteTabloide = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este tabloide?')) {
      await fetch(`/api/tabloides/${id}`, { method: 'DELETE' });
      fetchTabloides();
    }
  };

  const handleSaveTabloide = async (e: React.FormEvent) => {
    e.preventDefault();
    const marketId = user?.role === 'admin' ? tabloideMarketId : user?.id;
    
    if (!marketId || !tabloideUrl) {
      alert('Preencha os campos obrigatórios');
      return;
    }

    try {
      const response = await fetch('/api/tabloides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          market_id: parseInt(marketId),
          title: tabloideTitle,
          pdf_url: tabloideUrl,
          valid_until: tabloideExpiry
        }),
      });

      if (response.ok) {
        alert('Tabloide salvo com sucesso!');
        setTabloideTitle('');
        setTabloideUrl('');
        setTabloideExpiry('');
        if (user?.role === 'admin') fetchTabloides();
      }
    } catch (error) {
      alert('Erro ao salvar tabloide');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/10 w-full max-w-md border border-gray-100"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-[#1E3A8A] p-4 rounded-2xl shadow-lg">
              <LayoutDashboard className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-black text-center mb-2 text-gray-900 tracking-tight">Painel Admin</h2>
          <p className="text-gray-400 text-center mb-8 font-medium">Acesso restrito para mercados e administradores</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Usuário</label>
              <input
                type="text"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold mb-4"
                placeholder="Ex: admin ou nome do mercado"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Senha</label>
              <input
                type="password"
                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#1E3A8A] text-white font-black py-4 px-4 rounded-2xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 active:scale-95"
            >
              Entrar no Painel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">
              {user?.role === 'admin' ? 'Administração Geral' : `Painel: ${user?.name}`}
            </h1>
            <p className="text-gray-500 font-medium mt-1">
              {user?.role === 'admin' 
                ? 'Gerencie todos os mercados, produtos e ofertas da plataforma.' 
                : 'Gerencie suas informações e ofertas em tempo real.'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <div className="flex flex-wrap bg-gray-100 p-1 rounded-2xl gap-1">
                <button 
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex-grow sm:flex-grow-0 ${activeTab === 'dashboard' ? 'bg-white shadow-sm text-blue-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab('markets')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex-grow sm:flex-grow-0 ${activeTab === 'markets' ? 'bg-white shadow-sm text-blue-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Mercados
                </button>
                <button 
                  onClick={() => setActiveTab('offers')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex-grow sm:flex-grow-0 ${activeTab === 'offers' ? 'bg-white shadow-sm text-blue-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Ofertas
                </button>
                <button 
                  onClick={() => setActiveTab('tabloides')}
                  className={`px-4 py-2 rounded-xl font-bold text-sm transition-all flex-grow sm:flex-grow-0 ${activeTab === 'tabloides' ? 'bg-white shadow-sm text-blue-900' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Tabloides
                </button>
              </div>
            )}
            <button 
              onClick={() => {
                setIsLoggedIn(false);
                setUser(null);
                setUsername('');
                setPassword('');
                setActiveTab('dashboard');
              }}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-2xl font-bold hover:bg-red-100 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Sair
            </button>
          </div>
        </div>

        {activeTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { 
                  label: user?.role === 'admin' ? 'Total de Mercados' : 'Minhas Ofertas Ativas', 
                  value: user?.role === 'admin' ? markets.length.toString() : '6', 
                  icon: user?.role === 'admin' ? Store : Tag, 
                  color: user?.role === 'admin' ? 'text-blue-600' : 'text-green-600', 
                  bg: user?.role === 'admin' ? 'bg-blue-50' : 'bg-green-50' 
                },
                { 
                  label: user?.role === 'admin' ? 'Total de Ofertas' : 'Produtos Disponíveis', 
                  value: user?.role === 'admin' ? offers.length.toString() : '6', 
                  icon: user?.role === 'admin' ? Tag : Package, 
                  color: user?.role === 'admin' ? 'text-green-600' : 'text-orange-600', 
                  bg: user?.role === 'admin' ? 'bg-green-50' : 'bg-orange-50' 
                },
                { 
                  label: user?.role === 'admin' ? 'Produtos Cadastrados' : 'Visualizações (Mês)', 
                  value: user?.role === 'admin' ? '6' : '1.2k', 
                  icon: user?.role === 'admin' ? Package : Store, 
                  color: user?.role === 'admin' ? 'text-orange-600' : 'text-blue-600', 
                  bg: user?.role === 'admin' ? 'bg-orange-50' : 'bg-blue-50' 
                }
              ].map((stat, idx) => (
                <motion.div 
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-100 flex items-center gap-6"
                >
                  <div className={`${stat.bg} p-4 rounded-2xl`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div>
                    <h3 className="text-gray-400 text-xs font-black uppercase tracking-widest">{stat.label}</h3>
                    <p className="text-4xl font-black text-gray-900">{stat.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-[40px] shadow-sm p-10 border border-gray-100">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-orange-50 p-3 rounded-xl">
                      <PlusCircle className="h-6 w-6 text-[#F97316]" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Cadastrar Nova Oferta</h2>
                  </div>
                  
                  <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mercado</label>
                        {user?.role === 'admin' ? (
                          <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold appearance-none">
                            {markets.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        ) : (
                          <input 
                            type="text" 
                            disabled 
                            value={user?.name}
                            className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-500 cursor-not-allowed" 
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Produto</label>
                        <select className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold appearance-none">
                          <option>Arroz Branco 5kg</option>
                          <option>Óleo de Soja 900ml</option>
                          <option>Feijão Carioca 1kg</option>
                          <option>Leite Integral 1L</option>
                          <option>Café em Pó 500g</option>
                          <option>Detergente Líquido 500ml</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Preço (R$)</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          placeholder="0,00"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Data de Validade</label>
                        <input 
                          type="date" 
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold" 
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-[#1E3A8A] text-white font-black py-5 px-4 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                      Salvar Oferta
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </form>
                </div>

                {/* Tabloide Upload Form */}
                <div className="bg-white rounded-[40px] shadow-sm p-10 border border-gray-100 mt-8">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="bg-blue-50 p-3 rounded-xl">
                      <PlusCircle className="h-6 w-6 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Subir Tabloide (PDF)</h2>
                  </div>
                  
                  <form onSubmit={handleSaveTabloide} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Mercado</label>
                        {user?.role === 'admin' ? (
                          <select 
                            value={tabloideMarketId}
                            onChange={(e) => setTabloideMarketId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold appearance-none"
                          >
                            <option value="">Selecionar Mercado</option>
                            {markets.map(m => (
                              <option key={m.id} value={m.id}>{m.name}</option>
                            ))}
                          </select>
                        ) : (
                          <input 
                            type="text" 
                            disabled 
                            value={user?.name}
                            className="w-full bg-gray-100 border border-gray-100 rounded-2xl px-6 py-4 font-bold text-gray-500 cursor-not-allowed" 
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Título do Tabloide</label>
                        <input 
                          type="text" 
                          placeholder="Ex: Ofertas da Semana"
                          value={tabloideTitle}
                          onChange={(e) => setTabloideTitle(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">URL do PDF</label>
                        <input 
                          type="url" 
                          placeholder="https://exemplo.com/tabloide.pdf"
                          value={tabloideUrl}
                          onChange={(e) => setTabloideUrl(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Válido Até</label>
                        <input 
                          type="date" 
                          value={tabloideExpiry}
                          onChange={(e) => setTabloideExpiry(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#1E3A8A] transition-all font-bold" 
                        />
                      </div>
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-900 text-white font-black py-5 px-4 rounded-2xl hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 active:scale-[0.98]">
                      Salvar Tabloide
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </form>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-[40px] shadow-sm p-10 border border-gray-100 h-full">
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Ações Rápidas</h2>
                  <div className="space-y-4">
                    {[
                      { label: user?.role === 'admin' ? 'Cadastrar Mercado' : 'Editar Perfil do Mercado', icon: Store, color: 'bg-blue-50 text-blue-600' },
                      { label: user?.role === 'admin' ? 'Cadastrar Produto' : 'Sugerir Novo Produto', icon: Package, color: 'bg-orange-50 text-orange-600' },
                      { label: user?.role === 'admin' ? 'Ver Relatórios' : 'Ver Relatórios de Vendas', icon: LayoutDashboard, color: 'bg-purple-50 text-purple-600' }
                    ].map(action => (
                      <button key={action.label} className="w-full flex items-center justify-between p-6 rounded-3xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all border border-transparent hover:border-gray-100 group">
                        <div className="flex items-center gap-4">
                          <div className={`${action.color} p-3 rounded-xl`}>
                            <action.icon className="h-5 w-5" />
                          </div>
                          <span className="font-bold text-gray-700">{action.label}</span>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-gray-900 transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'markets' && user?.role === 'admin' && (
          <div className="bg-white rounded-[40px] shadow-sm p-10 border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Gerenciar Mercados</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Nome</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Usuário</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Endereço</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {markets.map(m => (
                    <tr key={m.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-gray-900">{m.name}</td>
                      <td className="py-4 text-gray-500 font-medium">{m.username}</td>
                      <td className="py-4 text-gray-500 font-medium">{m.address}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleDeleteMarket(m.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'offers' && user?.role === 'admin' && (
          <div className="bg-white rounded-[40px] shadow-sm p-10 border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Gerenciar Ofertas</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Produto</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Mercado</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Preço</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {offers.map(o => (
                    <tr key={o.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4">
                        <div className="font-bold text-gray-900">{o.product_name}</div>
                        <div className="text-xs text-gray-400 font-medium">{o.product_brand}</div>
                      </td>
                      <td className="py-4 text-gray-500 font-medium">{o.market_name}</td>
                      <td className="py-4 font-black text-blue-900">R$ {o.price.toFixed(2)}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleDeleteOffer(o.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {activeTab === 'tabloides' && user?.role === 'admin' && (
          <div className="bg-white rounded-[40px] shadow-sm p-10 border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-8">Gerenciar Tabloides</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Título</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Mercado</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest">Validade</th>
                    <th className="pb-4 font-black text-xs text-gray-400 uppercase tracking-widest text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {tabloides.map(t => (
                    <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                      <td className="py-4 font-bold text-gray-900">{t.title || 'Sem título'}</td>
                      <td className="py-4 text-gray-500 font-medium">{t.market_name}</td>
                      <td className="py-4 text-gray-500 font-medium">{t.valid_until}</td>
                      <td className="py-4 text-right">
                        <button 
                          onClick={() => handleDeleteTabloide(t.id)}
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
