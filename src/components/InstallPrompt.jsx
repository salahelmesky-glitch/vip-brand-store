import { useState, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import logo from '../assets/logo.jpg';

/* ═══════════════════════════════════════════════
   WELCOME MESSAGE — shown after successful install
   ═══════════════════════════════════════════════ */
function WelcomeOverlay({ onClose }) {
  const [phase, setPhase] = useState(0); // 0=enter, 1=visible, 2=exit

  useEffect(() => {
    // Phase 0 → 1 (show content)
    const t1 = setTimeout(() => setPhase(1), 100);
    // Auto-close after 6 seconds
    const t2 = setTimeout(() => {
      setPhase(2);
      setTimeout(onClose, 600);
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onClose]);

  const handleClose = useCallback(() => {
    setPhase(2);
    setTimeout(onClose, 600);
  }, [onClose]);

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 999999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5,0,16,0.95)',
        backdropFilter: 'blur(20px)',
        opacity: phase === 0 ? 0 : phase === 2 ? 0 : 1,
        transition: 'opacity 0.5s ease',
      }}
    >
      <div style={{
        textAlign: 'center', direction: 'rtl',
        transform: phase === 1 ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(30px)',
        opacity: phase === 1 ? 1 : 0,
        transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
        maxWidth: 340, padding: '0 20px',
      }}>
        {/* Animated logo */}
        <div style={{
          width: 100, height: 100, borderRadius: 24, margin: '0 auto 24px',
          overflow: 'hidden', position: 'relative',
          boxShadow: '0 0 60px rgba(191,64,191,0.4), 0 0 120px rgba(123,47,255,0.2)',
          border: '2px solid rgba(191,64,191,0.3)',
        }}>
          <img src={logo} alt="VIP" style={{
            width: '100%', height: '100%', objectFit: 'cover',
          }} />
          {/* Shimmer effect */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
            animation: 'welcomeShimmer 2s ease-in-out infinite',
          }} />
        </div>

        {/* Checkmark */}
        <div style={{
          fontSize: 48, marginBottom: 16,
          animation: 'welcomeBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s both',
        }}>✅</div>

        {/* Welcome text */}
        <h2 style={{
          fontSize: 22, fontWeight: 900, margin: '0 0 8px',
          background: 'linear-gradient(135deg, #ffffff 0%, #bf40bf 50%, #7b2fff 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          fontFamily: "'Noto Sans Arabic', 'Inter', sans-serif",
          animation: 'welcomeFadeUp 0.5s ease-out 0.4s both',
        }}>
          🎉 أهلاً بيك في عيلة VIP!
        </h2>

        <p style={{
          fontSize: 14, color: '#d4d4d8', margin: '0 0 6px',
          fontFamily: "'Noto Sans Arabic', sans-serif",
          fontWeight: 600, lineHeight: 1.8,
          animation: 'welcomeFadeUp 0.5s ease-out 0.5s both',
        }}>
          لقد انضممت إلى براند VIP 👑
        </p>

        <p style={{
          fontSize: 12, color: '#888', margin: '0 0 24px',
          fontFamily: "'Noto Sans Arabic', sans-serif",
          lineHeight: 1.7,
          animation: 'welcomeFadeUp 0.5s ease-out 0.6s both',
        }}>
          دلوقتي هتوصلك كل العروض الحصرية والمنتجات الجديدة
          <br />
          أول واحد قبل أي حد! 🔥
        </p>

        {/* Decorative line */}
        <div style={{
          width: 80, height: 2, margin: '0 auto 20px',
          background: 'linear-gradient(90deg, transparent, #bf40bf, transparent)',
          animation: 'welcomeFadeUp 0.5s ease-out 0.7s both',
        }} />

        {/* CTA */}
        <button
          onClick={handleClose}
          style={{
            padding: '12px 40px', borderRadius: 14, border: 'none',
            background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
            color: '#fff', fontSize: 14, fontWeight: 700,
            cursor: 'pointer',
            fontFamily: "'Noto Sans Arabic', 'Inter', sans-serif",
            boxShadow: '0 4px 20px rgba(191,64,191,0.4)',
            animation: 'welcomeFadeUp 0.5s ease-out 0.8s both',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        >
          🛍️ يلا نتسوق!
        </button>

        {/* Floating particles */}
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden',
        }}>
          {[...Array(12)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              width: 4 + Math.random() * 6,
              height: 4 + Math.random() * 6,
              borderRadius: '50%',
              background: i % 2 === 0 ? '#bf40bf' : '#7b2fff',
              opacity: 0.3 + Math.random() * 0.3,
              animation: `welcomeFloat ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes welcomeShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes welcomeBounce {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes welcomeFadeUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes welcomeFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.3); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   INSTALL PROMPT — Bottom banner prompting install
   ═══════════════════════════════════════════════ */
export default function InstallPrompt() {
  const { incrementInstallCount } = useAdmin();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);
  const [dismissed, setDismissed] = useState(() => {
    try { return sessionStorage.getItem('vip_install_dismissed') === 'true'; }
    catch { return false; }
  });

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      if (!dismissed) setShowPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful app install event
    const onInstalled = () => {
      incrementInstallCount();
      setShowPrompt(false);
      setInstalling(false);
      // Show welcome message!
      setShowWelcome(true);
      try { localStorage.setItem('vip_just_installed', 'true'); } catch {}
    };
    window.addEventListener('appinstalled', onInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', onInstalled);
    };
  }, [dismissed, incrementInstallCount]);

  useEffect(() => {
    // If already in standalone mode (installed PWA)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowPrompt(false);
      try {
        // Show welcome on first launch after install
        if (localStorage.getItem('vip_just_installed') === 'true') {
          localStorage.removeItem('vip_just_installed');
          setShowWelcome(true);
        }
        if (!localStorage.getItem('vip_install_tracked')) {
          localStorage.setItem('vip_install_tracked', 'true');
          incrementInstallCount();
        }
      } catch {}
    }
  }, [incrementInstallCount]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    
    setInstalling(true);
    setProgress(0);
    
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15 + 5;
      });
    }, 200);

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      clearInterval(progressInterval);
      setProgress(100);
      // Welcome message will show via appinstalled event
      setTimeout(() => {
        setShowPrompt(false);
        setInstalling(false);
      }, 800);
    } else {
      clearInterval(progressInterval);
      setInstalling(false);
      setProgress(0);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const handleDismiss = useCallback(() => {
    setShowPrompt(false);
    setDismissed(true);
    try { sessionStorage.setItem('vip_install_dismissed', 'true'); } catch {}
  }, []);

  return (
    <>
      {/* ─── Welcome Overlay (after install) ─── */}
      {showWelcome && (
        <WelcomeOverlay onClose={() => setShowWelcome(false)} />
      )}

      {/* ─── Top Progress Bar (visible during install) ─── */}
      {installing && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 99999,
          height: 4, background: 'rgba(5,0,16,0.8)',
        }}>
          <div style={{
            height: '100%',
            width: `${Math.min(progress, 100)}%`,
            background: 'linear-gradient(90deg, #bf40bf, #7b2fff, #bf40bf)',
            backgroundSize: '200% 100%',
            animation: 'installProgressGlow 1.5s linear infinite',
            borderRadius: '0 4px 4px 0',
            transition: 'width 0.3s ease-out',
            boxShadow: '0 0 12px rgba(191,64,191,0.6), 0 0 4px rgba(123,47,255,0.4)',
          }} />
        </div>
      )}

      {/* ─── Install Banner ─── */}
      {showPrompt && deferredPrompt && (
        <div style={{
          position: 'fixed', bottom: 74, left: '50%', transform: 'translateX(-50%)',
          zIndex: 9980, width: 'calc(100% - 20px)', maxWidth: 400,
          animation: 'installSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1)',
        }}>
          <div style={{
            borderRadius: 18, overflow: 'hidden',
            background: 'rgba(8,6,18,0.97)',
            border: '1px solid rgba(191,64,191,0.25)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.7), 0 0 20px rgba(191,64,191,0.1)',
          }}>
            <div style={{ height: 2, background: 'linear-gradient(90deg,#bf40bf,#7b2fff,#bf40bf)', backgroundSize: '200% 100%', animation: 'installGlow 3s linear infinite' }} />
            <div style={{ padding: '14px 16px', direction: 'rtl' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <img src={logo} alt="VIP" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover', flexShrink: 0, boxShadow: '0 2px 10px rgba(191,64,191,0.3)' }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, fontWeight: 800, color: '#f2f2f7', margin: 0 }}>📲 نزّل تطبيق VIP Brand!</p>
                  <p style={{ fontSize: 10, color: '#888', margin: '2px 0 0' }}>وصول أسرع للعروض والمنتجات الجديدة</p>
                </div>
                <button onClick={handleDismiss} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: '#555', fontSize: 12, cursor: 'pointer', width: 24, height: 24, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
              </div>

              {/* Install progress inline */}
              {installing && (
                <div style={{ marginBottom: 10, animation: 'fadeInUp 0.3s ease-out' }}>
                  <div style={{
                    height: 6, borderRadius: 99,
                    background: 'rgba(255,255,255,0.06)',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      width: `${Math.min(progress, 100)}%`,
                      background: 'linear-gradient(90deg, #bf40bf, #7b2fff)',
                      transition: 'width 0.3s ease-out',
                    }} />
                  </div>
                  <p style={{ fontSize: 10, color: '#bf40bf', margin: '4px 0 0', textAlign: 'center', fontWeight: 600 }}>
                    ⏳ جاري التثبيت... {Math.round(Math.min(progress, 100))}%
                  </p>
                </div>
              )}

              <button onClick={handleInstall} disabled={installing} style={{
                width: '100%', padding: '11px 0', borderRadius: 12, border: 'none',
                background: installing ? 'rgba(191,64,191,0.3)' : 'linear-gradient(135deg,#bf40bf,#7b2fff)',
                color: '#fff',
                fontSize: 13, fontWeight: 700,
                cursor: installing ? 'wait' : 'pointer',
                fontFamily: "'Noto Sans Arabic','Inter',sans-serif",
                opacity: installing ? 0.7 : 1,
                transition: 'all 0.3s',
              }}>{installing ? '⏳ جاري التثبيت...' : '⬇️ تثبيت التطبيق مجاناً'}</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes installSlideUp {
          from { transform: translateX(-50%) translateY(80px); opacity: 0; }
          to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes installGlow {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes installProgressGlow {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
