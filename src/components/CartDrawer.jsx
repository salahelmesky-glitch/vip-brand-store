import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';

export default function CartDrawer({ cart = [], setCart, isOpen, onClose }) {
    const updateQuantity = (id, delta) => {
        setCart(prev => prev
            .map(item => item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item)
            .filter(item => item.quantity > 0)
        );
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-[#0A0A0A] border-l border-[#A855F7]/20 z-[250] flex flex-col"
                        style={{
                            boxShadow: '-20px 0 60px rgba(168,85,247,0.15)'
                        }}
                    >
                        {/* Header - Bilingual */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <h2 className="font-bold text-xl flex items-center gap-3">
                                <ShoppingCart size={22} className="text-[#A855F7]" />
                                <span className="text-white">Cart </span>
                                <span className="text-[#D8B4FE]">| السلة</span>
                                <span className="text-white/60 text-sm">({cartCount})</span>
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg"
                            >
                                <X size={22} className="text-white" />
                            </motion.button>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {cart.length === 0 ? (
                                <div className="text-center py-20">
                                    <ShoppingCart size={64} className="mx-auto mb-4 text-white/20" />
                                    <p className="text-white/40">Cart is empty | السلة فارغة</p>
                                </div>
                            ) : (
                                cart.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 100 }}
                                        className="flex gap-4 bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
                                    >
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-20 h-24 object-cover rounded-xl"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-bold text-white truncate">{item.name}</h3>
                                            <p className="text-xs text-[#A855F7] mb-2">VIP Exclusive | قطعة حصرية</p>
                                            <p className="text-white font-bold text-lg">
                                                {item.price.toLocaleString()} EGP
                                            </p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="p-2 bg-[#A855F7]/20 rounded-lg text-[#A855F7] hover:bg-[#A855F7]/30"
                                                >
                                                    <Minus size={14} />
                                                </motion.button>
                                                <span className="font-bold w-8 text-center text-white">{item.quantity}</span>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="p-2 bg-[#A855F7]/20 rounded-lg text-[#A855F7] hover:bg-[#A855F7]/30"
                                                >
                                                    <Plus size={14} />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="ml-auto text-red-400 hover:text-red-500"
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer - Bilingual */}
                        {cart.length > 0 && (
                            <div className="p-6 border-t border-white/10 space-y-4 bg-black/50">
                                <div className="flex justify-between text-xl font-bold">
                                    <span>
                                        <span className="text-white">Total </span>
                                        <span className="text-[#D8B4FE]">| المجموع</span>
                                    </span>
                                    <span className="text-[#A855F7]">{cartTotal.toLocaleString()} EGP</span>
                                </div>
                                <Link to="/checkout" onClick={onClose}>
                                    <motion.button
                                        whileHover={{ scale: 1.02, boxShadow: '0 0 40px rgba(168,85,247,0.5)' }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-5 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl font-bold text-lg text-white flex items-center justify-center gap-3"
                                        style={{
                                            boxShadow: '0 0 30px rgba(168,85,247,0.4)'
                                        }}
                                    >
                                        Checkout | الدفع <ArrowRight size={20} />
                                    </motion.button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
