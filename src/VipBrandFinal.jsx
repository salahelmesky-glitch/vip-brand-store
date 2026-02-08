import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    Rocket,
    ShoppingCart,
    ChevronRight,
    Heart,
    Star,
    Crown,
    Search,
    X,
    Plus,
    Minus,
    Trash2,
    Zap,
    Menu,
    ArrowRight
} from 'lucide-react';
import CheckoutPage from './CheckoutPage';

export default function VipBrandFinal({
    cart = [],
    setCart = () => { },
    cartOpen = false,
    setCartOpen = () => { },
    adminOpen = false,
    setAdminOpen = () => { },
    recentlyViewed = [],
    addToRecentlyViewed = () => { }
}) {
    const [view, setView] = useState('login');
    const [category, setCategory] = useState('men');
    const [vipName, setVipName] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [wishlist, setWishlist] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [checkoutMode, setCheckoutMode] = useState(false);
    const [filters, setFilters] = useState({
        sizes: [],
        priceRange: [0, 10000]
    });

    const myNumber = "201006527185";
    const sizeOptions = ['M', 'L', 'XL', 'XXL'];

    // Sample products with real images
    const menImages = [
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop'
    ];

    const womenImages = [
        'https://images.unsplash.com/photo-1515886657613-52bcd06c5bae?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=500&fit=crop',
        'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=500&fit=crop'
    ];

    const menProducts = [...Array(50)].map((_, i) => ({
        id: `men-${i + 1}`,
        name: `VIP Edition #${i + 1}`,
        price: 1500 + (i * 50),
        category: 'men',
        rating: (4 + Math.random()).toFixed(1),
        isPremium: i < 10,
        isNew: i < 5,
        stock: Math.floor(Math.random() * 5) + 1,
        image: menImages[i % menImages.length]
    }));

    const womenProducts = [...Array(50)].map((_, i) => ({
        id: `women-${i + 1}`,
        name: `VIP Edition #${i + 1}`,
        price: 1500 + (i * 50),
        category: 'women',
        rating: (4 + Math.random()).toFixed(1),
        isPremium: i < 10,
        isNew: i < 5,
        stock: Math.floor(Math.random() * 5) + 1,
        image: womenImages[i % womenImages.length]
    }));

    const products = category === 'men' ? menProducts : womenProducts;

    const filteredProducts = products.filter(p => {
        if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (p.price > filters.priceRange[1]) return false;
        return true;
    });

    useEffect(() => {
        const saved = localStorage.getItem('vipWishlist');
        if (saved) try { setWishlist(JSON.parse(saved)); } catch { }
    }, []);

    useEffect(() => {
        localStorage.setItem('vipWishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const toggleWishlist = (id) => setWishlist(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
    const toggleSize = (size) => setFilters(p => ({ ...p, sizes: p.sizes.includes(size) ? p.sizes.filter(s => s !== size) : [...p.sizes, size] }));

    const handleLaunch = () => {
        setView('launching');
        setTimeout(() => setView('store'), 2000);
    };

    const addToCart = (product) => {
        setCart(prev => {
            const ex = prev.find(i => i.id === product.id);
            if (ex) return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
            return [...prev, { ...product, quantity: 1 }];
        });
        addToRecentlyViewed(product);
    };

    const updateQuantity = (id, delta) => {
        setCart(p => p.map(i => i.id === id ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i).filter(i => i.quantity > 0));
    };

    const removeFromCart = (id) => setCart(p => p.filter(i => i.id !== id));
    const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

    // ============================================
    // SIDEBAR - Purple & White Theme
    // ============================================
    const Sidebar = ({ mobile = false }) => (
        <div className={`${mobile ? 'w-80' : 'w-72'} bg-white border-r border-purple-100 flex flex-col h-full overflow-y-auto shadow-lg`}>
            <div className="p-6 border-b border-purple-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="https://i.ibb.co/L6vV6vW/vip-logo.png" alt="VIP" className="w-12 h-12 rounded-lg" />
                        <div>
                            <h1 className="text-xl font-black uppercase italic text-[#7C3AED]">VIP</h1>
                            <p className="text-[10px] text-gray-500">LUXURY FASHION</p>
                        </div>
                    </div>
                    {mobile && <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-purple-50 rounded-lg text-gray-600"><X size={24} /></button>}
                </div>
            </div>

            <div className="p-4">
                <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        className="w-full bg-gray-50 border border-purple-100 rounded-xl py-3 pl-12 pr-4 text-sm text-gray-800 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100"
                    />
                </div>
            </div>

            <div className="px-6 pb-4">
                <h3 className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest mb-4">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                    {sizeOptions.map(size => (
                        <button
                            key={size}
                            onClick={() => toggleSize(size)}
                            className={`py-3 rounded-lg text-sm font-bold transition-all ${filters.sizes.includes(size)
                                ? 'bg-[#7C3AED] text-white'
                                : 'bg-gray-50 border border-purple-100 text-gray-600 hover:border-[#7C3AED] hover:text-[#7C3AED]'
                                }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-6 pb-6">
                <h3 className="text-xs font-bold text-[#7C3AED] uppercase tracking-widest mb-4">Price Range</h3>
                <input
                    type="range"
                    min="0"
                    max="10000"
                    step="500"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters(p => ({ ...p, priceRange: [0, parseInt(e.target.value)] }))}
                    className="w-full accent-[#7C3AED]"
                />
                <div className="flex justify-between text-sm mt-3">
                    <span className="text-gray-500">0 EGP</span>
                    <span className="text-[#7C3AED] font-bold">{filters.priceRange[1].toLocaleString()} EGP</span>
                </div>
            </div>

            <div className="mt-auto p-4 border-t border-purple-100">
                <a
                    href={`https://wa.me/${myNumber}`}
                    className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-bold transition-all"
                >
                    <MessageCircle size={18} />
                    01006527185
                </a>
            </div>
        </div>
    );

    // ============================================
    // CHECKOUT MODE
    // ============================================
    if (checkoutMode) {
        return (
            <CheckoutPage
                cart={cart}
                onBack={() => setCheckoutMode(false)}
                onClearCart={() => setCart([])}
                onOrderComplete={() => { }}
            />
        );
    }

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans selection:bg-[#7C3AED] selection:text-white overflow-x-hidden">
            <AnimatePresence mode="wait">
                {/* Login - Purple Theme */}
                {view === 'login' && (
                    <motion.div
                        key="login"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ y: -1000 }}
                        className="flex flex-col items-center justify-center min-h-screen p-6 relative bg-gradient-to-br from-purple-50 via-white to-purple-100"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="mb-10 p-2 border-2 border-[#7C3AED] rounded-full shadow-[0_0_30px_rgba(124,58,237,0.3)]"
                        >
                            <img
                                src="https://i.ibb.co/L6vV6vW/vip-logo.png"
                                alt="VIP"
                                className="w-40 h-40 object-contain rounded-full"
                            />
                        </motion.div>

                        <div className="z-10 bg-white/90 backdrop-blur-md border border-purple-200 p-10 rounded-[2.5rem] w-full max-w-md text-center shadow-2xl">
                            <h1 className="text-3xl font-black mb-2 tracking-widest italic text-[#7C3AED]">VIP WORLD</h1>
                            <p className="text-gray-500 text-sm mb-8">LAUNCH YOUR STYLE. LIVE EXCLUSIVE.</p>

                            <div className="space-y-4 mb-8">
                                <input
                                    type="text"
                                    value={vipName}
                                    onChange={(e) => setVipName(e.target.value)}
                                    placeholder="ENTER VIP NAME"
                                    className="w-full bg-gray-50 p-4 rounded-xl border border-purple-100 outline-none focus:border-[#7C3AED] focus:ring-2 focus:ring-purple-100 transition-all text-center text-gray-800"
                                />
                            </div>

                            <button
                                onClick={handleLaunch}
                                className="w-full bg-[#7C3AED] text-white py-5 rounded-xl font-black text-2xl hover:bg-[#6D28D9] transition-all shadow-lg flex items-center justify-center gap-3"
                            >
                                JOIN THE ELITE <ChevronRight />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Rocket Launch - Purple Theme */}
                {view === 'launching' && (
                    <motion.div key="launch" className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white">
                        <motion.div
                            initial={{ y: 500 }}
                            animate={{ y: -1200 }}
                            transition={{ duration: 2, ease: "anticipate" }}
                        >
                            <Rocket size={100} className="text-[#7C3AED] fill-purple-200" />
                            <div className="w-10 h-32 bg-gradient-to-t from-[#7C3AED] to-transparent blur-2xl mx-auto"></div>
                        </motion.div>
                        <h2 className="text-xl font-black tracking-widest text-[#7C3AED] animate-pulse">PREPARING YOUR WORLD...</h2>
                    </motion.div>
                )}

                {/* Store - Purple & White Theme */}
                {view === 'store' && (
                    <motion.div key="shop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex bg-white">
                        <div className="hidden lg:block sticky top-0 h-screen"><Sidebar /></div>

                        <AnimatePresence>
                            {sidebarOpen && (
                                <>
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/40 z-50 lg:hidden" />
                                    <motion.div initial={{ x: -320 }} animate={{ x: 0 }} exit={{ x: -320 }} className="fixed left-0 top-0 bottom-0 z-50 lg:hidden">
                                        <Sidebar mobile />
                                    </motion.div>
                                </>
                            )}
                        </AnimatePresence>

                        <div className="flex-1 min-w-0 p-4 md:p-8 bg-gray-50">
                            <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 bg-white rounded-xl border border-purple-100 text-gray-600 hover:text-[#7C3AED]">
                                        <Menu size={22} />
                                    </button>
                                    <h1 className="text-2xl md:text-3xl font-black uppercase italic text-[#7C3AED]">
                                        VIP
                                    </h1>
                                    {/* Cart button for mobile/tablet */}
                                    <button
                                        onClick={() => setCartOpen(true)}
                                        className="relative ml-auto p-2 bg-[#7C3AED] rounded-xl text-white hover:bg-[#6D28D9]"
                                    >
                                        <ShoppingCart size={22} />
                                        {cartCount > 0 && (
                                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                {cartCount}
                                            </span>
                                        )}
                                    </button>
                                </div>

                                <div className="flex bg-white p-1.5 rounded-2xl border border-purple-100 shadow-sm">
                                    <button
                                        onClick={() => setCategory('men')}
                                        className={`px-8 md:px-10 py-3 rounded-xl font-bold transition-all ${category === 'men' ? 'bg-[#7C3AED] text-white' : 'text-gray-500 hover:text-[#7C3AED]'}`}
                                    >
                                        رجالي (50)
                                    </button>
                                    <button
                                        onClick={() => setCategory('women')}
                                        className={`px-8 md:px-10 py-3 rounded-xl font-bold transition-all ${category === 'women' ? 'bg-[#7C3AED] text-white' : 'text-gray-500 hover:text-[#7C3AED]'}`}
                                    >
                                        نسائي (50)
                                    </button>
                                </div>
                            </header>

                            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                                {filteredProducts.map((product, i) => {
                                    const isInWishlist = wishlist.includes(product.id);
                                    return (
                                        <motion.div
                                            key={product.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: (i % 10) * 0.03 }}
                                            whileHover={{ y: -10 }}
                                            className="bg-white border border-purple-50 rounded-3xl overflow-hidden hover:border-[#7C3AED] hover:shadow-xl transition-all group"
                                        >
                                            <div className="aspect-[4/5] relative overflow-hidden">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                                />

                                                <button
                                                    onClick={() => toggleWishlist(product.id)}
                                                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-purple-50 transition-all z-10 border border-purple-100"
                                                >
                                                    <Heart size={16} className={isInWishlist ? 'fill-[#7C3AED] text-[#7C3AED]' : 'text-[#7C3AED]'} />
                                                </button>

                                                {product.isPremium && (
                                                    <div className="absolute top-3 left-3 flex items-center gap-1 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] text-white text-[9px] font-black px-2 py-1 rounded-full shadow-lg z-10">
                                                        <Crown size={10} /> VIP
                                                    </div>
                                                )}

                                                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs shadow">
                                                    <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                                    <span className="font-bold text-gray-700">{product.rating}</span>
                                                </div>
                                            </div>

                                            <div className="p-4">
                                                <h3 className="text-xs text-gray-500 mb-1 uppercase tracking-tighter">
                                                    {category === 'men' ? 'رجالي' : 'نسائي'} • {product.name}
                                                </h3>
                                                <div className="text-[10px] text-red-500 font-bold mb-2">
                                                    <Zap size={10} className="inline" /> {product.stock} قطع متبقية
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-lg font-black text-gray-800">{product.price.toLocaleString()} <span className="text-xs text-gray-400">EGP</span></span>
                                                    <button
                                                        onClick={() => addToCart(product)}
                                                        className="p-2.5 bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-xl hover:scale-110 transition-transform shadow-lg"
                                                    >
                                                        <ShoppingCart size={16} className="text-white" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            <footer className="mt-32 py-16 border-t border-purple-100 text-center">
                                <p className="text-[#7C3AED] font-bold mb-4">VIP</p>
                                <p className="text-gray-400 font-mono text-xs italic">DESIGNED FOR THE TOP 1% • 2026</p>
                            </footer>

                            <div className="h-48"></div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Cart Drawer - Purple & White Theme */}
            <AnimatePresence>
                {cartOpen && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setCartOpen(false)} className="fixed inset-0 bg-black/40 z-[250]" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-purple-100 z-[250] flex flex-col shadow-2xl">
                            <div className="flex items-center justify-between p-5 border-b border-purple-100">
                                <h2 className="font-bold text-xl flex items-center gap-3 text-gray-800"><ShoppingCart size={22} className="text-[#7C3AED]" />Cart ({cartCount})</h2>
                                <button onClick={() => setCartOpen(false)} className="p-2 hover:bg-purple-50 rounded-lg text-gray-600"><X size={22} /></button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                                {cart.length === 0 ? (
                                    <div className="text-center py-20 text-gray-400"><ShoppingCart size={56} className="mx-auto mb-4 opacity-30" /><p>السلة فارغة</p></div>
                                ) : cart.map(item => (
                                    <div key={item.id} className="flex gap-4 bg-white rounded-xl p-4 border border-purple-50 shadow-sm">
                                        <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                                            <p className="text-xs text-[#7C3AED] mb-2">VIP Piece</p>
                                            <p className="text-gray-800 font-bold text-lg">{item.price.toLocaleString()} EGP</p>
                                            <div className="flex items-center gap-3 mt-3">
                                                <button onClick={() => updateQuantity(item.id, -1)} className="p-1.5 bg-purple-50 rounded-lg text-[#7C3AED] hover:bg-purple-100"><Minus size={14} /></button>
                                                <span className="font-bold w-8 text-center text-gray-800">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, 1)} className="p-1.5 bg-purple-50 rounded-lg text-[#7C3AED] hover:bg-purple-100"><Plus size={14} /></button>
                                                <button onClick={() => removeFromCart(item.id)} className="ml-auto text-red-400 hover:text-red-500"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {cart.length > 0 && (
                                <div className="p-5 border-t border-purple-100 space-y-4 bg-white">
                                    <div className="flex justify-between text-xl font-bold"><span className="text-gray-800">Total</span><span className="text-[#7C3AED]">{cartTotal.toLocaleString()} EGP</span></div>
                                    <button
                                        onClick={() => { setCartOpen(false); setCheckoutMode(true); }}
                                        className="w-full bg-[#7C3AED] hover:bg-[#6D28D9] py-4 rounded-xl font-bold text-lg text-white flex items-center justify-center gap-3 shadow-lg"
                                    >
                                        Checkout <ArrowRight size={20} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
