import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import logo from '../assets/logo.jpg';

const NAV_ITEMS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'store-orders', icon: '🛍️', label: 'طلبات المتجر' },
  { key: 'products', icon: '📦', label: 'Products' },
  { key: 'orders', icon: '🛒', label: 'Orders' },
  { key: 'users', icon: '👥', label: 'Users' },
  { key: 'newsletter', icon: '📭', label: 'النشرة البريدية' },
  { key: 'videos', icon: '🎬', label: 'Videos' },
  { key: 'site-settings', icon: '⚙️', label: 'Settings' },
];

export default function AdminSidebar({ currentPage, onNavigate, isMobileOpen, onCloseMobile }) {
  const { logout, adminName, stats } = useAdmin();
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== 'undefined' ? window.innerWidth >= 768 : true
  );

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sidebarVisible = isDesktop || isMobileOpen;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && !isDesktop && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
            zIndex: 998, backdropFilter: 'blur(4px)',
          }}
        />
      )}

      <aside style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: 250,
        background: 'linear-gradient(180deg, #0a0a10, #050508)',
        borderRight: '1px solid rgba(191,64,191,0.1)',
        zIndex: 999,
        display: 'flex', flexDirection: 'column',
        transition: 'transform 0.25s ease',
        transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        direction: 'ltr',
        textAlign: 'left',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {/* Logo */}
        <div style={{
          padding: '24px 20px 18px',
          borderBottom: '1px solid rgba(191,64,191,0.08)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          flexShrink: 0,
        }}>
          <img src={logo} alt="VIP Logo" style={{ 
            width: 60, height: 60, 
            borderRadius: '50%', 
            marginBottom: 8, 
            boxShadow: '0 0 15px rgba(191,64,191,0.25)', 
            objectFit: 'cover' 
          }} />
          <p style={{
            fontSize: 9, color: 'rgba(153,153,159,0.4)',
            letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4,
            fontFamily: "'Orbitron', sans-serif",
          }}>Admin Panel</p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key); onCloseMobile?.(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', borderRadius: 10,
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  width: '100%',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(191,64,191,0.15), rgba(123,47,255,0.1))'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #bf40bf' : '3px solid transparent',
                  color: isActive ? '#f2f2f7' : 'rgba(153,153,159,0.6)',
                  transition: 'all 0.15s',
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  fontFamily: "'Inter', sans-serif",
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</span>
                {item.key === 'orders' && stats.pendingOrders > 0 && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                    background: '#ef4444', color: '#fff',
                    padding: '2px 7px', borderRadius: 99,
                    minWidth: 20, textAlign: 'center', flexShrink: 0,
                  }}>{stats.pendingOrders}</span>
                )}
                {item.key === 'store-orders' && stats.pendingStoreOrders > 0 && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                    background: '#f59e0b', color: '#fff',
                    padding: '2px 7px', borderRadius: 99,
                    minWidth: 20, textAlign: 'center', flexShrink: 0,
                  }}>{stats.pendingStoreOrders}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div style={{
          padding: '14px 14px 18px',
          borderTop: '1px solid rgba(191,64,191,0.08)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0,
            }}>{adminName?.[0] || 'A'}</div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#f2f2f7', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{adminName}</p>
              <p style={{ fontSize: 10, color: 'rgba(153,153,159,0.4)', margin: 0 }}>Super Admin</p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '9px 0', borderRadius: 10,
              border: '1px solid rgba(239,68,68,0.2)',
              background: 'rgba(239,68,68,0.06)', cursor: 'pointer',
              color: '#f87171', fontSize: 12, fontWeight: 500,
              transition: 'all 0.15s',
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239,68,68,0.06)';
              e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)';
            }}
          >
            🚪 تسجيل خروج
          </button>
        </div>
      </aside>
    </>
  );
}
