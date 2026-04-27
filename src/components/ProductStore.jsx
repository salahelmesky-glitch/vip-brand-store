import { useRef, useState, useMemo, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';

/* ─── Helpers ─── */
const WHATSAPP_DEFAULT = '201006527185';

/* WhatsApp SVG path */
const WA_ICON = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

/* ═══════════════════════════════════════════════════
   PRODUCT DETAIL MODAL — New Order Flow
   ═══════════════════════════════════════════════════ */
function ProductDetailModal({ product, onClose }) {
  const { storePricing, siteTexts, addStoreOrder } = useAdmin();
  const [step, setStep] = useState('governorate'); // governorate → confirming → size → info → success
  const [governorate, setGovernorate] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [customerName, setCustomerName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [orderDone, setOrderDone] = useState(false);

  const whatsapp = siteTexts?.whatsappNumber || WHATSAPP_DEFAULT;
  const sizes = storePricing?.sizes || ['M', 'L', 'XL', '2XL'];
  
  const getPrices = () => {
    if (governorate === 'kafr') return storePricing?.kafrElSheikh || { M: 370, L: 380, XL: 390, '2XL': 395 };
    return storePricing?.other || { M: 410, L: 420, XL: 430, '2XL': 440 };
  };

  const currentPrice = selectedSize ? getPrices()[selectedSize] : null;

  const handleGovernorateSelect = (gov) => {
    setGovernorate(gov);
    setStep('confirming');
    setTimeout(() => {
      setStep('size');
    }, 1200);
  };

  const handleSubmitOrder = () => {
    if (!customerName.trim() || !address.trim() || !phone.trim()) return;
    
    const orderData = {
      productName: product.name,
      productImg: product.img,
      governorate: governorate === 'kafr' ? 'كفر الشيخ' : 'محافظة أخرى',
      size: selectedSize,
      price: currentPrice,
      customerName: customerName.trim(),
      address: address.trim(),
      phone: phone.trim(),
    };
    
    addStoreOrder(orderData);
    setOrderDone(true);
    setStep('success');
  };

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      onClick={onClose}
      style={{ background: 'rgba(5,5,5,0.94)', padding: '12px' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-h-[92vh] overflow-y-auto"
        style={{
          maxWidth: '400px',
          background: '#0c0c12',
          borderRadius: '20px',
          border: '1px solid rgba(191,64,191,0.2)',
          boxShadow: '0 0 60px rgba(191,64,191,0.1)',
          animation: 'modalIn 0.15s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white text-lg"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
        >
          ✕
        </button>

        {/* Product image — slightly smaller for mobile space */}
        <div className="relative w-full" style={{ aspectRatio: '1 / 1', maxHeight: '320px', background: 'linear-gradient(135deg, #0c0c12, #1a0b2e)' }}>
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full"
            style={{ objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Product info */}
        <div style={{ padding: '16px 18px 22px' }}>
          {/* Name */}
          <h2 style={{
            textAlign: 'center', fontSize: '17px', fontWeight: '800',
            letterSpacing: '0.5px', color: '#f2f2f7', margin: '0 0 14px',
            fontFamily: "'Inter', sans-serif",
          }}>
            {product.name}
          </h2>

          <div style={{ height: 1, background: 'rgba(191,64,191,0.12)', margin: '0 0 16px' }} />

          {/* ─── STEP 1: Governorate Selection ─── */}
          {step === 'governorate' && (
            <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
              <p style={{
                textAlign: 'center', fontSize: '14px', fontWeight: '700',
                color: '#f2f2f7', margin: '0 0 16px', lineHeight: 1.6,
                direction: 'rtl',
              }}>
                {siteTexts?.governorateQuestion || 'هل أنت من محافظة كفر الشيخ؟'}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {/* Kafr El-Sheikh */}
                <button
                  onClick={() => handleGovernorateSelect('kafr')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', borderRadius: '14px',
                    background: 'rgba(191,64,191,0.06)',
                    border: '1.5px solid rgba(191,64,191,0.2)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    direction: 'rtl', width: '100%',
                  }}
                >
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    border: '2px solid rgba(191,64,191,0.4)',
                    background: 'rgba(255,255,255,0.03)',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#f2f2f7' }}>
                    {siteTexts?.kafrLabel || 'محافظة كفر الشيخ'}
                  </span>
                </button>

                {/* Other */}
                <button
                  onClick={() => handleGovernorateSelect('other')}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '14px 16px', borderRadius: '14px',
                    background: 'rgba(123,47,255,0.06)',
                    border: '1.5px solid rgba(123,47,255,0.2)',
                    cursor: 'pointer', transition: 'all 0.2s',
                    direction: 'rtl', width: '100%',
                  }}
                >
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '6px',
                    border: '2px solid rgba(123,47,255,0.4)',
                    background: 'rgba(255,255,255,0.03)',
                    flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#f2f2f7' }}>
                    {siteTexts?.otherLabel || 'محافظة أخرى'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* ─── STEP: Confirming ─── */}
          {step === 'confirming' && (
            <div style={{
              textAlign: 'center', padding: '20px 0',
              animation: 'fadeInUp 0.3s ease-out',
            }}>
              <div style={{
                width: '56px', height: '56px', borderRadius: '50%',
                background: 'rgba(0,255,102,0.12)',
                border: '2px solid rgba(0,255,102,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px', animation: 'checkPop 0.4s ease-out',
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" style={{ width: '28px', height: '28px' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <p style={{ fontSize: '16px', fontWeight: '700', color: '#00ff66', margin: '0 0 4px' }}>
                تم التأكيد ✓
              </p>
              <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
                {governorate === 'kafr' ? (siteTexts?.kafrLabel || 'محافظة كفر الشيخ') : (siteTexts?.otherLabel || 'محافظة أخرى')}
              </p>
            </div>
          )}

          {/* ─── STEP 2: Size Selection ─── */}
          {step === 'size' && (
            <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
              <p style={{
                textAlign: 'center', fontSize: '11px', letterSpacing: '0.2em',
                textTransform: 'uppercase', color: '#888', fontWeight: '600',
                margin: '0 0 12px',
              }}>
                📏 اختار المقاس / SELECT SIZE
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {sizes.map((size) => {
                  const price = getPrices()[size];
                  const sel = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '12px 16px', borderRadius: '12px',
                        border: sel ? '2px solid #bf40bf' : '1.5px solid rgba(255,255,255,0.08)',
                        background: sel ? 'rgba(191,64,191,0.12)' : 'rgba(255,255,255,0.02)',
                        cursor: 'pointer', transition: 'all 0.2s', width: '100%',
                        boxShadow: sel ? '0 0 14px rgba(191,64,191,0.15)' : 'none',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '18px', height: '18px', borderRadius: '50%',
                          border: sel ? '2px solid #bf40bf' : '2px solid rgba(255,255,255,0.2)',
                          background: sel ? '#bf40bf' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s',
                        }}>
                          {sel && (
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />
                          )}
                        </div>
                        <span style={{
                          fontSize: '15px', fontWeight: '700',
                          color: sel ? '#fff' : 'rgba(255,255,255,0.6)',
                          fontFamily: "'Inter', sans-serif",
                        }}>
                          {size}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '15px', fontWeight: '800',
                        color: sel ? '#bf40bf' : 'rgba(255,255,255,0.4)',
                        fontFamily: "'Inter', sans-serif",
                      }}>
                        {price} EGP
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Address & Phone — show when size is selected */}
              {selectedSize && (
                <div style={{ animation: 'fadeInUp 0.3s ease-out' }}>
                  <div style={{ height: 1, background: 'rgba(191,64,191,0.1)', margin: '0 0 14px' }} />
                  
                  <p style={{
                    textAlign: 'center', fontSize: '11px', letterSpacing: '0.15em',
                    textTransform: 'uppercase', color: '#888', fontWeight: '600',
                    margin: '0 0 10px',
                  }}>
                    📋 بيانات التوصيل
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                    <input
                      type="text"
                      placeholder="الاسم بالكامل..."
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1.5px solid rgba(191,64,191,0.15)',
                        color: '#f2f2f7', fontSize: '13px',
                        outline: 'none', direction: 'rtl',
                        fontFamily: "'Inter', sans-serif",
                        boxSizing: 'border-box',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="العنوان بالتفصيل..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1.5px solid rgba(191,64,191,0.15)',
                        color: '#f2f2f7', fontSize: '13px',
                        outline: 'none', direction: 'rtl',
                        fontFamily: "'Inter', sans-serif",
                        boxSizing: 'border-box',
                      }}
                    />
                    <input
                      type="tel"
                      placeholder="رقم الموبايل..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      style={{
                        width: '100%', padding: '12px 14px', borderRadius: '12px',
                        background: 'rgba(255,255,255,0.04)',
                        border: '1.5px solid rgba(191,64,191,0.15)',
                        color: '#f2f2f7', fontSize: '13px',
                        outline: 'none', direction: 'ltr',
                        fontFamily: "'Inter', sans-serif",
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  {/* Price Summary */}
                  <div style={{
                    padding: '12px 14px', borderRadius: '12px',
                    background: 'rgba(191,64,191,0.06)',
                    border: '1px solid rgba(191,64,191,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: '14px',
                  }}>
                    <span style={{ fontSize: '12px', color: '#aaa', direction: 'rtl' }}>
                      المقاس: {selectedSize} · {governorate === 'kafr' ? 'كفر الشيخ' : 'محافظة أخرى'}
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#bf40bf', fontFamily: "'Inter', sans-serif" }}>
                      {currentPrice} <span style={{ fontSize: '11px', fontWeight: '600' }}>EGP</span>
                    </span>
                  </div>

                  {/* Submit Order */}
                  <button
                    onClick={handleSubmitOrder}
                    disabled={!customerName.trim() || !address.trim() || !phone.trim()}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: '8px', width: '100%', padding: '14px 0',
                      borderRadius: '14px',
                      background: (customerName.trim() && address.trim() && phone.trim())
                        ? 'linear-gradient(135deg, #bf40bf, #7b2fff)'
                        : 'rgba(255,255,255,0.06)',
                      color: (customerName.trim() && address.trim() && phone.trim()) ? '#fff' : '#666',
                      fontSize: '15px', fontWeight: '700', border: 'none',
                      cursor: (customerName.trim() && address.trim() && phone.trim()) ? 'pointer' : 'not-allowed',
                      boxShadow: (customerName.trim() && address.trim() && phone.trim()) ? '0 4px 20px rgba(191,64,191,0.25)' : 'none',
                      transition: 'all 0.3s',
                      fontFamily: "'Inter', sans-serif",
                    }}
                  >
                    🛒 إتمام الطلب
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─── STEP: Success ─── */}
          {step === 'success' && (
            <div style={{
              textAlign: 'center', padding: '10px 0',
              animation: 'fadeInUp 0.3s ease-out',
            }}>
              <div style={{
                width: '64px', height: '64px', borderRadius: '50%',
                background: 'linear-gradient(135deg, rgba(0,255,102,0.15), rgba(37,211,102,0.1))',
                border: '2px solid rgba(0,255,102,0.4)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 14px', animation: 'checkPop 0.5s ease-out',
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#00ff66" strokeWidth="3" strokeLinecap="round" style={{ width: '32px', height: '32px' }}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>

              <h3 style={{
                fontSize: '18px', fontWeight: '900', color: '#00ff66',
                margin: '0 0 14px', direction: 'rtl',
              }}>
                {siteTexts?.orderSuccess || 'تم الطلب بنجاح! 🎉'}
              </h3>

              {/* WhatsApp notification banner */}
              <div style={{
                padding: '12px 16px', borderRadius: '12px',
                background: 'rgba(37,211,102,0.08)',
                border: '1px solid rgba(37,211,102,0.2)',
                marginBottom: '16px', direction: 'rtl',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#25D366', margin: '0 0 4px' }}>
                  💬 سوف يتم التواصل معاك عبر الواتساب
                </p>
                <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>
                  فريق VIP هيتواصل معاك قريباً لتأكيد التوصيل وتفاصيل الطلب ✨
                </p>
              </div>

              {/* Order summary with design image */}
              <div style={{
                padding: '12px', borderRadius: '12px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                marginBottom: '16px', direction: 'rtl',
                fontSize: '12px', color: '#aaa', textAlign: 'right',
              }}>
                {/* Design image */}
                {product.img && (
                  <div style={{
                    borderRadius: '10px', overflow: 'hidden',
                    marginBottom: '10px', maxHeight: '120px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(255,255,255,0.02)',
                  }}>
                    <img src={product.img} alt={product.name} style={{ maxWidth: '100%', maxHeight: '120px', objectFit: 'contain' }} />
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>👤 الاسم</span><span style={{ color: '#f2f2f7' }}>{customerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>👕 المنتج</span><span style={{ color: '#f2f2f7' }}>{product.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>📏 المقاس</span><span style={{ color: '#f2f2f7' }}>{selectedSize}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>📍 المحافظة</span><span style={{ color: '#f2f2f7' }}>{governorate === 'kafr' ? 'كفر الشيخ' : 'محافظة أخرى'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span>📱 الرقم</span><span style={{ color: '#f2f2f7', direction: 'ltr' }}>{phone}</span>
                </div>
                <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '6px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: '700' }}>💰 الإجمالي</span>
                  <span style={{ fontWeight: '800', color: '#bf40bf', fontSize: '14px' }}>{currentPrice} EGP</span>
                </div>
              </div>

              {/* WhatsApp inquiry */}
              <a
                href={`https://api.whatsapp.com/send?phone=${whatsapp}&text=${encodeURIComponent(`مرحباً VIP! أنا ${customerName}، عندي استفسار عن طلبي 📦\nالمنتج: ${product.name}\nالمقاس: ${selectedSize}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  gap: '10px', width: '100%', padding: '13px 0',
                  borderRadius: '14px', background: '#25D366',
                  color: '#ffffff', fontSize: '13px', fontWeight: '700',
                  textDecoration: 'none',
                  boxShadow: '0 4px 16px rgba(37,211,102,0.25)',
                }}
              >
                <svg viewBox="0 0 24 24" fill="white" style={{ width: '18px', height: '18px' }}>
                  <path d={WA_ICON} />
                </svg>
                الاستفسار عبر الواتساب
              </a>

              <button
                onClick={onClose}
                style={{
                  marginTop: '10px', padding: '10px 0', width: '100%',
                  borderRadius: '12px', background: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#888', fontSize: '12px', cursor: 'pointer',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                إغلاق ✕
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LIGHTWEIGHT PRODUCT CARD — "إضغط للشراء" button
   ═══════════════════════════════════════════════════ */
function LightCard({ product, onOpenDetail, buyButtonText }) {
  const [imgError, setImgError] = useState(false);

  return (
    <div
      className="holo-card cursor-pointer"
      onClick={() => onOpenDetail(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ aspectRatio: '1 / 1', background: 'linear-gradient(135deg, #0c0c12, #1a0b2e)' }}>
        {!imgError ? (
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full"
            style={{ objectFit: 'contain', transition: 'transform 0.3s ease' }}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <span className="font-heading text-2xl font-black" style={{ color: '#d966d9' }}>VIP</span>
            <span className="text-xs mt-1" style={{ color: '#99999f' }}>{product.name}</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 8px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(242,242,247,0.9)', margin: '0 0 8px 0', fontFamily: 'Montserrat, Inter, sans-serif' }}>
          {product.name}
        </p>
        {/* Buy button instead of price */}
        <div style={{
          padding: '8px 12px', borderRadius: '10px',
          background: 'linear-gradient(135deg, rgba(191,64,191,0.15), rgba(123,47,255,0.1))',
          border: '1px solid rgba(191,64,191,0.3)',
          color: '#d966d9', fontSize: '12px', fontWeight: '700',
          transition: 'all 0.3s',
          fontFamily: "'Inter', sans-serif",
          direction: 'rtl',
        }}>
          {buyButtonText || 'إضغط للشراء 🛒'}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION BANNERS — CSS only
   ═══════════════════════════════════════════════════ */
function SectionBanner({ id, titleEn, titleAr, subtitle }) {
  return (
    <div
      id={id}
      className="col-span-full relative py-14 sm:py-16 md:py-20 my-6 sm:my-8 rounded-2xl overflow-hidden text-center"
      style={{
        background: 'linear-gradient(135deg, rgba(123,47,255,0.12) 0%, rgba(191,64,191,0.08) 50%, rgba(123,47,255,0.12) 100%)',
        border: '1px solid rgba(191,64,191,0.15)',
      }}
    >
      <div className="relative z-10">
        <p className="text-[10px] sm:text-xs tracking-[0.5em] uppercase font-medium mb-3" style={{ color: '#bf40bf' }}>
          {subtitle}
        </p>
        <h2
          className="font-heading text-4xl sm:text-5xl md:text-5xl font-black tracking-wider text-white-95"
          style={{ textShadow: '0 0 40px rgba(191,64,191,0.4)' }}
        >
          {titleEn}
        </h2>
        <p
          className="ar text-3xl sm:text-4xl font-bold mt-2"
          style={{ color: '#d966d9', textShadow: '0 0 20px rgba(217,102,217,0.3)' }}
        >
          {titleAr}
        </p>
        <div
          className="w-20 sm:w-28 h-[1px] mx-auto mt-4"
          style={{ background: 'linear-gradient(90deg, transparent, #bf40bf, transparent)' }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN STORE SECTION
   ═══════════════════════════════════════════════════ */
export default function ProductStore() {
  const { products, siteTexts } = useAdmin();
  const [detailProduct, setDetailProduct] = useState(null);

  const productsBoys = useMemo(() => products.filter(p => p.gender === 'boys' && p.inStock !== false), [products]);
  const productsGirls = useMemo(() => products.filter(p => p.gender === 'girls' && p.inStock !== false), [products]);

  const handleOpenDetail = useCallback((product) => {
    setDetailProduct(product);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailProduct(null);
  }, []);

  return (
    <section id="store" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-5 md:px-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto overflow-x-hidden">
        {/* Section header */}
        <div className="relative z-10 text-center mb-10 sm:mb-12 md:mb-14">
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium mb-1" style={{ color: '#bf40bf' }}>
            ★ VIP Holopreview Collection / مجموعة VIP الحصرية ★
          </p>

          <h2 className="font-heading text-xl sm:text-2xl md:text-5xl font-bold tracking-wider text-white-95 mt-2">
            {siteTexts?.storeTitle || 'All Products'}
          </h2>

          <p className="text-sm md:text-lg ar mt-1" style={{ color: '#99999f' }}>
            {siteTexts?.storeTitleAr || 'جميع المنتجات'}
          </p>

          <div
            className="w-12 sm:w-16 md:w-20 h-[1px] mx-auto mt-3 sm:mt-4"
            style={{ background: 'linear-gradient(90deg, transparent, #bf40bf, transparent)' }}
          />

          <p className="text-xs sm:text-sm mt-3 sm:mt-4" style={{ color: '#99999f' }}>
            <span className="text-[10px] sm:text-[11px] inline-block" style={{ color: '#99999f' }}>
              اضغط على أي منتج لبدء الطلب · Tap any product to order
            </span>
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 md:gap-5">
          {/* Boys Section Banner */}
          <SectionBanner
            id="boys-section"
            titleEn={siteTexts?.boysSectionEn || 'BOYS COLLECTION'}
            titleAr={siteTexts?.boysSectionAr || 'قسم الولاد'}
            subtitle="★ Section 1 ★"
          />

          {/* Boys products */}
          {productsBoys.map((product) => (
            <LightCard
              key={product.id}
              product={product}
              onOpenDetail={handleOpenDetail}
              buyButtonText={siteTexts?.buyButton}
            />
          ))}

          {/* Girls Section Banner */}
          <SectionBanner
            id="girls-section"
            titleEn={siteTexts?.girlsSectionEn || 'GIRLS COLLECTION'}
            titleAr={siteTexts?.girlsSectionAr || 'قسم البنات'}
            subtitle="★ Section 2 ★"
          />

          {/* Girls products */}
          {productsGirls.map((product) => (
            <LightCard
              key={product.id}
              product={product}
              onOpenDetail={handleOpenDetail}
              buyButtonText={siteTexts?.buyButton}
            />
          ))}
        </div>
      </div>

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          onClose={handleCloseDetail}
        />
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}
      </style>
    </section>
  );
}
