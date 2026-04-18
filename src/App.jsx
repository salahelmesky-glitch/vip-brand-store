import { useState, useCallback } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import PortalEntrance from './components/PortalEntrance';
import ParticleCanvas from './components/ParticleCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductStore from './components/ProductStore';
import Footer from './components/Footer';
import AIStylist from './components/AIStylist';
import EmptyPage2 from './components/EmptyPage2';
import SettingsPage from './components/SettingsPage';
import { AdminProvider } from './context/AdminContext';
import { UserProvider } from './context/UserContext';
import AdminLayout from './admin/AdminLayout';

function StoreFront() {
  const [portalDone, setPortalDone] = useState(() => {
    return sessionStorage.getItem('portal-done') === 'true';
  });

  const handlePortalComplete = useCallback(() => {
    setPortalDone(true);
    sessionStorage.setItem('portal-done', 'true');
  }, []);

  // Check maintenance mode
  const isMaintenance = localStorage.getItem('vip_maintenance') === 'true';
  if (isMaintenance) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 20,
        background: '#050010', color: '#f2f2f7', fontFamily: "'Inter',sans-serif",
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>🔧</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px' }}>تحت الصيانة</h1>
        <p style={{ fontSize: 14, color: '#888', margin: '0 0 4px' }}>Under Maintenance</p>
        <p style={{ fontSize: 12, color: '#555', maxWidth: 320, lineHeight: 1.6, margin: '10px 0 20px' }}>
          الموقع قيد الصيانة حالياً وهنرجع قريب جداً بتحديثات جديدة! 🚀
        </p>
        <a href="/admin" style={{
          fontSize: 10, color: 'rgba(191,64,191,0.3)', textDecoration: 'none',
        }}>Admin</a>
      </div>
    );
  }

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
    <UserProvider>
      <AdminProvider>
        <Routes>
          <Route path="/*" element={<StoreFront />} />
          <Route path="/ai" element={<AIStylist />} />
          <Route path="/page2" element={<EmptyPage2 />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin/*" element={<AdminLayout />} />
        </Routes>
      </AdminProvider>
    </UserProvider>
  );
}
