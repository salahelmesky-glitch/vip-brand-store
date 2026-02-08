import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageCircle, Instagram, Facebook, Twitter, Send, Mail, MapPin, Phone, Youtube, Linkedin } from 'lucide-react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const whatsappNumber = "201006527185";

    const handleSubscribe = (e) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail('');
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const footerLinks = {
        shop: [
            { labelEn: 'Home', labelAr: 'الرئيسية', path: '/' },
            { labelEn: 'Men', labelAr: 'رجالي', path: '/men' },
            { labelEn: 'Women', labelAr: 'نسائي', path: '/women' },
            { labelEn: 'New Arrivals', labelAr: 'وصل حديثاً', path: '/men' }
        ],
        support: [
            { labelEn: 'Contact Us', labelAr: 'تواصل معنا', path: '#' },
            { labelEn: 'FAQ', labelAr: 'الأسئلة الشائعة', path: '#' },
            { labelEn: 'Shipping', labelAr: 'الشحن والتوصيل', path: '#' },
            { labelEn: 'Returns', labelAr: 'سياسة الإرجاع', path: '#' }
        ]
    };

    const socialLinks = [
        { icon: Instagram, href: '#', label: 'Instagram' },
        { icon: Facebook, href: '#', label: 'Facebook' },
        { icon: Twitter, href: '#', label: 'Twitter' },
        { icon: Youtube, href: '#', label: 'Youtube' },
        { icon: Linkedin, href: '#', label: 'LinkedIn' }
    ];

    return (
        <footer className="bg-[#050505] border-t border-[#A855F7]/20 relative z-10">
            {/* Large Footer Content */}
            <div className="ultra-wide py-20 lg:py-28">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

                    {/* Brand Column - Larger */}
                    <div className="lg:col-span-2">
                        <Link to="/">
                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#A855F7] to-[#7C3AED] p-[3px] mb-8 inline-block"
                                style={{ boxShadow: '0 0 40px rgba(168,85,247,0.4)' }}>
                                <div className="w-full h-full rounded-2xl bg-[#0A0A0A] flex items-center justify-center">
                                    <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D8B4FE] to-[#A855F7]">
                                        VIP
                                    </span>
                                </div>
                            </div>
                        </Link>

                        {/* Bilingual Tagline */}
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="text-white">Exclusive VIP </span>
                            <span className="text-[#D8B4FE]">| ڤي آي بي حصري</span>
                        </h3>

                        <p className="text-white/60 mb-4 leading-relaxed max-w-md">
                            Your premier destination for luxury fashion. We bring you the finest global brands at exclusive prices.
                        </p>
                        <p className="text-[#D8B4FE]/80 mb-8 leading-relaxed max-w-md" style={{ fontFamily: 'Cairo, sans-serif' }}>
                            الوجهة الأولى للأزياء الفاخرة. نقدم أفضل الماركات العالمية بأسعار حصرية.
                        </p>

                        {/* Contact Info - Bilingual */}
                        <div className="space-y-4">
                            <a href={`https://wa.me/${whatsappNumber}`}
                                className="flex items-center gap-4 text-white/70 hover:text-[#A855F7] transition-colors group">
                                <div className="p-3 bg-[#A855F7]/10 rounded-xl group-hover:bg-[#A855F7]/20 transition-all">
                                    <Phone size={20} className="text-[#A855F7]" />
                                </div>
                                <div>
                                    <span className="block text-lg font-bold text-white">01006527185</span>
                                    <span className="text-sm">
                                        <span className="text-white/50">WhatsApp </span>
                                        <span className="text-[#D8B4FE]/50">| واتساب</span>
                                    </span>
                                </div>
                            </a>
                            <div className="flex items-center gap-4 text-white/70">
                                <div className="p-3 bg-[#A855F7]/10 rounded-xl">
                                    <MapPin size={20} className="text-[#A855F7]" />
                                </div>
                                <div>
                                    <span className="block text-lg font-bold text-white">Egypt</span>
                                    <span className="text-sm">
                                        <span className="text-white/50">Location </span>
                                        <span className="text-[#D8B4FE]/50">| الموقع: مصر</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shop Links - Bilingual */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">
                            <span className="text-white">Shop </span>
                            <span className="text-[#D8B4FE]">| تسوق</span>
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.shop.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                                    >
                                        <span>{link.labelEn}</span>
                                        <span className="text-[#D8B4FE]/50 group-hover:text-[#D8B4FE]">| {link.labelAr}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links - Bilingual */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">
                            <span className="text-white">Support </span>
                            <span className="text-[#D8B4FE]">| الدعم</span>
                        </h4>
                        <ul className="space-y-4">
                            {footerLinks.support.map((link, i) => (
                                <li key={i}>
                                    <Link
                                        to={link.path}
                                        className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                                    >
                                        <span>{link.labelEn}</span>
                                        <span className="text-[#D8B4FE]/50 group-hover:text-[#D8B4FE]">| {link.labelAr}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter & Social Column */}
                    <div>
                        <h4 className="text-xl font-bold mb-6">
                            <span className="text-white">Newsletter </span>
                            <span className="text-[#D8B4FE]">| النشرة البريدية</span>
                        </h4>
                        <p className="text-white/50 mb-6 text-sm">
                            Subscribe for exclusive offers | اشترك للعروض الحصرية
                        </p>

                        <form onSubmit={handleSubscribe} className="mb-8">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email | البريد الإلكتروني"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-[#A855F7] transition-all"
                                    />
                                </div>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168,85,247,0.5)' }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-3 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl"
                                >
                                    <Send size={18} className="text-white" />
                                </motion.button>
                            </div>
                            {subscribed && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-green-400 text-sm mt-2"
                                >
                                    Subscribed! | تم الاشتراك!
                                </motion.p>
                            )}
                        </form>

                        {/* Large Social Icons */}
                        <h5 className="text-sm font-bold text-white/70 mb-4">
                            Follow Us | تابعنا
                        </h5>
                        <div className="flex flex-wrap items-center gap-3">
                            {socialLinks.map((social, i) => (
                                <motion.a
                                    key={i}
                                    href={social.href}
                                    whileHover={{
                                        scale: 1.15,
                                        y: -3,
                                        boxShadow: '0 0 25px rgba(168,85,247,0.5)'
                                    }}
                                    className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-[#A855F7]/50 hover:bg-[#A855F7]/10 transition-all"
                                >
                                    <social.icon size={22} className="text-white/70 hover:text-[#A855F7]" />
                                </motion.a>
                            ))}
                            <motion.a
                                href={`https://wa.me/${whatsappNumber}`}
                                whileHover={{
                                    scale: 1.15,
                                    y: -3,
                                    boxShadow: '0 0 25px rgba(34,197,94,0.5)'
                                }}
                                className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl hover:bg-green-500/30 transition-all"
                            >
                                <MessageCircle size={22} className="text-green-400" />
                            </motion.a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 py-8">
                <div className="ultra-wide flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-white/40 text-sm">
                        © 2026 VIP. All rights reserved | جميع الحقوق محفوظة
                    </p>
                    <p className="text-sm">
                        <span className="text-white/40">DESIGNED FOR THE TOP 1% </span>
                        <span className="text-[#D8B4FE]/40">| مصمم لأفضل 1%</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
