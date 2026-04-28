import { Link } from 'react-router-dom';

const governorates = [
  { name: 'كفر الشيخ', price: '٣٧٠ - ٣٩٥ ج.م', time: '١-٢ يوم', icon: '⭐' },
  { name: 'القاهرة والجيزة', price: '٤١٠ - ٤٤٠ ج.م', time: '٢-٣ أيام', icon: '🏙️' },
  { name: 'الإسكندرية', price: '٤١٠ - ٤٤٠ ج.م', time: '٢-٣ أيام', icon: '🌊' },
  { name: 'باقي المحافظات', price: '٤١٠ - ٤٤٠ ج.م', time: '٣-٥ أيام', icon: '📦' },
];

const steps = [
  { num: '1', icon: '🛒', title: 'اختار المنتج', desc: 'اختار التيشيرت اللي عاجبك وحدد المقاس' },
  { num: '2', icon: '📋', title: 'أكمل البيانات', desc: 'ادخل اسمك وعنوانك ورقم موبايلك' },
  { num: '3', icon: '✅', title: 'تأكيد الطلب', desc: 'فريقنا هيتواصل معاك على الواتساب' },
  { num: '4', icon: '🚚', title: 'التوصيل', desc: 'هنوصلك الطلب لحد باب بيتك' },
];

export default function ShippingInfo() {
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
        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#bf40bf', fontWeight: 600 }}>🚚 SHIPPING</span>
        <div style={{ width: 40 }} />
      </header>

      <div style={{ paddingTop: 62, paddingBottom: 100, maxWidth: 500, margin: '0 auto', padding: '62px 16px 100px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: '#bf40bf', textTransform: 'uppercase', fontWeight: 600 }}>
            🚚 SHIPPING & DELIVERY
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f2f2f7', margin: '8px 0' }}>
            الشحن والتوصيل
          </h1>
          <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>
            بنوصلك لحد باب بيتك في كل المحافظات
          </p>
        </div>

        {/* How it works */}
        <div style={{
          padding: '18px', borderRadius: 16,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(191,64,191,0.1)',
          marginBottom: 24,
        }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#bf40bf', fontWeight: 600, margin: '0 0 16px', textAlign: 'center',
          }}>
            ✨ خطوات الطلب
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {steps.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, direction: 'rtl', alignItems: 'flex-start' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 14, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(191,64,191,0.12), rgba(123,47,255,0.08))',
                  border: '1px solid rgba(191,64,191,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>{step.icon}</div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7', margin: '0 0 3px' }}>
                    <span style={{ color: '#bf40bf', marginLeft: 4 }}>{step.num}.</span> {step.title}
                  </p>
                  <p style={{ fontSize: 12, color: '#888', margin: 0, lineHeight: 1.5 }}>{step.desc}</p>
                </div>
                {i < steps.length - 1 && (
                  <div style={{
                    position: 'absolute', right: 37, marginTop: 48,
                    width: 1, height: 16, background: 'rgba(191,64,191,0.15)',
                  }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Prices */}
        <div style={{
          padding: '18px', borderRadius: 16,
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(191,64,191,0.1)',
          marginBottom: 24,
        }}>
          <p style={{
            fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase',
            color: '#bf40bf', fontWeight: 600, margin: '0 0 14px',
          }}>
            💰 أسعار التوصيل حسب المحافظة
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {governorates.map((gov, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '14px', borderRadius: 14,
                background: i === 0 ? 'rgba(0,255,102,0.04)' : 'rgba(255,255,255,0.02)',
                border: `1px solid ${i === 0 ? 'rgba(0,255,102,0.12)' : 'rgba(255,255,255,0.04)'}`,
                direction: 'rtl',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{gov.icon}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 700, color: '#f2f2f7', margin: 0 }}>{gov.name}</p>
                    <p style={{ fontSize: 11, color: '#888', margin: '2px 0 0' }}>⏱️ {gov.time}</p>
                  </div>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: i === 0 ? '#00ff66' : '#bf40bf' }}>
                  {gov.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div style={{
          padding: '20px', borderRadius: 16, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(191,64,191,0.06), rgba(123,47,255,0.04))',
          border: '1px solid rgba(191,64,191,0.12)',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#f2f2f7', margin: '0 0 12px' }}>
            💳 طرق الدفع
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            {[
              { text: '💵 كاش عند الاستلام', highlight: false },
              { text: '📱 فودافون كاش', highlight: true },
              { text: '💳 انستاباي', highlight: false },
            ].map((m, i) => (
              <div key={i} style={{
                padding: '10px 16px', borderRadius: 12,
                background: m.highlight ? 'rgba(230,0,18,0.08)' : 'rgba(191,64,191,0.08)',
                border: `1px solid ${m.highlight ? 'rgba(230,0,18,0.2)' : 'rgba(191,64,191,0.15)'}`,
                fontSize: 12, fontWeight: 600,
                color: m.highlight ? '#e60012' : '#d966d9',
              }}>{m.text}</div>
            ))}
          </div>
          {/* Vodafone Cash Number */}
          <div style={{
            marginTop: 14, padding: '12px', borderRadius: 12,
            background: 'rgba(230,0,18,0.05)',
            border: '1px solid rgba(230,0,18,0.12)',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 11, color: '#e60012', fontWeight: 700, margin: '0 0 6px' }}>
              📱 رقم فودافون كاش للتحويل:
            </p>
            <span style={{
              fontSize: 20, fontWeight: 900, color: '#fff',
              fontFamily: "'Inter', monospace", letterSpacing: '2px',
            }}>01006527185</span>
          </div>
        </div>

        {/* Important notes */}
        <div style={{
          padding: '18px', borderRadius: 16,
          background: 'rgba(255,200,50,0.04)',
          border: '1px solid rgba(255,200,50,0.12)',
          marginBottom: 24, direction: 'rtl',
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#ffd43b', margin: '0 0 10px' }}>
            ⚠️ ملاحظات مهمة
          </p>
          <ul style={{ fontSize: 12, color: '#ccc', lineHeight: 1.8, margin: 0, paddingRight: 16 }}>
            <li>الأسعار شاملة مصاريف الشحن</li>
            <li>الدفع عند الاستلام متاح في كل المحافظات</li>
            <li>يمكنك الاستبدال خلال ٧ أيام من الاستلام</li>
            <li>للاستفسارات كلمنا على الواتساب</li>
          </ul>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
          <Link to="/" style={{
            display: 'block', padding: '13px', borderRadius: 14, textDecoration: 'none',
            background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
            color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center',
          }}>🛒 ابدأ التسوق</Link>
          <a
            href="https://wa.me/201006527185?text=عندي استفسار عن الشحن والتوصيل"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', padding: '13px', borderRadius: 14, textDecoration: 'none',
              background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center',
            }}
          >💬 استفسر عن الشحن</a>
        </div>
      </div>
    </div>
  );
}
