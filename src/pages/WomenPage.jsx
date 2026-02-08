import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Crown, Flame, Zap, Ruler, X } from 'lucide-react';

// Bilingual product names for women
const womenProductNames = [
    { en: 'Evening Gown', ar: 'فستان سهرة' },
    { en: 'Silk Blouse', ar: 'بلوزة حرير' },
    { en: 'Cashmere Wrap', ar: 'شال كشمير' },
    { en: 'Designer Dress', ar: 'فستان مصمم' },
    { en: 'Tailored Blazer', ar: 'بليزر مفصل' },
    { en: 'Luxury Jumpsuit', ar: 'جمبسوت فاخر' },
    { en: 'Pleated Skirt', ar: 'تنورة مطوية' },
    { en: 'Wool Coat', ar: 'معطف صوف' },
    { en: 'Satin Top', ar: 'توب ساتان' },
    { en: 'Embroidered Jacket', ar: 'جاكيت مطرز' }
];

const womenImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1549062572-544a64fb0c56?w=400&h=500&fit=crop'
];

// Size Guide Modal
function SizeGuideModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    const sizes = [
        { size: 'XS', bust: '80-84', waist: '60-64', hips: '86-90' },
        { size: 'S', bust: '85-89', waist: '65-69', hips: '91-95' },
        { size: 'M', bust: '90-94', waist: '70-74', hips: '96-100' },
        { size: 'L', bust: '95-99', waist: '75-79', hips: '101-105' }
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
                className="bg-[#0A0A0A] border border-[#D8B4FE]/30 rounded-3xl p-8 max-w-lg w-full"
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
                            <th className="py-3 text-left text-[#D8B4FE]">Size</th>
                            <th className="py-3 text-center text-white/60">Bust</th>
                            <th className="py-3 text-center text-white/60">Waist</th>
                            <th className="py-3 text-center text-white/60">Hips</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sizes.map((row, i) => (
                            <tr key={i} className="border-b border-white/5">
                                <td className="py-3 font-bold text-white">{row.size}</td>
                                <td className="py-3 text-center text-white/70">{row.bust} cm</td>
                                <td className="py-3 text-center text-white/70">{row.waist} cm</td>
                                <td className="py-3 text-center text-white/70">{row.hips} cm</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
}

// Product Card with Soft Lavender Glow
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
                border: `1px solid ${isHovered ? 'rgba(216, 180, 254, 0.6)' : 'rgba(216, 180, 254, 0.2)'}`,
                boxShadow: isHovered ? '0 0 25px rgba(216, 180, 254, 0.5)' : 'none',
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
                    <Heart size={14} className={isInWishlist ? 'fill-[#D8B4FE] text-[#D8B4FE]' : 'text-white'} />
                </button>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.isPremium && (
                        <span className="flex items-center gap-1 bg-gradient-to-r from-[#D8B4FE] to-[#A855F7] text-white text-[8px] font-black px-2 py-0.5 rounded-full">
                            <Crown size={8} /> VIP
                        </span>
                    )}
                    {product.isLimited && (
                        <span className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full">
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
                    className="absolute bottom-3 right-3 left-12 py-2 bg-gradient-to-r from-[#D8B4FE] to-[#A855F7] rounded-lg text-[10px] font-bold text-white flex items-center justify-center gap-1 shadow-lg"
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
                    <span className="text-[#D8B4FE]">Sold {product.sold}x</span>
                </div>

                {/* Size Guide */}
                <button
                    onClick={onSizeGuide}
                    className="flex items-center gap-1 text-[10px] text-white/40 hover:text-[#D8B4FE] mb-2"
                >
                    <Ruler size={10} /> Size Guide
                </button>

                {/* Price */}
                <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-white">{product.price.toLocaleString()} <span className="text-[10px] text-white/50">EGP</span></span>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="px-3 py-1.5 bg-[#D8B4FE] rounded-lg text-[10px] font-bold text-black"
                    >
                        ADD
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default function WomenPage({ cart, setCart, wishlist, setWishlist }) {
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

    const products = useMemo(() => [...Array(50)].map((_, i) => ({
        id: `women-${i + 1}`,
        nameEn: womenProductNames[i % womenProductNames.length].en,
        nameAr: womenProductNames[i % womenProductNames.length].ar,
        price: 1500 + (i * 50),
        rating: (4 + Math.random()).toFixed(1),
        isPremium: i < 10,
        isLimited: i < 5,
        stock: Math.floor(Math.random() * 5) + 1,
        sold: Math.floor(Math.random() * 50) + 10,
        image: womenImages[i % womenImages.length]
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
                        style={{ textShadow: '0 0 30px rgba(216, 180, 254, 0.4)' }}
                    >
                        WOMEN'S COLLECTION
                    </h1>
                    <p className="text-[#D8B4FE] text-lg">
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
