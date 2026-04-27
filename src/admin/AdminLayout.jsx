import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from './AdminLogin';
import AdminSidebar from './AdminSidebar';
import DashboardHome from './DashboardHome';
import ProductsPage from './ProductsPage';
import OrdersPage from './OrdersPage';
import StoreOrdersPage from './StoreOrdersPage';
import UsersPage from './UsersPage';
import VideosPage from './VideosPage';
import SiteSettingsPage from './SiteSettingsPage';
import NewsletterAdmin from './NewsletterAdmin';

/* ═══════════════════════════════════════════════
   NEW ORDER NOTIFICATION BANNER
   ═══════════════════════════════════════════════ */
function OrderNotificationBanner({ alert, onDismiss, onGoToOrders }) {
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (alert) {
      setVisible(true);
      setExiting(false);
    }
  }, [alert]);

  const handleDismiss = useCallback(() => {
    setExiting(true);
    setTimeout(() => {
      setVisible(false);
      setExiting(false);
      onDismiss();
    }, 300);
  }, [onDismiss]);

  // Auto-dismiss after 15 seconds
  useEffect(() => {
    if (alert && visible) {
      const timer = setTimeout(handleDismiss, 15000);
      return () => clearTimeout(timer);
    }
  }, [alert, visible, handleDismiss]);

  if (!visible || !alert) return null;

  const order = alert.order;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
      padding: '0 12px',
      animation: exiting ? 'notifSlideOut 0.3s ease-in forwards' : 'notifSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
    }}>
      <div style={{
        maxWidth: 480, margin: '12px auto 0',
        background: 'linear-gradient(135deg, rgba(10,10,16,0.98), rgba(15,8,30,0.98))',
        borderRadius: 18,
        border: '1px solid rgba(0,255,102,0.3)',
        boxShadow: '0 8px 40px rgba(0,255,102,0.15), 0 0 80px rgba(0,255,102,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
        backdropFilter: 'blur(20px)',
        overflow: 'hidden',
      }}>
        {/* Animated glow bar at top */}
        <div style={{
          height: 3,
          background: 'linear-gradient(90deg, #00ff66, #25D366, #00ff66)',
          backgroundSize: '200% 100%',
          animation: 'glowSlide 2s linear infinite',
        }} />

        <div style={{ padding: '14px 16px 16px', direction: 'rtl' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 12,
                background: 'rgba(0,255,102,0.12)',
                border: '1px solid rgba(0,255,102,0.25)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18, animation: 'bellRing 0.6s ease-in-out',
              }}>🔔</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: '#00ff66', margin: 0, letterSpacing: '0.02em' }}>
                  🛍️ طلب جديد!
                  {alert.count > 1 && <span style={{ fontSize: 11, marginRight: 6, color: '#25D366' }}>({alert.count} طلبات)</span>}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(153,153,159,0.6)', margin: '2px 0 0' }}>
                  {new Date(alert.timestamp).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <button onClick={handleDismiss} style={{
              background: 'rgba(255,255,255,0.05)', border: 'none',
              color: '#666', fontSize: 14, cursor: 'pointer',
              width: 28, height: 28, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>✕</button>
          </div>

          {/* Order details */}
          <div style={{
            padding: '10px 12px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: 10,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#f2f2f7', margin: '0 0 4px' }}>
                  👤 {order.customerName || 'عميل جديد'}
                </p>
                <p style={{ fontSize: 11, color: '#aaa', margin: 0 }}>
                  👕 {order.productName} · 📏 {order.size}
                </p>
              </div>
              <div style={{
                fontSize: 16, fontWeight: 900, color: '#bf40bf',
                fontFamily: "'Inter', sans-serif",
              }}>
                {order.price} <span style={{ fontSize: 10, fontWeight: 600 }}>ج.م</span>
              </div>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => { onGoToOrders(); handleDismiss(); }}
            style={{
              width: '100%', padding: '10px 0', borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(0,255,102,0.15), rgba(37,211,102,0.1))',
              border: '1px solid rgba(0,255,102,0.25)',
              color: '#00ff66', fontSize: 12, fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: "'Noto Sans Arabic', 'Inter', sans-serif",
            }}
          >
            📋 الذهاب للطلبات
          </button>
        </div>
      </div>

      <style>{`
        @keyframes notifSlideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes notifSlideOut {
          from { transform: translateY(0); opacity: 1; }
          to { transform: translateY(-100%); opacity: 0; }
        }
        @keyframes glowSlide {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes bellRing {
          0% { transform: rotate(0deg); }
          15% { transform: rotate(14deg); }
          30% { transform: rotate(-14deg); }
          45% { transform: rotate(10deg); }
          60% { transform: rotate(-8deg); }
          75% { transform: rotate(4deg); }
          90% { transform: rotate(-2deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}

export default function AdminLayout() {
  const { isAuthenticated, newOrderAlert, setNewOrderAlert } = useAdmin();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (!isAuthenticated) return <AdminLogin />;

  const renderPage = () => {
    switch (currentPage) {
      case 'products': return <ProductsPage />;
      case 'orders': return <OrdersPage />;
      case 'store-orders': return <StoreOrdersPage />;
      case 'users': return <UsersPage />;
      case 'videos': return <VideosPage />;
      case 'newsletter': return <NewsletterAdmin />;
      case 'site-settings': return <SiteSettingsPage />;
      default: return <DashboardHome />;
    }
  };

  const pageTitle = {
    dashboard: '📊 لوحة التحكم',
    'store-orders': '🛍️ طلبات المتجر',
    products: '📦 المنتجات',
    orders: '🛒 الطلبات',
    users: '👥 الأعضاء',
    newsletter: '📭 النشرة البريدية',
    videos: '🎬 الفيديوهات',
    'site-settings': '⚙️ إعدادات الموقع',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      color: '#f2f2f7',
      fontFamily: "'Inter', 'Noto Sans Arabic', sans-serif",
    }}>
      {/* 🔔 New Order Notification Banner */}
      <OrderNotificationBanner
        alert={newOrderAlert}
        onDismiss={() => setNewOrderAlert(null)}
        onGoToOrders={() => setCurrentPage('store-orders')}
      />

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
