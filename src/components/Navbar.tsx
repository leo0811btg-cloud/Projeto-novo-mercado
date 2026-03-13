import React, { useState, useEffect } from 'react';
import { Search, Menu, X, ShoppingBag, MapPin } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', path: '/' },
    { name: 'Melhor Compra', path: '/melhor-compra' },
    { name: 'Tabloides', path: '/tabloides' },
    { name: 'Admin', path: '/admin' },
  ];

  const isHome = location.pathname === '/';
  const shouldHaveBackground = scrolled || !isHome;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        shouldHaveBackground ? 'py-3 bg-primary/95 backdrop-blur-xl shadow-2xl border-b border-white/5' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-12">
            <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="bg-secondary p-2 sm:p-2.5 rounded-xl sm:rounded-2xl shadow-xl shadow-secondary/20 group-hover:scale-110 transition-transform duration-500">
                <ShoppingBag className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-2xl leading-none tracking-tight text-white">
                  PreçoCerto <span className="text-secondary">Dourados</span>
                </span>
                <span className="text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] text-white/50 mt-1">
                  Market Intelligence
                </span>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    location.pathname === link.path
                      ? 'bg-white text-primary shadow-lg'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-white/40">
              <MapPin className="h-3.5 w-3.5 text-secondary" />
              Dourados, MS
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <button className="p-2.5 rounded-2xl transition-all bg-white/5 text-white hover:bg-white/10 border border-white/10">
              <Search className="h-5 w-5" />
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2.5 rounded-2xl transition-all bg-white/5 text-white border border-white/10"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-primary absolute top-full left-0 right-0 shadow-2xl border-t border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-4 pb-8 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-5 py-4 rounded-2xl text-base font-bold transition-all ${
                    location.pathname === link.path
                      ? 'bg-secondary text-primary'
                      : 'text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
