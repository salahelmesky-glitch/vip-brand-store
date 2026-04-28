import { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import AdminLayout from './admin/AdminLayout';

import PortalEntrance from './components/PortalEntrance';
import BottomNav from './components/BottomNav';

import InstallPrompt from './components/InstallPrompt';

/* ─── Scroll to top on every route change ─── */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/* ─── Lazy-loaded routes (less critical) ─── */
const SizeGuide = lazy(() => import('./components/SizeGuide'));
const ShippingInfo = lazy(() => import('./components/ShippingInfo'));
const FAQPage = lazy(() => import('./components/FAQPage'));
const OrderTracking = lazy(() => import('./components/OrderTracking'));

/* ─── Ultra-light loading fallback ─── */
function LoadingFallback() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#050010', color: '#bf40bf',
    }}>
      <p style={{ fontSize: 14, fontWeight: 700, letterSpacing: '0.2em', fontFamily: "'Inter',sans-serif" }}>VIP</p>
    </div>
  );
}

/* ─── Maintenance Page ─── */
function MaintenancePage() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 20,
      background: 'linear-gradient(135deg, #050010 0%, #0c0020 50%, #050010 100%)',
      color: '#f2f2f7', fontFamily: "'Inter',sans-serif",
      textAlign: 'center', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        fontSize: 80, marginBottom: 24,
        animation: 'gearSpin 4s linear infinite',
      }}>⚙️</div>

      <h1 style={{
        fontSize: 28, fontWeight: 900, margin: '0 0 8px',
        background: 'linear-gradient(135deg, #bf40bf, #d966d9)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
      }}>تحت الصيانة</h1>

      <p style={{ fontSize: 14, color: '#888', margin: '0 0 20px', fontWeight: 500 }}>
        Under Maintenance
      </p>

      <div style={{
        width: 80, height: 2, margin: '0 auto 24px',
        background: 'linear-gradient(90deg, transparent, #bf40bf, transparent)',
      }} />

      <p style={{
        fontSize: 14, color: '#aaa', maxWidth: 360, lineHeight: 1.8,
        margin: '0 0 32px', direction: 'rtl',
      }}>
        الموقع قيد الصيانة حالياً 🔧<br />
        وهنرجع قريب جداً بتحديثات جديدة! 🚀
      </p>

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

  if (maintenance) {
    return <MaintenancePage />;
  }

  return (
    <>
      {!portalDone && (
        <PortalEntrance onComplete={handlePortalComplete} />
      )}

      <div style={{
        position: 'relative', minHeight: '100vh',
        background: '#050010', color: '#f2f2f7',
        overflowX: 'hidden', maxWidth: '100vw',
      }}>
        <Navbar />

        <main style={{
          position: 'relative', zIndex: 10,
          paddingTop: '80px', paddingBottom: '80px',
          overflowX: 'hidden', maxWidth: '100vw',
        }}>
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
          <ScrollToTop />
          <Routes>
            <Route path="/*" element={<StoreFront />} />
            <Route path="/ai" element={<AIStylist />} />
            <Route path="/page2" element={<EmptyPage2 />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/size-guide" element={<SizeGuide />} />
            <Route path="/shipping" element={<ShippingInfo />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/track-order" element={<OrderTracking />} />
            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
          <BottomNav />
          <InstallPrompt />
        </Suspense>
      </AdminProvider>
    </UserProvider>
  );
}
