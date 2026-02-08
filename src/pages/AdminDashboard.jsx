import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LogIn, LogOut, Package, ShoppingBag, Users, Settings,
    Plus, Edit, Trash2, Eye, CheckCircle, XCircle, Clock,
    Truck, X, Save, Image as ImageIcon, Phone, MapPin, Calendar,
    Search, Filter, RefreshCw, DollarSign, ChevronDown
} from 'lucide-react';
import { authApi, ordersApi, productsApi } from '../api';

// API Base URL for images
const getApiBase = () => (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

// Login Component
function AdminLogin({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authApi.login(username, password);
            if (response.token) {
                localStorage.setItem('adminToken', response.token);
                onLogin(response.token);
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Is the server running?');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-[#A855F7]/30"
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-black text-white mb-2">VIP ADMIN</h1>
                    <p className="text-white/50">Login to manage your store</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-white/60 mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                            placeholder="admin"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-white/60 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm text-center">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl font-bold text-white flex items-center justify-center gap-2"
                    >
                        {loading ? 'Logging in...' : <><LogIn size={18} /> Login</>}
                    </button>
                </form>
            </motion.div>
        </div>
    );
}

// Enhanced Orders Tab
function OrdersTab({ token }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        try {
            const data = await ordersApi.getAll(token);
            setOrders(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading orders:', err);
        }
        setLoading(false);
    };

    const updateStatus = async (id, status) => {
        await ordersApi.updateStatus(id, status, token);
        loadOrders();
    };

    const deleteOrder = async (id) => {
        if (confirm('Delete this order?')) {
            await ordersApi.delete(id, token);
            loadOrders();
        }
    };

    const statusColors = {
        pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
        confirmed: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        shipped: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        delivered: 'bg-green-500/20 text-green-400 border-green-500/30',
        cancelled: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    const statusLabels = {
        pending: 'قيد الانتظار',
        confirmed: 'تم التأكيد',
        shipped: 'تم الشحن',
        delivered: 'تم التوصيل',
        cancelled: 'ملغي'
    };

    const filteredOrders = filterStatus === 'all'
        ? orders
        : orders.filter(o => o.status === filterStatus);

    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0)
    };

    if (loading) return (
        <div className="text-white/50 text-center py-12 flex items-center justify-center gap-3">
            <RefreshCw size={20} className="animate-spin" />
            Loading orders...
        </div>
    );

    return (
        <div>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/50 text-sm">Total Orders</p>
                    <p className="text-2xl font-bold text-white">{stats.total}</p>
                </div>
                <div className="bg-yellow-500/10 rounded-xl p-4 border border-yellow-500/20">
                    <p className="text-yellow-400/70 text-sm">Pending</p>
                    <p className="text-2xl font-bold text-yellow-400">{stats.pending}</p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                    <p className="text-green-400/70 text-sm">Delivered</p>
                    <p className="text-2xl font-bold text-green-400">{stats.delivered}</p>
                </div>
                <div className="bg-[#A855F7]/10 rounded-xl p-4 border border-[#A855F7]/20">
                    <p className="text-[#A855F7]/70 text-sm">Revenue</p>
                    <p className="text-2xl font-bold text-[#A855F7]">{stats.revenue.toLocaleString()} EGP</p>
                </div>
            </div>

            {/* Header with Filter */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">Orders ({filteredOrders.length})</h2>
                <div className="flex gap-3">
                    <select
                        value={filterStatus}
                        onChange={e => setFilterStatus(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                    <button
                        onClick={loadOrders}
                        className="px-4 py-2 bg-[#A855F7]/20 rounded-lg text-[#A855F7] text-sm flex items-center gap-2"
                    >
                        <RefreshCw size={16} /> Refresh
                    </button>
                </div>
            </div>

            {filteredOrders.length === 0 ? (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10">
                    <ShoppingBag size={48} className="mx-auto mb-4 text-white/20" />
                    <p className="text-white/50">No orders found</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredOrders.map(order => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 rounded-2xl p-5 border border-white/10 hover:border-[#A855F7]/30 transition-all"
                        >
                            {/* Order Header */}
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white truncate">{order.customerName}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${statusColors[order.status]}`}>
                                            {order.status?.toUpperCase()} | {statusLabels[order.status]}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm">
                                        <span className="flex items-center gap-2 text-white/60">
                                            <Phone size={14} /> {order.phone}
                                        </span>
                                        <span className="flex items-center gap-2 text-white/60">
                                            <Calendar size={14} /> {new Date(order.createdAt).toLocaleDateString('ar-EG')}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-[#A855F7]">{order.total?.toLocaleString()} EGP</p>
                                    <p className="text-xs text-white/40">{order.items?.length || 0} items</p>
                                </div>
                            </div>

                            {/* Address */}
                            <div className="flex items-start gap-2 text-white/60 text-sm mb-4 bg-black/30 rounded-lg p-3">
                                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                                <span>{order.address}</span>
                            </div>

                            {/* Order Items Preview */}
                            {order.items && order.items.length > 0 && (
                                <div className="mb-4 bg-black/30 rounded-lg p-3">
                                    <p className="text-white/50 text-xs mb-2">Items:</p>
                                    <div className="space-y-1">
                                        {order.items.slice(0, 3).map((item, i) => (
                                            <div key={i} className="flex justify-between text-sm">
                                                <span className="text-white">{item.name} <span className="text-white/50">x{item.quantity}</span></span>
                                                <span className="text-[#D8B4FE]">{(item.price * item.quantity).toLocaleString()} EGP</span>
                                            </div>
                                        ))}
                                        {order.items.length > 3 && (
                                            <p className="text-white/40 text-xs">+{order.items.length - 3} more items...</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setSelectedOrder(order)}
                                        className="px-4 py-2 bg-[#A855F7]/20 rounded-lg text-[#A855F7] text-sm font-bold flex items-center gap-2 hover:bg-[#A855F7]/30 transition-all"
                                    >
                                        <Eye size={16} /> View Details
                                    </button>
                                    {order.paymentScreenshot && (
                                        <span className="px-3 py-2 bg-green-500/20 rounded-lg text-green-400 text-xs flex items-center gap-1">
                                            <ImageIcon size={14} /> Has Screenshot
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <select
                                        value={order.status}
                                        onChange={e => updateStatus(order._id, e.target.value)}
                                        className="bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <button
                                        onClick={() => deleteOrder(order._id)}
                                        className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-all"
                                    >
                                        <Trash2 size={16} className="text-red-400" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Order Detail Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-[#0A0A0A] rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#A855F7]/30"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Order Details</h3>
                                    <p className="text-white/50 text-sm">#{selectedOrder._id?.slice(-8)}</p>
                                </div>
                                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/10 rounded-full">
                                    <X size={24} className="text-white" />
                                </button>
                            </div>

                            {/* Customer Info */}
                            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                                <h4 className="text-lg font-bold text-white mb-3">{selectedOrder.customerName}</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Phone size={16} className="text-[#A855F7]" />
                                        <a href={`tel:${selectedOrder.phone}`} className="hover:text-[#A855F7]">{selectedOrder.phone}</a>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/70">
                                        <Calendar size={16} className="text-[#A855F7]" />
                                        {new Date(selectedOrder.createdAt).toLocaleString('ar-EG')}
                                    </div>
                                </div>
                                <div className="flex items-start gap-2 text-white/70 mt-3">
                                    <MapPin size={16} className="text-[#A855F7] flex-shrink-0 mt-1" />
                                    <span>{selectedOrder.address}</span>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                                <h4 className="text-sm font-bold text-white/50 mb-3">ORDER ITEMS</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, i) => (
                                        <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                                            <div>
                                                <p className="text-white font-medium">{item.name}</p>
                                                <p className="text-white/50 text-sm">Qty: {item.quantity} × {item.price?.toLocaleString()} EGP</p>
                                            </div>
                                            <span className="text-[#A855F7] font-bold">{(item.price * item.quantity).toLocaleString()} EGP</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
                                    <span className="text-xl font-bold text-white">Total</span>
                                    <span className="text-2xl font-black text-[#A855F7]">{selectedOrder.total?.toLocaleString()} EGP</span>
                                </div>
                            </div>

                            {/* Payment Screenshot */}
                            {selectedOrder.paymentScreenshot && (
                                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                    <h4 className="text-sm font-bold text-white/50 mb-3 flex items-center gap-2">
                                        <ImageIcon size={16} /> PAYMENT SCREENSHOT
                                    </h4>
                                    <img
                                        src={`${getApiBase()}${selectedOrder.paymentScreenshot}`}
                                        alt="Payment Screenshot"
                                        className="w-full max-h-96 object-contain rounded-lg border border-white/10"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><rect fill="%23111" width="200" height="100"/><text fill="%23666" x="50%" y="50%" dominant-baseline="middle" text-anchor="middle">Image not found</text></svg>';
                                        }}
                                    />
                                    <a
                                        href={`${getApiBase()}${selectedOrder.paymentScreenshot}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block mt-3 text-[#A855F7] text-sm hover:underline"
                                    >
                                        Open in new tab →
                                    </a>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Enhanced Products Tab with Search
function ProductsTab({ token }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await productsApi.getAll();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Error loading products:', err);
        }
        setLoading(false);
    };

    const deleteProduct = async (id) => {
        if (confirm('Delete this product?')) {
            await productsApi.delete(id, token);
            loadProducts();
        }
    };

    // Filter products
    const filteredProducts = products.filter(p => {
        const matchesSearch = !searchQuery ||
            p.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.nameAr?.includes(searchQuery) ||
            p.price?.toString().includes(searchQuery);
        const matchesCategory = filterCategory === 'all' || p.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    const menProducts = products.filter(p => p.category === 'men');
    const womenProducts = products.filter(p => p.category === 'women');

    if (loading) return (
        <div className="text-white/50 text-center py-12 flex items-center justify-center gap-3">
            <RefreshCw size={20} className="animate-spin" />
            Loading products...
        </div>
    );

    return (
        <div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <p className="text-white/50 text-sm">Total</p>
                    <p className="text-2xl font-bold text-white">{products.length}</p>
                </div>
                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/20">
                    <p className="text-blue-400/70 text-sm">Men</p>
                    <p className="text-2xl font-bold text-blue-400">{menProducts.length}</p>
                </div>
                <div className="bg-pink-500/10 rounded-xl p-4 border border-pink-500/20">
                    <p className="text-pink-400/70 text-sm">Women</p>
                    <p className="text-2xl font-bold text-pink-400">{womenProducts.length}</p>
                </div>
            </div>

            {/* Header with Search & Filter */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <h2 className="text-2xl font-bold text-white">
                    Products ({filteredProducts.length})
                </h2>
                <div className="flex flex-wrap gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            className="bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm w-48 focus:outline-none focus:border-[#A855F7]"
                        />
                    </div>
                    <select
                        value={filterCategory}
                        onChange={e => setFilterCategory(e.target.value)}
                        className="bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-white text-sm"
                    >
                        <option value="all">All Categories</option>
                        <option value="men">Men</option>
                        <option value="women">Women</option>
                    </select>
                    <button
                        onClick={() => { setEditingProduct(null); setShowForm(true); }}
                        className="px-4 py-2 bg-[#A855F7] rounded-lg text-white text-sm flex items-center gap-2 font-bold"
                    >
                        <Plus size={16} /> Add Product
                    </button>
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#A855F7]/30 transition-all group"
                    >
                        <div className="relative">
                            <img src={product.image} alt={product.nameEn} className="w-full h-36 object-cover" />
                            <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold ${product.category === 'men' ? 'bg-blue-500/80 text-white' : 'bg-pink-500/80 text-white'
                                }`}>
                                {product.category === 'men' ? 'MEN' : 'WOMEN'}
                            </span>
                            {product.isPremium && (
                                <span className="absolute top-2 right-2 px-2 py-0.5 bg-[#C9A961] rounded text-xs font-bold text-black">
                                    PREMIUM
                                </span>
                            )}
                        </div>
                        <div className="p-3">
                            <h4 className="text-white font-bold text-sm truncate">{product.nameEn}</h4>
                            <p className="text-[#D8B4FE] text-xs truncate">{product.nameAr}</p>
                            <div className="flex items-center justify-between mt-2">
                                <p className="text-[#A855F7] font-bold">{product.price?.toLocaleString()} EGP</p>
                                <span className="text-white/40 text-xs">Stock: {product.stock || 0}</span>
                            </div>
                            <div className="flex gap-2 mt-3">
                                <button
                                    onClick={() => { setEditingProduct(product); setShowForm(true); }}
                                    className="flex-1 py-2 bg-[#A855F7]/20 hover:bg-[#A855F7]/30 rounded-lg text-xs text-[#A855F7] font-bold flex items-center justify-center gap-1 transition-all"
                                >
                                    <Edit size={12} /> Edit
                                </button>
                                <button
                                    onClick={() => deleteProduct(product._id)}
                                    className="py-2 px-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-all"
                                >
                                    <Trash2 size={14} className="text-red-400" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredProducts.length === 0 && (
                <div className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 mt-4">
                    <Package size={48} className="mx-auto mb-4 text-white/20" />
                    <p className="text-white/50">No products found</p>
                </div>
            )}

            {/* Product Form Modal */}
            <AnimatePresence>
                {showForm && (
                    <ProductForm
                        product={editingProduct}
                        token={token}
                        onClose={() => setShowForm(false)}
                        onSave={() => { setShowForm(false); loadProducts(); }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// Product Form
function ProductForm({ product, token, onClose, onSave }) {
    const [formData, setFormData] = useState({
        nameEn: product?.nameEn || '',
        nameAr: product?.nameAr || '',
        category: product?.category || 'men',
        price: product?.price || 1500,
        image: product?.image || '',
        stock: product?.stock || 10,
        isPremium: product?.isPremium || false,
        isLimited: product?.isLimited || false
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (product) {
                await productsApi.update(product._id, formData, token);
            } else {
                await productsApi.create(formData, token);
            }
            onSave();
        } catch (err) {
            console.error('Error saving product:', err);
            alert('Error saving product');
        }
        setSaving(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#0A0A0A] rounded-2xl p-6 max-w-md w-full border border-[#A855F7]/30 max-h-[90vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full">
                        <X size={20} className="text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-white/60 mb-1">Name (English)</label>
                        <input
                            type="text"
                            value={formData.nameEn}
                            onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-white/60 mb-1">Name (Arabic)</label>
                        <input
                            type="text"
                            value={formData.nameAr}
                            onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-[#A855F7] focus:outline-none"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-1">Category</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                            >
                                <option value="men">Men</option>
                                <option value="women">Women</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-white/60 mb-1">Price (EGP)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={e => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm text-white/60 mb-1">Image URL</label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={e => setFormData({ ...formData, image: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                            required
                        />
                        {formData.image && (
                            <img src={formData.image} alt="Preview" className="mt-2 h-20 w-full object-cover rounded-lg" />
                        )}
                    </div>
                    <div>
                        <label className="block text-sm text-white/60 mb-1">Stock</label>
                        <input
                            type="number"
                            value={formData.stock}
                            onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                            className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white"
                        />
                    </div>
                    <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-white cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isPremium}
                                onChange={e => setFormData({ ...formData, isPremium: e.target.checked })}
                                className="w-4 h-4 accent-[#A855F7]"
                            />
                            Premium
                        </label>
                        <label className="flex items-center gap-2 text-white cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isLimited}
                                onChange={e => setFormData({ ...formData, isLimited: e.target.checked })}
                                className="w-4 h-4 accent-[#A855F7]"
                            />
                            Limited Edition
                        </label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 bg-[#A855F7] hover:bg-[#9333EA] rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                            {saving ? 'Saving...' : 'Save Product'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

// Main Admin Dashboard
export default function AdminDashboard() {
    const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
    const [activeTab, setActiveTab] = useState('orders');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        setToken('');
    };

    if (!token) {
        return <AdminLogin onLogin={setToken} />;
    }

    return (
        <div className="min-h-screen bg-black">
            {/* Header */}
            <header className="bg-white/5 border-b border-white/10 px-4 lg:px-6 py-4 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-xl lg:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#A855F7] to-[#D8B4FE]">
                        VIP ADMIN
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-all"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
                {/* Tabs */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'orders'
                            ? 'bg-[#A855F7] text-white shadow-lg shadow-[#A855F7]/30'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        <ShoppingBag size={18} /> Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === 'products'
                            ? 'bg-[#A855F7] text-white shadow-lg shadow-[#A855F7]/30'
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                            }`}
                    >
                        <Package size={18} /> Products
                    </button>
                </div>

                {/* Content */}
                {activeTab === 'orders' && <OrdersTab token={token} />}
                {activeTab === 'products' && <ProductsTab token={token} />}
            </div>
        </div>
    );
}
