import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import PortalEntrance from './components/PortalEntrance';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductStore from './components/ProductStore';
import Footer from './components/Footer';
import { AdminProvider } from './context/AdminContext';
import AdminLayout from './admin/AdminLayout';

function StoreFront() {
  const [portalDone, setPortalDone] = useState(false);

  const handlePortalComplete = useCallback(() => {
    setPortalDone(true);
  }, []);

  return (
    <>
      {/* Cinematic Portal Entrance */}
      {!portalDone && <PortalEntrance onComplete={handlePortalComplete} />}

      <div className="relative min-h-screen bg-obsidian text-white-95 overflow-x-hidden">
        {/* Deep-Space Starfield — disabled during intro for performance */}
        {portalDone && <ParticleCanvas />}

        {/* Glass Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="relative z-10 pt-24 md:pt-20 overflow-x-hidden">
          <Hero />
          <ProductStore />
        </main>

        <Footer />
      </div>
    </>
  );
}

export default function App() {
  return (
    <AdminProvider>
      <Routes>
        <Route path="/*" element={<StoreFront />} />
        <Route path="/admin/*" element={<AdminLayout />} />
      </Routes>
    </AdminProvider>
  );
}
