import { useRef, useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAdmin } from '../context/AdminContext';

/* ─── Helpers ─── */
const toAr = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

const WHATSAPP = '201006527185';
const SIZES = ['M', 'L', 'XL', '2XL'];

/* WhatsApp SVG path (reused) */
const WA_ICON = 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z';

/* ═══════════════════════════════════════════════════
   PRODUCT DETAIL MODAL — lightweight
   ═══════════════════════════════════════════════════ */
function ProductDetailModal({ product, onClose }) {
  const [selectedSize, setSelectedSize] = useState('L');

  if (!product) return null;

  const waText = encodeURIComponent(
    `أهلاً VIP، حابب أطلب ${product.name} مقاس ${selectedSize}\n` +
    `📸 الصورة: ${window.location.origin}/images/${product.id}.jpg`
  );
  const waLink = `https://wa.me/${WHATSAPP}?text=${waText}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      style={{ background: 'rgba(5,5,5,0.92)' }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl overflow-hidden"
        style={{
          background: '#0c0c12',
          border: '1px solid rgba(191,64,191,0.2)',
          boxShadow: '0 0 60px rgba(191,64,191,0.1)',
          animation: 'modalIn 0.25s ease-out',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full flex items-center justify-center text-white text-lg"
          style={{ background: 'rgba(0,0,0,0.5)' }}
        >
          ✕
        </button>

        {/* Product image */}
        <div className="relative w-full" style={{ aspectRatio: '1 / 1', background: 'linear-gradient(135deg, #0c0c12, #1a0b2e)' }}>
          <img
            src={product.img}
            alt={product.name}
            className="w-full h-full"
            style={{ objectFit: 'contain' }}
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        </div>

        {/* Product info */}
        <div className="p-5 sm:p-6">
          <h2
            className="text-center"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: '20px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              color: '#f2f2f7',
            }}
          >
            {product.name}
          </h2>

          <p
            className="text-center"
            style={{
              fontFamily: 'Montserrat, Inter, sans-serif',
              fontSize: '22px',
              fontWeight: '700',
              color: '#bc13fe',
              marginTop: '10px',
            }}
          >
            {product.price || 500} EGP
          </p>

          {/* Size selector */}
          <div style={{ marginTop: '15px' }}>
            <p
              className="text-center"
              style={{
                fontSize: '10px',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#99999f',
                fontWeight: '500',
                marginBottom: '12px',
              }}
            >
              SELECT SIZE
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '13px' }}>
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    border: selectedSize === size ? '2px solid #d966d9' : '2px solid rgba(217,102,217,0.3)',
                    background: selectedSize === size ? 'rgba(217,102,217,0.15)' : 'transparent',
                    color: selectedSize === size ? '#ffffff' : 'rgba(255,255,255,0.6)',
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '13px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp Order button */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: '100%',
              padding: '14px 0',
              marginTop: '20px',
              borderRadius: '9999px',
              background: '#25D366',
              color: '#ffffff',
              fontFamily: 'Montserrat, Inter, sans-serif',
              fontSize: '13px',
              fontWeight: '700',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              textDecoration: 'none',
            }}
          >
            <svg viewBox="0 0 24 24" fill="white" style={{ width: '18px', height: '18px' }}>
              <path d={WA_ICON} />
            </svg>
            اطلب الآن / ORDER NOW
          </a>

          <p
            className="ar"
            style={{
              fontSize: '9px',
              color: 'rgba(153,153,159,0.5)',
              textAlign: 'center',
              marginTop: '8px',
            }}
          >
            سيتم فتح واتساب · مقاس {selectedSize}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LIGHTWEIGHT PRODUCT CARD — no framer-motion per card
   ═══════════════════════════════════════════════════ */
function LightCard({ product, onOpenDetail }) {
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
            <span className="text-sm font-bold mt-1" style={{ color: '#bc13fe' }}>{product.price || 500} EGP</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '10px 8px', textAlign: 'center' }}>
        <p style={{ fontSize: '14px', fontWeight: '500', color: 'rgba(242,242,247,0.9)', margin: '0 0 5px 0', fontFamily: 'Montserrat, Inter, sans-serif' }}>
          {product.name}
        </p>
        <p style={{ fontSize: '13px', fontWeight: '700', color: '#bc13fe', margin: 0, fontFamily: 'Montserrat, Inter, sans-serif' }}>
          {product.price || 500} EGP
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   SECTION BANNERS — CSS only, no framer-motion
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
  const { products } = useAdmin();
  const [detailProduct, setDetailProduct] = useState(null);

  const productsBoys = useMemo(() => products.filter(p => p.gender === 'boys' && p.inStock !== false), [products]);
  const productsGirls = useMemo(() => products.filter(p => p.gender === 'girls' && p.inStock !== false), [products]);

  /* Compute display price dynamically from actual product data */
  const displayPrice = useMemo(() => {
    if (!products || products.length === 0) return 500;
    // Find the most common price
    const freq = {};
    products.forEach(p => { freq[p.price] = (freq[p.price] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    return Number(sorted[0][0]);
  }, [products]);

  const displayPriceAr = useMemo(() => toAr(displayPrice), [displayPrice]);

  const handleOpenDetail = useCallback((product) => {
    setDetailProduct(product);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setDetailProduct(null);
  }, []);

  return (
    <section id="store" className="relative py-12 sm:py-16 md:py-24 px-4 sm:px-5 md:px-6 overflow-x-hidden">
      <div className="max-w-7xl mx-auto overflow-x-hidden">
        {/* Section header — CSS only */}
        <div className="relative z-10 text-center mb-10 sm:mb-12 md:mb-14">
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-medium mb-1" style={{ color: '#bf40bf' }}>
            ★ VIP Holopreview Collection / مجموعة VIP الحصرية ★
          </p>

          <h2 className="font-heading text-xl sm:text-2xl md:text-5xl font-bold tracking-wider text-white-95 mt-2">
            All Products
          </h2>

          <p className="text-sm md:text-lg ar mt-1" style={{ color: '#99999f' }}>
            جميع المنتجات
          </p>

          <div
            className="w-12 sm:w-16 md:w-20 h-[1px] mx-auto mt-3 sm:mt-4"
            style={{ background: 'linear-gradient(90deg, transparent, #bf40bf, transparent)' }}
          />

          <p className="text-xs sm:text-sm mt-3 sm:mt-4" style={{ color: '#99999f' }}>
            All items —{' '}
            <span className="font-heading font-bold" style={{ color: '#bf40bf' }}>{displayPrice} EGP</span>{' '}
            <span className="ar">| {displayPriceAr} جنية</span>
            <br />
            <span className="text-[10px] sm:text-[11px] mt-1 inline-block" style={{ color: '#99999f' }}>
              Tap any product to view details · Select size · Order via WhatsApp
            </span>
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 md:gap-5">
          {/* Boys Section Banner */}
          <SectionBanner
            id="boys-section"
            titleEn="BOYS COLLECTION"
            titleAr="قسم الولاد"
            subtitle="★ Section 1 ★"
          />

          {/* Boys products (1-50) */}
          {productsBoys.map((product) => (
            <LightCard
              key={product.id}
              product={product}
              onOpenDetail={handleOpenDetail}
            />
          ))}

          {/* Girls Section Banner */}
          <SectionBanner
            id="girls-section"
            titleEn="GIRLS COLLECTION"
            titleAr="قسم البنات"
            subtitle="★ Section 2 ★"
          />

          {/* Girls products (51-100) */}
          {productsGirls.map((product) => (
            <LightCard
              key={product.id}
              product={product}
              onOpenDetail={handleOpenDetail}
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
      `}</style>
    </section>
  );
}
