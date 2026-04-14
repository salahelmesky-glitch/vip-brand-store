import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import DashboardHome from './DashboardHome';
import ProductsPage from './ProductsPage';
import OrdersPage from './OrdersPage';

export default function AdminLayout() {
  const { isAuthenticated } = useAdmin();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!isAuthenticated) return <AdminLogin />;

  const renderPage = () => {
    switch (currentPage) {
      case 'products': return <ProductsPage />;
      case 'orders': return <OrdersPage />;
      default: return <DashboardHome />;
    }
  };

  const pageTitle = {
    dashboard: '📊 لوحة التحكم',
    products: '📦 المنتجات',
    orders: '🛒 الطلبات',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      color: '#f2f2f7',
      fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
    }}>
      <AdminSidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main content */}
      <div style={{
        marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? 250 : 0,
        transition: 'margin-left 0.3s',
        minHeight: '100vh',
      }}>
        {/* Top Bar */}
        <div style={{
          padding: '18px 24px',
          display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: '1px solid rgba(191,64,191,0.06)',
          background: 'rgba(5,5,5,0.95)',
          backdropFilter: 'blur(10px)',
          position: 'sticky', top: 0, zIndex: 100,
        }}>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            style={{
              display: typeof window !== 'undefined' && window.innerWidth >= 768 ? 'none' : 'flex',
              alignItems: 'center', justifyContent: 'center',
              width: 38, height: 38, borderRadius: 10,
              border: '1px solid rgba(191,64,191,0.12)',
              background: 'rgba(191,64,191,0.06)',
              color: '#d966d9', cursor: 'pointer', fontSize: 18,
            }}
          >☰</button>

          <h1 style={{
            fontSize: 18, fontWeight: 700,
            fontFamily: "'Noto Sans Arabic', sans-serif",
            direction: 'rtl',
          }}>{pageTitle[currentPage]}</h1>

          {/* Back to store link */}
          <a
            href="/"
            style={{
              marginLeft: 'auto',
              fontSize: 11, color: 'rgba(153,153,159,0.5)',
              textDecoration: 'none',
              padding: '6px 14px', borderRadius: 8,
              border: '1px solid rgba(255,255,255,0.06)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(191,64,191,0.2)';
              e.currentTarget.style.color = '#d966d9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
              e.currentTarget.style.color = 'rgba(153,153,159,0.5)';
            }}
          >🏠 الموقع</a>
        </div>

        {/* Page Content */}
        <div style={{ padding: '24px' }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
