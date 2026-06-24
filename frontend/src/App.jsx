import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Footer from './components/Footer';
import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col font-sans">
        {/* Stroži, editorial Navbar */}
        <nav className="bg-white border-b border-gray-300 sticky top-0 z-50 shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
            
            {/* Logo sekcija - oštriji dizajn */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="flex h-9 w-9 items-center justify-center bg-black text-base font-bold text-white tracking-tighter rounded-sm">
                NR
              </div>
              <div className="leading-none flex flex-col justify-center">
                <span className="text-lg font-black tracking-tight text-gray-900 uppercase">News Registry</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Verified Aggregator</span>
              </div>
            </Link>

            {/* Navigacijski linkovi - minimalizam */}
            <div className="flex items-center gap-5 sm:gap-7">
              <Link to="/" className="text-[13px] font-bold text-gray-600 uppercase tracking-wide hover:text-black transition-colors">
                Vijesti
              </Link>
              <Link to="/analytics" className="text-[13px] font-bold text-gray-600 uppercase tracking-wide hover:text-black transition-colors">
                Analitika
              </Link>
              
              {/* Vertikalni separator */}
              <div className="h-4 w-px bg-gray-300 hidden sm:block"></div>
              
              {/* Gumb za prijavu - četvrtastiji, oštriji */}
              <Link to="/auth" className="bg-black border border-black text-white px-5 py-1.5 text-[13px] font-bold uppercase tracking-wide rounded-sm hover:bg-gray-800 transition-colors">
                Prijava
              </Link>
            </div>
          </div>
        </nav>

        <main className="flex-grow">
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Routes>
              <Route path="/" element={<EventListPage />} />
              <Route path="/event/:id" element={<EventDetailPage />} />
              <Route path="/analytics" element={<AnalyticsDashboard />} />
              <Route path="/auth" element={<AuthPage />} />
            </Routes>
          </div>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;