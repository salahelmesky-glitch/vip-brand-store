import { useState, useEffect } from 'react';

/**
 * ────────────────────────────────────────
 *  Admin › Site Settings
 *  - Maintenance Mode (stored in localStorage)
 *  - WhatsApp order log
 * ────────────────────────────────────────
 */
export default function SiteSettingsPage() {
  const [maintenance, setMaintenance] = useState(() => {
    return localStorage.getItem('vip_maintenance') === 'true';
  });
  const [waOrders, setWaOrders] = useState([]);

  useEffect(() => {
    try { const o = JSON.parse(localStorage.getItem('vip_wa_orders') || '[]'); setWaOrders(o); } catch {}
  }, []);

  const toggleMaintenance = () => {
    const next = !maintenance;
    setMaintenance(next);
    localStorage.setItem('vip_maintenance', next ? 'true' : 'false');
  };

  const clearOrders = () => {
    setWaOrders([]);
    localStorage.setItem('vip_wa_orders', '[]');
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f2f2f7', margin: '0 0 20px' }}>⚙️ إعدادات الموقع / Site Settings</h2>

      {/* Maintenance Mode */}
      <div style={{
        padding: '20px', borderRadius: 16, marginBottom: 16,
        background: maintenance ? 'rgba(239,68,68,0.06)' : 'rgba(0,255,102,0.04)',
        border: `1px solid ${maintenance ? 'rgba(239,68,68,0.2)' : 'rgba(0,255,102,0.15)'}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7', margin: 0 }}>🔧 وضع الصيانة / Maintenance Mode</p>
            <p style={{ fontSize: 11, color: '#888', margin: '4px 0 0' }}>
              {maintenance ? 'الموقع مقفول للزوار حالياً' : 'الموقع شغال عادي'}
            </p>
          </div>
          <button onClick={toggleMaintenance} style={{
            padding: '10px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            fontWeight: 700, fontSize: 12,
            background: maintenance ? '#ef4444' : 'linear-gradient(135deg, #25D366, #128C7E)',
            color: '#fff',
          }}>{maintenance ? '🔴 فعال — اقفله' : '🟢 مفتوح — اقفله'}</button>
        </div>
        <div style={{
          padding: '10px 14px', borderRadius: 10, fontSize: 11, lineHeight: 1.5, color: '#888',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
        }}>
          💡 لما تفعل الصيانة، الزوار هيشوفو رسالة "الموقع تحت الصيانة" بدل الصفحة الرئيسية.
        </div>
      </div>

      {/* WhatsApp Orders Log */}
      <div style={{
        padding: '20px', borderRadius: 16,
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(191,64,191,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7', margin: 0 }}>📲 طلبات الواتساب / WhatsApp Orders</p>
            <p style={{ fontSize: 11, color: '#888', margin: '4px 0 0' }}>
              {waOrders.length} طلب تم ارساله عبر واتساب
            </p>
          </div>
          {waOrders.length > 0 && (
            <button onClick={clearOrders} style={{
              padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(255,100,100,0.2)',
              background: 'rgba(255,100,100,0.06)', color: '#ff6b6b', fontSize: 10, cursor: 'pointer',
            }}>🗑️ مسح</button>
          )}
        </div>

        {waOrders.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#555', fontSize: 12, padding: 20 }}>
            لا يوجد طلبات واتساب مسجلة بعد. الطلبات بتتسجل تلقائي لما العميل يضغط "اطلب الآن" من المتجر.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto' }}>
            {[...waOrders].reverse().map((o, i) => (
              <div key={i} style={{
                padding: '10px 12px', borderRadius: 10,
                background: 'rgba(37,211,102,0.04)', border: '1px solid rgba(37,211,102,0.1)',
                display: 'flex', alignItems: 'flex-start', gap: 8,
              }}>
                <span style={{ fontSize: 16 }}>📦</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: '#f2f2f7', margin: 0 }}>{o.product}</p>
                  <p style={{ fontSize: 10, color: '#888', margin: '2px 0 0' }}>
                    📏 {o.size} · 💰 {o.price} EGP
                  </p>
                  <p style={{ fontSize: 9, color: '#555', margin: '2px 0 0' }}>
                    🕐 {new Date(o.date).toLocaleString('ar-EG')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
