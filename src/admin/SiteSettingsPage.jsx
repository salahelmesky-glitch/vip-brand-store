import { useState, useEffect } from 'react';

const DEFAULT_PRIZES = [
  { id: 'discount_10', labelAr: 'خصم ١٠٪', color: '#ff6b6b', icon: '🏷️' },
  { id: 'bonus_30', labelAr: '+٣٠ نقطة', color: '#ffd43b', icon: '⭐' },
  { id: 'free_shipping', labelAr: 'شحن مجاني', color: '#69db7c', icon: '🚚' },
  { id: 'discount_20', labelAr: 'خصم ٢٠٪', color: '#da77f2', icon: '🔥' },
  { id: 'try_again', labelAr: 'حاول تاني', color: '#868e96', icon: '🔄' },
  { id: 'free_tshirt', labelAr: 'تيشيرت مجاني!', color: '#00ff66', icon: '👕' },
];

export default function SiteSettingsPage() {
  /* ── Maintenance ── */
  const [maintenance, setMaintenance] = useState(() => localStorage.getItem('vip_maintenance') === 'true');

  /* ── Gift Text ── */
  const [giftText, setGiftText] = useState(() => localStorage.getItem('vip_gift_text') || '🎁 مبروك! كسبت خصم 50% على طلبك القادم!');
  const [mysteryText, setMysteryText] = useState(() => localStorage.getItem('vip_mystery_text') || '🎉 ألف مبروك! كسبت معانا هدية حصرية!');

  /* ── Prizes ── */
  const [prizes, setPrizes] = useState(() => {
    try { const p = JSON.parse(localStorage.getItem('vip_prizes')); return p?.length ? p : DEFAULT_PRIZES; } catch { return DEFAULT_PRIZES; }
  });

  const [saved, setSaved] = useState('');

  const save = (key, val, msg) => {
    localStorage.setItem(key, typeof val === 'string' ? val : JSON.stringify(val));
    setSaved(msg); setTimeout(() => setSaved(''), 2000);
  };

  const updatePrize = (idx, field, value) => {
    const copy = [...prizes];
    copy[idx] = { ...copy[idx], [field]: value };
    setPrizes(copy);
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f2f2f7', margin: '0 0 20px' }}>⚙️ إعدادات الموقع</h2>

      {saved && (
        <div style={{ padding: '10px 16px', borderRadius: 12, marginBottom: 14, background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)', fontSize: 13, color: '#00ff66', fontWeight: 600, textAlign: 'center' }}>{saved}</div>
      )}

      {/* ═══ MAINTENANCE MODE ═══ */}
      <div style={section}>
        <p style={sectionTitle}>🚧 وضع الصيانة / Maintenance Mode</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => {
            const v = !maintenance; setMaintenance(v);
            save('vip_maintenance', v.toString(), v ? '⚠️ وضع الصيانة مفعل' : '✅ الموقع شغال');
          }} style={{
            padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
            background: maintenance ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #25D366, #128C7E)',
            color: '#fff',
          }}>{maintenance ? '🔴 الصيانة مفعلة — اضغط لإلغاء' : '🟢 الموقع شغال'}</button>
        </div>
      </div>

      {/* ═══ GIFT & MYSTERY TEXT ═══ */}
      <div style={section}>
        <p style={sectionTitle}>🎁 نص الهدية (100 نقطة)</p>
        <p style={{ fontSize: 10, color: '#666', margin: '0 0 8px' }}>النص اللي بيظهر للعميل لما يكسب الهدية</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={giftText} onChange={e => setGiftText(e.target.value)} style={inp} />
          <button onClick={() => save('vip_gift_text', giftText, '✅ تم حفظ نص الهدية')} style={saveBtn}>💾</button>
        </div>
      </div>

      <div style={section}>
        <p style={sectionTitle}>📦 نص صندوق الغموض (200 نقطة)</p>
        <p style={{ fontSize: 10, color: '#666', margin: '0 0 8px' }}>النص اللي بيظهر للعميل لما يكسب الصندوق</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={mysteryText} onChange={e => setMysteryText(e.target.value)} style={inp} />
          <button onClick={() => save('vip_mystery_text', mysteryText, '✅ تم حفظ نص الصندوق')} style={saveBtn}>💾</button>
        </div>
      </div>

      {/* ═══ SPIN WHEEL PRIZES ═══ */}
      <div style={section}>
        <p style={sectionTitle}>🎰 جوائز العجلة / Spin Wheel Prizes</p>
        <p style={{ fontSize: 10, color: '#666', margin: '0 0 12px' }}>غيّر أسماء الجوائز والألوان</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {prizes.map((p, i) => (
            <div key={i} style={{
              display: 'flex', gap: 8, alignItems: 'center', padding: '10px 12px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <input value={p.icon} onChange={e => updatePrize(i, 'icon', e.target.value)}
                style={{ ...inp, width: 42, textAlign: 'center', flexShrink: 0 }} />
              <input value={p.labelAr} onChange={e => updatePrize(i, 'labelAr', e.target.value)}
                style={{ ...inp, flex: 1 }} placeholder="اسم الجائزة" />
              <input type="color" value={p.color} onChange={e => updatePrize(i, 'color', e.target.value)}
                style={{ width: 36, height: 36, border: 'none', borderRadius: 8, cursor: 'pointer', background: 'none' }} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={() => save('vip_prizes', prizes, '✅ تم حفظ جوائز العجلة')} style={{
            ...saveBtn, flex: 1, padding: '10px',
          }}>💾 حفظ الجوائز</button>
          <button onClick={() => { setPrizes(DEFAULT_PRIZES); save('vip_prizes', DEFAULT_PRIZES, '🔄 تم الرجوع للافتراضي'); }} style={{
            flex: 0, padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
            background: 'none', color: '#888', fontSize: 12, cursor: 'pointer',
          }}>🔄 افتراضي</button>
        </div>
      </div>

      {/* ═══ WHATSAPP ORDER LOG ═══ */}
      <div style={section}>
        <p style={sectionTitle}>📋 طلبات الواتساب / WhatsApp Orders</p>
        <OrderLog />
      </div>
    </div>
  );
}

/* ── Order Log Sub-component ── */
function OrderLog() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    try { setOrders(JSON.parse(localStorage.getItem('vip_whatsapp_orders') || '[]')); } catch {}
  }, []);

  if (!orders.length) return <p style={{ fontSize: 12, color: '#666', textAlign: 'center' }}>لا توجد طلبات بعد</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
      {orders.slice().reverse().map((o, i) => (
        <div key={i} style={{
          padding: '8px 12px', borderRadius: 10, fontSize: 11,
          background: 'rgba(37,211,102,0.04)', border: '1px solid rgba(37,211,102,0.1)', color: '#ccc',
        }}>
          <span style={{ color: '#25D366', fontWeight: 700 }}>🛒 {o.product}</span>
          <span style={{ color: '#888' }}> · {o.size} · {o.price} ج.م</span>
          <span style={{ float: 'right', fontSize: 9, color: '#555' }}>{new Date(o.timestamp).toLocaleString('ar-EG')}</span>
        </div>
      ))}
    </div>
  );
}

const section = {
  padding: '18px', borderRadius: 14, marginBottom: 16,
  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(191,64,191,0.1)',
};
const sectionTitle = { fontSize: 13, fontWeight: 700, color: '#f2f2f7', margin: '0 0 8px' };
const inp = {
  padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(191,64,191,0.15)',
  background: 'rgba(255,255,255,0.04)', color: '#f2f2f7', fontSize: 12,
  outline: 'none', fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
};
const saveBtn = {
  padding: '8px 16px', borderRadius: 10, border: 'none',
  background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
  color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', flexShrink: 0,
};
