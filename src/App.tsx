/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import SearchPage from './pages/Search';
import MarketDetail from './pages/MarketDetail';
import Admin from './pages/Admin';
import Tabloides from './pages/Tabloides';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/market/:id" element={<MarketDetail />} />
            <Route path="/tabloides" element={<Tabloides />} />
            <Route path="/admin" element={<Admin />} />
            {/* Add other routes as needed */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}
