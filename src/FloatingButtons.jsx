import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Settings, MessageCircle } from 'lucide-react';

export default function FloatingButtons({
    cartCount = 0,
    onCartClick,
    onSettingsClick,
    whatsappNumber = "201006527185"
}) {
    return (
        <div className="fixed bottom-40 right-4 lg:right-6 flex flex-col gap-3 z-[200]">
            {/* Cart FAB */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onCartClick}
                className="relative p-4 bg-gradient-to-r from-[#C9A961] to-[#B8984F] rounded-full shadow-lg hover:shadow-xl transition-all"
                style={{ boxShadow: '0 10px 40px rgba(201, 169, 97, 0.4)' }}
                title="Shopping Cart"
            >
                <ShoppingCart size={24} className="text-black" />
                {cartCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-6 h-6 bg-[#800020] text-white text-xs font-black rounded-full flex items-center justify-center border-2 border-black"
                    >
                        {cartCount > 99 ? '99+' : cartCount}
                    </motion.span>
                )}
            </motion.button>

            {/* Settings/Admin FAB */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onSettingsClick}
                className="p-4 bg-[#800020] backdrop-blur-xl border border-[#C9A961]/30 rounded-full hover:bg-[#a00028] transition-all"
                style={{ boxShadow: '0 8px 32px rgba(128, 0, 32, 0.5)' }}
                title="Admin Dashboard"
            >
                <Settings size={24} className="text-[#C9A961]" />
            </motion.button>

            {/* WhatsApp FAB */}
            <motion.a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-green-500 rounded-full shadow-lg hover:bg-green-600 transition-all relative"
                style={{ boxShadow: '0 10px 40px rgba(34, 197, 94, 0.4)' }}
                title="WhatsApp Support"
            >
                <MessageCircle size={24} className="text-white" />
                {/* Pulse Animation */}
                <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></span>
            </motion.a>
        </div>
    );
}
