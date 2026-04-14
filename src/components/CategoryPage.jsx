import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';

/* ─── Helper: Convert number to Arabic numerals ─── */
const toArabicNum = (n) =>
  String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

/* ─── Product data generators ─── */
const menNames = [
  'Obsidian Phantom Hoodie', 'Neon Edge Cargo Pants', 'Cyber Luxe Bomber', 'Eclipse Stealth Tee',
  'Midnight Apex Jacket', 'Void Runner Sneakers', 'Prism Tech Vest', 'Shadow Grid Hoodie',
  'Carbon Fiber Joggers', 'Titanium Track Jacket', 'Dark Matter Polo', 'Zero-G Windbreaker',
  'Onyx Shield Parka', 'Quantum Flex Shorts', 'Nebula Knit Sweater', 'Stealth Mode Cap',
  'Gravity Denim Jacket', 'Night Ops Henley', 'Circuit Board Tee', 'Plasma Zip-Up',
  'Infinity Loop Hoodie', 'Chrome Drift Pants', 'Photon Mesh Tank', 'Atomic Blend Shirt',
  'Fusion Core Varsity', 'Echo Chamber Coat', 'Binary Code Joggers', 'Turbo Boost Sneakers',
  'Matrix Reload Hoodie', 'Cipher Block Tee', 'Spark Plug Cargo', 'Orbit Shift Jacket',
  'Neutron Star Vest', 'Black Hole Bomber', 'Solar Flare Polo', 'Laser Cut Shorts',
  'Hex Code Sweatshirt', 'Pixel Storm Cap', 'Deep Space Parka', 'Warp Drive Henley',
  'Nano Fiber Blazer', 'Ion Pulse Tee', 'Mach Speed Pants', 'Radar Ghost Hoodie',
  'Flux Capacitor Vest', 'Delta Force Jacket', 'Omega Point Coat', 'Ultra Wave Sneakers',
  'Zenith Peak Shirt', 'Apex Protocol Hoodie',
];
const womenNames = [
  'Aurora Silk Dress', 'Velvet Noir Blazer', 'Crystal Edge Crop Top', 'Moonlight Maxi Skirt',
  'Ethereal Mesh Blouse', 'Obsidian Curve Leggings', 'Diamond Dust Jacket', 'Celestial Wrap Dress',
  'Starfall Sequin Top', 'Neon Bloom Hoodie', 'Opal Mist Cardigan', 'Midnight Rose Jumpsuit',
  'Prism Glow Pants', 'Eclipse Satin Cami', 'Binary Lace Dress', 'Quantum Crop Jacket',
  'Shadow Veil Tunic', 'Nebula Flow Skirt', 'Chrome Heart Tee', 'Plasma Wave Shorts',
  'Galaxy Drift Coat', 'Luna Phase Hoodie', 'Titanium Luxe Blazer', 'Cosmic Flare Jeans',
  'Dark Energy Vest', 'Solstice Silk Blouse', 'Void Bloom Dress', 'Neon Cascade Top',
  'Iris Beam Cardigan', 'Stardust Knit Sweater', 'Photon Pleat Skirt', 'Infinity Curve Tee',
  'Digital Rose Jumpsuit', 'Black Pearl Coat', 'Zero Gravity Pants', 'Aurora Zip Jacket',
  'Crystal Core Dress', 'Halo Effect Hoodie', 'Matrix Shine Blouse', 'Pixel Perfect Shorts',
  'Radiant Edge Blazer', 'Echo Silk Cami', 'Fusion Glow Skirt', 'Orbit Luxe Top',
  'Neuron Mesh Dress', 'Cipher Wave Leggings', 'Turbo Chic Jacket', 'Apex Bloom Vest',
  'Zenith Grace Coat', 'Omega Lux Gown',
];
const menArabicNames = [
  'هودي فانتوم الأسود', 'بنطلون كارجو نيون', 'جاكيت بومبر سايبر', 'تيشيرت إكليبس',
  'جاكيت أبيكس منتصف الليل', 'حذاء فويد رانر', 'سترة بريزم تك', 'هودي شادو جريد',
  'بنطلون جوجر كاربون', 'جاكيت تراك تيتانيوم', 'بولو دارك ماتر', 'جاكيت زيرو جي',
  'باركا أونيكس شيلد', 'شورت كوانتوم فليكس', 'سويتر نيبولا', 'كاب ستيلث مود',
  'جاكيت جينز جرافيتي', 'هينلي نايت أوبس', 'تيشيرت سيركت بورد', 'سويتشيرت بلازما',
  'هودي إنفينيتي لوب', 'بنطلون كروم دريفت', 'تانك فوتون مش', 'قميص أتوميك بليند',
  'جاكيت فيوجن كور', 'معطف إيكو تشامبر', 'جوجر باينري كود', 'حذاء تيربو بوست',
  'هودي ماتريكس ريلود', 'تيشيرت سايفر بلوك', 'كارجو سبارك بلج', 'جاكيت أوربت شيفت',
  'سترة نيوترون ستار', 'بومبر بلاك هول', 'بولو سولار فلير', 'شورت ليزر كت',
  'سويتشيرت هيكس كود', 'كاب بيكسل ستورم', 'باركا ديب سبيس', 'هينلي وارب درايف',
  'بليزر نانو فايبر', 'تيشيرت أيون بالس', 'بنطلون ماك سبيد', 'هودي رادار جوست',
  'سترة فلكس كاباسيتور', 'جاكيت دلتا فورس', 'معطف أوميجا بوينت', 'حذاء ألترا ويف',
  'قميص زينيث بيك', 'هودي أبيكس بروتوكول',
];
const womenArabicNames = [
  'فستان أورورا حريري', 'بليزر فيلفيت نوار', 'كروب توب كريستال', 'تنورة مونلايت ماكسي',
  'بلوزة إيثريال مش', 'ليجنز أوبسيديان كيرف', 'جاكيت دايموند دست', 'فستان سيليستيال راب',
  'توب ستارفول سيكوين', 'هودي نيون بلوم', 'كارديجان أوبال ميست', 'جمبسوت ميدنايت روز',
  'بنطلون بريزم جلو', 'كامي إكليبس ساتين', 'فستان باينري ليس', 'جاكيت كوانتوم كروب',
  'تونيك شادو فيل', 'تنورة نيبولا فلو', 'تيشيرت كروم هارت', 'شورت بلازما ويف',
  'معطف جالاكسي دريفت', 'هودي لونا فيز', 'بليزر تيتانيوم لوكس', 'جينز كوزميك فلير',
  'سترة دارك إنرجي', 'بلوزة سولستيس حريري', 'فستان فويد بلوم', 'توب نيون كاسكيد',
  'كارديجان آيريس بيم', 'سويتر ستاردست نت', 'تنورة فوتون بليت', 'تيشيرت إنفينيتي كيرف',
  'جمبسوت ديجيتال روز', 'معطف بلاك بيرل', 'بنطلون زيرو جرافيتي', 'جاكيت أورورا زيب',
  'فستان كريستال كور', 'هودي هالو إفكت', 'بلوزة ماتريكس شاين', 'شورت بيكسل بيرفكت',
  'بليزر راديانت إيدج', 'كامي إيكو سيلك', 'تنورة فيوجن جلو', 'توب أوربت لوكس',
  'فستان نيورون مش', 'ليجنز سايفر ويف', 'جاكيت تيربو شيك', 'سترة أبيكس بلوم',
  'معطف زينيث جريس', 'فستان سهرة أوميجا لوكس',
];

const tags = ['New', 'Hot', 'Limited', 'Exclusive', null];

const menImages = [
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?w=400&h=500&fit=crop',
];
const womenImages = [
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1502716119720-b23a1f421175?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1529898329186-ce9c52e037da?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=500&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop',
];

const generateProducts = (gender) => {
  const names = gender === 'men' ? menNames : womenNames;
  const arNames = gender === 'men' ? menArabicNames : womenArabicNames;
  const imgs = gender === 'men' ? menImages : womenImages;
  return names.map((name, i) => ({
    id: `${gender}-${i}`,
    name,
    nameAr: arNames[i],
    price: Math.floor(Math.random() * 800 + 200),
    tag: i < 12 ? tags[i % 5] : null,
    img: imgs[i % imgs.length],
  }));
};

const WHATSAPP_NUMBER = '201006527185';

/* ─── Product Card ─── */
function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-40px' });
  const [showWA, setShowWA] = useState(false);

  const waMessage = encodeURIComponent(
    `Hi! I'm interested in: ${product.name} — ${product.price} EGP\nمرحباً! أنا مهتم بـ: ${product.nameAr} — ${toArabicNum(product.price)} ج.م`
  );
  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: Math.min(index * 0.04, 0.6), ease: [0.16, 1, 0.3, 1] }}
      className="group relative rounded-2xl overflow-hidden glass hover:border-cyan/30 transition-all duration-500"
    >
      {/* Image — click to reveal WhatsApp */}
      <div
        className="relative aspect-[4/5] overflow-hidden cursor-pointer"
        onClick={() => setShowWA(!showWA)}
      >
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-60 group-hover:opacity-70 transition-opacity duration-500" />

        {/* Tag */}
        {product.tag && (
          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-widest uppercase bg-cyan/15 border border-cyan/30 text-cyan backdrop-blur-sm">
            {product.tag}
          </div>
        )}

        {/* WhatsApp overlay */}
        {showWA && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute inset-0 flex items-center justify-center bg-obsidian/70 backdrop-blur-sm"
          >
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-3 rounded-full bg-whatsapp text-white text-xs font-bold tracking-wider uppercase glow-whatsapp hover:scale-105 transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <span>Contact via WhatsApp / تواصل واتساب</span>
            </a>
          </motion.div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-xs sm:text-sm font-semibold text-white-95 tracking-wider mb-0.5 group-hover:text-cyan transition-colors duration-300 truncate">
          {product.name}
        </h3>
        <p className="text-[11px] text-white-60 ar truncate mb-1.5">{product.nameAr}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-heading font-bold text-cyan text-glow-cyan">
            {product.price} EGP
          </span>
          <span className="text-[11px] text-white-60 ar">
            {toArabicNum(product.price)} ج.م
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Category Section ─── */
export default function CategoryPage({ gender = 'men' }) {
  const products = generateProducts(gender);
  const headerRef = useRef(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-60px' });

  const isMen = gender === 'men';
  const title = isMen ? 'Men Collection' : 'Women Collection';
  const titleAr = isMen ? 'مجموعة رجالي' : 'مجموعة نسائي';
  const subtitle = isMen ? 'Summer 2026 — Men' : 'Summer 2026 — Women';
  const subtitleAr = isMen ? 'صيف ٢٠٢٦ — رجالي' : 'صيف ٢٠٢٦ — نسائي';

  return (
    <section id={gender} className="relative py-20 md:py-28 px-4 md:px-6">
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-purple/3 blur-[150px]" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-12 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-cyan font-medium mb-1"
          >
            {subtitle}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-[10px] md:text-xs tracking-wider text-white-60 ar mb-3"
          >
            {subtitleAr}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold tracking-wider text-white-95"
          >
            {title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headerInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base md:text-lg ar text-white-60 mt-1"
          >
            {titleAr}
          </motion.p>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={headerInView ? { scaleX: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="w-16 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent mx-auto mt-4"
          />
        </div>

        {/* Grid — 2 cols on mobile, 3 on tablet, 4 on desktop, 5 on wide */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-5">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
