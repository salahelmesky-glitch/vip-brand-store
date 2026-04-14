import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import MusicControl from './MusicControl';

const navLinks = [
  { label: 'Home / الرئيسية', href: '#hero' },
  { label: 'Store / المتجر', href: '#store' },
  { label: 'About / من نحن', href: '#about' },
  { label: 'Contact / تواصل', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'glass py-2 md:py-3 shadow-[0_4px_30px_rgba(191,64,191,0.06)]'
          : 'bg-transparent py-3 md:py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Brand text only — logo moved to Hero */}
        <a href="#hero" className="flex items-center gap-2 group shrink-0">
          <span className="font-heading text-base md:text-lg font-bold tracking-[0.25em] text-white-95 group-hover:text-holo transition-colors duration-300">
            VIP BRAND
          </span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="relative text-xs font-medium text-white-60 hover:text-holo transition-colors duration-300 tracking-wider group whitespace-nowrap"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-holo transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* CTA + Music + Admin */}
        <div className="hidden lg:flex items-center gap-3">
          <MusicControl />
          <Link
            to="/admin"
            title="Admin"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white-60/40 hover:text-holo hover:bg-holo/10 transition-all duration-300"
            style={{ fontSize: 14 }}
          >⚙️</Link>
          <a
            href="#store"
            className="px-5 xl:px-6 py-2.5 text-[10px] font-semibold tracking-widest uppercase rounded-full border border-holo/30 text-holo hover:bg-holo/10 hover:border-holo/60 transition-all duration-300"
          >
            Shop Now / تسوق الآن
          </a>
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <MusicControl />
          <Link
            to="/admin"
            title="Admin"
            className="w-8 h-8 rounded-full flex items-center justify-center text-white-60/40 hover:text-holo transition-all duration-300"
            style={{ fontSize: 13 }}
          >⚙️</Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2"
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-[2px] bg-white-95 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
            <span className={`block w-6 h-[2px] bg-white-95 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-[2px] bg-white-95 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 100, damping: 18 }}
          className="lg:hidden mt-2 mx-3 rounded-2xl p-5 flex flex-col gap-4"
          style={{
            background: '#0c0c12',
            border: '1px solid rgba(191, 64, 191, 0.15)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.6), 0 0 20px rgba(191,64,191,0.06)',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-sm font-semibold text-white tracking-wider hover:text-holo transition-colors duration-300"
              style={{ opacity: 1 }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#store"
            onClick={() => setMenuOpen(false)}
            className="mt-2 text-center px-6 py-2.5 text-xs font-semibold tracking-widest uppercase rounded-full border border-holo/30 text-holo hover:bg-holo/10 transition-all duration-300"
          >
            Shop Now / تسوق الآن
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
