import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

// WhatsApp Icon SVG
const WhatsAppIcon = ({ size = 20 }) => (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const navLinks = [
    { path: '/', labelEn: 'HOME', labelAr: 'الرئيسية' },
    { path: '/men', labelEn: 'MEN', labelAr: 'رجالي' },
    { path: '/women', labelEn: 'WOMEN', labelAr: 'نسائي' },
    { path: '/checkout', labelEn: 'CHECKOUT', labelAr: 'الدفع' }
];

export default function Header({ cartCount = 0, onCartClick }) {
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [isPulsing, setIsPulsing] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsPulsing(true);
            setTimeout(() => setIsPulsing(false), 500);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed top-0 left-0 right-0 z-[100]"
            style={{
                background: scrolled
                    ? 'rgba(0, 0, 0, 0.85)'
                    : 'rgba(0, 0, 0, 0.5)',
                backdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
                WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(10px)',
                borderBottom: scrolled
                    ? '1px solid rgba(168, 85, 247, 0.2)'
                    : '1px solid transparent',
                boxShadow: scrolled
                    ? '0 10px 40px rgba(0, 0, 0, 0.5)'
                    : 'none',
                transition: 'all 0.3s ease'
            }}
        >
            <div className="max-w-[2000px] mx-auto px-4 lg:px-8">
                <div className="flex items-center justify-between h-20 lg:h-24">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <motion.div
                            className="relative"
                            animate={isPulsing ? {
                                textShadow: [
                                    '0 0 10px rgba(168, 85, 247, 0.5)',
                                    '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)',
                                    '0 0 10px rgba(168, 85, 247, 0.5)'
                                ]
                            } : {}}
                            transition={{ duration: 0.5 }}
                        >
                            <span
                                className="text-3xl lg:text-4xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#D8B4FE] to-[#A855F7]"
                                style={{
                                    textShadow: isPulsing
                                        ? '0 0 40px rgba(168, 85, 247, 0.8), 0 0 80px rgba(168, 85, 247, 0.4)'
                                        : '0 0 20px rgba(168, 85, 247, 0.4)'
                                }}
                            >
                                VIP
                            </span>
                        </motion.div>
                    </Link>

                    {/* Centered Navigation */}
                    <nav className="hidden md:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.path;
                            return (
                                <Link key={link.path} to={link.path}>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-4 lg:px-6 py-3 rounded-xl font-bold text-sm transition-all ${isActive
                                                ? 'bg-[#A855F7]/20 border border-[#A855F7]/50'
                                                : 'hover:bg-white/5'
                                            }`}
                                        style={{
                                            boxShadow: isActive
                                                ? '0 0 20px rgba(168, 85, 247, 0.4), inset 0 0 15px rgba(168, 85, 247, 0.1)'
                                                : 'none'
                                        }}
                                    >
                                        <span className="text-white">{link.labelEn}</span>
                                        <span className="text-[#D8B4FE] ml-1">| {link.labelAr}</span>
                                    </motion.div>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right Side - WhatsApp + Cart */}
                    <div className="flex items-center gap-3">
                        {/* WhatsApp Icon */}
                        <motion.a
                            href="https://wa.me/201006527185"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-3 lg:p-4 bg-white/5 border border-[#A855F7]/30 rounded-xl text-[#A855F7] hover:bg-[#A855F7]/20 transition-all"
                            style={{
                                boxShadow: '0 0 15px rgba(168, 85, 247, 0.2)'
                            }}
                        >
                            <WhatsAppIcon size={20} />
                        </motion.a>

                        {/* Cart Button */}
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={onCartClick}
                            className="relative p-3 lg:p-4 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl"
                            style={{
                                boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)'
                            }}
                        >
                            <ShoppingCart size={20} className="text-white" />
                            {cartCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-2 -right-2 w-6 h-6 bg-white text-[#A855F7] text-xs font-black rounded-full flex items-center justify-center"
                                >
                                    {cartCount}
                                </motion.span>
                            )}
                        </motion.button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="md:hidden flex items-center justify-center gap-2 pb-4 overflow-x-auto">
                    {navLinks.map((link) => {
                        const isActive = location.pathname === link.path;
                        return (
                            <Link key={link.path} to={link.path}>
                                <div
                                    className={`px-4 py-2 rounded-lg text-xs font-bold whitespace-nowrap ${isActive
                                            ? 'bg-[#A855F7]/20 border border-[#A855F7]/50'
                                            : 'bg-white/5'
                                        }`}
                                >
                                    <span className="text-white">{link.labelEn}</span>
                                    <span className="text-[#D8B4FE] ml-1">| {link.labelAr}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </motion.header>
    );
}
