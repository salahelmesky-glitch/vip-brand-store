import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const WHATSAPP_NUMBER = '201006527185';
const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`;

const socialLinks = [
  {
    name: 'TikTok',
    url: 'https://tiktok.com/@vip0.4',
    icon: 'M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z',
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/vipjs.js19?igsh=MTBwdG9hOTBhY2Mx',
    icon: 'M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2zm-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6zm9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6z',
  },
  {
    name: 'WhatsApp',
    url: WHATSAPP_LINK,
    icon: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z',
  },
];

const footerLinks = {
  'Shop / تسوق': [
    { label: 'Boys / الولاد', href: '#boys-section' },
    { label: 'Girls / البنات', href: '#girls-section' },
    { label: 'All Products / جميع المنتجات', href: '#store' },
  ],
  'Support / الدعم': [
    { label: 'Size Guide / دليل المقاسات', href: '#' },
    { label: 'Shipping / الشحن', href: '#' },
    { label: 'FAQ / أسئلة شائعة', href: '#' },
  ],
};

export default function Footer() {
  const [contactOpen, setContactOpen] = useState(false);
  const navigate = useNavigate();
  const clickCount = useRef(0);
  const clickTimer = useRef(null);

  const handleSecretAdmin = useCallback(() => {
    clickCount.current += 1;
    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 1200);
    }
    if (clickCount.current >= 3) {
      clearTimeout(clickTimer.current);
      clickCount.current = 0;
      navigate('/admin');
    }
  }, [navigate]);

  return (
    <>
      <footer id="contact" className="relative pt-16 md:pt-20 pb-6 md:pb-8 px-4 md:px-6 border-t border-white-60/5 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-12 md:mb-16">

            {/* ─── About Us / من نحن ─── */}
            <div id="about" className="sm:col-span-2">
              <div className="flex items-center gap-2 mb-4 md:mb-5">
                <div
                  className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center glow-holo"
                  style={{ background: 'linear-gradient(135deg, #bf40bf, #7b2fff)' }}
                >
                  <span className="font-heading text-[10px] md:text-xs font-black text-white tracking-widest">V</span>
                </div>
                <span className="font-heading text-base md:text-lg font-bold tracking-[0.25em] text-white-95">VIP</span>
              </div>

              <p className="text-xs md:text-sm text-white-60 leading-relaxed max-w-sm mb-2 ar" dir="rtl">
                نحن VIP Brand، براند مصري طالع من قلب محافظة كفر الشيخ، بنقدم أحدث صيحات الـ Streetwear بجودة عالمية وتصاميم مستقبلية.
              </p>
              <p className="text-[11px] md:text-xs text-white-60/70 leading-relaxed max-w-sm mb-5">
                We are VIP Brand — Egyptian streetwear from the heart of Kafr El-Sheikh, delivering world-class quality and futuristic designs.
              </p>

              {/* Social Links */}
              <div className="flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="group flex items-center gap-2 px-3 py-2 rounded-full glass hover:border-holo/30 transition-all duration-300"
                    style={{ border: '1px solid rgba(191,64,191,0.1)' }}
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white-60 group-hover:text-holo transition-colors duration-300">
                      <path d={social.icon} />
                    </svg>
                    <span className="text-[10px] sm:text-xs text-white-60 group-hover:text-holo font-medium tracking-wider transition-colors duration-300">
                      {social.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* ─── Footer Links ─── */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-heading text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-white-95 mb-4 md:mb-5">
                  {title}
                </h4>
                <ul className="space-y-2.5 md:space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-xs md:text-sm text-white-60 hover:text-holo transition-colors duration-300">
                        {link.label}
                      </a>
                    </li>
                  ))}
                  {/* Contact button in Support column */}
                  {title.includes('Support') && (
                    <li>
                      <button
                        onClick={() => setContactOpen(true)}
                        className="text-xs md:text-sm text-holo hover:text-holo-bright transition-colors duration-300 cursor-pointer"
                      >
                        Contact / تواصل 📞
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white-60/5 pt-5 md:pt-6 flex flex-col md:flex-row items-center justify-between gap-3 md:gap-4">
            <p className="text-[10px] md:text-xs text-white-60/60 tracking-wider">
              © 2026 VIP Brand. All rights reserved. / جميع الحقوق محفوظة.
            </p>
            {/* Secret admin access — triple click the dot */}
            <button
              onClick={handleSecretAdmin}
              aria-hidden="true"
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: 'rgba(153,153,159,0.15)',
                border: 'none', cursor: 'default',
                padding: 0, marginLeft: 4,
                outline: 'none',
                transition: 'none',
                flexShrink: 0,
              }}
            />
            <div className="flex gap-4 md:gap-6">
              {['Privacy / الخصوصية', 'Terms / الشروط'].map((item) => (
                <a key={item} href="#" className="text-[10px] md:text-xs text-white-60/60 hover:text-white-60 transition-colors duration-300 tracking-wider">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>

      {/* ═══ Contact Modal ═══ */}
      <AnimatePresence>
        {contactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setContactOpen(false)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm" />

            {/* Modal card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl p-6 sm:p-8 text-center overflow-hidden"
              style={{
                background: 'rgba(17, 17, 24, 0.95)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(191,64,191,0.2)',
                boxShadow: '0 0 60px rgba(191,64,191,0.15), 0 25px 80px rgba(0,0,0,0.6)',
              }}
            >
              {/* Close button */}
              <button
                onClick={() => setContactOpen(false)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-white-60 hover:text-white-95 hover:bg-white-60/10 transition-all duration-300"
              >
                ✕
              </button>

              {/* Glow */}
              <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[250px] h-[150px] rounded-full blur-[80px]" style={{ background: 'rgba(191,64,191,0.12)' }} />

              <div className="relative z-10">
                <h3 className="font-heading text-lg sm:text-xl font-bold tracking-wider text-white-95 mb-1">
                  Contact Us
                </h3>
                <p className="ar text-base sm:text-lg text-holo font-semibold mb-5">
                  للتواصل والطلب
                </p>

                {/* Phone number */}
                <div
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: 'rgba(191,64,191,0.06)',
                    border: '1px solid rgba(191,64,191,0.12)',
                  }}
                >
                  <p className="text-[10px] tracking-widest uppercase text-white-60 mb-1">Phone / رقمنا</p>
                  <p className="font-heading text-xl sm:text-2xl font-bold text-holo-bright holo-text-glow tracking-widest" dir="ltr">
                    01006527185
                  </p>
                </div>

                {/* WhatsApp button */}
                <a
                  href={`${WHATSAPP_LINK}?text=${encodeURIComponent('مرحباً VIP! أحتاج مساعدة / Hi VIP! I need help')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-white text-sm font-bold tracking-widest uppercase transition-all duration-400 hover:shadow-[0_0_30px_rgba(37,211,102,0.4)]"
                  style={{ background: '#25D366' }}
                >
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
