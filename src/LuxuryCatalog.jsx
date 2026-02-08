import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Star,
    ShoppingCart,
    Heart,
    ArrowLeft,
    Sparkles,
    Eye,
    Filter,
    X,
    Crown,
    ChevronDown,
    Menu
} from 'lucide-react';

// Generate products
const generateProducts = () => {
    const menNames = [
        'VIP Leather Jacket', 'Premium Wool Blazer', 'Luxury Silk Shirt', 'Designer Hoodie',
        'Cashmere Sweater', 'Italian Suit', 'Slim Fit Trousers', 'Premium Polo', 'Classic Oxford Shirt',
        'Vintage Denim Jacket', 'Velvet Dinner Jacket', 'Merino Cardigan', 'Linen Summer Shirt',
        'Athletic Track Jacket', 'Quilted Vest', 'Formal Tuxedo', 'Cable Knit Sweater', 'Bomber Jacket',
        'Chino Pants', 'Dress Shirt Collection', 'Smart Casual Blazer', 'Puffer Jacket',
        'Henley Long Sleeve', 'Tailored Coat', 'Graphic Tee Premium'
    ];

    const womenNames = [
        'Elegant Evening Gown', 'Silk Blouse', 'Designer Handbag', 'Cashmere Wrap',
        'Tailored Blazer', 'Pleated Midi Skirt', 'Luxury Jumpsuit', 'Cocktail Dress',
        'Merino Turtleneck', 'Wide Leg Trousers', 'Embroidered Jacket', 'Satin Slip Dress',
        'Wool Coat', 'Sequin Top', 'High Waist Pants', 'Leather Pencil Skirt',
        'Chiffon Maxi Dress', 'Structured Shoulder Bag', 'Cashmere Cardigan', 'Lace Blouse',
        'Crepe Blazer', 'Silk Scarf Collection', 'Fitted Waistcoat', 'Floral Midi Dress',
        'Cape Coat'
    ];

    const products = [];

    menNames.forEach((name, i) => {
        products.push({
            id: `men-${i + 1}`,
            name,
            category: 'men',
            price: Math.floor(Math.random() * 3500) + 800,
            rating: (4 + Math.random()).toFixed(1),
            isPremium: i % 3 === 0,
            isNew: i < 5,
            stock: Math.floor(Math.random() * 5) + 1,
            image: `https://images.unsplash.com/photo-${1617137968427 + (i * 1000)}-85924c800a22?w=400&h=500&fit=crop`,
            sizes: ['S', 'M', 'L', 'XL']
        });
    });

    womenNames.forEach((name, i) => {
        products.push({
            id: `women-${i + 1}`,
            name,
            category: 'women',
            price: Math.floor(Math.random() * 3500) + 800,
            rating: (4 + Math.random()).toFixed(1),
            isPremium: i % 3 === 0,
            isNew: i < 5,
            stock: Math.floor(Math.random() * 5) + 1,
            image: `https://images.unsplash.com/photo-${1515886657613 + (i * 1000)}-52bcd06c5bae?w=400&h=500&fit=crop`,
            sizes: ['XS', 'S', 'M', 'L']
        });
    });

    return products;
};

const allProducts = generateProducts();

// Shop The Look suggestions (related products)
const getRelatedProducts = (product, allProducts) => {
    return allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 3);
};

// Product Card Component
const ProductCard = ({ product, index, onAddToCart, wishlist = [], toggleWishlist = () => { } }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [imageLoaded, setImageLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showShopLook, setShowShopLook] = useState(false);
    const cardRef = useRef(null);
    const isInWishlist = wishlist.includes(product.id);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        if (cardRef.current) observer.observe(cardRef.current);
        return () => observer.disconnect();
    }, []);

    const fallbackImages = {
        men: [
            'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop'
        ],
        women: [
            'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
            'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop'
        ]
    };

    const getImage = () => fallbackImages[product.category][index % fallbackImages[product.category].length];
    const relatedProducts = getRelatedProducts(product, allProducts);

    return (
        <motion.div
            ref={cardRef}
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.5, delay: (index % 10) * 0.05 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => { setIsHovered(false); setShowShopLook(false); }}
            className="group relative bg-gradient-to-b from-neutral-900 to-neutral-950 border border-white/5 rounded-2xl overflow-hidden hover:border-[#C9A961]/50 transition-all"
        >
            {/* Product Image */}
            <div className="aspect-[3/4] relative overflow-hidden">
                {isVisible && (
                    <img
                        src={getImage()}
                        alt={product.name}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'} ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    />
                )}

                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-neutral-900 animate-pulse flex items-center justify-center">
                        <span className="text-white/5 font-black text-5xl italic">VIP</span>
                    </div>
                )}

                {/* Golden Heart Wishlist */}
                <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 bg-black/60 backdrop-blur-sm rounded-full hover:bg-[#C9A961]/20 transition-all z-10"
                >
                    <Heart size={18} className={`transition-all ${isInWishlist ? 'fill-[#C9A961] text-[#C9A961]' : 'text-[#C9A961]'}`} />
                </button>

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                    {product.isPremium && (
                        <div className="flex items-center gap-1 bg-gradient-to-r from-[#C9A961] via-[#FFE5A0] to-[#C9A961] text-black text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                            <Crown size={10} /> VIP CHOICE
                        </div>
                    )}
                    {product.isNew && !product.isPremium && (
                        <span className="bg-[#C9A961] text-black text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
                            <Sparkles size={10} /> NEW
                        </span>
                    )}
                </div>

                {/* Rating */}
                <div className="absolute top-3 right-12 bg-black/80 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                    <Star size={12} className="fill-[#C9A961] text-[#C9A961]" />
                    <span className="text-white font-bold">{product.rating}</span>
                </div>

                {/* Hover Overlay */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col items-center justify-end p-4"
                >
                    <div className="flex gap-3 mb-3">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onAddToCart(product)}
                            className="flex items-center gap-2 bg-gradient-to-r from-[#C9A961] to-[#B8984F] text-black px-5 py-3 rounded-full font-bold text-sm"
                        >
                            <ShoppingCart size={16} /> Quick Add
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-3 bg-white/10 backdrop-blur rounded-full hover:bg-white/20"
                        >
                            <Eye size={18} className="text-white" />
                        </motion.button>
                    </div>

                    {/* Shop The Look Button */}
                    <button
                        onClick={() => setShowShopLook(!showShopLook)}
                        className="text-xs text-[#C9A961] hover:underline flex items-center gap-1"
                    >
                        Shop The Look <ChevronDown size={12} className={showShopLook ? 'rotate-180' : ''} />
                    </button>
                </motion.div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <p className="text-[10px] text-[#C9A961] font-bold tracking-widest mb-1 uppercase">
                    {product.category === 'men' ? 'MEN' : 'WOMEN'} COLLECTION
                </p>
                <h3 className="font-bold text-sm text-white mb-2 line-clamp-1 group-hover:text-[#C9A961] transition-colors">
                    {product.name}
                </h3>
                <div className="text-[10px] text-red-400 font-bold mb-2">🔥 Only {product.stock} left!</div>
                <div className="flex justify-between items-center">
                    <span className="text-lg font-black text-white">
                        {product.price.toLocaleString()} <span className="text-xs text-gray-500">EGP</span>
                    </span>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="p-2 bg-gradient-to-r from-[#C9A961] to-[#FFE5A0] rounded-full hover:scale-110 transition-transform"
                    >
                        <ShoppingCart size={16} className="text-black" />
                    </button>
                </div>
            </div>

            {/* Shop The Look Dropdown */}
            <AnimatePresence>
                {showShopLook && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10 overflow-hidden"
                    >
                        <div className="p-3 bg-black/50">
                            <p className="text-xs text-gray-400 mb-2">Complete the look:</p>
                            <div className="flex gap-2 overflow-x-auto">
                                {relatedProducts.map(rel => (
                                    <div key={rel.id} className="flex-shrink-0 w-16">
                                        <img src={fallbackImages[rel.category][0]} className="w-16 h-20 object-cover rounded-lg" alt={rel.name} />
                                        <p className="text-[10px] truncate mt-1">{rel.name}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default function LuxuryCatalog({ onBack, onAddToCart, wishlist = [], toggleWishlist = () => { } }) {
    const [activeCategory, setActiveCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(20);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [filters, setFilters] = useState({ sizes: [], priceRange: [0, 5000] });

    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

    const toggleSize = (size) => {
        setFilters(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
        }));
    };

    // Filter products
    const filteredProducts = allProducts.filter(product => {
        if (activeCategory === 'premium') return product.isPremium;
        if (activeCategory !== 'all' && product.category !== activeCategory) return false;
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (product.price > filters.priceRange[1]) return false;
        return true;
    });

    // Load more on scroll
    const loadMore = useCallback(() => {
        if (visibleCount < filteredProducts.length) {
            setVisibleCount(prev => Math.min(prev + 10, filteredProducts.length));
        }
    }, [visibleCount, filteredProducts.length]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) loadMore();
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    useEffect(() => { setVisibleCount(20); }, [activeCategory, searchQuery, filters]);

    const displayedProducts = filteredProducts.slice(0, visibleCount);

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen bg-black">
            {/* Sticky Header with Search */}
            <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-white/5">
                <div className="p-4 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 bg-neutral-900 rounded-xl">
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex-1 relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search catalog..."
                            className="w-full bg-neutral-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#C9A961]"
                        />
                    </div>
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-neutral-900 rounded-xl">
                        <Filter size={20} />
                    </button>
                </div>

                {/* Big Men/Women Tabs */}
                <div className="flex border-b border-white/5">
                    {[
                        { id: 'all', label: 'ALL', icon: '✦' },
                        { id: 'men', label: 'MEN', icon: '👔' },
                        { id: 'women', label: 'WOMEN', icon: '👗' },
                        { id: 'premium', label: 'VIP', icon: '👑' }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveCategory(tab.id)}
                            className={`flex-1 py-4 font-bold text-center transition-all relative ${activeCategory === tab.id
                                    ? 'text-[#C9A961]'
                                    : 'text-gray-500 hover:text-white'
                                }`}
                        >
                            <span className="text-lg mr-2">{tab.icon}</span>
                            {tab.label}
                            {activeCategory === tab.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A961]"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </header>

            {/* Mobile Filter Sidebar */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 z-50"
                        />
                        <motion.div
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            exit={{ x: 300 }}
                            className="fixed right-0 top-0 bottom-0 w-80 bg-neutral-950 border-l border-white/10 z-50 p-6 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="font-bold text-lg">Filters</h2>
                                <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Size Filter */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Size</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sizeOptions.map(size => (
                                        <button
                                            key={size}
                                            onClick={() => toggleSize(size)}
                                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${filters.sizes.includes(size)
                                                    ? 'bg-[#C9A961] text-black'
                                                    : 'bg-black/50 border border-white/10 text-gray-400'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Price Filter */}
                            <div className="mb-6">
                                <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Max Price</h3>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    step="100"
                                    value={filters.priceRange[1]}
                                    onChange={(e) => setFilters(prev => ({ ...prev, priceRange: [0, parseInt(e.target.value)] }))}
                                    className="w-full accent-[#C9A961]"
                                />
                                <p className="text-center text-[#C9A961] font-bold mt-2">{filters.priceRange[1].toLocaleString()} EGP</p>
                            </div>

                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="w-full bg-[#C9A961] text-black py-3 rounded-xl font-bold"
                            >
                                Apply Filters
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Products Grid */}
            <main className="p-4 lg:p-8 pb-32">
                <p className="text-gray-500 mb-6">{filteredProducts.length} products found</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-5">
                    {displayedProducts.map((product, index) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            index={index}
                            onAddToCart={onAddToCart}
                            wishlist={wishlist}
                            toggleWishlist={toggleWishlist}
                        />
                    ))}
                </div>

                {visibleCount < filteredProducts.length && (
                    <div className="flex justify-center py-10">
                        <div className="flex items-center gap-3 text-gray-500">
                            <div className="w-6 h-6 border-2 border-[#C9A961] border-t-transparent rounded-full animate-spin"></div>
                            Loading more...
                        </div>
                    </div>
                )}

                {filteredProducts.length === 0 && (
                    <div className="text-center py-20">
                        <Search size={60} className="mx-auto mb-4 text-gray-700" />
                        <h3 className="text-xl font-bold text-white mb-2">No products found</h3>
                        <p className="text-gray-500">Try adjusting your filters</p>
                    </div>
                )}
            </main>
        </motion.div>
    );
}
