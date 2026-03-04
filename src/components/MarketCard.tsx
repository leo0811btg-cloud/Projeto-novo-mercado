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
      whileHover={{ y: -8 }}
      className="group bg-white rounded-3xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
    >
      <div className="relative h-48 overflow-hidden bg-gray-50">
        {market.cover_image ? (
          <img 
            src={market.cover_image} 
            alt={market.name} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" 
          />
        ) : market.logo ? (
          <img 
            src={market.logo} 
            alt={market.name} 
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 blur-sm opacity-50" 
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 text-[#1E3A8A] text-5xl font-bold opacity-40">
            {market.name[0]}
          </div>
        )}
        
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm p-2 rounded-xl shadow-sm">
            <ExternalLink className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        {/* Logo Overlay */}
        <div className="absolute -bottom-6 left-8 h-16 w-16 rounded-2xl border-4 border-white shadow-lg overflow-hidden bg-white z-10">
          {market.logo ? (
            <img src={market.logo} alt={`${market.name} logo`} className="h-full w-full object-contain p-1" />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold">
              {market.name[0]}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 sm:p-8 pt-8 sm:pt-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-[#1E3A8A] transition-colors">{market.name}</h3>
            <div className="flex items-center text-gray-400 mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="text-[10px] font-medium uppercase tracking-wider">Dourados, MS</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-6 sm:mb-8">
          <div className="flex items-center text-gray-600">
            <div className="bg-blue-50 p-2 rounded-lg mr-3">
              <MapPin className="h-4 w-4 text-[#1E3A8A]" />
            </div>
            <span className="text-xs sm:text-sm font-medium line-clamp-1">{market.address}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <div className="bg-orange-50 p-2 rounded-lg mr-3">
              <Phone className="h-4 w-4 text-[#F97316]" />
            </div>
            <span className="text-xs sm:text-sm font-medium">{market.phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <div className="bg-green-50 p-2 rounded-lg mr-3">
              <Clock className="h-4 w-4 text-green-600" />
            </div>
            <span className="text-xs sm:text-sm font-medium">{market.hours}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button 
            onClick={() => navigate(`/market/${market.id}`)}
            className="flex-grow bg-[#1E3A8A] text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10 flex items-center justify-center gap-2"
          >
            Ver Ofertas
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className="p-3 bg-gray-50 text-gray-400 rounded-2xl hover:bg-gray-100 transition-colors">
            <MapPin className="h-5 w-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default MarketCard;
