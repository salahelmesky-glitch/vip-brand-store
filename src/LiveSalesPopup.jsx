import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, MapPin } from 'lucide-react';

const salesData = [
    { name: 'Ahmed', city: 'Cairo', product: 'VIP Leather Jacket', time: '2 mins ago' },
    { name: 'Sara', city: 'Alexandria', product: 'Luxury Silk Blouse', time: '5 mins ago' },
    { name: 'Mohamed', city: 'Giza', product: 'Premium Wool Blazer', time: '8 mins ago' },
    { name: 'Fatma', city: 'Mansoura', product: 'Designer Hoodie', time: '12 mins ago' },
    { name: 'Omar', city: 'Tanta', product: 'Cashmere Sweater', time: '15 mins ago' },
    { name: 'Nour', city: 'Aswan', product: 'Elegant Evening Gown', time: '18 mins ago' },
    { name: 'Youssef', city: 'Luxor', product: 'Italian Suit', time: '22 mins ago' },
    { name: 'Mona', city: 'Port Said', product: 'Tailored Blazer', time: '25 mins ago' },
    { name: 'Hassan', city: 'Suez', product: 'VIP Polo Collection', time: '30 mins ago' },
    { name: 'Layla', city: 'Hurghada', product: 'Silk Scarf Set', time: '35 mins ago' }
];

export default function LiveSalesPopup() {
    const [currentSale, setCurrentSale] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show first popup after 3 seconds
        const initialTimeout = setTimeout(() => {
            showRandomSale();
        }, 3000);

        return () => clearTimeout(initialTimeout);
    }, []);

    useEffect(() => {
        if (currentSale) {
            // Hide after 4 seconds
            const hideTimeout = setTimeout(() => {
                setIsVisible(false);
            }, 4000);

            // Show next sale after 8-15 seconds
            const nextTimeout = setTimeout(() => {
                showRandomSale();
            }, 8000 + Math.random() * 7000);

            return () => {
                clearTimeout(hideTimeout);
                clearTimeout(nextTimeout);
            };
        }
    }, [currentSale]);

    const showRandomSale = () => {
        const randomSale = salesData[Math.floor(Math.random() * salesData.length)];
        setCurrentSale(randomSale);
        setIsVisible(true);
    };

    return (
        <AnimatePresence>
            {isVisible && currentSale && (
                <motion.div
                    initial={{ opacity: 0, x: -100, y: 20 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed bottom-20 left-4 z-[150] max-w-xs"
                >
                    <div className="bg-black/90 backdrop-blur-xl border border-[#C9A961]/30 rounded-2xl p-4 shadow-2xl">
                        <div className="flex items-start gap-3">
                            {/* Icon */}
                            <div className="w-12 h-12 bg-gradient-to-br from-[#C9A961] to-[#B8984F] rounded-xl flex items-center justify-center flex-shrink-0">
                                <ShoppingBag size={20} className="text-black" />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-bold">
                                    {currentSale.name} just purchased
                                </p>
                                <p className="text-[#C9A961] text-sm font-bold truncate">
                                    {currentSale.product}
                                </p>
                                <div className="flex items-center gap-1 text-gray-400 text-xs mt-1">
                                    <MapPin size={10} />
                                    <span>{currentSale.city}</span>
                                    <span className="mx-1">•</span>
                                    <span>{currentSale.time}</span>
                                </div>
                            </div>
                        </div>

                        {/* Verified Badge */}
                        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/10">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs text-gray-400">Verified Purchase</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
