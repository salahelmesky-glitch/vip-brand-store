import { useAdmin } from '../context/AdminContext';

const NAV_ITEMS = [
  { key: 'dashboard', icon: '📊', label: 'Dashboard' },
  { key: 'products', icon: '📦', label: 'Products' },
  { key: 'orders', icon: '🛒', label: 'Orders' },
];

export default function AdminSidebar({ currentPage, onNavigate, isMobileOpen, onCloseMobile }) {
  const { logout, adminName, stats } = useAdmin();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
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
        transition: 'transform 0.3s ease',
        transform: isMobileOpen ? 'translateX(0)' : undefined,
        ...(typeof window !== 'undefined' && window.innerWidth < 768 && !isMobileOpen
          ? { transform: 'translateX(-100%)' }
          : {}),
      }}>
        {/* Logo */}
        <div style={{
          padding: '28px 24px 20px',
          borderBottom: '1px solid rgba(191,64,191,0.08)',
        }}>
          <div style={{
            fontSize: 28, fontWeight: 900,
            fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '0.12em',
            background: 'linear-gradient(135deg, #fff, #bf40bf, #7b2fff)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 20px rgba(191,64,191,0.3))',
          }}>VIP</div>
          <p style={{
            fontSize: 9, color: 'rgba(153,153,159,0.4)',
            letterSpacing: '0.25em', textTransform: 'uppercase', marginTop: 4,
            fontFamily: "'Orbitron', sans-serif",
          }}>Admin Panel</p>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => { onNavigate(item.key); onCloseMobile?.(); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '13px 16px', borderRadius: 12,
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  width: '100%',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(191,64,191,0.15), rgba(123,47,255,0.1))'
                    : 'transparent',
                  borderLeft: isActive ? '3px solid #bf40bf' : '3px solid transparent',
                  color: isActive ? '#f2f2f7' : 'rgba(153,153,159,0.6)',
                  transition: 'all 0.2s',
                  fontSize: 13, fontWeight: isActive ? 600 : 400,
                  fontFamily: "'Inter', sans-serif",
                  boxShadow: isActive ? '0 0 20px rgba(191,64,191,0.08)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                <span>{item.label}</span>
                {item.key === 'orders' && stats.pendingOrders > 0 && (
                  <span style={{
                    marginLeft: 'auto', fontSize: 10, fontWeight: 700,
                    background: '#ef4444', color: '#fff',
                    padding: '2px 7px', borderRadius: 99,
                    minWidth: 20, textAlign: 'center',
                  }}>{stats.pendingOrders}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User & Logout */}
        <div style={{
          padding: '16px 16px 20px',
          borderTop: '1px solid rgba(191,64,191,0.08)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 700, color: '#fff',
            }}>{adminName?.[0] || 'A'}</div>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: '#f2f2f7' }}>{adminName}</p>
              <p style={{ fontSize: 10, color: 'rgba(153,153,159,0.4)' }}>Super Admin</p>
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              width: '100%', padding: '10px 0', borderRadius: 10,
              border: '1px solid rgba(239,68,68,0.2)',
              background: 'rgba(239,68,68,0.06)', cursor: 'pointer',
              color: '#f87171', fontSize: 12, fontWeight: 500,
              transition: 'all 0.2s',
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
