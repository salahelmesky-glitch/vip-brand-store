import { useState, useEffect } from 'react';
import logo from '../assets/logo.jpg';

/* ─── Fast, lightweight intro ─── */
export default function PortalEntrance({ onComplete }) {
  const [phase, setPhase] = useState('logo'); // logo → done

  useEffect(() => {
    // Exact 1-second intro logo appearance as requested
    const t1 = setTimeout(() => setPhase('done'), 1000);
    const t2 = setTimeout(() => onComplete?.(), 1250);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000000',
        animation: phase === 'done' ? 'fadeOut 0.25s forwards' : undefined,
      }}
    >
      {/* Eagle Logo — simple fade in */}
      <div
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          overflow: 'hidden',
          animation: 'splashGlow 2s ease-in-out infinite, logoIn 0.5s ease-out',
          boxShadow: '0 0 40px rgba(188,19,254,0.4), 0 0 80px rgba(188,19,254,0.15)',
        }}
      >
        <img
          src={logo}
          alt="VIP Eagle Logo"
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
        />
      </div>

      {/* Brand name */}
      <p
        style={{
          marginTop: '20px',
          fontFamily: "'Orbitron', sans-serif",
          fontSize: '14px',
          letterSpacing: '0.4em',
          color: 'rgba(191,64,191,0.6)',
          animation: 'logoIn 0.5s ease-out 0.1s both',
        }}
      >
        VIP BRAND
      </p>

      <style>{`
        @keyframes splashGlow {
          0%, 100% { box-shadow: 0 0 30px rgba(188,19,254,0.3), 0 0 60px rgba(188,19,254,0.15); }
          50% { box-shadow: 0 0 50px rgba(188,19,254,0.6), 0 0 100px rgba(188,19,254,0.25); }
        }
        @keyframes logoIn {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
          to { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
