import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import EventListPage from './pages/EventListPage';
import EventDetailPage from './pages/EventDetailPage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import AuthPage from './pages/AuthPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        
        <nav className="bg-slate-900 text-white px-6 py-4 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/" className="text-xl font-black tracking-tight hover:text-indigo-400 transition-colors">
              News Registry App
            </Link>
          </div>
          
          <div className="flex items-center space-x-6 font-semibold text-sm">
            <Link to="/" className="hover:text-indigo-400 transition-colors">Vijesti</Link>
            <Link to="/analytics" className="hover:text-indigo-400 transition-colors">Analitika</Link>
            <Link to="/auth" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm">
              Prijava
            </Link>
          </div>
        </nav>

        <main className="flex-grow container mx-auto p-4 mt-6 max-w-7xl w-full">
          <Routes>
            <Route path="/" element={<EventListPage />} />
            <Route path="/event/:id" element={<EventDetailPage />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/auth" element={<AuthPage />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}

export default App;