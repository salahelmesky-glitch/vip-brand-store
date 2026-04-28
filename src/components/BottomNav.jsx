import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { key: '/', icon: '🏠', label: 'الرئيسية' },
  { key: '/store', icon: '🛒', label: 'المتجر' },
  { key: '/ai', icon: '🤖', label: 'AI' },
  { key: '/page2', icon: '🏆', label: 'مسابقات' },
  { key: '/settings', icon: '👤', label: 'حسابي' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState('/');

  // Don't show on admin pages
  const isAdmin = location.pathname.startsWith('/admin');
  if (isAdmin) return null;

  useEffect(() => {
    const path = location.pathname;
    if (path === '/' || path === '') setActiveKey('/');
    else if (path === '/ai') setActiveKey('/ai');
    else if (path === '/page2') setActiveKey('/page2');
    else if (path === '/settings') setActiveKey('/settings');
    else setActiveKey(path);
  }, [location.pathname]);

  const handleClick = (key, e) => {
    if (key === '/store') {
      e.preventDefault();
      if (location.pathname === '/') {
        // Already on home — just scroll to store
        const el = document.getElementById('store');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Navigate to home first, scroll to top, then scroll to store
        navigate('/');
        window.scrollTo(0, 0);
        setTimeout(() => {
          const el = document.getElementById('store');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
      setActiveKey('/store');
      return;
    }
    // For home and other links — always scroll to top when navigating
    if (key === '/' && location.pathname !== '/') {
      window.scrollTo(0, 0);
    }
  };

  return (
    <nav
      className="bottom-nav-container"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        height: '64px',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        background: 'rgba(5, 0, 16, 0.95)',
        borderTop: '1px solid rgba(191, 64, 191, 0.1)',
        boxShadow: '0 -2px 20px rgba(0,0,0,0.5)',
      }}
    >
      {navItems.map((item) => {
        const isActive = activeKey === item.key ||
          (item.key === '/' && activeKey !== '/ai' && activeKey !== '/page2' && activeKey !== '/settings' && activeKey !== '/store' && location.pathname === '/');
        const isStore = item.key === '/store';

        const content = (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '2px',
              padding: '6px 0',
              minWidth: '52px',
              position: 'relative',
            }}
          >
            {/* Active indicator dot */}
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '-6px',
                  width: '16px',
                  height: '2px',
                  borderRadius: '2px',
                  background: '#bf40bf',
                  boxShadow: '0 0 8px rgba(191,64,191,0.4)',
                }}
              />
            )}
            <span
              style={{
                fontSize: '18px',
                lineHeight: 1,
                filter: isActive ? 'drop-shadow(0 0 6px rgba(191,64,191,0.3))' : 'none',
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: '9px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#d966d9' : 'rgba(153,153,159,0.5)',
                fontFamily: "'Noto Sans Arabic', 'Inter', sans-serif",
              }}
            >
              {item.label}
            </span>
          </div>
        );

        if (isStore) {
          return (
            <a
              key={item.key}
              href="/#store"
              onClick={(e) => handleClick(item.key, e)}
              style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
            >
              {content}
            </a>
          );
        }

        return (
          <Link
            key={item.key}
            to={item.key}
            style={{ textDecoration: 'none', WebkitTapHighlightColor: 'transparent' }}
          >
            {content}
          </Link>
        );
      })}

      <style>{`
        @media (min-width: 769px) {
          .bottom-nav-container {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
}
