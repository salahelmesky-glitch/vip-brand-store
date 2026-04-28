import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function SiteSettingsPage() {
  const {
    maintenance, updateMaintenance,
    storePricing, updateStorePricing,
    siteTexts, updateSiteTexts,
    rewardCosts, updateRewardCosts,
    prizes, updatePrizes,
    mysteryText, updateMysteryText,
  } = useAdmin();

  /* ── Local state mirrors (for editing before save) ── */
  const [localPricing, setLocalPricing] = useState(storePricing || {});
  const [localTexts, setLocalTexts] = useState(siteTexts || {});
  const [localCosts, setLocalCosts] = useState(rewardCosts || {});
  const [localPrizes, setLocalPrizes] = useState(prizes || []);
  const [localMysteryText, setLocalMysteryText] = useState(mysteryText || '');

  const [saved, setSaved] = useState('');

  const showSaved = (msg) => { setSaved(msg); setTimeout(() => setSaved(''), 2000); };

  /* ══ CRITICAL: Sync local state when context updates from API ══ 
     Without this, the local form values would revert to old values
     after polling fetches new data from MongoDB */
  useEffect(() => { setLocalPricing(storePricing || {}); }, [storePricing]);
  useEffect(() => { setLocalTexts(siteTexts || {}); }, [siteTexts]);
  useEffect(() => { setLocalCosts(rewardCosts || {}); }, [rewardCosts]);
  useEffect(() => { setLocalPrizes(prizes || []); }, [prizes]);
  useEffect(() => { setLocalMysteryText(mysteryText || ''); }, [mysteryText]);

  const updatePrize = (idx, field, value) => {
    const copy = [...localPrizes];
    copy[idx] = { ...copy[idx], [field]: value };
    setLocalPrizes(copy);
  };

  const updateText = (key, value) => {
    setLocalTexts(prev => ({ ...prev, [key]: value }));
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
        <p style={{ fontSize: 10, color: '#888', margin: '0 0 10px' }}>لما تفعّل الصيانة، كل العملاء هيشوفوا صفحة الصيانة فوراً!</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={async () => {
            const v = !maintenance;
            await updateMaintenance(v);
            showSaved(v ? '⚠️ وضع الصيانة مفعل — كل العملاء هيشوفوا صفحة الصيانة' : '✅ الموقع شغال — كل العملاء هيشوفوا الموقع');
          }} style={{
            padding: '10px 20px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
            background: maintenance ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #25D366, #128C7E)',
            color: '#fff',
          }}>{maintenance ? '🔴 الصيانة مفعلة — اضغط لإلغاء' : '🟢 الموقع شغال'}</button>
        </div>
      </div>

      {/* ═══ REWARD COSTS ═══ */}
      <div style={section}>
        <p style={sectionTitle}>🎯 تكلفة المكافآت / Reward Costs</p>
        <p style={{ fontSize: 10, color: '#666', margin: '0 0 14px' }}>تحكم في عدد النقاط المطلوبة للعجلة وصندوق الغموض</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(191,64,191,0.04)', border: '1px solid rgba(191,64,191,0.12)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#d966d9', margin: '0 0 10px', direction: 'rtl' }}>🎰 عجلة الحظ</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#aaa', fontWeight: 700 }}>النقاط</span>
              <input type="number" min="1" value={localCosts?.spinCost || 75}
                onChange={(e) => setLocalCosts(prev => ({ ...prev, spinCost: Number(e.target.value) }))}
                style={{ ...inp, width: '100%' }} />
            </div>
          </div>
          <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(123,47,255,0.04)', border: '1px solid rgba(123,47,255,0.12)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#7b2fff', margin: '0 0 10px', direction: 'rtl' }}>📦 صندوق الغموض</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 12, color: '#aaa', fontWeight: 700 }}>النقاط</span>
              <input type="number" min="1" value={localCosts?.mysteryCost || 100}
                onChange={(e) => setLocalCosts(prev => ({ ...prev, mysteryCost: Number(e.target.value) }))}
                style={{ ...inp, width: '100%' }} />
            </div>
          </div>
        </div>

        <button onClick={async () => {
          await updateRewardCosts(localCosts);
          showSaved('✅ تم حفظ تكلفة المكافآت — التغيير بان عند الكل فوراً');
        }} style={{ ...saveBtn, width: '100%', padding: '12px', marginTop: 12 }}>
          💾 حفظ تكلفة المكافآت
        </button>
      </div>

      {/* ═══ STORE PRICING ═══ */}
      <div style={section}>
        <p style={sectionTitle}>💰 أسعار المقاسات / Size Pricing</p>
        <p style={{ fontSize: 10, color: '#666', margin: '0 0 14px' }}>غيّر الأسعار حسب المحافظة — التغيير بيبان عند الزبون فوراً</p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(191,64,191,0.04)', border: '1px solid rgba(191,64,191,0.12)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#d966d9', margin: '0 0 10px', direction: 'rtl' }}>📍 كفر الشيخ</p>
            {(localPricing?.sizes || ['M', 'L', 'XL', '2XL']).map((size) => (
              <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#aaa', width: 30, fontWeight: 700 }}>{size}</span>
                <input type="number" value={localPricing?.kafrElSheikh?.[size] || ''}
                  onChange={(e) => setLocalPricing(prev => ({
                    ...prev,
                    kafrElSheikh: { ...prev.kafrElSheikh, [size]: Number(e.target.value) }
                  }))} style={{ ...inp, width: '100%' }} />
                <span style={{ fontSize: 10, color: '#666' }}>ج.م</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px', borderRadius: 12, background: 'rgba(123,47,255,0.04)', border: '1px solid rgba(123,47,255,0.12)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#7b2fff', margin: '0 0 10px', direction: 'rtl' }}>📍 محافظة أخرى</p>
            {(localPricing?.sizes || ['M', 'L', 'XL', '2XL']).map((size) => (
              <div key={size} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: '#aaa', width: 30, fontWeight: 700 }}>{size}</span>
                <input type="number" value={localPricing?.other?.[size] || ''}
                  onChange={(e) => setLocalPricing(prev => ({
                    ...prev,
                    other: { ...prev.other, [size]: Number(e.target.value) }
                  }))} style={{ ...inp, width: '100%' }} />
                <span style={{ fontSize: 10, color: '#666' }}>ج.م</span>
              </div>
            ))}
          </div>
        </div>

        <button onClick={async () => {
          await updateStorePricing(localPricing);
          showSaved('✅ تم حفظ الأسعار — التغيير بان عند الكل فوراً');
        }} style={{ ...saveBtn, width: '100%', padding: '12px', marginTop: 12 }}>
          💾 حفظ الأسعار
        </button>
      </div>

      {/* ═══ SITE TEXTS ═══ */}
      <div style={section}>
        <p style={sectionTitle}>✏️ نصوص الموقع / Site Texts</p>
        <p style={{ fontSize: 10, color: '#666', margin: '0 0 14px' }}>غيّر أي كلمة على الموقع — التغيير بيبان فوراً عند كل العملاء</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'brandName', label: '🏷️ اسم البراند', placeholder: 'VIP' },
            { key: 'heroSubtitle', label: '✨ العنوان الفرعي', placeholder: '★ Exclusive Luxury Streetwear...' },
            { key: 'heroTaglineEn', label: '💬 الشعار إنجليزي', placeholder: 'Redefining luxury...' },
            { key: 'heroTaglineAr', label: '💬 الشعار عربي', placeholder: 'نعيد تعريف الفخامة...' },
            { key: 'ctaButton', label: '🛒 زر التسوق', placeholder: 'Shop Now / تسوق الآن' },
            { key: 'buyButton', label: '🛍️ زر الشراء على الكارت', placeholder: 'إضغط للشراء 🛒' },
            { key: 'boysSectionEn', label: '👦 قسم الولاد إنجليزي', placeholder: 'BOYS COLLECTION' },
            { key: 'boysSectionAr', label: '👦 قسم الولاد عربي', placeholder: 'قسم الولاد' },
            { key: 'girlsSectionEn', label: '👧 قسم البنات إنجليزي', placeholder: 'GIRLS COLLECTION' },
            { key: 'girlsSectionAr', label: '👧 قسم البنات عربي', placeholder: 'قسم البنات' },
            { key: 'storeTitle', label: '🏪 عنوان المتجر إنجليزي', placeholder: 'All Products' },
            { key: 'storeTitleAr', label: '🏪 عنوان المتجر عربي', placeholder: 'جميع المنتجات' },
            { key: 'governorateQuestion', label: '❓ سؤال المحافظة', placeholder: 'هل أنت من محافظة كفر الشيخ؟' },
            { key: 'kafrLabel', label: '📍 اسم المحافظة ١', placeholder: 'محافظة كفر الشيخ' },
            { key: 'otherLabel', label: '📍 اسم المحافظة ٢', placeholder: 'محافظة أخرى' },
            { key: 'orderSuccess', label: '🎉 رسالة نجاح الطلب', placeholder: 'تم الطلب بنجاح! 🎉' },
            { key: 'orderSuccessDesc', label: '📝 وصف نجاح الطلب', placeholder: 'سوف يتم التواصل معاك...' },
            { key: 'aboutAr', label: '📄 نبذة عربي', placeholder: 'نحن VIP Brand...' },
            { key: 'aboutEn', label: '📄 نبذة إنجليزي', placeholder: 'We are VIP Brand...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 10, color: '#888', display: 'block', marginBottom: 4, fontWeight: 600 }}>{label}</label>
              <input
                value={localTexts?.[key] || ''}
                onChange={(e) => updateText(key, e.target.value)}
                placeholder={placeholder}
                style={inp}
              />
            </div>
          ))}
        </div>

        <button onClick={async () => {
          await updateSiteTexts(localTexts);
          showSaved('✅ تم حفظ النصوص — التغيير بان عند الكل فوراً');
        }} style={{ ...saveBtn, width: '100%', padding: '12px', marginTop: 12 }}>
          💾 حفظ النصوص
        </button>
      </div>

      {/* ═══ SOCIAL & CONTACT ═══ */}
      <div style={section}>
        <p style={sectionTitle}>📱 السوشيال ميديا والتواصل</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { key: 'whatsappNumber', label: '💬 رقم الواتساب', placeholder: '201006527185' },
            { key: 'tiktokUrl', label: '🎵 رابط التيك توك', placeholder: 'https://tiktok.com/@...' },
            { key: 'instagramUrl', label: '📸 رابط الانستجرام', placeholder: 'https://www.instagram.com/...' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: 10, color: '#888', display: 'block', marginBottom: 4, fontWeight: 600 }}>{label}</label>
              <input
                value={localTexts?.[key] || ''}
                onChange={(e) => updateText(key, e.target.value)}
                placeholder={placeholder}
                style={inp}
              />
            </div>
          ))}
        </div>

        <button onClick={async () => {
          await updateSiteTexts(localTexts);
          showSaved('✅ تم حفظ الروابط — التغيير بان عند الكل فوراً');
        }} style={{ ...saveBtn, width: '100%', padding: '12px', marginTop: 12 }}>
          💾 حفظ الروابط
        </button>
      </div>

      {/* ═══ MYSTERY TEXT ═══ */}
      <div style={section}>
        <p style={sectionTitle}>📦 نص صندوق الغموض ({localCosts?.mysteryCost || 100} نقطة)</p>
        <p style={{ fontSize: 10, color: '#666', margin: '0 0 8px' }}>النص اللي بيظهر للعميل لما يكسب الصندوق</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <input value={localMysteryText} onChange={e => setLocalMysteryText(e.target.value)} style={inp} />
          <button onClick={async () => {
            await updateMysteryText(localMysteryText);
            showSaved('✅ تم حفظ نص الصندوق');
          }} style={saveBtn}>💾</button>
        </div>
      </div>

      {/* ═══ SPIN WHEEL PRIZES ═══ */}
      <div style={section}>
        <p style={sectionTitle}>🎰 جوائز العجلة / Spin Wheel Prizes</p>
        <p style={{ fontSize: 10, color: '#666', margin: '0 0 12px' }}>غيّر أسماء الجوائز والألوان</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {localPrizes.map((p, i) => (
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
          <button onClick={async () => {
            await updatePrizes(localPrizes);
            showSaved('✅ تم حفظ جوائز العجلة — التغيير بان عند الكل فوراً');
          }} style={{ ...saveBtn, flex: 1, padding: '10px' }}>💾 حفظ الجوائز</button>
          <button onClick={async () => {
            const defaults = [
              { id: 'discount_10', labelAr: 'خصم ١٠٪', color: '#ff6b6b', icon: '🏷️' },
              { id: 'bonus_30', labelAr: '+٣٠ نقطة', color: '#ffd43b', icon: '⭐' },
              { id: 'free_shipping', labelAr: 'شحن مجاني', color: '#69db7c', icon: '🚚' },
              { id: 'discount_20', labelAr: 'خصم ٢٠٪', color: '#da77f2', icon: '🔥' },
              { id: 'try_again', labelAr: 'حاول تاني', color: '#868e96', icon: '🔄' },
              { id: 'free_tshirt', labelAr: 'تيشيرت مجاني!', color: '#00ff66', icon: '👕' },
            ];
            setLocalPrizes(defaults);
            await updatePrizes(defaults);
            showSaved('🔄 تم الرجوع للافتراضي');
          }} style={{
            flex: 0, padding: '10px 16px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)',
            background: 'none', color: '#888', fontSize: 12, cursor: 'pointer',
          }}>🔄 افتراضي</button>
        </div>
      </div>
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
