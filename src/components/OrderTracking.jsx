import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const statusMap = {
  pending: { label: 'قيد المراجعة', color: '#ffd43b', icon: '⏳', step: 1 },
  confirmed: { label: 'تم التأكيد', color: '#00bfff', icon: '✅', step: 2 },
  shipping: { label: 'جاري الشحن', color: '#bf40bf', icon: '🚚', step: 3 },
  completed: { label: 'تم التوصيل', color: '#00ff66', icon: '🎉', step: 4 },
  cancelled: { label: 'ملغي', color: '#ff4444', icon: '❌', step: 0 },
};

const steps = [
  { icon: '📋', label: 'تأكيد الطلب' },
  { icon: '📦', label: 'التجهيز' },
  { icon: '🚚', label: 'الشحن' },
  { icon: '🎉', label: 'تم التوصيل' },
];

export default function OrderTracking() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!phone.trim()) {
      setError('ادخل رقم الموبايل');
      return;
    }
    setLoading(true);
    setError('');
    setOrders(null);
    try {
      const ts = Date.now();
      const res = await fetch(`/api/store-orders?_t=${ts}`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' },
      });
      if (!res.ok) throw new Error('خطأ في الاتصال');
      const json = await res.json();
      if (json.success && json.data) {
        const cleanPhone = phone.trim().replace(/\s/g, '');
        const matched = json.data.filter(o => {
          const orderPhone = (o.phone || '').trim().replace(/\s/g, '');
          return orderPhone.includes(cleanPhone) || cleanPhone.includes(orderPhone);
        });
        setOrders(matched);
      } else {
        setOrders([]);
      }
    } catch (err) {
      setError('حصل مشكلة في البحث. جرب تاني.');
      console.error(err);
    } finally {
      setLoading(false);
      setSearched(true);
    }
  }, [phone]);

  return (
    <div style={{ background: '#050010', minHeight: '100vh', color: '#f2f2f7', fontFamily: "'Inter','Segoe UI',sans-serif" }}>
      {/* Header */}
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
        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#bf40bf', fontWeight: 600 }}>📦 ORDER TRACKING</span>
        <div style={{ width: 40 }} />
      </header>

      <div style={{ paddingTop: 62, paddingBottom: 100, maxWidth: 500, margin: '0 auto', padding: '62px 16px 100px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: '#bf40bf', textTransform: 'uppercase', fontWeight: 600 }}>
            📦 ORDER TRACKING
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f2f2f7', margin: '8px 0' }}>
            تتبع طلبك
          </h1>
          <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>
            ادخل رقم موبايلك لمعرفة حالة طلبك
          </p>
        </div>

        {/* Search Box */}
        <div style={{
          padding: '20px', borderRadius: 18,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(191,64,191,0.15)',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="رقم الموبايل..."
              style={{
                flex: 1, padding: '13px 16px', borderRadius: 14,
                background: 'rgba(255,255,255,0.04)',
                border: '1.5px solid rgba(191,64,191,0.2)',
                color: '#f2f2f7', fontSize: 14, outline: 'none',
                direction: 'ltr', fontFamily: "'Inter', sans-serif",
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={handleSearch}
              disabled={loading}
              style={{
                padding: '13px 20px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
                color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                opacity: loading ? 0.6 : 1, whiteSpace: 'nowrap',
              }}
            >
              {loading ? '...' : '🔍 بحث'}
            </button>
          </div>
          {error && (
            <p style={{ fontSize: 12, color: '#ff6b6b', margin: '8px 0 0', textAlign: 'center' }}>
              ⚠️ {error}
            </p>
          )}
        </div>

        {/* Results */}
        {searched && orders !== null && (
          <>
            {orders.length === 0 ? (
              <div style={{
                padding: '40px 20px', borderRadius: 18, textAlign: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
              }}>
                <p style={{ fontSize: 36, margin: '0 0 10px' }}>📭</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#f2f2f7', margin: '0 0 6px' }}>
                  مفيش طلبات
                </p>
                <p style={{ fontSize: 12, color: '#888', margin: '0 0 16px', lineHeight: 1.6 }}>
                  مش لاقيين طلبات بالرقم ده. تأكد من الرقم أو كلمنا على الواتساب.
                </p>
                <Link to="/" style={{
                  display: 'inline-block', padding: '11px 24px', borderRadius: 12,
                  background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
                  color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none',
                }}>🛒 تسوق الآن</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <p style={{
                  fontSize: 11, color: '#888', textAlign: 'center',
                  margin: '0 0 4px',
                }}>
                  تم العثور على {orders.length} طلب
                </p>
                {orders.map((order, i) => {
                  const status = statusMap[order.status] || statusMap.pending;
                  const currentStep = status.step;
                  return (
                    <div key={order.id || i} style={{
                      padding: '18px', borderRadius: 18,
                      background: 'rgba(255,255,255,0.02)',
                      border: `1px solid ${status.color}22`,
                    }}>
                      {/* Order header */}
                      <div style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        marginBottom: 14, direction: 'rtl',
                      }}>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7', margin: 0 }}>
                            👕 {order.productName}
                          </p>
                          <p style={{ fontSize: 11, color: '#888', margin: '3px 0 0' }}>
                            📏 {order.size} · {order.governorate}
                          </p>
                        </div>
                        <div style={{
                          padding: '6px 12px', borderRadius: 20,
                          background: `${status.color}15`,
                          border: `1px solid ${status.color}30`,
                        }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: status.color }}>
                            {status.icon} {status.label}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      {order.status !== 'cancelled' && (
                        <div style={{ marginBottom: 14 }}>
                          <div style={{
                            display: 'flex', justifyContent: 'space-between', marginBottom: 8,
                          }}>
                            {steps.map((step, si) => (
                              <div key={si} style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                                flex: 1,
                              }}>
                                <div style={{
                                  width: 32, height: 32, borderRadius: '50%',
                                  background: si + 1 <= currentStep
                                    ? `linear-gradient(135deg, ${status.color}, ${status.color}88)`
                                    : 'rgba(255,255,255,0.05)',
                                  border: `1.5px solid ${si + 1 <= currentStep ? status.color : 'rgba(255,255,255,0.08)'}`,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 14,
                                  transition: 'all 0.3s',
                                }}>
                                  {step.icon}
                                </div>
                                <span style={{
                                  fontSize: 8, color: si + 1 <= currentStep ? status.color : '#555',
                                  fontWeight: 600, textAlign: 'center',
                                }}>
                                  {step.label}
                                </span>
                              </div>
                            ))}
                          </div>
                          {/* Progress line */}
                          <div style={{
                            height: 3, borderRadius: 3,
                            background: 'rgba(255,255,255,0.05)',
                            marginTop: -22, marginBottom: 20,
                            marginLeft: '12%', marginRight: '12%',
                            position: 'relative', zIndex: 0,
                          }}>
                            <div style={{
                              height: '100%', borderRadius: 3,
                              background: `linear-gradient(90deg, ${status.color}, ${status.color}88)`,
                              width: `${Math.max(0, (currentStep - 1) / 3 * 100)}%`,
                              transition: 'width 0.5s ease',
                            }} />
                          </div>
                        </div>
                      )}

                      {/* Order details */}
                      <div style={{
                        padding: '10px 12px', borderRadius: 12,
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.04)',
                        fontSize: 12, color: '#aaa', direction: 'rtl',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span>💰 السعر</span>
                          <span style={{ color: '#bf40bf', fontWeight: 800 }}>{order.price} ج.م</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span>📅 التاريخ</span>
                          <span style={{ color: '#ccc' }}>
                            {new Date(order.createdAt).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* Initial state — before search */}
        {!searched && (
          <div style={{
            padding: '40px 20px', borderRadius: 18, textAlign: 'center',
            background: 'rgba(191,64,191,0.03)',
            border: '1px solid rgba(191,64,191,0.08)',
          }}>
            <p style={{ fontSize: 48, margin: '0 0 12px' }}>📦</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7', margin: '0 0 6px' }}>
              تتبع طلبك بسهولة
            </p>
            <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.6 }}>
              ادخل رقم الموبايل اللي طلبت بيه وهنعرضلك كل طلباتك وحالتها
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
