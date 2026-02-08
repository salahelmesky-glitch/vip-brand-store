import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Check,
    Copy,
    Upload,
    MessageCircle,
    ShoppingBag,
    MapPin,
    CreditCard,
    ChevronRight,
    X,
    ArrowRight,
    Camera,
    Download,
    Shield,
    Truck,
    HeadphonesIcon
} from 'lucide-react';
import { ordersApi } from '../api';

export default function CheckoutPage({ cart = [], setCart }) {
    const [step, setStep] = useState(1);
    const [copied, setCopied] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        phone: ''
    });
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [orderComplete, setOrderComplete] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const vodafoneNumber = "01006527185";
    const whatsappNumber = "201006527185";

    const steps = [
        { num: 1, labelEn: 'Info', labelAr: 'المعلومات', icon: MapPin },
        { num: 2, labelEn: 'Payment', labelAr: 'الدفع', icon: CreditCard },
        { num: 3, labelEn: 'Summary', labelAr: 'الملخص', icon: ShoppingBag },
        { num: 4, labelEn: 'Confirm', labelAr: 'التأكيد', icon: Check }
    ];

    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    const copyNumber = () => {
        navigator.clipboard.writeText(vodafoneNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setScreenshot(file);
            const reader = new FileReader();
            reader.onloadend = () => setScreenshotPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const removeScreenshot = () => {
        setScreenshot(null);
        setScreenshotPreview(null);
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        setError('');

        try {
            const orderData = {
                customerName: formData.name,
                phone: formData.phone,
                address: formData.address,
                items: cart.map(item => ({
                    productId: item.id,
                    name: item.name || item.nameEn,
                    nameAr: item.nameAr || '',
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image
                })),
                total: cartTotal
            };

            const response = await ordersApi.create(orderData, screenshot);

            if (response._id) {
                setOrderComplete(true);
                setCart([]); // Clear cart after successful order
            } else {
                setError(response.message || 'Order failed. Please try again.');
            }
        } catch (err) {
            console.error('Order error:', err);
            setError('Connection error. Please check if the server is running.');
        }

        setSubmitting(false);
    };

    const generateInvoice = () => {
        const invoiceContent = `
VIP BRAND - INVOICE
==================

Customer: ${formData.name}
Address: ${formData.address}
Phone: ${formData.phone}

ITEMS:
${cart.map(item => `- ${item.name || item.nameEn} x${item.quantity} = ${(item.price * item.quantity).toLocaleString()} EGP`).join('\n')}

TOTAL: ${cartTotal.toLocaleString()} EGP

Payment: Vodafone Cash
Reference: ${vodafoneNumber}

Thank you for shopping with VIP Brand!
        `;

        const blob = new Blob([invoiceContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `VIP_Invoice_${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const isStep1Valid = formData.name && formData.address && formData.phone;
    const isStep2Valid = screenshot !== null;

    // Order Complete State
    if (orderComplete) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center max-w-md"
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] flex items-center justify-center"
                        style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.5)' }}
                    >
                        <Check size={48} className="text-white" />
                    </motion.div>
                    <h2 className="text-3xl font-black text-white mb-4">ORDER CONFIRMED!</h2>
                    <p className="text-white/60 mb-8">Your order has been received. We will contact you shortly.</p>

                    <button
                        onClick={generateInvoice}
                        className="px-8 py-4 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl font-bold text-white flex items-center gap-2 mx-auto"
                    >
                        <Download size={20} />
                        Download Invoice
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pb-20">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                {/* Page Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl lg:text-5xl font-black mb-4 text-white"
                        style={{ textShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                    >
                        CHECKOUT
                    </h1>
                    <p className="text-[#A855F7]">Complete your VIP order</p>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-3 gap-4 mb-12"
                >
                    {[
                        { icon: Shield, labelEn: 'Official VIP', labelAr: 'علامة رسمية' },
                        { icon: Truck, labelEn: 'Fast Delivery', labelAr: 'توصيل سريع' },
                        { icon: HeadphonesIcon, labelEn: '24/7 Support', labelAr: 'دعم متواصل' }
                    ].map((badge, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-xl border border-[#A855F7]/20 rounded-xl p-4 text-center">
                            <badge.icon size={24} className="mx-auto text-[#A855F7] mb-2" />
                            <p className="text-white text-xs font-bold">{badge.labelEn}</p>
                            <p className="text-[#D8B4FE] text-[10px]">{badge.labelAr}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Progress Steps */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-center gap-2 mb-12 flex-wrap"
                >
                    {steps.map((s, i) => (
                        <React.Fragment key={s.num}>
                            <button
                                onClick={() => s.num < step && setStep(s.num)}
                                className={`flex flex-col items-center gap-1 px-4 py-3 rounded-xl transition-all ${step >= s.num
                                        ? 'bg-[#A855F7]/20 border border-[#A855F7]/50'
                                        : 'bg-white/5 border border-white/10'
                                    }`}
                                style={{
                                    boxShadow: step >= s.num ? '0 0 20px rgba(168, 85, 247, 0.3)' : 'none'
                                }}
                            >
                                <s.icon size={18} className={step >= s.num ? 'text-[#A855F7]' : 'text-white/30'} />
                                <span className={`text-[10px] font-bold ${step >= s.num ? 'text-white' : 'text-white/30'}`}>
                                    {s.labelEn}
                                </span>
                            </button>
                            {i < steps.length - 1 && (
                                <ChevronRight size={16} className="text-white/20" />
                            )}
                        </React.Fragment>
                    ))}
                </motion.div>

                {error && (
                    <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-center">
                        {error}
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Form Area */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Customer Info */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">CUSTOMER INFO</h2>

                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-white/60 mb-2">Full Name | الاسم</label>
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#A855F7] focus:outline-none"
                                                placeholder="Enter your name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-white/60 mb-2">Address | العنوان</label>
                                            <textarea
                                                value={formData.address}
                                                onChange={e => setFormData({ ...formData, address: e.target.value })}
                                                rows={3}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#A855F7] focus:outline-none resize-none"
                                                placeholder="Enter delivery address"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-white/60 mb-2">Phone | الهاتف</label>
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-4 text-white focus:border-[#A855F7] focus:outline-none"
                                                placeholder="01xxxxxxxxx"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setStep(2)}
                                        disabled={!isStep1Valid}
                                        className="w-full mt-8 py-5 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ boxShadow: isStep1Valid ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none' }}
                                    >
                                        Continue to Payment <ArrowRight size={20} />
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: Payment (Vodafone Cash) */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">VODAFONE CASH PAYMENT</h2>

                                    {/* Step-by-Step Guide */}
                                    <div className="space-y-4 mb-8">
                                        {[
                                            { num: 1, en: 'Copy Number', ar: 'انسخ الرقم' },
                                            { num: 2, en: 'Transfer Amount', ar: 'حوّل المبلغ' },
                                            { num: 3, en: 'Upload Screenshot', ar: 'ارفع الصورة' }
                                        ].map((s, i) => (
                                            <div key={i} className="flex items-center gap-4 p-4 bg-black/30 rounded-xl border border-[#A855F7]/20">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#A855F7] to-[#7C3AED] flex items-center justify-center font-black text-white">
                                                    {s.num}
                                                </div>
                                                <div>
                                                    <p className="text-white font-bold">{s.en}</p>
                                                    <p className="text-[#D8B4FE] text-sm">{s.ar}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Vodafone Number with Copy */}
                                    <div className="bg-gradient-to-r from-[#A855F7]/20 to-[#7C3AED]/20 rounded-2xl p-6 border border-[#A855F7]/30 mb-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-white/60 text-sm mb-1">Transfer to | حوّل إلى</p>
                                                <p className="text-3xl font-black text-white tracking-wider">{vodafoneNumber}</p>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={copyNumber}
                                                className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 ${copied
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-[#A855F7] text-white'
                                                    }`}
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                                {copied ? 'Copied!' : 'Copy'}
                                            </motion.button>
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="bg-black/30 rounded-xl p-4 mb-6">
                                        <p className="text-white/60 text-sm">Amount to Transfer | المبلغ المطلوب</p>
                                        <p className="text-2xl font-black text-[#A855F7]">{cartTotal.toLocaleString()} EGP</p>
                                    </div>

                                    {/* Screenshot Upload */}
                                    <div className="mb-6">
                                        <p className="text-white font-bold mb-3">Upload Screenshot | ارفع صورة التحويل</p>

                                        {screenshotPreview ? (
                                            <div className="relative">
                                                <img src={screenshotPreview} alt="Screenshot" className="w-full max-h-64 object-contain rounded-xl" />
                                                <button
                                                    onClick={removeScreenshot}
                                                    className="absolute top-2 right-2 p-2 bg-red-500 rounded-full"
                                                >
                                                    <X size={16} className="text-white" />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="block w-full py-12 border-2 border-dashed border-[#A855F7]/30 rounded-xl text-center cursor-pointer hover:border-[#A855F7] transition-colors">
                                                <Camera size={32} className="mx-auto text-[#A855F7] mb-2" />
                                                <p className="text-white/60">Click to upload</p>
                                                <input
                                                    ref={fileInputRef}
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleFileChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>

                                    {/* WhatsApp Payment Help */}
                                    <div className="mb-6 p-4 bg-black/30 rounded-xl border border-[#A855F7]/20 text-center">
                                        <p className="text-white/70 text-sm mb-3">
                                            For inquiries, contact us here | للاستفسار كلمنا هنا
                                        </p>
                                        <a
                                            href={`https://wa.me/${whatsappNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[#A855F7] hover:text-[#D8B4FE] transition-colors"
                                        >
                                            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                        </a>
                                    </div>

                                    <button
                                        onClick={() => setStep(3)}
                                        disabled={!isStep2Valid}
                                        className="w-full py-5 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
                                        style={{ boxShadow: isStep2Valid ? '0 0 30px rgba(168, 85, 247, 0.4)' : 'none' }}
                                    >
                                        View Order Summary <ArrowRight size={20} />
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 3: Order Summary */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">ORDER SUMMARY</h2>

                                    <p className="text-[#A855F7] mb-4">{cartCount} items selected</p>

                                    {/* Items List */}
                                    <div className="max-h-80 overflow-y-auto space-y-3 mb-6">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex items-center gap-4 bg-black/30 rounded-xl p-3">
                                                <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                                                <div className="flex-1">
                                                    <h4 className="text-white font-bold text-sm">{item.name || item.nameEn}</h4>
                                                    <p className="text-white/50 text-xs">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-[#A855F7] font-bold">{(item.price * item.quantity).toLocaleString()} EGP</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Customer Info Summary */}
                                    <div className="bg-black/30 rounded-xl p-4 mb-6">
                                        <h3 className="text-white font-bold mb-2">Delivery To:</h3>
                                        <p className="text-white/60 text-sm">{formData.name}</p>
                                        <p className="text-white/60 text-sm">{formData.address}</p>
                                        <p className="text-white/60 text-sm">{formData.phone}</p>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-between items-center py-4 border-t border-white/10 mb-6">
                                        <span className="text-white font-bold text-xl">TOTAL</span>
                                        <span className="text-[#A855F7] font-black text-2xl">{cartTotal.toLocaleString()} EGP</span>
                                    </div>

                                    <button
                                        onClick={() => setStep(4)}
                                        className="w-full py-5 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl font-bold text-white flex items-center justify-center gap-2"
                                        style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.4)' }}
                                    >
                                        Continue to Confirm <ArrowRight size={20} />
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 4: Confirm */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10"
                                >
                                    <h2 className="text-2xl font-bold text-white mb-6">CONFIRM ORDER</h2>

                                    <div className="text-center py-8">
                                        <ShoppingBag size={48} className="mx-auto text-[#A855F7] mb-4" />
                                        <p className="text-white text-lg mb-2">Ready to place your order?</p>
                                        <p className="text-white/50 text-sm mb-6">
                                            {cartCount} items • {cartTotal.toLocaleString()} EGP
                                        </p>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={submitting}
                                            className="px-12 py-5 bg-gradient-to-r from-[#A855F7] to-[#7C3AED] rounded-xl font-bold text-lg text-white disabled:opacity-50"
                                            style={{ boxShadow: '0 0 40px rgba(168, 85, 247, 0.5)' }}
                                        >
                                            {submitting ? 'PLACING ORDER...' : 'PLACE ORDER'}
                                        </button>
                                    </div>

                                    {/* WhatsApp Support */}
                                    <div className="mt-8 p-4 bg-black/30 rounded-xl text-center">
                                        <p className="text-white/60 text-sm mb-2">Need help? | محتاج مساعدة؟</p>
                                        <a
                                            href={`https://wa.me/${whatsappNumber}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-[#A855F7] font-bold"
                                        >
                                            <MessageCircle size={18} />
                                            WhatsApp Support
                                        </a>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar - Cart Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 sticky top-32">
                            <h3 className="text-xl font-bold text-white mb-6">Cart Summary</h3>

                            <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
                                {cart.length === 0 ? (
                                    <p className="text-white/40 text-center py-8">Cart is empty</p>
                                ) : (
                                    cart.map(item => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <img src={item.image} alt={item.name} className="w-12 h-14 object-cover rounded-lg" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{item.name || item.nameEn}</p>
                                                <p className="text-white/50 text-xs">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-[#A855F7] text-sm font-bold">{item.price.toLocaleString()}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="border-t border-white/10 pt-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-white font-bold">Total</span>
                                    <span className="text-[#A855F7] font-black text-xl">{cartTotal.toLocaleString()} EGP</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
