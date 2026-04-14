import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── 6 T-Shirts — fixed 500 EGP ─── */
const tshirts = [
  { id: 1, name: 'Obsidian VIP Tee', nameAr: 'تيشيرت أوبسيديان VIP', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=600&fit=crop' },
  { id: 2, name: 'Neon Circuit Tee', nameAr: 'تيشيرت نيون سيركت', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=500&h=600&fit=crop' },
  { id: 3, name: 'Midnight Stealth Tee', nameAr: 'تيشيرت ميدنايت ستيلث', img: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=500&h=600&fit=crop' },
  { id: 4, name: 'Eclipse Core Tee', nameAr: 'تيشيرت إكليبس كور', img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=500&h=600&fit=crop' },
  { id: 5, name: 'Phantom Edge Tee', nameAr: 'تيشيرت فانتوم إيدج', img: 'https://images.unsplash.com/photo-1554568218-0f1715e72254?w=500&h=600&fit=crop' },
  { id: 6, name: 'Void Luxe Tee', nameAr: 'تيشيرت فويد لوكس', img: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=500&h=600&fit=crop' },
];

const PRICE = 500;
const MESSENGER_LINK = 'https://m.me/VIPBrandStore'; // Replace with actual page
const TELEGRAM_LINK = 'https://t.me/VIPBrandStore'; // Replace with actual bot/user

function Modal({ product, onClose }) {
  if (!product) return null;

  const message = encodeURIComponent(`أريد الاستفسار عن تيشيرت ${product.nameAr} - ${PRICE} EGP`);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="glass rounded-2xl overflow-hidden max-w-sm w-full border-cyan/20"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Product Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent" />
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full glass flex items-center justify-center text-white-60 hover:text-white-95 hover:border-cyan/40 transition-all duration-300"
          >
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-base font-semibold text-white-95 tracking-wider">{product.name}</h3>
            <p className="text-sm text-white-60 ar mt-0.5">{product.nameAr}</p>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-heading font-bold text-cyan text-glow-cyan">500 EGP</span>
            <span className="text-sm text-white-60 ar">٥٠٠ ج.م</span>
          </div>

          {/* Contact Buttons — Messenger & Telegram */}
          <div className="flex flex-col gap-2.5 pt-1">
            {/* Messenger */}
            <a
              href={`${MESSENGER_LINK}?ref=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-white text-sm font-semibold tracking-wider transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #00B2FF, #006AFF)' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.2 5.42 3.15 7.25a.71.71 0 01.23.52l.05 1.68a.71.71 0 001 .63l1.88-.83a.71.71 0 01.48-.03c.9.25 1.87.38 2.89.38h.32C17.64 21.3 22 17.17 22 11.7S17.64 2 12 2zm5.83 7.73l-2.87 4.55a1.5 1.5 0 01-2.17.4l-2.28-1.71a.6.6 0 00-.72 0l-3.08 2.34a.47.47 0 01-.68-.63l2.87-4.55a1.5 1.5 0 012.17-.4l2.28 1.71a.6.6 0 00.72 0l3.08-2.34a.47.47 0 01.68.63z"/>
              </svg>
              <span>Messenger / ماسنجر</span>
            </a>

            {/* Telegram */}
            <a
              href={`${TELEGRAM_LINK}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2.5 w-full py-3 rounded-xl text-white text-sm font-semibold tracking-wider transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #2AABEE, #229ED9)' }}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0h-.056zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              <span>Telegram / تيليجرام</span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function TshirtStore() {
  const [selected, setSelected] = useState(null);

  return (
    <section id="tshirts" className="relative py-20 md:py-28 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase text-cyan font-medium mb-1 text-glow-cyan">
            Featured Collection / مجموعة مميزة
          </p>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold tracking-wider text-white-95 mt-2">
            VIP T-Shirts
          </h2>
          <p className="text-lg md:text-xl ar text-white-60 mt-1">تيشيرتات VIP</p>
          <div className="w-16 md:w-20 h-[1px] bg-gradient-to-r from-transparent via-cyan to-transparent mx-auto mt-4" />
          <p className="text-sm text-white-60 mt-4">
            All items — <span className="text-cyan font-heading font-bold">500 EGP</span>{' '}
            <span className="ar text-white-60">/ ٥٠٠ ج.م للقطعة</span>
          </p>
        </motion.div>

        {/* Grid — 2 cols mobile, 3 cols desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {tshirts.map((shirt, i) => (
            <motion.div
              key={shirt.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, transition: { duration: 0.25 } }}
              onClick={() => setSelected(shirt)}
              className="group rounded-2xl overflow-hidden glass hover:border-cyan/30 transition-all duration-500 cursor-pointer"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={shirt.img}
                  alt={shirt.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500" />
                {/* Tap hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-400">
                  <span className="px-4 py-2 rounded-full glass text-[10px] font-semibold tracking-widest uppercase text-cyan border-cyan/30">
                    View / عرض
                  </span>
                </div>
              </div>
              <div className="p-3 md:p-4">
                <h3 className="text-xs sm:text-sm font-semibold text-white-95 truncate group-hover:text-cyan transition-colors duration-300">
                  {shirt.name}
                </h3>
                <p className="text-[10px] sm:text-[11px] text-white-60 ar truncate">{shirt.nameAr}</p>
                <p className="text-sm font-heading font-bold text-cyan mt-1 text-glow-cyan">
                  500 EGP <span className="text-[11px] text-white-60 ar font-normal">/ ٥٠٠ ج.م</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && <Modal product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </section>
  );
}
