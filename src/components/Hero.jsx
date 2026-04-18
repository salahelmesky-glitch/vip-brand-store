import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ padding: 0 }}
    >
      {/* Radial ambient glow — single one, not two */}
      <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full blur-[100px]" style={{ background: 'rgba(191,64,191,0.05)' }} />

      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', animation: 'fadeInUp 0.8s ease-out' }}>

        {/* ★ Navigate to Page 2 — Glowing Arrow ★ */}
        <Link
          to="/page2"
          className="page2-arrow-btn group"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '18px',
            textDecoration: 'none',
            cursor: 'pointer',
            animation: 'fadeInUp 0.6s ease-out',
          }}
        >
          {/* Arrow circle */}
          <div
            className="page2-arrow-circle"
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(191, 64, 191, 0.08)',
              border: '1.5px solid rgba(191, 64, 191, 0.35)',
              transition: 'all 0.35s ease',
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#d966d9"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'transform 0.3s ease' }}
              className="page2-arrow-icon"
            >
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </div>
          {/* Label */}
          <span
            style={{
              fontSize: '9px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: '#99999f',
              fontWeight: '500',
              transition: 'color 0.3s ease',
            }}
            className="page2-arrow-label"
          >
            Page 2 / صفحة ٢
          </span>
        </Link>


        {/* Eagle Logo */}
        <div style={{ marginBottom: '24px' }}>
          <div className="logo-container" style={{ width: '120px', height: '120px' }}>
            <img
              src={logo}
              alt="VIP Eagle Logo"
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
        </div>

        {/* Subtitle */}
        <p
          className="text-[10px] md:text-sm tracking-[0.3em] md:tracking-[0.4em] uppercase font-medium"
          style={{ marginBottom: '20px', color: '#bf40bf' }}
        >
          ★ Exclusive Luxury Streetwear / أزياء فاخرة حصرية ★
        </p>

        {/* VIP Title */}
        <div className="relative z-10" style={{ marginBottom: '20px' }}>
          <h1 className="font-heading text-[4.5rem] sm:text-[7rem] md:text-[11rem] lg:text-[15rem] font-black leading-none vip-cosmic relative select-none">
            VIP
          </h1>
          <div className="absolute inset-0 vip-shimmer pointer-events-none" />
        </div>

        {/* Decorative line */}
        <div style={{ width: '80px', height: '1px', background: 'linear-gradient(90deg, transparent, #bf40bf, transparent)', marginBottom: '20px' }} />

        {/* Tagline */}
        <p
          className="text-sm md:text-lg font-light leading-relaxed"
          style={{ marginBottom: '32px', textAlign: 'center', maxWidth: '500px', padding: '0 16px', color: '#99999f' }}
        >
          Redefining luxury for the digital era.
          <br />
          <span className="ar text-xs md:text-base">نعيد تعريف الفخامة لعصر جديد.</span>
        </p>

        {/* CTA Button */}
        <a
          href="#store"
          className="group relative px-10 md:px-12 py-3.5 md:py-4 rounded-full text-white text-xs font-bold tracking-widest uppercase overflow-hidden inline-block"
          style={{ background: 'linear-gradient(135deg, #bf40bf, #7b2fff)', transition: 'box-shadow 0.3s' }}
        >
          <span className="relative z-10">Shop Now / تسوق الآن</span>
        </a>

        {/* BOYS / GIRLS Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: '60px',
            animation: 'fadeInUp 1s ease-out 0.3s both',
          }}
        >
          <div style={{ display: 'flex', gap: '40px', justifyContent: 'center', alignItems: 'center' }}>
            {/* Boys */}
            <a
              href="#boys-section"
              className="group relative rounded-2xl overflow-hidden"
              style={{
                width: '160px', height: '120px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(191, 64, 191, 0.06)',
                border: '1.5px solid rgba(191, 64, 191, 0.35)',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="font-heading text-base sm:text-lg md:text-xl font-bold tracking-widest" style={{ color: '#d966d9' }}>BOYS</span>
                <span className="ar text-sm sm:text-base md:text-lg mt-1.5 font-semibold" style={{ color: '#bf40bf' }}>قسم الولاد</span>
              </div>
            </a>

            {/* Girls */}
            <a
              href="#girls-section"
              className="group relative rounded-2xl overflow-hidden"
              style={{
                width: '160px', height: '120px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                background: 'rgba(123, 47, 255, 0.06)',
                border: '1.5px solid rgba(123, 47, 255, 0.35)',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span className="font-heading text-base sm:text-lg md:text-xl font-bold tracking-widest" style={{ color: '#d966d9' }}>GIRLS</span>
                <span className="ar text-sm sm:text-base md:text-lg mt-1.5 font-semibold" style={{ color: '#7b2fff' }}>قسم البنات</span>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 md:bottom-10 flex flex-col items-center gap-2" style={{ animation: 'fadeInUp 1s ease-out 0.5s both' }}>
        <span className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase" style={{ color: '#99999f' }}>Scroll / مرّر</span>
        <div className="w-5 h-8 rounded-full flex justify-center pt-1.5" style={{ border: '1px solid rgba(153,153,159,0.3)' }}>
          <div className="w-1 h-2 rounded-full" style={{ background: '#bf40bf', animation: 'scrollBounce 2s ease-in-out infinite' }} />
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        /* Page 2 Arrow Animations */
        .page2-arrow-circle {
          animation: arrowPulse 2.5s ease-in-out infinite;
        }
        @keyframes arrowPulse {
          0%, 100% { box-shadow: 0 0 12px rgba(191,64,191,0.15); }
          50% { box-shadow: 0 0 25px rgba(191,64,191,0.35); }
        }
        .page2-arrow-btn:hover .page2-arrow-circle {
          background: rgba(191, 64, 191, 0.18) !important;
          border-color: rgba(217, 102, 217, 0.7) !important;
          box-shadow: 0 0 30px rgba(191,64,191,0.4);
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
