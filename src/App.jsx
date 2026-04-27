import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductStore from './components/ProductStore';
import Footer from './components/Footer';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { UserProvider } from './context/UserContext';

import AIStylist from './components/AIStylist';
import EmptyPage2 from './components/EmptyPage2';
import SettingsPage from './components/SettingsPage';

import PortalEntrance from './components/PortalEntrance';
import ParticleCanvas from './components/ParticleCanvas';

/* ─── Lazy-loaded routes (less critical) ─── */
const AdminLayout = lazy(() => import('./admin/AdminLayout'));

/* ─── Loading fallback ─── */
function LoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050010', color: '#bf40bf', fontFamily: "'Inter',sans-serif",
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 36, marginBottom: 12, animation: 'pulse 1.5s infinite' }}>⚡</div>
        <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.2em' }}>VIP</p>
      </div>
    </div>
  );
}

/* ─── Beautiful Maintenance Page ─── */
function MaintenancePage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      background: 'linear-gradient(135deg, #050010 0%, #0c0020 50%, #050010 100%)',
      color: '#f2f2f7', fontFamily: "'Inter',sans-serif",
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 400, height: 400, borderRadius: '50%', opacity: 0.15,
        background: 'radial-gradient(circle, rgba(191,64,191,0.6), transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none',
      }} />

      {/* Gear icon with animation */}
      <div style={{
        fontSize: 80, marginBottom: 24,
        animation: 'gearSpin 4s linear infinite',
        filter: 'drop-shadow(0 0 20px rgba(191,64,191,0.4))',
      }}>⚙️</div>

      {/* Arabic Title */}
      <h1 style={{
        fontSize: 32, fontWeight: 900, margin: '0 0 8px',
        background: 'linear-gradient(135deg, #bf40bf, #d966d9)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        letterSpacing: '0.05em',
      }}>تحت الصيانة</h1>

      {/* English subtitle */}
      <p style={{ fontSize: 16, color: '#888', margin: '0 0 20px', fontWeight: 500 }}>
        Under Maintenance
      </p>

      {/* Decorative line */}
      <div style={{
        width: 80, height: 2, margin: '0 auto 24px',
        background: 'linear-gradient(90deg, transparent, #bf40bf, transparent)',
        borderRadius: 1,
      }} />

      {/* Description */}
      <p style={{
        fontSize: 15, color: '#aaa', maxWidth: 380, lineHeight: 1.8,
        margin: '0 0 32px', direction: 'rtl',
      }}>
        الموقع قيد الصيانة حالياً 🔧<br />
        وهنرجع قريب جداً بتحديثات جديدة وحاجات تحفة! 🚀
      </p>

      {/* VIP brand badge */}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '12px 24px', borderRadius: 16,
        background: 'rgba(191,64,191,0.08)',
        border: '1px solid rgba(191,64,191,0.2)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 900, color: '#fff',
        }}>V</div>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#d966d9', letterSpacing: '0.15em' }}>
          VIP BRAND
        </span>
      </div>

      {/* Admin link (subtle) */}
      <a href="/admin" style={{
        position: 'absolute', bottom: 20,
        fontSize: 10, color: 'rgba(191,64,191,0.15)', textDecoration: 'none',
      }}>Admin</a>

      <style>{`
        @keyframes gearSpin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function StoreFront() {
  const { maintenance } = useAdmin();

  const [portalDone, setPortalDone] = useState(() => {
    return sessionStorage.getItem('portal-done') === 'true';
  });

  const handlePortalComplete = useCallback(() => {
    setPortalDone(true);
    sessionStorage.setItem('portal-done', 'true');
  }, []);

  /* If maintenance mode is ON (from MongoDB), show maintenance page */
  if (maintenance) {
    return <MaintenancePage />;
  }

  return (
    <>
      {/* Logo Intro — shows once per session */}
      {!portalDone && (
        <PortalEntrance onComplete={handlePortalComplete} />
      )}

      <div className="relative min-h-screen bg-obsidian text-white-95 overflow-x-hidden">
        {/* Deep-Space Starfield */}
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
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/*" element={<StoreFront />} />
            <Route path="/ai" element={<AIStylist />} />
            <Route path="/page2" element={<EmptyPage2 />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
        </Suspense>
      </AdminProvider>
    </UserProvider>
  );
}
