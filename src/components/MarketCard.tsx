import React from 'react';
import { MapPin, Phone, Clock, ExternalLink, ChevronRight } from 'lucide-react';
import { Market } from '../types';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface MarketCardProps {
  market: Market;
}

const MarketCard: React.FC<MarketCardProps> = ({ market }) => {
  const navigate = useNavigate();
  return (
    <motion.div 
      whileHover={{ y: -12 }}
      onClick={() => navigate(`/market/${market.id}`)}
      className="group bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)] transition-all duration-700 overflow-hidden border border-gray-100/50 cursor-pointer"
    >
      <div className="relative h-56 overflow-hidden bg-gray-50">
        {market.cover_image ? (
          <img 
            src={market.cover_image} 
            alt={market.name} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" 
          />
        ) : market.logo ? (
          <img 
            src={market.logo} 
            alt={market.name} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out blur-sm opacity-50" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10 text-primary text-6xl font-bold opacity-20">
            {market.name[0]}
          </div>
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute top-6 right-6">
          <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50">
            <ExternalLink className="h-4 w-4 text-primary/40" />
          </div>
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-8 left-10 h-20 w-20 rounded-3xl border-[6px] border-white shadow-2xl overflow-hidden bg-white z-10 group-hover:-translate-y-2 transition-transform duration-500">
          {market.logo ? (
            <img src={market.logo} alt={`${market.name} logo`} className="h-full w-full object-contain p-2" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-50 text-primary/20 font-bold text-2xl">
              {market.name[0]}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-8 sm:p-10 pt-16 sm:pt-16">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-primary group-hover:text-secondary transition-colors duration-300 tracking-tight">{market.name}</h3>
            <div className="flex items-center text-primary/30 mt-2">
              <MapPin className="h-3.5 w-3.5 mr-1.5 text-secondary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Strategic Partner</span>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-10">
          <div className="flex items-center text-primary/60">
            <div className="bg-primary/5 p-2.5 rounded-xl mr-4 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <MapPin className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold line-clamp-1">{market.address}</span>
          </div>
          <div className="flex items-center text-primary/60">
            <div className="bg-secondary/10 p-2.5 rounded-xl mr-4 group-hover:bg-secondary group-hover:text-primary transition-colors duration-500">
              <Phone className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">{market.phone}</span>
          </div>
          <div className="flex items-center text-primary/60">
            <div className="bg-green-50 p-2.5 rounded-xl mr-4 group-hover:bg-green-600 group-hover:text-white transition-colors duration-500">
              <Clock className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold">{market.hours}</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            onClick={() => navigate(`/market/${market.id}`)}
            className="flex-grow bg-primary text-white py-4 rounded-2xl font-bold text-sm hover:bg-primary/90 transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 group/btn"
          >
            Analisar Ofertas
            <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          <button className="p-4 bg-gray-50 text-primary/20 rounded-2xl hover:bg-primary hover:text-white transition-all duration-500 border border-gray-100">
            <MapPin className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketCard;
