import { useState } from 'react';
import { Link } from 'react-router-dom';

const faqData = [
  {
    q: 'إزاي أطلب من VIP Brand؟',
    a: 'ببساطة اختار المنتج اللي عاجبك من المتجر، حدد المقاس والمحافظة، وادخل بياناتك. فريقنا هيتواصل معاك على الواتساب لتأكيد الطلب.',
    icon: '🛒',
  },
  {
    q: 'إيه المقاسات المتوفرة؟',
    a: 'عندنا مقاسات M, L, XL, 2XL. ممكن تشوف جدول المقاسات التفصيلي من صفحة دليل المقاسات.',
    icon: '📏',
  },
  {
    q: 'بتوصلوا لكل المحافظات؟',
    a: 'أيوه! بنوصل لكل محافظات مصر. التوصيل لكفر الشيخ خلال ١-٢ يوم، وباقي المحافظات ٣-٥ أيام.',
    icon: '🚚',
  },
  {
    q: 'إيه طرق الدفع المتاحة؟',
    a: 'متاح الدفع كاش عند الاستلام، فودافون كاش، وانستاباي.',
    icon: '💳',
  },
  {
    q: 'ممكن أرجع أو أستبدل المنتج؟',
    a: 'أكيد! يمكنك الاستبدال خلال ٧ أيام من الاستلام بشرط المنتج يكون في حالته الأصلية.',
    icon: '🔄',
  },
  {
    q: 'إزاي أتابع طلبي؟',
    a: 'بعد تأكيد الطلب، هنتواصل معاك على الواتساب بتحديثات الشحن. كمان ممكن تسأل فريقنا أي وقت.',
    icon: '📋',
  },
  {
    q: 'إيه نظام النقاط والمسابقات؟',
    a: 'كل تيشيرت بتشتريه بيضيف ١٠ نقاط لحسابك. النقاط دي ممكن تستخدمها في عجلة الحظ أو صندوق الغموض وتكسب هدايا!',
    icon: '🏆',
  },
  {
    q: 'إزاي أتواصل مع VIP Brand؟',
    a: 'كلمنا على الواتساب على رقم 01006527185 أو تابعنا على تيك توك وانستجرام.',
    icon: '💬',
  },
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div
      style={{
        borderRadius: 14, overflow: 'hidden',
        border: `1px solid ${isOpen ? 'rgba(191,64,191,0.25)' : 'rgba(255,255,255,0.05)'}`,
        background: isOpen ? 'rgba(191,64,191,0.04)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.3s ease',
      }}
    >
      <button
        onClick={onClick}
        style={{
          display: 'flex', alignItems: 'center', gap: 12,
          width: '100%', padding: '16px', direction: 'rtl',
          background: 'none', border: 'none', cursor: 'pointer',
          textAlign: 'right',
        }}
      >
        <span style={{ fontSize: 22, flexShrink: 0 }}>{faq.icon}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 700, color: '#f2f2f7', lineHeight: 1.5 }}>
          {faq.q}
        </span>
        <svg
          width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="#bf40bf" strokeWidth="2" strokeLinecap="round"
          style={{
            flexShrink: 0,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {isOpen && (
        <div style={{
          padding: '0 16px 16px', direction: 'rtl',
          animation: 'faqSlideIn 0.3s ease-out',
        }}>
          <div style={{
            height: 1, background: 'rgba(191,64,191,0.1)',
            marginBottom: 12, marginRight: 34,
          }} />
          <p style={{
            fontSize: 13, color: '#aaa', margin: 0, lineHeight: 1.8,
            paddingRight: 34,
          }}>{faq.a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

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
        <span style={{ fontSize: 10, letterSpacing: '0.2em', color: '#bf40bf', fontWeight: 600 }}>❓ FAQ</span>
        <div style={{ width: 40 }} />
      </header>

      <div style={{ paddingTop: 62, paddingBottom: 100, maxWidth: 500, margin: '0 auto', padding: '62px 16px 100px' }}>
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: '#bf40bf', textTransform: 'uppercase', fontWeight: 600 }}>
            ❓ FAQ
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#f2f2f7', margin: '8px 0' }}>
            أسئلة شائعة
          </h1>
          <p style={{ fontSize: 12, color: '#888', margin: '4px 0 0' }}>
            كل اللي محتاج تعرفه عن VIP Brand
          </p>
        </div>

        {/* FAQ Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {faqData.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              isOpen={openIndex === i}
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>

        {/* Still have questions? */}
        <div style={{
          padding: '24px 20px', borderRadius: 18, textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(37,211,102,0.06), rgba(37,211,102,0.02))',
          border: '1px solid rgba(37,211,102,0.15)',
        }}>
          <p style={{ fontSize: 28, margin: '0 0 8px' }}>🤔</p>
          <h3 style={{ fontSize: 18, fontWeight: 800, color: '#f2f2f7', margin: '0 0 6px' }}>
            لسه عندك سؤال؟
          </h3>
          <p style={{ fontSize: 12, color: '#888', margin: '0 0 16px', lineHeight: 1.6 }}>
            فريق VIP جاهز يساعدك ٢٤/٧
          </p>
          <a
            href="https://wa.me/201006527185?text=عندي سؤال عن VIP Brand"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 14, textDecoration: 'none',
              background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 700,
              boxShadow: '0 4px 20px rgba(37,211,102,0.25)',
            }}
          >💬 اسألنا على الواتساب</a>
        </div>
      </div>

      <style>{`
        @keyframes faqSlideIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
