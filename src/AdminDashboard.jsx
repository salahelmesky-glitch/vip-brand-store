import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    DollarSign,
    TrendingUp,
    Package,
    Users,
    ShoppingCart,
    Clock,
    CheckCircle,
    XCircle,
    Eye,
    Phone,
    MapPin,
    Calendar,
    CreditCard,
    Truck,
    Crown,
    BarChart3,
    Settings,
    RefreshCw
} from 'lucide-react';
import { supabase } from './lib/supabase';

export default function AdminDashboard({ onBack }) {
    const [activeTab, setActiveTab] = useState('overview');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [profitMargin, setProfitMargin] = useState(30);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // Fake stats for demo (will be replaced with real data)
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        pendingOrders: 0,
        completedOrders: 0,
        totalCustomers: 0,
        todayRevenue: 0
    });

    // Load orders from Supabase
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            setOrders(data || []);
            calculateStats(data || []);
        } catch (error) {
            console.error('Error fetching orders:', error);
            // Use demo data if no orders
            const demoOrders = generateDemoOrders();
            setOrders(demoOrders);
            calculateStats(demoOrders);
        } finally {
            setLoading(false);
        }
    };

    const generateDemoOrders = () => {
        const names = ['أحمد محمد', 'محمد علي', 'سارة أحمد', 'فاطمة حسن', 'عمر خالد', 'نور الدين', 'ياسمين محمود', 'كريم سعيد'];
        const cities = ['القاهرة', 'الجيزة', 'الإسكندرية', 'المنصورة', 'طنطا'];
        const statuses = ['pending', 'confirmed', 'shipped', 'delivered'];
        const paymentMethods = ['vodafone', 'fawry', 'card'];

        return [...Array(15)].map((_, i) => ({
            id: `VIP-${2024001 + i}`,
            customer_name: names[i % names.length],
            customer_phone: `0100${Math.floor(1000000 + Math.random() * 9000000)}`,
            customer_address: `شارع ${i + 1}، ${cities[i % cities.length]}`,
            items: [
                { name: `VIP Edition #${i + 1}`, price: 1500 + (i * 100), quantity: Math.floor(Math.random() * 2) + 1 }
            ],
            total: 1500 + (i * 100) * (Math.floor(Math.random() * 2) + 1),
            payment_method: paymentMethods[i % 3],
            status: statuses[i % 4],
            created_at: new Date(Date.now() - i * 3600000 * 6).toISOString()
        }));
    };

    const calculateStats = (ordersData) => {
        const total = ordersData.reduce((sum, o) => sum + (o.total || 0), 0);
        const pending = ordersData.filter(o => o.status === 'pending').length;
        const completed = ordersData.filter(o => o.status === 'delivered').length;
        const today = new Date().toDateString();
        const todayOrders = ordersData.filter(o => new Date(o.created_at).toDateString() === today);
        const todayRev = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

        setStats({
            totalRevenue: total,
            totalOrders: ordersData.length,
            pendingOrders: pending,
            completedOrders: completed,
            totalCustomers: new Set(ordersData.map(o => o.customer_phone)).size,
            todayRevenue: todayRev
        });
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
            calculateStats(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            console.error('Error updating order:', error);
        }
    };

    const profit = stats.totalRevenue * (profitMargin / 100);

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'confirmed': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'shipped': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
            case 'delivered': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'cancelled': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'قيد الانتظار';
            case 'confirmed': return 'تم التأكيد';
            case 'shipped': return 'تم الشحن';
            case 'delivered': return 'تم التوصيل';
            case 'cancelled': return 'ملغي';
            default: return status;
        }
    };

    const getPaymentIcon = (method) => {
        switch (method) {
            case 'vodafone': return '📱';
            case 'fawry': return '🏪';
            case 'card': return '💳';
            default: return '💰';
        }
    };

    return (
        <div className="h-full bg-black text-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 lg:p-6 border-b border-white/10 flex-shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-[#C9A961] to-[#800020] rounded-xl flex items-center justify-center">
                        <Crown size={24} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl lg:text-2xl font-black">VIP Admin Dashboard</h1>
                        <p className="text-gray-500 text-sm">مركز التحكم الرئيسي</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={fetchOrders} className="p-2 bg-neutral-900 rounded-xl border border-white/10 hover:border-[#C9A961]">
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={onBack} className="p-2 bg-neutral-900 rounded-xl border border-white/10 hover:border-red-500">
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/5 px-4 lg:px-6 flex-shrink-0 overflow-x-auto">
                {[
                    { id: 'overview', label: 'نظرة عامة', icon: <BarChart3 size={16} /> },
                    { id: 'orders', label: 'الطلبات', icon: <Package size={16} /> },
                    { id: 'settings', label: 'الإعدادات', icon: <Settings size={16} /> }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                                ? 'text-[#C9A961] border-b-2 border-[#C9A961]'
                                : 'text-gray-500 hover:text-white'
                            }`}
                    >
                        {tab.icon}
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-[#C9A961]/20 to-[#C9A961]/5 rounded-2xl p-5 border border-[#C9A961]/30">
                                <DollarSign className="text-[#C9A961] mb-3" size={28} />
                                <p className="text-gray-400 text-sm mb-1">إجمالي الإيرادات</p>
                                <p className="text-2xl lg:text-3xl font-black text-white">{stats.totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-[#C9A961]">EGP</p>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-5 border border-green-500/30">
                                <TrendingUp className="text-green-400 mb-3" size={28} />
                                <p className="text-gray-400 text-sm mb-1">صافي الربح</p>
                                <p className="text-2xl lg:text-3xl font-black text-white">{profit.toLocaleString()}</p>
                                <p className="text-xs text-green-400">{profitMargin}% margin</p>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl p-5 border border-blue-500/30">
                                <Package className="text-blue-400 mb-3" size={28} />
                                <p className="text-gray-400 text-sm mb-1">إجمالي الطلبات</p>
                                <p className="text-2xl lg:text-3xl font-black text-white">{stats.totalOrders}</p>
                                <p className="text-xs text-yellow-400">{stats.pendingOrders} قيد الانتظار</p>
                            </motion.div>

                            <motion.div whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-2xl p-5 border border-purple-500/30">
                                <Users className="text-purple-400 mb-3" size={28} />
                                <p className="text-gray-400 text-sm mb-1">العملاء</p>
                                <p className="text-2xl lg:text-3xl font-black text-white">{stats.totalCustomers}</p>
                                <p className="text-xs text-green-400">{stats.completedOrders} طلب مكتمل</p>
                            </motion.div>
                        </div>

                        {/* Profit Margin Slider */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-3">
                                <TrendingUp className="text-[#C9A961]" size={20} />
                                هامش الربح
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="range"
                                    min="10"
                                    max="70"
                                    value={profitMargin}
                                    onChange={(e) => setProfitMargin(parseInt(e.target.value))}
                                    className="w-full accent-[#C9A961]"
                                />
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">10%</span>
                                    <span className="text-2xl font-black text-[#C9A961]">{profitMargin}%</span>
                                    <span className="text-gray-500">70%</span>
                                </div>
                                <div className="bg-black rounded-xl p-4 flex justify-between items-center">
                                    <span className="text-gray-400">صافي الربح المتوقع:</span>
                                    <span className="text-3xl font-black text-green-400">{profit.toLocaleString()} EGP</span>
                                </div>
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-lg font-bold mb-4">آخر الطلبات</h3>
                            <div className="space-y-3">
                                {orders.slice(0, 5).map(order => (
                                    <div key={order.id} className="flex items-center justify-between p-3 bg-black rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span>{getPaymentIcon(order.payment_method)}</span>
                                            <div>
                                                <p className="font-bold text-sm">{order.customer_name}</p>
                                                <p className="text-xs text-gray-500">{order.id}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#C9A961]">{order.total?.toLocaleString()} EGP</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusColor(order.status)}`}>
                                                {getStatusLabel(order.status)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="w-10 h-10 border-2 border-[#C9A961]/30 border-t-[#C9A961] rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-gray-500">جاري تحميل الطلبات...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="text-center py-20">
                                <Package size={64} className="mx-auto mb-4 text-gray-700" />
                                <p className="text-gray-500">لا توجد طلبات بعد</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-neutral-900 rounded-2xl p-5 border border-white/5 hover:border-[#C9A961]/30 transition-all"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{getPaymentIcon(order.payment_method)}</span>
                                                <h3 className="font-bold text-lg">{order.customer_name}</h3>
                                                <span className={`text-xs px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                                                    {getStatusLabel(order.status)}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-sm flex items-center gap-2">
                                                <Calendar size={14} />
                                                {new Date(order.created_at).toLocaleString('ar-EG')}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-[#C9A961]">{order.total?.toLocaleString()} EGP</p>
                                            <p className="text-xs text-gray-500">{order.id}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <Phone size={14} />
                                            <span>{order.customer_phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <MapPin size={14} />
                                            <span>{order.customer_address}</span>
                                        </div>
                                    </div>

                                    {/* Status Update Buttons */}
                                    <div className="flex flex-wrap gap-2">
                                        {['pending', 'confirmed', 'shipped', 'delivered'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => updateOrderStatus(order.id, status)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${order.status === status
                                                        ? getStatusColor(status)
                                                        : 'bg-neutral-800 text-gray-500 hover:text-white'
                                                    }`}
                                            >
                                                {getStatusLabel(status)}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                            <h3 className="text-lg font-bold mb-4">إعدادات المتجر</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">اسم المتجر</label>
                                    <input type="text" defaultValue="VIP BRAND" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#C9A961]" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">رقم الواتساب</label>
                                    <input type="text" defaultValue="01006527185" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#C9A961]" />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">الشحن المجاني فوق (EGP)</label>
                                    <input type="number" defaultValue="2000" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#C9A961]" />
                                </div>
                            </div>
                        </div>

                        <button className="w-full bg-[#800020] hover:bg-[#a00028] py-4 rounded-xl font-bold">
                            حفظ الإعدادات
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
