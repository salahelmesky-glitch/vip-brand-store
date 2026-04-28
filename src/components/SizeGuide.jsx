import { Link } from 'react-router-dom';

const sizeData = [
  { size: 'M', chest: '96-100', length: '68-70', shoulder: '44-46', weight: '55-65 كجم' },
  { size: 'L', chest: '100-104', length: '70-72', shoulder: '46-48', weight: '65-75 كجم' },
  { size: 'XL', chest: '104-110', length: '72-74', shoulder: '48-50', weight: '75-85 كجم' },
  { size: '2XL', chest: '110-116', length: '74-76', shoulder: '50-52', weight: '85-95 كجم' },
];

const tips = [
  { icon: '📏', text: 'قيس الصدر من أعرض منطقة في الجسم' },
  { icon: '📐', text: 'طول التيشيرت من الكتف للأسفل' },
  { icon: '👕', text: 'لو بين مقاسين، اختار الأكبر لراحة أكتر' },
  { icon: '📞', text: 'مش متأكد؟ كلمنا على الواتساب وهنساعدك!' },
];

export default function SizeGuide() {
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
        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#bf40bf', fontWeight: 600 }}>📏 SIZE GUIDE</span>
        <div style={{ width: 40 }} />
      </header>

      <div style={{ paddingTop: 62, paddingBottom: 100, maxWidth: 500, margin: '0 auto', padding: '62px 16px 100px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: '#bf40bf', textTransform: 'uppercase', fontWeight: 600 }}>
            📏 SIZE GUIDE
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f2f2f7', margin: '8px 0' }}>
            دليل المقاسات
          </h1>
          <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>
            اختار مقاسك الصح وأنت مرتاح
          </p>
        </div>

        {/* Size Table */}
        <div style={{
          borderRadius: 18, overflow: 'hidden',
          border: '1px solid rgba(191,64,191,0.15)',
          marginBottom: 24,
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 1fr',
            background: 'linear-gradient(135deg, rgba(191,64,191,0.15), rgba(123,47,255,0.1))',
            padding: '14px 12px',
            gap: 4,
          }}>
            {['المقاس', 'الصدر', 'الطول', 'الكتف', 'الوزن'].map((h, i) => (
              <span key={i} style={{
                fontSize: 10, fontWeight: 700, color: '#bf40bf', textAlign: 'center',
                letterSpacing: '0.05em',
              }}>{h}</span>
            ))}
          </div>

          {/* Table Rows */}
          {sizeData.map((row, idx) => (
            <div key={row.size} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 1fr 1fr 1fr',
              padding: '14px 12px', gap: 4,
              background: idx % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
              borderTop: '1px solid rgba(255,255,255,0.04)',
            }}>
              <span style={{
                fontSize: 15, fontWeight: 800, color: '#d966d9', textAlign: 'center',
                fontFamily: "'Inter', sans-serif",
              }}>{row.size}</span>
              <span style={{ fontSize: 12, color: '#ccc', textAlign: 'center' }}>{row.chest}</span>
              <span style={{ fontSize: 12, color: '#ccc', textAlign: 'center' }}>{row.length}</span>
              <span style={{ fontSize: 12, color: '#ccc', textAlign: 'center' }}>{row.shoulder}</span>
              <span style={{ fontSize: 11, color: '#aaa', textAlign: 'center', direction: 'rtl' }}>{row.weight}</span>
            </div>
          ))}

          {/* Unit note */}
          <div style={{
            padding: '10px 12px', background: 'rgba(191,64,191,0.04)',
            borderTop: '1px solid rgba(191,64,191,0.08)',
            textAlign: 'center',
          }}>
            <span style={{ fontSize: 10, color: '#888' }}>جميع المقاسات بالسنتيمتر (سم)</span>
          </div>
        </div>

        {/* Tips */}
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
            💡 نصائح لاختيار المقاس
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {tips.map((tip, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, direction: 'rtl' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
                <p style={{ fontSize: 13, color: '#ccc', margin: 0, lineHeight: 1.6 }}>{tip.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual Size Indicator */}
        <div style={{
          padding: '20px', borderRadius: 16, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(191,64,191,0.06), rgba(123,47,255,0.04))',
          border: '1px solid rgba(191,64,191,0.12)',
          marginBottom: 24,
        }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: '#f2f2f7', margin: '0 0 14px' }}>
            المقاسات المتوفرة
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            {['M', 'L', 'XL', '2XL'].map((s) => (
              <div key={s} style={{
                width: 52, height: 52, borderRadius: 14,
                background: 'rgba(191,64,191,0.1)',
                border: '1.5px solid rgba(191,64,191,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, fontWeight: 800, color: '#d966d9',
                fontFamily: "'Inter', sans-serif",
              }}>{s}</div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'center' }}>
          <Link to="/" style={{
            display: 'block', padding: '13px', borderRadius: 14, textDecoration: 'none',
            background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
            color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center',
          }}>🛒 تسوق الآن</Link>
          <a
            href="https://wa.me/201006527185?text=محتاج مساعدة في اختيار المقاس"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'block', padding: '13px', borderRadius: 14, textDecoration: 'none',
              background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700, textAlign: 'center',
            }}
          >💬 اسأل عن مقاسك</a>
        </div>
      </div>
    </div>
  );
}
