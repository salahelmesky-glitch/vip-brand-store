import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import { useAdmin } from '../context/AdminContext';

export default function Hero() {
  const { siteTexts } = useAdmin();
  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
        padding: '0 16px',
        maxWidth: '100vw',
      }}
    >
      {/* Radial ambient glow */}
      <div style={{
        position: 'absolute', top: '25%', left: '50%', transform: 'translate(-50%, -50%)',
        width: 300, height: 300, borderRadius: '50%', filter: 'blur(100px)',
        background: 'rgba(191,64,191,0.05)', pointerEvents: 'none',
      }} />

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 600 }}>

        {/* ★ Navigate to Page 2 — Glowing Arrow ★ */}
        <Link
          to="/page2"
          className="page2-arrow-btn"
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 6, marginBottom: 20, textDecoration: 'none', cursor: 'pointer',
          }}
        >
          <div
            className="page2-arrow-circle"
            style={{
              width: 44, height: 44, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(191, 64, 191, 0.08)',
              border: '1.5px solid rgba(191, 64, 191, 0.35)',
              transition: 'all 0.3s ease',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="#d966d9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              style={{ transition: 'transform 0.3s ease' }} className="page2-arrow-icon"
            >
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </div>
          <span style={{
            fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#99999f', fontWeight: 500, transition: 'color 0.3s ease',
          }} className="page2-arrow-label">
            Page 2 / صفحة ٢
          </span>
        </Link>


        {/* Eagle Logo */}
        <div style={{ marginBottom: 20 }}>
          <div className="logo-container" style={{ width: 110, height: 110 }}>
            <img
              src={logo}
              alt="VIP Eagle Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
        </div>

        {/* Subtitle */}
        <p style={{
          fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
          fontWeight: 500, marginBottom: 20, color: '#bf40bf',
          maxWidth: 350, lineHeight: 1.6, textAlign: 'center',
          fontFamily: "'Inter', sans-serif",
        }}>
          {siteTexts?.heroSubtitle || '★ Exclusive Luxury Streetwear / أزياء فاخرة حصرية ★'}
        </p>

        {/* VIP Title */}
        <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <h1 className="vip-cosmic" style={{
            fontFamily: "'Orbitron', sans-serif",
            fontSize: 'clamp(5.5rem, 20vw, 16rem)',
            fontWeight: 900, lineHeight: 1, margin: 0, padding: 0,
            userSelect: 'none', textAlign: 'center',
          }}>
            {siteTexts?.brandName || 'VIP'}
          </h1>
          <div className="vip-shimmer" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        </div>

        {/* Decorative line */}
        <div style={{
          width: 80, height: 1, marginBottom: 16,
          background: 'linear-gradient(90deg, transparent, #bf40bf, transparent)',
        }} />

        {/* Tagline */}
        <p style={{
          fontSize: 14, fontWeight: 300, lineHeight: 1.6, marginBottom: 28,
          textAlign: 'center', maxWidth: 320, color: '#99999f',
          padding: '0 8px',
        }}>
          {siteTexts?.heroTaglineEn || 'Redefining luxury for the digital era.'}
          <br />
          <span className="ar" style={{ fontSize: 13, lineHeight: 1.4, marginTop: 4, display: 'inline-block' }}>
            {siteTexts?.heroTaglineAr || 'نعيد تعريف الفخامة لعصر جديد.'}
          </span>
        </p>

        {/* CTA Button */}
        <a
          href="#store"
          style={{
            display: 'inline-block',
            padding: '12px 40px', borderRadius: 999,
            background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
            color: '#fff', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            textDecoration: 'none', transition: 'box-shadow 0.3s',
          }}
        >
          {siteTexts?.ctaButton || 'Shop Now / تسوق الآن'}
        </a>

        {/* BOYS / GIRLS Buttons */}
        <div style={{
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          width: '100%', marginTop: 36, gap: 16, flexWrap: 'wrap',
          padding: '0 12px',
        }}>
          {/* Boys */}
          <a
            href="#boys-section"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center',
              width: 140, height: 90, borderRadius: 16,
              background: 'rgba(191, 64, 191, 0.06)',
              border: '1.5px solid rgba(191, 64, 191, 0.3)',
              textDecoration: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <span style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 700,
              letterSpacing: '0.15em', color: '#d966d9',
            }}>BOYS</span>
            <span className="ar" style={{ fontSize: 13, marginTop: 6, fontWeight: 600, color: '#bf40bf' }}>
              قسم الولاد
            </span>
          </a>

          {/* Girls */}
          <a
            href="#girls-section"
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'center',
              width: 140, height: 90, borderRadius: 16,
              background: 'rgba(123, 47, 255, 0.06)',
              border: '1.5px solid rgba(123, 47, 255, 0.3)',
              textDecoration: 'none',
              transition: 'border-color 0.2s, box-shadow 0.2s',
            }}
          >
            <span style={{
              fontFamily: "'Orbitron', sans-serif", fontSize: 16, fontWeight: 700,
              letterSpacing: '0.15em', color: '#d966d9',
            }}>GIRLS</span>
            <span className="ar" style={{ fontSize: 13, marginTop: 6, fontWeight: 600, color: '#7b2fff' }}>
              قسم البنات
            </span>
          </a>
        </div>
      </div>

      {/* Scroll indicator — small and spaced away */}
      <div style={{
        position: 'absolute', bottom: 12,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        opacity: 0.5,
      }}>
        <span style={{ fontSize: 7, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#99999f' }}>SCROLL</span>
        <div style={{
          width: 14, height: 22, borderRadius: 99,
          border: '1px solid rgba(153,153,159,0.25)',
          display: 'flex', justifyContent: 'center', paddingTop: 4,
        }}>
          <div style={{
            width: 2, height: 5, borderRadius: 99,
            background: '#bf40bf',
            animation: 'scrollBounce 2s ease-in-out infinite',
          }} />
        </div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(4px); }
        }
        .page2-arrow-circle {
          animation: arrowPulse 2.5s ease-in-out infinite;
        }
        @keyframes arrowPulse {
          0%, 100% { box-shadow: 0 0 10px rgba(191,64,191,0.1); }
          50% { box-shadow: 0 0 20px rgba(191,64,191,0.25); }
        }
        .page2-arrow-btn:hover .page2-arrow-circle {
          background: rgba(191, 64, 191, 0.18) !important;
          border-color: rgba(217, 102, 217, 0.7) !important;
        }
        .page2-arrow-btn:hover .page2-arrow-icon {
          stroke: #ffffff;
          transform: translate(2px, -2px);
        }
        .page2-arrow-btn:hover .page2-arrow-label {
          color: #d966d9 !important;
        }
      `}</style>
    </section>
  );
}
