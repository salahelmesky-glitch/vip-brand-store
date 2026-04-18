import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

/* ═══════════════════════════════════════════════════
   AUTH FORM (Login / Register) — Smart auto-detect
   ═══════════════════════════════════════════════════ */
function AuthForm() {
  const { login, register, loading, error } = useUser();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [localErr, setLocalErr] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handle = async (e) => {
    e.preventDefault();
    setLocalErr(''); setSuccessMsg('');
    if (!email || !password) { setLocalErr('ادخل الإيميل والباسورد'); return; }
    if (!isLogin && !name) { setLocalErr('ادخل اسمك'); return; }

    let ok = false;

    if (isLogin) {
      const result = await login(email, password);
      if (result.success) ok = true;
      else setLocalErr(result.error);
    } else {
      const result = await register(email, password, name);
      if (result.success) {
        ok = true;
      } else if (result.error?.includes('already') || result.error?.includes('مسجل')) {
        // Auto-try login
        const lr = await login(email, password);
        if (lr.success) ok = true;
        else { setLocalErr('الإيميل مسجل. جرب الباسورد الصحيح'); setIsLogin(true); }
      } else {
        setLocalErr(result.error);
      }
    }

    if (ok) {
      const msgs = [
        'يلا بينا نختار التيشيرت مع بعض! 🎽',
        'يلا جرب حظك في المسابقة! 🎰',
        'أهلاً بيك في عيلة VIP! 💜',
        'حسابك جاهز! يلا نبدأ 🚀',
      ];
      setSuccessMsg(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  };

  // Show success after login
  if (successMsg) {
    return (
      <div style={{ maxWidth: 380, width: '100%', margin: '0 auto', padding: '0 16px', textAlign: 'center' }}>
        <div style={{
          padding: '32px 24px', borderRadius: 20,
          background: 'rgba(0,255,102,0.05)', border: '1px solid rgba(0,255,102,0.2)',
        }}>
          <div style={{ fontSize: 50, marginBottom: 12 }}>🎉</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#00ff66', margin: '0 0 8px' }}>!تم بنجاح</h2>
          <p style={{ fontSize: 15, color: '#f2f2f7', margin: '0 0 20px', lineHeight: 1.6, fontWeight: 600 }}>
            {successMsg}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link to="/page2" style={{
              display: 'block', padding: '13px', borderRadius: 14, textDecoration: 'none',
              background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
              color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center',
            }}>🏆 ادخل المسابقة</Link>
            <Link to="/" style={{
              display: 'block', padding: '13px', borderRadius: 14, textDecoration: 'none',
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center',
            }}>🛒 تسوق الآن</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 380, width: '100%', margin: '0 auto', padding: '0 16px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(191,64,191,0.2)',
        borderRadius: 20, padding: '28px 22px',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{
            width: 60, height: 60, borderRadius: '50%', margin: '0 auto 10px',
            background: 'linear-gradient(135deg, rgba(191,64,191,0.15), rgba(123,47,255,0.15))',
            border: '1px solid rgba(191,64,191,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
          }}>
            {isLogin ? '🔐' : '✨'}
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#f2f2f7', margin: 0 }}>
            {isLogin ? 'تسجيل الدخول' : 'حساب جديد'}
          </h2>
          <p style={{ fontSize: 11, color: '#888', margin: '4px 0 0' }}>
            {isLogin ? 'Login to your account' : 'Create a new account'}
          </p>
        </div>

        <form onSubmit={handle} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {!isLogin && (
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="الاسم / Your Name" style={inputStyle} />
          )}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="الإيميل / Email" style={inputStyle} />
          <div style={{ position: 'relative' }}>
            <input type={showPass ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="الباسورد / Password"
              style={{ ...inputStyle, paddingRight: 44 }} />
            <button type="button" onClick={() => setShowPass(!showPass)} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer', padding: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {showPass ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              )}
            </button>
          </div>
          {(localErr || error) && (
            <p style={{ fontSize: 12, color: '#ff6b6b', margin: 0, textAlign: 'center', lineHeight: 1.4 }}>
              ⚠️ {localErr || error}
            </p>
          )}
          <button type="submit" disabled={loading} style={{
            padding: '13px', borderRadius: 14, border: 'none', marginTop: 2,
            background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
            color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            opacity: loading ? 0.6 : 1, boxShadow: '0 4px 16px rgba(191,64,191,0.2)',
          }}>
            {loading ? '...' : isLogin ? 'دخول / Login' : 'تسجيل / Register'}
          </button>
        </form>

        <button onClick={() => { setIsLogin(!isLogin); setLocalErr(''); }} style={{
          display: 'block', width: '100%', marginTop: 14,
          background: 'none', border: 'none', color: '#bf40bf',
          fontSize: 12, cursor: 'pointer', textDecoration: 'underline',
        }}>
          {isLogin ? 'مفيش حساب؟ سجل جديد / Create account' : 'عندك حساب؟ سجل دخول / Login'}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   USER PROFILE
   ═══════════════════════════════════════════════════ */
function UserProfile({ user, logout }) {
  return (
    <div style={{
      padding: '20px', borderRadius: 18,
      background: 'linear-gradient(135deg, rgba(191,64,191,0.08), rgba(123,47,255,0.06))',
      border: '1px solid rgba(191,64,191,0.2)', marginBottom: 20,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
        <div style={{
          width: 60, height: 60, borderRadius: '50%',
          background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
        }}>👤</div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#f2f2f7', margin: 0 }}>{user.name}</p>
          <p style={{ fontSize: 11, color: '#888', margin: '4px 0 0' }}>{user.email}</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(191,64,191,0.1)', border: '1px solid rgba(191,64,191,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: '#bf40bf', margin: 0, fontWeight: 600 }}>النقاط</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#f2f2f7', margin: '4px 0 0' }}>{user.points}</p>
        </div>
        <div style={{ padding: '12px', borderRadius: 12, background: 'rgba(0,255,102,0.1)', border: '1px solid rgba(0,255,102,0.2)', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: '#00ff66', margin: 0, fontWeight: 600 }}>التيشيرتات</p>
          <p style={{ fontSize: 20, fontWeight: 800, color: '#00ff66', margin: '4px 0 0' }}>{user.tshirtsPurchased || 0}</p>
        </div>
      </div>
      {/* Quick links */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <Link to="/page2" style={{
          flex: 1, padding: '10px', borderRadius: 12, textDecoration: 'none', textAlign: 'center',
          background: 'rgba(191,64,191,0.1)', border: '1px solid rgba(191,64,191,0.2)',
          color: '#bf40bf', fontSize: 12, fontWeight: 700,
        }}>🏆 المسابقة</Link>
        <Link to="/" style={{
          flex: 1, padding: '10px', borderRadius: 12, textDecoration: 'none', textAlign: 'center',
          background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)',
          color: '#25D366', fontSize: 12, fontWeight: 700,
        }}>🛒 المتجر</Link>
      </div>
      <button onClick={logout} style={{
        width: '100%', padding: '11px', borderRadius: 12, border: '1px solid rgba(255,100,100,0.3)',
        background: 'rgba(255,100,100,0.08)', color: '#ff6b6b', fontSize: 13, fontWeight: 700, cursor: 'pointer',
      }}>خروج / Logout</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SETTINGS PAGE
   ═══════════════════════════════════════════════════ */
export default function SettingsPage() {
  const { user, isLoggedIn, logout } = useUser();

  return (
    <div style={{ background: '#050010', minHeight: '100vh', color: '#f2f2f7', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', height: 52,
        background: 'rgba(5,0,16,0.92)', backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(191,64,191,0.12)',
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#aaa', fontSize: 12 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5" /><path d="M12 19l-7-7 7-7" /></svg>
          VIP BRAND
        </Link>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#bf40bf', fontWeight: 600 }}>🔐 ACCOUNT</span>
        <div style={{ width: 40 }} />
      </header>

      <div style={{ paddingTop: 62, paddingBottom: 40, maxWidth: 500, margin: '0 auto', padding: '62px 16px 40px' }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: '#bf40bf', textTransform: 'uppercase', fontWeight: 600 }}>
            🔐 حسابك / YOUR ACCOUNT
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f2f2f7', margin: '8px 0' }}>
            {isLoggedIn ? `أهلاً ${user?.name}! 👋` : 'سجل الدخول'}
          </h1>
          <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>
            {isLoggedIn ? 'إدارة حسابك والنقاط والمكافآت' : 'سجل دخول أو أنشئ حساب جديد'}
          </p>
        </div>
        {isLoggedIn ? <UserProfile user={user} logout={logout} /> : <AuthForm />}
      </div>
    </div>
  );
}

const inputStyle = {
  padding: '13px 16px', borderRadius: 14, border: '1px solid rgba(191,64,191,0.2)',
  background: 'rgba(255,255,255,0.04)', color: '#f2f2f7', fontSize: 14,
  outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
};
