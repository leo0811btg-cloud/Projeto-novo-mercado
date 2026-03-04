import React from 'react';
import { ShoppingBag, Instagram, Facebook, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="bg-[#F97316] p-2 rounded-xl shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="font-bold text-2xl text-[#1E3A8A] tracking-tight">
                PreçoCerto <span className="text-[#F97316]">Dourados</span>
              </span>
            </Link>
            <p className="text-gray-500 font-medium leading-relaxed mb-8">
              A maior plataforma de comparação de preços de supermercados em Dourados-MS. Economia real na palma da sua mão.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#1E3A8A] hover:text-white transition-all">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#1E3A8A] hover:text-white transition-all">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-[#1E3A8A] hover:text-white transition-all">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Navegação</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-gray-500 hover:text-[#F97316] font-medium transition-colors">Início</Link></li>
              <li><Link to="/mercados" className="text-gray-500 hover:text-[#F97316] font-medium transition-colors">Mercados</Link></li>
              <li><Link to="/tabloides" className="text-gray-500 hover:text-[#F97316] font-medium transition-colors">Tabloides</Link></li>
              <li><Link to="/admin" className="text-gray-500 hover:text-[#F97316] font-medium transition-colors">Painel Admin</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Categorias Populares</h3>
            <ul className="space-y-4">
              <li><button className="text-gray-500 hover:text-[#F97316] font-medium transition-colors">Açougue</button></li>
              <li><button className="text-gray-500 hover:text-[#F97316] font-medium transition-colors">Hortifruti</button></li>
              <li><button className="text-gray-500 hover:text-[#F97316] font-medium transition-colors">Bebidas</button></li>
              <li><button className="text-gray-500 hover:text-[#F97316] font-medium transition-colors">Limpeza</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-6">Contato</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#F97316] shrink-0" />
                <span className="text-gray-500 font-medium">Dourados, Mato Grosso do Sul</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#F97316] shrink-0" />
                <span className="text-gray-500 font-medium">(67) 99999-9999</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#F97316] shrink-0" />
                <span className="text-gray-500 font-medium">contato@precocerto.com.br</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm font-medium">
            &copy; {new Date().getFullYear()} PreçoCerto Dourados. Todos os direitos reservados.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest">Termos de Uso</a>
            <a href="#" className="text-gray-400 hover:text-gray-600 text-xs font-bold uppercase tracking-widest">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
