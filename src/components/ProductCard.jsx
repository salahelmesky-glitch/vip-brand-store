import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Zap, Crown, Flame, Ruler } from 'lucide-react';

export default function ProductCard({
    product,
    isInWishlist = false,
    onToggleWishlist,
    onAddToCart,
    index = 0,
    variant = 'purple', // 'purple' for men, 'lavender' for women
    onSizeGuideClick
}) {
    const [isHovered, setIsHovered] = useState(false);

    // Random sold count for urgency
    const soldCount = Math.floor(Math.random() * 50) + 10;
    const isLimited = index < 10;

    const borderColor = variant === 'lavender'
        ? 'rgba(216, 180, 254, 0.3)'
        : 'rgba(168, 85, 247, 0.3)';

    const hoverBorderColor = variant === 'lavender'
        ? 'rgba(216, 180, 254, 0.8)'
        : 'rgba(168, 85, 247, 0.8)';

    const glowColor = variant === 'lavender'
        ? '0 0 20px rgba(216, 180, 254, 0.4), 0 0 40px rgba(216, 180, 254, 0.2)'
        : '0 0 20px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)';

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index % 20) * 0.02, duration: 0.4 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative rounded-2xl overflow-hidden product-card-glow"
            style={{
                border: `1px solid ${isHovered ? hoverBorderColor : borderColor}`,
                boxShadow: isHovered ? glowColor : 'none',
                transition: 'all 0.4s ease'
            }}
        >
            {/* Glassmorphism Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl" />

            <div className="relative">
                {/* Image Container */}
                <div className="aspect-[4/5] relative overflow-hidden">
                    <motion.img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        animate={{ scale: isHovered ? 1.1 : 1 }}
                        transition={{ duration: 0.5 }}
                    />

                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Wishlist Button */}
                    <motion.button
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onToggleWishlist(product.id)}
                        className="absolute top-3 right-3 p-2.5 bg-black/50 backdrop-blur-md rounded-full border border-white/20 hover:border-[#A855F7] transition-all z-10"
                    >
                        <Heart
                            size={16}
                            className={isInWishlist ? 'fill-[#A855F7] text-[#A855F7]' : 'text-white'}
                        />
                    </motion.button>

                    {/* Badges Row */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        {/* Premium Badge */}
                        {product.isPremium && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-[#A855F7] to-[#D8B4FE] text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg">
                                <Crown size={10} /> VIP
                            </div>
                        )}
                        {/* Limited Edition Badge */}
                        {isLimited && (
                            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full">
                                <Flame size={10} /> Limited | محدود
                            </div>
                        )}
                    </div>

                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 text-xs border border-white/10">
                        <Star size={10} className="fill-yellow-400 text-yellow-400" />
                        <span className="font-bold text-white">{product.rating}</span>
                    </div>

                    {/* Quick Buy Button - Shows on Hover */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                        className="absolute inset-x-3 bottom-3 right-auto"
                    >
                        <button
                            onClick={() => onAddToCart(product)}
                            className="w-full py-3 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl font-bold text-sm text-white shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center gap-2"
                        >
                            <ShoppingCart size={16} />
                            <span>Quick Buy | شراء سريع</span>
                        </button>
                    </motion.div>
                </div>

                {/* Content */}
                <div className="p-4">
                    {/* Bilingual Name */}
                    <h3 className="font-bold text-base mb-1 line-clamp-1">
                        <span className="text-white">{product.nameEn || product.name}</span>
                        {product.nameAr && (
                            <span className="text-[#D8B4FE] text-sm ml-1">| {product.nameAr}</span>
                        )}
                    </h3>

                    {/* Urgency Section */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1 text-orange-400 text-xs font-medium">
                            <Zap size={10} className="animate-pulse" />
                            <span>{product.stock} left | متبقي</span>
                        </div>
                        <div className="text-[#A855F7] text-xs">
                            Sold {soldCount}x | بيع {soldCount}
                        </div>
                    </div>

                    {/* Size Guide Link */}
                    {onSizeGuideClick && (
                        <button
                            onClick={onSizeGuideClick}
                            className="flex items-center gap-1 text-xs text-white/50 hover:text-[#A855F7] mb-3 transition-colors"
                        >
                            <Ruler size={12} />
                            <span>Size Guide | دليل المقاسات</span>
                        </button>
                    )}

                    {/* Price & Add to Cart */}
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xl font-black text-white">
                                {product.price.toLocaleString()}
                            </span>
                            <span className="text-white/50 text-xs ml-1">EGP</span>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onAddToCart(product)}
                            className="px-4 py-2 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-lg font-bold text-xs text-white shadow-lg hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all"
                        >
                            Add | أضف
                        </motion.button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
