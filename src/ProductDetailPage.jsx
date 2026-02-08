import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    Heart,
    Share2,
    ShoppingCart,
    Zap,
    Star,
    Truck,
    Shield,
    RotateCcw,
    ChevronRight,
    X
} from 'lucide-react';
import { supabase } from './lib/supabase';

export default function ProductDetailPage({ product, onBack, onAddToCart, suggestedProducts = [] }) {
    const [selectedVariant, setSelectedVariant] = useState('men');
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [activeImage, setActiveImage] = useState(0);
    const [loading, setLoading] = useState(false);

    // Size options - can be fetched from Supabase per product
    const sizeOptions = product?.sizes || ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL'];

    // Color options - can be fetched from Supabase per product
    const colorOptions = product?.colors || [
        { name: 'Jet Black', value: '#000000' },
        { name: 'Pure White', value: '#FFFFFF' },
        { name: 'Crimson Red', value: '#DC143C' },
        { name: 'Midnight Navy', value: '#191970' },
        { name: 'Charcoal', value: '#36454F' },
        { name: 'Gold', value: '#FFD700' },
        { name: 'Silver', value: '#C0C0C0' },
        { name: 'Rose', value: '#FF007F' }
    ];

    // Generate variant slots (up to 50)
    const generateVariantSlots = () => {
        const slots = [];
        for (let i = 0; i < 50; i++) {
            const size = sizeOptions[i % sizeOptions.length];
            const color = colorOptions[i % colorOptions.length];
            slots.push({
                id: i,
                size,
                color,
                available: Math.random() > 0.2 // 80% availability
            });
        }
        return slots;
    };

    const [variantSlots] = useState(generateVariantSlots());

    // Product images (demo or from Supabase)
    const images = product?.images?.length > 0
        ? product.images
        : [null, null, null, null];

    const handleAddToCart = () => {
        if (!selectedSize || !selectedColor) {
            alert('Please select size and color');
            return;
        }

        onAddToCart({
            ...product,
            selectedSize,
            selectedColor,
            quantity,
            variant: selectedVariant
        });
    };

    const handleBuyNow = () => {
        handleAddToCart();
        // Could trigger immediate checkout
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.4 }}
            className="min-h-screen bg-black text-white"
        >
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-all"
                    >
                        <ChevronLeft size={24} />
                        <span className="hidden sm:inline">Back to Store</span>
                    </button>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsWishlisted(!isWishlisted)}
                            className={`p-2 rounded-full transition-all ${isWishlisted ? 'bg-[#800020] text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                        >
                            <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
                        </button>
                        <button className="p-2 bg-white/5 rounded-full text-gray-400 hover:text-white transition-all">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="pt-20 pb-32">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12">

                        {/* Image Gallery */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="aspect-[4/5] bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl overflow-hidden flex items-center justify-center relative"
                            >
                                {images[activeImage] ? (
                                    <img src={images[activeImage]} alt={product?.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white/10 font-black text-8xl italic">VIP</span>
                                )}

                                {/* Image Navigation */}
                                <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 p-4">
                                    {images.map((_, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveImage(idx)}
                                            className={`w-2 h-2 rounded-full transition-all ${activeImage === idx ? 'bg-[#800020] w-6' : 'bg-white/30'}`}
                                        />
                                    ))}
                                </div>
                            </motion.div>

                            {/* Thumbnail Strip */}
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setActiveImage(idx)}
                                        className={`w-20 h-24 flex-shrink-0 bg-neutral-900 rounded-xl overflow-hidden flex items-center justify-center border-2 transition-all ${activeImage === idx ? 'border-[#800020]' : 'border-transparent'
                                            }`}
                                    >
                                        {img ? (
                                            <img src={img} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-white/10 font-black text-xl">VIP</span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-8">
                            {/* Category & Rating */}
                            <div className="flex items-center justify-between">
                                <span className="text-[#800020] text-sm font-bold tracking-wider uppercase">
                                    {product?.category || 'Premium Collection'}
                                </span>
                                <div className="flex items-center gap-2">
                                    <Star size={16} className="fill-yellow-500 text-yellow-500" />
                                    <span className="font-bold">{product?.rating?.toFixed(1) || '4.8'}</span>
                                    <span className="text-gray-500 text-sm">({product?.reviews || 128} reviews)</span>
                                </div>
                            </div>

                            {/* Title & Price */}
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black mb-4">{product?.name || 'VIP Premium Product'}</h1>
                                <div className="flex items-baseline gap-4">
                                    <span className="text-4xl font-black text-[#800020]">
                                        {(product?.price || 1500).toLocaleString()} <span className="text-lg">EGP</span>
                                    </span>
                                    {product?.originalPrice && (
                                        <span className="text-xl text-gray-500 line-through">{product.originalPrice.toLocaleString()} EGP</span>
                                    )}
                                </div>
                            </div>

                            {/* Men/Women Toggle */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Select Variant</h3>
                                <div className="flex bg-neutral-900 p-1 rounded-2xl w-fit">
                                    {['men', 'women'].map(variant => (
                                        <button
                                            key={variant}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`px-8 py-3 rounded-xl font-bold transition-all capitalize ${selectedVariant === variant
                                                    ? 'bg-[#800020] text-white'
                                                    : 'text-gray-500 hover:text-white'
                                                }`}
                                        >
                                            {variant === 'men' ? "Men's" : "Women's"}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Select Size</h3>
                                    <button className="text-[#800020] text-sm hover:underline">Size Guide</button>
                                </div>
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                                    {sizeOptions.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`py-3 rounded-xl font-bold transition-all border ${selectedSize === size
                                                    ? 'bg-[#800020] border-[#800020] text-white'
                                                    : 'bg-neutral-900 border-white/10 text-gray-400 hover:border-[#800020]'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Selection */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                    Select Color {selectedColor && <span className="text-white ml-2">— {selectedColor.name}</span>}
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {colorOptions.map(color => (
                                        <button
                                            key={color.value}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor?.value === color.value
                                                    ? 'border-[#800020] scale-110 ring-2 ring-[#800020] ring-offset-2 ring-offset-black'
                                                    : 'border-white/20 hover:scale-105'
                                                }`}
                                            style={{ backgroundColor: color.value }}
                                            title={color.name}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Variant Slots Grid (50 slots) */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">
                                    Available Combinations ({selectedVariant === 'men' ? "Men's" : "Women's"})
                                </h3>
                                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 max-h-40 overflow-y-auto p-2 bg-neutral-900/50 rounded-2xl">
                                    {variantSlots.slice(0, 50).map(slot => (
                                        <button
                                            key={slot.id}
                                            disabled={!slot.available}
                                            onClick={() => {
                                                setSelectedSize(slot.size);
                                                setSelectedColor(colorOptions.find(c => c.value === slot.color.value) || slot.color);
                                            }}
                                            className={`aspect-square rounded-lg text-xs font-bold flex items-center justify-center transition-all ${slot.available
                                                    ? 'bg-neutral-800 hover:bg-[#800020] text-white cursor-pointer'
                                                    : 'bg-neutral-900 text-gray-700 cursor-not-allowed line-through'
                                                }`}
                                            style={{ borderLeft: `3px solid ${slot.color.value || slot.color}` }}
                                            title={`${slot.size} - ${slot.color.name || 'Color'}`}
                                        >
                                            {slot.size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Quantity */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Quantity</h3>
                                <div className="flex items-center gap-4 bg-neutral-900 p-2 rounded-2xl w-fit">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-black text-xl">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-4 py-6 border-y border-white/5">
                                <div className="flex items-center gap-3 text-sm">
                                    <Truck size={20} className="text-[#800020]" />
                                    <span className="text-gray-400">Free Shipping</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield size={20} className="text-[#800020]" />
                                    <span className="text-gray-400">Secure Payment</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <RotateCcw size={20} className="text-[#800020]" />
                                    <span className="text-gray-400">Easy Returns</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Description</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {product?.description || 'Experience luxury like never before with our premium VIP collection. Crafted with the finest materials and designed for those who demand excellence. Each piece is a statement of sophistication and style.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Suggested Products */}
                    {suggestedProducts.length > 0 && (
                        <section className="mt-20">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-black">You May Also Like</h2>
                                <button className="text-[#800020] flex items-center gap-2 hover:gap-3 transition-all">
                                    View All <ChevronRight size={18} />
                                </button>
                            </div>

                            <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
                                {suggestedProducts.map((item, idx) => (
                                    <motion.div
                                        key={item.id || idx}
                                        whileHover={{ y: -5 }}
                                        className="flex-shrink-0 w-64 snap-start bg-neutral-950 border border-white/5 rounded-2xl overflow-hidden hover:border-[#800020]/50 transition-all"
                                    >
                                        <div className="aspect-[3/4] bg-neutral-900 flex items-center justify-center">
                                            {item.images?.[0] ? (
                                                <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-white/10 font-black text-4xl">VIP</span>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-bold text-sm mb-1 line-clamp-1">{item.name}</h3>
                                            <p className="text-[#800020] font-black">{item.price?.toLocaleString()} EGP</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* Sticky Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
                    {/* Price Summary */}
                    <div className="hidden sm:block">
                        <p className="text-gray-500 text-sm">Total</p>
                        <p className="text-2xl font-black">{((product?.price || 1500) * quantity).toLocaleString()} EGP</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 flex-1 sm:flex-none">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 sm:flex-none px-8 py-4 bg-neutral-900 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all"
                        >
                            <ShoppingCart size={20} />
                            <span className="hidden sm:inline">Add to Cart</span>
                        </button>
                        <button
                            onClick={handleBuyNow}
                            className="flex-1 sm:flex-none px-8 py-4 bg-[#800020] rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#a00028] transition-all"
                        >
                            <Zap size={20} />
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
