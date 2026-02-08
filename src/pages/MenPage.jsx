import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Crown, Flame, Zap, Ruler, X } from 'lucide-react';

// Bilingual product names for men
const menProductNames = [
    { en: 'Royal Suit', ar: 'بدلة ملكية' },
    { en: 'Premium Blazer', ar: 'بليزر فاخر' },
    { en: 'Silk Shirt', ar: 'قميص حرير' },
    { en: 'Leather Jacket', ar: 'جاكيت جلد' },
    { en: 'Wool Coat', ar: 'معطف صوف' },
    { en: 'Cashmere Sweater', ar: 'سويتر كشمير' },
    { en: 'Designer Hoodie', ar: 'هودي مصمم' },
    { en: 'Tailored Pants', ar: 'بنطال مفصل' },
    { en: 'Classic Oxford', ar: 'أكسفورد كلاسيك' },
    { en: 'Velvet Jacket', ar: 'جاكيت مخمل' }
];

const menImages = [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop'
];

// Size Guide Modal
function SizeGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const sizes = [
        { size: 'M', chest: '96-101', waist: '81-86', length: '71' },
        { size: 'L', chest: '102-107', waist: '87-92', length: '73' },
        { size: 'XL', chest: '108-113', waist: '93-98', length: '75' },
        { size: 'XXL', chest: '114-119', waist: '99-104', length: '77' }
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[200] flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-[#A855F7]/30 rounded-3xl p-8 max-w-lg w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">SIZE GUIDE</h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                        <X size={20} className="text-white" />
                    </button>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="py-3 text-left text-[#A855F7]">Size</th>
                            <th className="py-3 text-center text-white/60">Chest</th>
                            <th className="py-3 text-center text-white/60">Waist</th>
                            <th className="py-3 text-center text-white/60">Length</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizes.map((row, i) => (
                            <tr key={i} className="border-b border-white/5">
                                <td className="py-3 font-bold text-white">{row.size}</td>
                                <td className="py-3 text-center text-white/70">{row.chest} cm</td>
                                <td className="py-3 text-center text-white/70">{row.waist} cm</td>
                                <td className="py-3 text-center text-white/70">{row.length} cm</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
}

// Product Card
function ProductCard({ product, index, onAddToCart, wishlist, toggleWishlist, onSizeGuide }) {
    const [isHovered, setIsHovered] = useState(false);
    const isInWishlist = wishlist.includes(product.id);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: (index % 10) * 0.02 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl"
            style={{
                border: `1px solid ${isHovered ? 'rgba(168, 85, 247, 0.6)' : 'rgba(168, 85, 247, 0.2)'}`,
                boxShadow: isHovered ? '0 0 25px rgba(168, 85, 247, 0.5)' : 'none',
                transition: 'all 0.3s ease'
            }}
        >
            {/* Image */}
            <div className="aspect-[4/5] relative overflow-hidden">
                <motion.img
                    src={product.image}
                    alt={product.nameEn}
                    className="w-full h-full object-cover"
                    animate={{ scale: isHovered ? 1.1 : 1 }}
                    transition={{ duration: 0.4 }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Wishlist */}
                <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-black/50 backdrop-blur rounded-full z-10"
                >
                    <Heart size={14} className={isInWishlist ? 'fill-[#A855F7] text-[#A855F7]' : 'text-white'} />
                </button>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.isPremium && (
                        <span className="flex items-center gap-1 bg-gradient-to-r from-[#A855F7] to-[#D8B4FE] text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                            <Crown size={8} /> VIP
                        </span>
                    )}
                    {product.isLimited && (
                        <span className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                            <Flame size={8} /> LIMITED
                        </span>
                    )}
                </div>

                {/* Rating */}
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur px-2 py-1 rounded-full flex items-center gap-1 text-[10px]">
                    <Star size={8} className="fill-yellow-400 text-yellow-400" />
                    <span className="text-white font-bold">{product.rating}</span>
                </div>

                {/* Buy Now */}
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                    onClick={() => onAddToCart(product)}
                    className="absolute bottom-3 right-3 left-12 py-2 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1 shadow-lg"
                >
                    <ShoppingCart size={12} />
                    BUY NOW
                </motion.button>
            </div>

            {/* Content */}
            <div className="p-3">
                {/* Bilingual Name */}
                <h3 className="font-bold text-sm mb-1 line-clamp-1">
                    <span className="text-white">{product.nameEn}</span>
                    <span className="text-[#D8B4FE] ml-1 text-xs">| {product.nameAr}</span>
                </h3>

                {/* Urgency */}
                <div className="flex items-center justify-between text-[10px] mb-2">
                    <span className="text-orange-400 flex items-center gap-0.5">
                        <Zap size={8} /> {product.stock} left
                    </span>
                    <span className="text-[#A855F7]">Sold {product.sold}x</span>
                </div>

                {/* Size Guide */}
                <button
                    onClick={onSizeGuide}
                    className="flex items-center gap-1 text-[10px] text-white/40 hover:text-[#A855F7] mb-2"
                >
                    <Ruler size={10} /> Size Guide
                </button>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">{product.price.toLocaleString()} <span className="text-[10px] text-white/50">EGP</span></span>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="px-3 py-1.5 bg-[#A855F7] rounded-lg text-[10px] font-bold text-white"
                    >
                        ADD
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function MenPage({ cart, setCart, wishlist, setWishlist }) {
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

    const products = useMemo(() => [...Array(50)].map((_, i) => ({
        id: `men-${i + 1}`,
        nameEn: menProductNames[i % menProductNames.length].en,
        nameAr: menProductNames[i % menProductNames.length].ar,
        price: 1500 + (i * 50),
        rating: (4 + Math.random()).toFixed(1),
        isPremium: i < 10,
        isLimited: i < 5,
        stock: Math.floor(Math.random() * 5) + 1,
        sold: Math.floor(Math.random() * 50) + 10,
        image: menImages[i % menImages.length]
    })), []);

    const toggleWishlist = (id) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const addToCart = (product) => {
        setCart(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) {
                return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            }
            return [...prev, { ...product, name: product.nameEn, quantity: 1 }];
        });
    };

    return (
        <div className="min-h-screen bg-black pb-20">
            <div className="w-full px-2 lg:px-4">
                {/* Page Header - English Only */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1
                        className="text-4xl lg:text-6xl font-black mb-4 text-white"
                        style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                    >
                        MEN'S COLLECTION
                    </h1>
                    <p className="text-[#A855F7] text-lg">
                        50 EXCLUSIVE PIECES
                    </p>
                </motion.div>

                {/* Full Width Products Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 lg:gap-4">
                    {products.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            index={index}
                            onAddToCart={addToCart}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                            onSizeGuide={() => setSizeGuideOpen(true)}
                        />
                    ))}
                </div>
            </div>

            {/* Size Guide Modal */}
            <SizeGuideModal isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
        </div>
    );
}
