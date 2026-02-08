import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, ChevronDown, ShoppingCart, Heart, Star, Crown, Flame, Zap, X, Ruler } from 'lucide-react';

// Bilingual product names
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

const menImages = [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop'
];

const womenImages = [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop',
    'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop'
];

// Generate products
const generateMenProducts = () => [...Array(50)].map((_, i) => ({
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
}));

const generateWomenProducts = () => [...Array(50)].map((_, i) => ({
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
}));

// Size Guide Modal
function SizeGuideModal({ isOpen, onClose, category }) {
    if (!isOpen) return null;

    const menSizes = [
        { size: 'M', chest: '96-101', waist: '81-86', length: '71' },
        { size: 'L', chest: '102-107', waist: '87-92', length: '73' },
        { size: 'XL', chest: '108-113', waist: '93-98', length: '75' },
        { size: 'XXL', chest: '114-119', waist: '99-104', length: '77' }
    ];

    const womenSizes = [
        { size: 'XS', bust: '80-84', waist: '60-64', hips: '86-90' },
        { size: 'S', bust: '85-89', waist: '65-69', hips: '91-95' },
        { size: 'M', bust: '90-94', waist: '70-74', hips: '96-100' },
        { size: 'L', bust: '95-99', waist: '75-79', hips: '101-105' }
    ];

    const sizes = category === 'men' ? menSizes : womenSizes;

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
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0A0A0A] border border-[#A855F7]/30 rounded-3xl p-8 max-w-lg w-full"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">
                        <span className="text-white">Size Guide </span>
                        <span className="text-[#D8B4FE]">| دليل المقاسات</span>
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                        <X size={20} className="text-white" />
                    </button>
                </div>

                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="py-3 text-left text-[#A855F7]">Size</th>
                            {category === 'men' ? (
                                <>
                                    <th className="py-3 text-center text-white/60">Chest</th>
                                    <th className="py-3 text-center text-white/60">Waist</th>
                                    <th className="py-3 text-center text-white/60">Length</th>
                                </>
                            ) : (
                                <>
                                    <th className="py-3 text-center text-white/60">Bust</th>
                                    <th className="py-3 text-center text-white/60">Waist</th>
                                    <th className="py-3 text-center text-white/60">Hips</th>
                                </>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {sizes.map((row, i) => (
                            <tr key={i} className="border-b border-white/5">
                                <td className="py-3 font-bold text-white">{row.size}</td>
                                <td className="py-3 text-center text-white/70">{category === 'men' ? row.chest : row.bust} cm</td>
                                <td className="py-3 text-center text-white/70">{row.waist} cm</td>
                                <td className="py-3 text-center text-white/70">{category === 'men' ? row.length : row.hips} cm</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>
        </motion.div>
    );
}

// Product Card Component
function ProductCard({ product, index, variant, onAddToCart, wishlist, toggleWishlist, onSizeGuide }) {
    const [isHovered, setIsHovered] = useState(false);
    const isInWishlist = wishlist.includes(product.id);

    const borderColor = variant === 'lavender'
        ? 'rgba(216, 180, 254, 0.2)'
        : 'rgba(168, 85, 247, 0.2)';

    const hoverGlow = variant === 'lavender'
        ? '0 0 25px rgba(216, 180, 254, 0.5)'
        : '0 0 25px rgba(168, 85, 247, 0.5)';

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
                border: `1px solid ${borderColor}`,
                boxShadow: isHovered ? hoverGlow : 'none',
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

                {/* Buy Now Button */}
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

export default function HomePage() {
    const galleryRef = useRef(null);
    const [wishlist, setWishlist] = useState([]);
    const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
    const [sizeGuideCategory, setSizeGuideCategory] = useState('men');

    const menProducts = generateMenProducts();
    const womenProducts = generateWomenProducts();

    const { scrollYProgress } = useScroll();
    const parallaxY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);

    const scrollToGallery = () => {
        galleryRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleWishlist = (id) => {
        setWishlist(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    };

    const addToCart = (product) => {
        console.log('Added to cart:', product);
    };

    const openSizeGuide = (category) => {
        setSizeGuideCategory(category);
        setSizeGuideOpen(true);
    };

    return (
        <div className="min-h-screen bg-black">
            {/* Hero Section - English Only */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#A855F7]/20 via-transparent to-[#7C3AED]/10" />
                    <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[#A855F7]/10 rounded-full blur-[150px]" />
                    <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#7C3AED]/15 rounded-full blur-[120px]" />
                </div>

                {/* Hero Content - English Only */}
                <motion.div
                    style={{ y: parallaxY }}
                    className="relative z-10 text-center px-4"
                >
                    {/* VIP Badge */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-[#A855F7]/30 mb-8 backdrop-blur-xl"
                    >
                        <Sparkles size={16} className="text-[#A855F7]" />
                        <span className="text-white font-bold text-sm tracking-wider">
                            EXCLUSIVE 2026 COLLECTION
                        </span>
                    </motion.div>

                    {/* Main Heading - English Only with Purple Neon Effect */}
                    <motion.h1
                        initial={{ opacity: 0, y: 60 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-black mb-6"
                        style={{
                            textShadow: '0 0 40px rgba(168, 85, 247, 0.5), 0 0 80px rgba(168, 85, 247, 0.3)'
                        }}
                    >
                        <span className="text-white">EXCLUSIVE </span>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] via-[#D8B4FE] to-[#A855F7]">
                            VIP
                        </span>
                    </motion.h1>

                    {/* Subtitle - English Only */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl text-white/70 mb-12 font-light tracking-wide"
                        style={{
                            textShadow: '0 0 20px rgba(168, 85, 247, 0.3)'
                        }}
                    >
                        PREMIUM FASHION FOR THE ELITE
                    </motion.p>

                    {/* CTA Buttons - Bilingual */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
                    >
                        <Link to="/men">
                            <motion.button
                                whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(168,85,247,0.5)" }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-5 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-2xl font-bold text-lg text-white flex items-center gap-3"
                            >
                                <span>Discover Men | اكتشف الرجالي</span>
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                        <Link to="/women">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                                className="px-10 py-5 bg-white/5 border border-white/20 hover:border-[#A855F7]/50 rounded-2xl font-bold text-lg text-white flex items-center gap-3 backdrop-blur-xl"
                            >
                                <span>Discover Women | اكتشف النسائي</span>
                                <ArrowRight size={20} />
                            </motion.button>
                        </Link>
                    </motion.div>

                    {/* SHOP HERE Arrow - Large, Animated, English Only */}
                    <motion.button
                        onClick={scrollToGallery}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="group flex flex-col items-center gap-6"
                    >
                        <span
                            className="text-3xl lg:text-4xl font-black text-white tracking-wider"
                            style={{
                                textShadow: '0 0 30px rgba(168, 85, 247, 0.6)'
                            }}
                        >
                            SHOP HERE
                        </span>
                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-20 h-20 rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] flex items-center justify-center"
                            style={{
                                boxShadow: '0 0 50px rgba(168,85,247,0.7), 0 0 100px rgba(168,85,247,0.4), 0 0 150px rgba(168,85,247,0.2)'
                            }}
                        >
                            <ChevronDown size={40} className="text-white" />
                        </motion.div>
                    </motion.button>
                </motion.div>
            </section>

            {/* Product Kingdom - 100% Full Width */}
            <section ref={galleryRef} className="py-20 relative w-full">
                {/* Men's Collection - 50 Slots Full Width */}
                <div className="mb-20 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2
                            className="text-4xl lg:text-6xl font-black mb-4 text-white"
                            style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                        >
                            MEN'S COLLECTION
                        </h2>
                        <p className="text-[#A855F7]">50 EXCLUSIVE PIECES</p>
                    </motion.div>

                    {/* Full Width Grid */}
                    <div className="w-full px-2 lg:px-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 lg:gap-4">
                            {menProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    variant="purple"
                                    onAddToCart={addToCart}
                                    wishlist={wishlist}
                                    toggleWishlist={toggleWishlist}
                                    onSizeGuide={() => openSizeGuide('men')}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-[#A855F7]/50 to-transparent my-20" />

                {/* Women's Collection - 50 Slots Full Width */}
                <div className="w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2
                            className="text-4xl lg:text-6xl font-black mb-4 text-white"
                            style={{ textShadow: '0 0 30px rgba(216, 180, 254, 0.4)' }}
                        >
                            WOMEN'S COLLECTION
                        </h2>
                        <p className="text-[#D8B4FE]">50 EXCLUSIVE PIECES</p>
                    </motion.div>

                    {/* Full Width Grid */}
                    <div className="w-full px-2 lg:px-4">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 lg:gap-4">
                            {womenProducts.map((product, index) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    index={index}
                                    variant="lavender"
                                    onAddToCart={addToCart}
                                    wishlist={wishlist}
                                    toggleWishlist={toggleWishlist}
                                    onSizeGuide={() => openSizeGuide('women')}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="py-20 bg-gradient-to-r from-[#A855F7]/10 via-black to-[#7C3AED]/10">
                <div className="max-w-[2000px] mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                        {[
                            { value: '100+', label: 'LUXURY PRODUCTS' },
                            { value: '50K+', label: 'HAPPY CUSTOMERS' },
                            { value: '24/7', label: 'SUPPORT' },
                            { value: '100%', label: 'QUALITY' }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <p className="text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#D8B4FE]">
                                    {stat.value}
                                </p>
                                <p className="text-white/60 mt-2 font-bold tracking-wide">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Size Guide Modal */}
            <SizeGuideModal
                isOpen={sizeGuideOpen}
                onClose={() => setSizeGuideOpen(false)}
                category={sizeGuideCategory}
            />
        </div>
    );
}
