import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const WA = '201006527185';

/* ─── Default Prizes (admin can override via localStorage) ─── */
function getPrizes() {
  try { const p = JSON.parse(localStorage.getItem('vip_prizes')); if (p?.length) return p; } catch {}
  return [
    { id: 'discount_10', labelAr: 'خصم ١٠٪', color: '#ff6b6b', icon: '🏷️' },
    { id: 'bonus_30', labelAr: '+٣٠ نقطة', color: '#ffd43b', icon: '⭐' },
    { id: 'free_shipping', labelAr: 'شحن مجاني', color: '#69db7c', icon: '🚚' },
    { id: 'discount_20', labelAr: 'خصم ٢٠٪', color: '#da77f2', icon: '🔥' },
    { id: 'try_again', labelAr: 'حاول تاني', color: '#868e96', icon: '🔄' },
    { id: 'free_tshirt', labelAr: 'تيشيرت مجاني!', color: '#00ff66', icon: '👕' },
  ];
}
function getGiftText() {
  return localStorage.getItem('vip_gift_text') || '🎁 مبروك! كسبت خصم 50% على طلبك القادم!';
}
function getMysteryText() {
  return localStorage.getItem('vip_mystery_text') || '🎉 ألف مبروك! كسبت معانا هدية حصرية!';
}

/* ═══════════════════════════════════════════════
   REWARD POPUP (WhatsApp CTA)
   ═══════════════════════════════════════════════ */
function RewardPopup({ show, title, subtitle, onClose }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)', padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 360, width: '100%', borderRadius: 24, padding: '32px 24px', textAlign: 'center',
        background: 'linear-gradient(145deg, #0f0f1a, #1a0b2e)',
        border: '2px solid rgba(0,255,102,0.3)',
        boxShadow: '0 0 60px rgba(0,255,102,0.15)',
      }}>
        <div style={{ fontSize: 56, marginBottom: 12 }}>🎉</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#00ff66', margin: '0 0 8px', lineHeight: 1.4 }}>{title}</h2>
        <p style={{ fontSize: 14, color: '#ccc', margin: '0 0 20px', lineHeight: 1.6 }}>{subtitle}</p>
        <a href={`https://wa.me/${WA}?text=${encodeURIComponent('مرحباً VIP! عايز أستلم هديتي 🎁')}`}
          target="_blank" rel="noopener noreferrer" style={{
            display: 'block', padding: '14px', borderRadius: 14, textDecoration: 'none',
            background: '#25D366', color: '#fff', fontSize: 15, fontWeight: 700,
            boxShadow: '0 4px 20px rgba(37,211,102,0.3)', marginBottom: 10,
          }}>💬 اطلب هديتك عبر واتساب</a>
        <p style={{ fontSize: 13, color: '#888', margin: '0 0 12px', direction: 'ltr' }}>📞 0{WA.slice(2)}</p>
        <button onClick={onClose} style={{
          padding: '8px 20px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
          background: 'none', color: '#666', fontSize: 12, cursor: 'pointer',
        }}>إغلاق ✕</button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SPIN WHEEL (Canvas) — 400 points
   ═══════════════════════════════════════════════ */
function SpinWheel({ onSpin, isLoggedIn, userPoints }) {
  const canvasRef = useRef(null);
  const [spinning, setSpinning] = useState(false);
  const [angle, setAngle] = useState(0);
  const [result, setResult] = useState(null);
  const animRef = useRef(null);
  const PRIZES = getPrizes();

  const canSpin = isLoggedIn && userPoints >= 400;

  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const size = canvas.width, center = size / 2, radius = center - 10;
    const slice = (2 * Math.PI) / PRIZES.length;
    ctx.clearRect(0, 0, size, size);
    PRIZES.forEach((p, i) => {
      const s = angle + i * slice, e = s + slice;
      ctx.beginPath(); ctx.moveTo(center, center); ctx.arc(center, center, radius, s, e);
      ctx.closePath(); ctx.fillStyle = p.color; ctx.fill();
      ctx.strokeStyle = '#050010'; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.save(); ctx.translate(center, center); ctx.rotate(s + slice / 2);
      ctx.textAlign = 'right'; ctx.fillStyle = '#fff'; ctx.font = 'bold 12px sans-serif';
      ctx.fillText(p.icon + ' ' + p.labelAr, radius - 14, 5); ctx.restore();
    });
    ctx.beginPath(); ctx.arc(center, center, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#050010'; ctx.fill(); ctx.strokeStyle = '#bf40bf'; ctx.lineWidth = 3; ctx.stroke();
    ctx.fillStyle = '#bf40bf'; ctx.font = 'bold 14px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('VIP', center, center);
    ctx.beginPath(); ctx.moveTo(size - 4, center - 10); ctx.lineTo(size - 4, center + 10); ctx.lineTo(size - 22, center);
    ctx.closePath(); ctx.fillStyle = '#00ff66'; ctx.fill();
  }, [angle, PRIZES]);

  const doSpin = async () => {
    if (spinning || !canSpin) return; setSpinning(true); setResult(null);
    const dur = 3000, rot = Math.PI * 8 + Math.random() * Math.PI * 4;
    const st = Date.now(), sa = angle;
    const anim = () => {
      const p = Math.min((Date.now() - st) / dur, 1);
      setAngle(sa + rot * (1 - Math.pow(1 - p, 3)));
      if (p < 1) { animRef.current = requestAnimationFrame(anim); }
      else { (async () => { const r = await onSpin(); if (r?.success) setResult(r.prize); setSpinning(false); })(); }
    };
    animRef.current = requestAnimationFrame(anim);
  };

  const btnText = !isLoggedIn ? '🔒 سجل الدخول لتشترك' : userPoints < 400 ? `🔒 محتاج ${400 - userPoints} نقطة كمان` : spinning ? '🎰 ...' : '🎰 لف العجلة!';

  return (
    <div style={cardStyle}>
      <p style={secLabel}>🎰 عجلة الحظ / SPIN WHEEL <span style={{ color: '#666', fontWeight: 400 }}>(400 نقطة)</span></p>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <canvas ref={canvasRef} width={300} height={300} style={{
          borderRadius: '50%', border: '4px solid rgba(191,64,191,0.35)',
          opacity: canSpin ? 1 : 0.4, maxWidth: '85vw', height: 'auto',
        }} />
        <button onClick={doSpin} disabled={spinning || !canSpin} style={{
          padding: '12px 32px', borderRadius: 30, border: 'none', width: '100%', maxWidth: 320,
          background: canSpin ? 'linear-gradient(135deg, #bf40bf, #7b2fff)' : '#222',
          color: '#fff', fontSize: 13, fontWeight: 700, cursor: canSpin ? 'pointer' : 'not-allowed', opacity: spinning ? 0.6 : 1,
        }}>{btnText}</button>
        {result && (
          <div style={{ padding: '14px 18px', borderRadius: 14, background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.25)', textAlign: 'center', width: '100%' }}>
            <p style={{ fontSize: 20, margin: '0 0 4px' }}>{PRIZES.find(p => p.id === result)?.icon || '🎁'}</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#00ff66', margin: 0 }}>{PRIZES.find(p => p.id === result)?.labelAr || result}</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   REWARD CARD
   ═══════════════════════════════════════════════ */
function RewardCard({ icon, title, desc, cost, onClaim, isLoggedIn, userPoints }) {
  const canClaim = isLoggedIn && userPoints >= cost;
  const btnText = !isLoggedIn ? '🔒 سجل الدخول أولاً' : userPoints < cost ? `🔒 محتاج ${cost - userPoints} نقطة كمان` : `✨ استبدل ${cost} نقطة`;
  return (
    <div style={{
      padding: '16px', borderRadius: 14,
      background: canClaim ? 'rgba(0,255,102,0.03)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${canClaim ? 'rgba(0,255,102,0.15)' : 'rgba(255,255,255,0.06)'}`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
        <span style={{ fontSize: 28 }}>{icon}</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7', margin: 0 }}>{title}</p>
          <p style={{ fontSize: 11, color: '#888', margin: '3px 0 0' }}>{desc} · {cost} نقطة</p>
        </div>
      </div>
      <button onClick={canClaim ? onClaim : undefined} disabled={!canClaim} style={{
        width: '100%', padding: 11, borderRadius: 12, border: 'none',
        background: canClaim ? 'linear-gradient(135deg, #bf40bf, #7b2fff)' : '#1a1a24',
        color: canClaim ? '#fff' : '#666', fontSize: 12, fontWeight: 700, cursor: canClaim ? 'pointer' : 'not-allowed',
      }}>{btnText}</button>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   SECTIONS: Video, Newsletter, Footer (compact)
   ═══════════════════════════════════════════════ */
function VideoSection() {
  const [videos, setVideos] = useState([]);
  useEffect(() => { try { setVideos(JSON.parse(localStorage.getItem('vip_videos') || '[]')); } catch {} }, []);
  if (!videos.length) return (
    <div style={cardStyle}><p style={secLabel}>🎬 فيديوهاتنا / OUR VIDEOS</p>
      <p style={{ textAlign: 'center', color: '#555', fontSize: 12, margin: '16px 0' }}>قريباً هنضيف فيديوهات حصرية! 🎥</p></div>
  );
  return (
    <div style={cardStyle}><p style={secLabel}>🎬 فيديوهاتنا / OUR VIDEOS</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
        {videos.slice(0, 50).map((v, i) => (
          <a key={i} href={v.url} target="_blank" rel="noopener noreferrer" style={{ display: 'block', borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(191,64,191,0.12)', textDecoration: 'none' }}>
            <div style={{ width: '100%', aspectRatio: '9/16', background: 'linear-gradient(135deg, #1a0b2e, #0c0c12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {v.thumbnail ? <img src={v.thumbnail} alt={v.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: 32 }}>▶️</span>}
            </div>
            <p style={{ fontSize: 11, color: '#ccc', padding: '8px 10px', margin: 0, textAlign: 'center', fontWeight: 600 }}>{v.title || `فيديو #${i + 1}`}</p>
          </a>))}
      </div></div>
  );
}

function Newsletter() {
  const [email, setEmail] = useState(''); const [done, setDone] = useState(false);
  return (
    <div style={{ padding: '28px 20px', borderRadius: 18, textAlign: 'center', background: 'linear-gradient(135deg, rgba(191,64,191,0.08), rgba(123,47,255,0.05))', border: '1px solid rgba(191,64,191,0.15)' }}>
      <p style={{ fontSize: 10, letterSpacing: '0.25em', color: '#bf40bf', fontWeight: 600, margin: '0 0 6px', textTransform: 'uppercase' }}>★ النشرة البريدية ★</p>
      <h3 style={{ fontSize: 20, fontWeight: 900, color: '#f2f2f7', margin: '0 0 6px' }}>انضم إلينا</h3>
      <p style={{ fontSize: 11, color: '#888', margin: '0 0 16px', lineHeight: 1.6 }}>كن أول من يعرف عن العروض الحصرية</p>
      {done ? <p style={{ fontSize: 14, color: '#00ff66', fontWeight: 700 }}>✅ تم الاشتراك!</p> : (
        <form onSubmit={e => { e.preventDefault(); if (email) { setDone(true); setEmail(''); } }} style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, margin: '0 auto' }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="بريدك الإلكتروني" style={{ padding: '11px 14px', borderRadius: 12, border: '1px solid rgba(191,64,191,0.2)', background: 'rgba(255,255,255,0.04)', color: '#f2f2f7', fontSize: 13, outline: 'none', textAlign: 'center', width: '100%', boxSizing: 'border-box' }} />
          <button type="submit" style={{ padding: 12, borderRadius: 12, border: '1px solid rgba(191,64,191,0.3)', background: 'rgba(191,64,191,0.1)', color: '#f2f2f7', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>اشترك الآن</button>
        </form>)}
    </div>
  );
}

function PremiumFooter() {
  return (
    <footer style={{ background: '#0a0a14', padding: '32px 20px 18px', marginTop: 10, borderTop: '1px solid rgba(191,64,191,0.08)' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: 'linear-gradient(135deg, #bf40bf, #7b2fff)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color: '#fff' }}>V</div>
          <div>
            <h4 style={{ fontSize: 16, fontWeight: 900, margin: '0 0 4px', color: '#f2f2f7', letterSpacing: '0.1em' }}>VIP</h4>
            <p style={{ fontSize: 10, color: '#888', margin: 0, lineHeight: 1.5, maxWidth: 280 }}>براند مصري من كفر الشيخ · Streetwear بجودة عالمية.</p>
          </div>
        </div>
        <div style={{ height: 1, background: 'rgba(255,255,255,0.05)', margin: '0 0 12px' }} />
        <p style={{ textAlign: 'center', fontSize: 9, color: 'rgba(255,255,255,0.2)', margin: 0 }}>© 2026 VIP Brand. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════════
   MAIN PAGE 2
   ═══════════════════════════════════════════════ */
export default function EmptyPage2() {
  const { user, isLoggedIn, spinWheel, claimGift, claimMystery, leaderboard, fetchLeaderboard } = useUser();
  const [popup, setPopup] = useState(null);
  const pts = user?.points || 0;

  useEffect(() => { fetchLeaderboard(); }, [fetchLeaderboard]);

  const handleGift = async () => {
    const r = await claimGift();
    if (r?.success) setPopup({ title: getGiftText(), subtitle: 'تعالا اطلب هديتك عبر الواتساب وهنوصلهالك!' });
  };
  const handleMystery = async () => {
    const r = await claimMystery();
    if (r?.success) setPopup({ title: getMysteryText(), subtitle: 'ألف مبروك كسبت معانا هدية حصرية!\nتعالا واطلبها عبر الواتساب وهنوصلهالك!' });
  };

  return (
    <div style={{ background: '#050010', minHeight: '100vh', color: '#f2f2f7', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Reward Popup */}
      <RewardPopup show={!!popup} title={popup?.title} subtitle={popup?.subtitle} onClose={() => setPopup(null)} />

      {/* Header */}
      <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', height: 48, background: 'rgba(5,0,16,0.92)', backdropFilter: 'blur(14px)', borderBottom: '1px solid rgba(191,64,191,0.1)' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6, textDecoration: 'none', color: '#aaa', fontSize: 11 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/></svg> VIP BRAND
        </Link>
        <span style={{ fontSize: 9, letterSpacing: '0.2em', color: '#bf40bf', fontWeight: 600 }}>🏆 COMPETITIONS</span>
        <Link to="/settings" style={{ textDecoration: 'none', border: '1px solid rgba(191,64,191,0.3)', borderRadius: 8, color: '#bf40bf', fontSize: 9, padding: '3px 8px' }}>⚙️ إعدادات</Link>
      </header>

      <div style={{ paddingTop: 58, maxWidth: 480, margin: '0 auto', padding: '58px 14px 0', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Welcome */}
        {isLoggedIn && user ? (
          <div style={{ ...cardStyle, textAlign: 'center', borderColor: 'rgba(0,255,102,0.2)', background: 'rgba(0,255,102,0.04)' }}>
            <p style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px' }}>أهلاً {user.name}! 👋</p>
            <p style={{ fontSize: 12, color: '#888', margin: '0 0 10px' }}>جرب حظك في المسابقة! 🎰</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24 }}>
              <div style={{ textAlign: 'center' }}><p style={{ fontSize: 22, fontWeight: 900, color: '#bf40bf', margin: 0 }}>{pts}</p><p style={{ fontSize: 10, color: '#888', margin: '2px 0 0' }}>نقطة 🏆</p></div>
              <div style={{ textAlign: 'center' }}><p style={{ fontSize: 22, fontWeight: 900, color: '#00ff66', margin: 0 }}>{user.tshirtsPurchased}</p><p style={{ fontSize: 10, color: '#888', margin: '2px 0 0' }}>تيشيرت 👕</p></div>
            </div>
          </div>
        ) : (
          <div style={{ ...cardStyle, textAlign: 'center', borderColor: 'rgba(191,64,191,0.25)', background: 'rgba(191,64,191,0.04)' }}>
            <p style={{ fontSize: 28, margin: '0 0 8px' }}>🏆</p>
            <p style={{ fontSize: 16, fontWeight: 800, color: '#f2f2f7', margin: '0 0 6px' }}>مسابقات VIP</p>
            <p style={{ fontSize: 13, color: '#888', margin: '0 0 14px', lineHeight: 1.6 }}>سجل الدخول لتشترك في المسابقة وتكسب نقاط وهدايا!</p>
            <Link to="/settings" style={{ display: 'inline-block', padding: '11px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #bf40bf, #7b2fff)', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>🔐 سجل الدخول لتشترك</Link>
          </div>
        )}

        {/* Rewards */}
        <div style={cardStyle}>
          <p style={secLabel}>🎁 المكافآت المتاحة</p>
          <RewardCard icon="🎁" title="هدية حصرية / Gift" desc="خصم 50% على طلبك" cost={100} onClaim={handleGift} isLoggedIn={isLoggedIn} userPoints={pts} />
          <div style={{ height: 12 }} />
          <RewardCard icon="📦" title="صندوق الغموض / Mystery" desc="هدية حصرية مفاجأة" cost={200} onClaim={handleMystery} isLoggedIn={isLoggedIn} userPoints={pts} />
        </div>

        {/* Spin */}
        <SpinWheel onSpin={spinWheel} isLoggedIn={isLoggedIn} userPoints={pts} />

        {/* Leaderboard */}
        {leaderboard.length > 0 && (
          <div style={cardStyle}>
            <p style={secLabel}>🏆 المتصدرين / LEADERBOARD</p>
            {leaderboard.map((u, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: i < 3 ? 'rgba(191,64,191,0.04)' : 'transparent', border: i < 3 ? '1px solid rgba(191,64,191,0.1)' : '1px solid rgba(255,255,255,0.03)', marginBottom: 6 }}>
                <span style={{ fontSize: i < 3 ? 20 : 12, width: 28, textAlign: 'center' }}>{i < 3 ? ['🥇','🥈','🥉'][i] : `#${i+1}`}</span>
                <p style={{ flex: 1, fontSize: 13, fontWeight: 600, color: '#f2f2f7', margin: 0 }}>{u.name}</p>
                <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? '#ffd43b' : '#bf40bf' }}>{u.points} pts</span>
              </div>))}
          </div>)}

        {/* Shop */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', borderRadius: 30, background: 'linear-gradient(135deg, #25D366, #128C7E)', color: '#fff', fontSize: 14, fontWeight: 700, textDecoration: 'none' }}>🛒 اشتري تيشيرت واكسب نقاط</Link>
          <p style={{ fontSize: 10, color: '#555', margin: '8px 0 0' }}>كل تيشيرت = ١٠ نقاط</p>
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(191,64,191,0.15), transparent)' }} />
        <VideoSection />
        <Newsletter />
      </div>
      <PremiumFooter />
    </div>
  );
}

const cardStyle = { padding: '18px', borderRadius: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(191,64,191,0.1)' };
const secLabel = { fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#bf40bf', fontWeight: 600, margin: '0 0 14px' };
