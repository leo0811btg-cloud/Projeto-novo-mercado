import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Calendar, ExternalLink, X, Eye, Store } from 'lucide-react';

export default function Tabloides() {
  const [tabloides, setTabloides] = useState<any[]>([]);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTabloides();
  }, []);

  const fetchTabloides = async () => {
    try {
      const res = await fetch('/api/tabloides');
      const data = await res.json();
      setTabloides(data);
    } catch (error) {
      console.error('Erro ao buscar tabloides:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1E3A8A]"></div>
      </div>
    );
  }

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
            <FileText className="h-4 w-4" />
            Ofertas em PDF
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight"
          >
            Tabloides <span className="text-[#F97316]">Digitais</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-100 max-w-2xl mx-auto font-medium"
          >
            Folheie as ofertas dos seus mercados favoritos sem precisar baixar nada. Economia na palma da sua mão.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        {tabloides.length === 0 ? (
          <div className="bg-white rounded-[40px] p-20 text-center shadow-xl border border-gray-100">
            <div className="bg-gray-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <FileText className="h-10 w-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-2">Nenhum tabloide disponível</h2>
            <p className="text-gray-500 font-medium">Fique de olho! Em breve teremos novas ofertas por aqui.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tabloides.map((tabloide, idx) => (
              <motion.div
                key={tabloide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[40px] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 group"
              >
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden border border-gray-100">
                      {tabloide.market_logo ? (
                        <img src={tabloide.market_logo} alt={tabloide.market_name} className="w-full h-full object-cover" />
                      ) : (
                        <Store className="h-8 w-8 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-black text-gray-900 text-xl leading-tight">{tabloide.market_name}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">
                        <Calendar className="h-3 w-3" />
                        Expira em: {tabloide.valid_until || 'N/A'}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-lg font-bold text-gray-800 mb-6 line-clamp-2 min-h-[3.5rem]">
                    {tabloide.title || 'Tabloide de Ofertas'}
                  </h4>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedPdf(tabloide.pdf_url)}
                      className="flex-grow flex items-center justify-center gap-2 bg-[#1E3A8A] text-white font-black py-4 rounded-2xl hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                    >
                      <Eye className="h-5 w-5" />
                      Visualizar
                    </button>
                    <a
                      href={tabloide.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 hover:text-gray-900 transition-all border border-gray-100"
                    >
                      <ExternalLink className="h-5 w-5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-sm"
          >
            <div className="relative w-full h-full max-w-6xl bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-xl">
                    <FileText className="h-6 w-6 text-[#1E3A8A]" />
                  </div>
                  <span className="font-black text-gray-900 tracking-tight">Visualizador de Tabloide</span>
                </div>
                <button
                  onClick={() => setSelectedPdf(null)}
                  className="p-3 bg-gray-100 text-gray-500 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <div className="flex-grow bg-gray-100 relative">
                <object
                  data={selectedPdf}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <iframe
                    src={`https://docs.google.com/viewer?url=${encodeURIComponent(selectedPdf)}&embedded=true`}
                    className="w-full h-full border-none"
                    title="PDF Viewer Fallback"
                  />
                </object>
              </div>
              
              <div className="p-6 bg-gray-50 flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Dica: Use os controles do visualizador para dar zoom ou girar as páginas.
                </p>
                <a 
                  href={selectedPdf} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-[#1E3A8A] font-black text-sm hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
                  Abrir em tela cheia
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
