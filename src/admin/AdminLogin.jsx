import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function AdminLogin() {
  const { login } = useAdmin();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) setError(result.error);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated background orbs */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 400, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(191,64,191,0.08), transparent 70%)',
          animation: 'float1 8s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%',
          width: 300, height: 300, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(123,47,255,0.06), transparent 70%)',
          animation: 'float2 10s ease-in-out infinite',
        }} />
      </div>

      <div style={{ position: 'relative', width: '100%', maxWidth: 420, zIndex: 10 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            fontSize: 42, fontWeight: 900, fontFamily: "'Orbitron', sans-serif",
            letterSpacing: '0.15em',
            background: 'linear-gradient(135deg, #fff 0%, #bf40bf 50%, #7b2fff 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 30px rgba(191,64,191,0.4))',
          }}>VIP</div>
          <p style={{
            color: 'rgba(153,153,159,0.6)', fontSize: 11,
            letterSpacing: '0.3em', textTransform: 'uppercase', marginTop: 6,
            fontFamily: "'Orbitron', sans-serif",
          }}>Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div style={{
          padding: '36px 32px',
          borderRadius: 20,
          background: 'linear-gradient(145deg, rgba(12,12,18,0.95), rgba(5,5,5,0.98))',
          border: '1px solid rgba(191,64,191,0.12)',
          boxShadow: '0 0 80px rgba(0,0,0,0.4), 0 0 40px rgba(191,64,191,0.05)',
        }}>
          <h2 style={{ color: '#f2f2f7', fontSize: 22, fontWeight: 700, marginBottom: 4,
            fontFamily: "'Montserrat', sans-serif" }}>مرحباً بيك 👋</h2>
          <p style={{ color: 'rgba(153,153,159,0.7)', fontSize: 13, marginBottom: 28 }}>
            سجل دخول لحساب الأدمن
          </p>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{
                display: 'block', fontSize: 10, color: 'rgba(153,153,159,0.6)',
                textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8,
                fontFamily: "'Orbitron', sans-serif",
              }}>Email</label>
              <input
                type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@vip.com"
                required
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(191,64,191,0.12)',
                  color: '#f2f2f7', fontSize: 14, outline: 'none',
                  transition: 'border-color 0.3s',
                  fontFamily: "'Inter', sans-serif",
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(191,64,191,0.4)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(191,64,191,0.12)'}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18, position: 'relative' }}>
              <label style={{
                display: 'block', fontSize: 10, color: 'rgba(153,153,159,0.6)',
                textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 8,
                fontFamily: "'Orbitron', sans-serif",
              }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'} value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  required
                  style={{
                    width: '100%', padding: '14px 48px 14px 16px', borderRadius: 14,
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(191,64,191,0.12)',
                    color: '#f2f2f7', fontSize: 14, outline: 'none',
                    transition: 'border-color 0.3s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onFocus={(e) => e.target.style.borderColor = 'rgba(191,64,191,0.4)'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(191,64,191,0.12)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'rgba(153,153,159,0.5)', fontSize: 18,
                  }}
                >{showPass ? '🙈' : '👁'}</button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 12, marginBottom: 16,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              }}>
                <p style={{ fontSize: 12, color: '#f87171' }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%', padding: '15px 0', borderRadius: 14,
                border: 'none', cursor: isLoading ? 'wait' : 'pointer',
                fontSize: 14, fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: '#fff',
                background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
                boxShadow: '0 0 30px rgba(191,64,191,0.25)',
                transition: 'all 0.3s',
                opacity: isLoading ? 0.6 : 1,
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              {isLoading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  <svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="10" strokeLinecap="round" />
                  </svg>
                  جاري الدخول...
                </span>
              ) : 'تسجيل دخول'}
            </button>
          </form>

          {/* Hint */}
          <div style={{
            marginTop: 24, paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.04)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 10, color: 'rgba(153,153,159,0.4)' }}>
              Default: admin@vip.com / admin123
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 20px) scale(1.05); }
        }
        input::placeholder { color: rgba(153,153,159,0.3); }
      `}</style>
    </div>
  );
}
