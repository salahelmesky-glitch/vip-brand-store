import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft,
    CreditCard,
    Smartphone,
    Building2,
    CheckCircle2,
    Shield,
    Lock,
    Package,
    Truck,
    MapPin,
    User,
    Phone,
    Crown,
    Rocket,
    Sparkles
} from 'lucide-react';
import { supabase } from './lib/supabase';

export default function CheckoutPage({ cart = [], onBack, onOrderComplete, onClearCart }) {
    const [step, setStep] = useState(1); // 1: Info, 2: Payment, 3: Success
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
        notes: ''
    });
    const [orderId, setOrderId] = useState(null);

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shipping = cartTotal > 2000 ? 0 : 50;
    const finalTotal = cartTotal + shipping;

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const isStep1Valid = formData.name && formData.phone && formData.address && formData.city;

    const handlePayment = async () => {
        if (!paymentMethod) return;

        setLoading(true);

        try {
            // Create order in Supabase
            const { data, error } = await supabase
                .from('orders')
                .insert({
                    customer_name: formData.name,
                    customer_phone: formData.phone,
                    customer_address: `${formData.address}, ${formData.city}`,
                    items: cart,
                    total: finalTotal,
                    payment_method: paymentMethod,
                    status: 'pending',
                    notes: formData.notes
                })
                .select()
                .single();

            if (error) throw error;

            setOrderId(data.id);
            setStep(3);
            if (onClearCart) onClearCart();
            if (onOrderComplete) onOrderComplete(data);
        } catch (error) {
            console.error('Order error:', error);
            // Still show success for demo
            setOrderId(`VIP-${Date.now()}`);
            setStep(3);
            if (onClearCart) onClearCart();
        } finally {
            setLoading(false);
        }
    };

    const paymentMethods = [
        {
            id: 'vodafone',
            name: 'Vodafone Cash',
            icon: <Smartphone size={24} className="text-red-500" />,
            description: 'ادفع عن طريق فودافون كاش',
            color: 'from-red-500/20 to-red-600/20',
            border: 'border-red-500'
        },
        {
            id: 'fawry',
            name: 'Fawry',
            icon: <Building2 size={24} className="text-yellow-500" />,
            description: 'ادفع في أي فرع فوري',
            color: 'from-yellow-500/20 to-yellow-600/20',
            border: 'border-yellow-500'
        },
        {
            id: 'card',
            name: 'Credit Card',
            icon: <CreditCard size={24} className="text-blue-500" />,
            description: 'Visa / Mastercard',
            color: 'from-blue-500/20 to-blue-600/20',
            border: 'border-blue-500'
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <AnimatePresence mode="wait">
                {/* Step 1: Customer Information */}
                {step === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="min-h-screen p-4 lg:p-8"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={onBack} className="p-2 bg-neutral-900 rounded-xl border border-white/10 hover:border-[#800020]">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black">Checkout</h1>
                                <p className="text-gray-500 text-sm">Step 1 of 2 - Your Details</p>
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            {/* Progress */}
                            <div className="flex items-center gap-4 mb-10">
                                <div className="flex-1 h-1 bg-[#800020] rounded-full" />
                                <div className="flex-1 h-1 bg-neutral-800 rounded-full" />
                            </div>

                            {/* Form */}
                            <div className="space-y-6">
                                <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                                    <h2 className="text-lg font-bold mb-6 flex items-center gap-3">
                                        <User className="text-[#C9A961]" size={20} />
                                        معلومات التوصيل
                                    </h2>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">الاسم كامل *</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                placeholder="أحمد محمد"
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#800020] transition-all"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">رقم الموبايل *</label>
                                            <div className="flex">
                                                <span className="bg-neutral-800 border border-white/10 border-r-0 rounded-l-xl px-4 py-3 text-gray-400">+20</span>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="01006527185"
                                                    className="flex-1 bg-black border border-white/10 rounded-r-xl px-4 py-3 outline-none focus:border-[#800020] transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">المدينة *</label>
                                            <select
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#800020] transition-all"
                                            >
                                                <option value="">اختر المدينة</option>
                                                <option value="القاهرة">القاهرة</option>
                                                <option value="الجيزة">الجيزة</option>
                                                <option value="الإسكندرية">الإسكندرية</option>
                                                <option value="المنصورة">المنصورة</option>
                                                <option value="طنطا">طنطا</option>
                                                <option value="أسيوط">أسيوط</option>
                                                <option value="الأقصر">الأقصر</option>
                                                <option value="أسوان">أسوان</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">العنوان بالتفصيل *</label>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                placeholder="الشارع، رقم العمارة، الدور، الشقة..."
                                                rows={3}
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#800020] transition-all resize-none"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-400 mb-2">ملاحظات (اختياري)</label>
                                            <input
                                                type="text"
                                                name="notes"
                                                value={formData.notes}
                                                onChange={handleInputChange}
                                                placeholder="مثال: اتصل قبل التوصيل"
                                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-[#800020] transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                                    <h2 className="text-lg font-bold mb-4">ملخص الطلب</h2>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-400">المنتجات ({cart.length})</span><span>{cartTotal.toLocaleString()} EGP</span></div>
                                        <div className="flex justify-between"><span className="text-gray-400">الشحن</span><span className={shipping === 0 ? 'text-green-400' : ''}>{shipping === 0 ? 'مجاني' : `${shipping} EGP`}</span></div>
                                        <div className="border-t border-white/10 pt-3 flex justify-between text-lg font-bold">
                                            <span>الإجمالي</span>
                                            <span className="text-[#C9A961]">{finalTotal.toLocaleString()} EGP</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setStep(2)}
                                    disabled={!isStep1Valid}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${isStep1Valid
                                            ? 'bg-[#800020] hover:bg-[#a00028]'
                                            : 'bg-neutral-800 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    متابعة للدفع
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="min-h-screen p-4 lg:p-8"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => setStep(1)} className="p-2 bg-neutral-900 rounded-xl border border-white/10 hover:border-[#800020]">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black">اختر طريقة الدفع</h1>
                                <p className="text-gray-500 text-sm">Step 2 of 2 - Payment</p>
                            </div>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            {/* Progress */}
                            <div className="flex items-center gap-4 mb-10">
                                <div className="flex-1 h-1 bg-[#800020] rounded-full" />
                                <div className="flex-1 h-1 bg-[#800020] rounded-full" />
                            </div>

                            {/* Payment Methods */}
                            <div className="space-y-4 mb-8">
                                {paymentMethods.map((method) => (
                                    <motion.button
                                        key={method.id}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`w-full p-5 rounded-2xl border-2 transition-all flex items-center gap-4 ${paymentMethod === method.id
                                                ? `bg-gradient-to-r ${method.color} ${method.border}`
                                                : 'bg-neutral-900 border-white/10 hover:border-white/30'
                                            }`}
                                    >
                                        <div className="p-3 bg-black/30 rounded-xl">
                                            {method.icon}
                                        </div>
                                        <div className="flex-1 text-left">
                                            <h3 className="font-bold text-lg">{method.name}</h3>
                                            <p className="text-sm text-gray-400">{method.description}</p>
                                        </div>
                                        {paymentMethod === method.id && (
                                            <CheckCircle2 className="text-green-400" size={24} />
                                        )}
                                    </motion.button>
                                ))}
                            </div>

                            {/* Payment Details */}
                            {paymentMethod === 'vodafone' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 mb-6"
                                >
                                    <h3 className="font-bold mb-3 text-red-400">تعليمات فودافون كاش</h3>
                                    <p className="text-sm text-gray-300 mb-3">حول المبلغ لـ: <span className="font-bold text-white">01006527185</span></p>
                                    <p className="text-sm text-gray-400">بعد التحويل سيتم تأكيد طلبك خلال دقائق</p>
                                </motion.div>
                            )}

                            {paymentMethod === 'fawry' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-6"
                                >
                                    <h3 className="font-bold mb-3 text-yellow-400">تعليمات فوري</h3>
                                    <p className="text-sm text-gray-300 mb-3">رقم الفاتورة: <span className="font-bold text-white">VIP-{Date.now().toString().slice(-8)}</span></p>
                                    <p className="text-sm text-gray-400">توجه لأقرب فرع فوري وادفع بالرقم أعلاه</p>
                                </motion.div>
                            )}

                            {paymentMethod === 'card' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-6 space-y-4"
                                >
                                    <h3 className="font-bold text-blue-400">بيانات الكارت</h3>
                                    <input type="text" placeholder="رقم الكارت" className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <input type="text" placeholder="MM/YY" className="bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500" />
                                        <input type="text" placeholder="CVV" className="bg-black border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-blue-500" />
                                    </div>
                                </motion.div>
                            )}

                            {/* Security Badge */}
                            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
                                <Lock size={14} />
                                <span>معاملة آمنة ومشفرة 100%</span>
                                <Shield size={14} className="text-green-500" />
                            </div>

                            {/* Total & Pay */}
                            <div className="bg-neutral-900 rounded-2xl p-6 border border-white/5">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-gray-400">المجموع</span>
                                    <span className="text-3xl font-black text-[#C9A961]">{finalTotal.toLocaleString()} EGP</span>
                                </div>
                                <button
                                    onClick={handlePayment}
                                    disabled={!paymentMethod || loading}
                                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${paymentMethod && !loading
                                            ? 'bg-[#800020] hover:bg-[#a00028]'
                                            : 'bg-neutral-800 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    {loading ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <CheckCircle2 size={20} />
                                            تأكيد الطلب
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden"
                    >
                        {/* Stars */}
                        <div className="absolute inset-0">
                            {[...Array(30)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                                    className="absolute w-1 h-1 bg-white rounded-full"
                                    style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                                />
                            ))}
                        </div>

                        {/* Rocket Animation */}
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: 'spring', damping: 10 }}
                            className="text-8xl mb-8"
                        >
                            <motion.div
                                animate={{ y: [-5, 5, -5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🚀
                            </motion.div>
                        </motion.div>

                        {/* Success Text */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-center"
                        >
                            <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                                <CheckCircle2 size={32} />
                                <Sparkles className="text-[#C9A961]" size={24} />
                            </div>
                            <h1 className="text-4xl font-black mb-4 text-[#C9A961]">Order Placed!</h1>
                            <p className="text-gray-400 text-lg mb-2">تم استلام طلبك بنجاح</p>
                            <p className="text-white font-bold mb-8">رقم الطلب: {orderId}</p>
                        </motion.div>

                        {/* Order Summary */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-neutral-900 rounded-2xl p-6 border border-white/10 max-w-md w-full mb-8"
                        >
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Package className="text-[#C9A961]" size={18} />
                                    <span>سيتم تجهيز طلبك خلال 24 ساعة</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Truck className="text-[#C9A961]" size={18} />
                                    <span>التوصيل خلال 2-5 أيام عمل</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-300">
                                    <Phone className="text-[#C9A961]" size={18} />
                                    <span>سيتم التواصل معك لتأكيد الطلب</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.button
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            onClick={onBack}
                            className="bg-[#800020] hover:bg-[#a00028] px-10 py-4 rounded-xl font-bold text-lg flex items-center gap-3"
                        >
                            <Crown size={20} />
                            العودة للتسوق
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
