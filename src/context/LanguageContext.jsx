import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

const translations = {
    en: {
        // Navigation
        home: 'Home',
        men: 'Men',
        women: 'Women',
        checkout: 'Checkout',

        // Hero
        heroTitle: 'Exclusive VIP Collection',
        heroSubtitle: 'Premium Fashion for the Elite',
        shopNow: 'Shop Now',
        discoverMen: 'Discover Men',
        discoverWomen: 'Discover Women',

        // Products
        menCollection: "Men's Collection",
        womenCollection: "Women's Collection",
        addToCart: 'Add to Cart',
        piecesLeft: 'pieces left',
        price: 'EGP',
        vipEdition: 'VIP Edition',
        premiumPiece: 'Premium Piece',

        // Checkout
        orderSummary: 'Order Summary',
        customerInfo: 'Customer Information',
        name: 'Full Name',
        address: 'Delivery Address',
        phone: 'Phone Number',
        vodafoneCash: 'Vodafone Cash Payment',
        copyNumber: 'Copy Number',
        copied: 'Copied!',
        uploadScreenshot: 'Upload Transfer Screenshot',
        uploadHint: 'Click or drag to upload payment proof',
        placeOrder: 'Place Order',
        whatsappSupport: 'WhatsApp Support',
        total: 'Total',
        emptyCart: 'Your cart is empty',

        // Footer
        designedFor: 'DESIGNED FOR THE TOP 1%',
        luxuryFashion: 'LUXURY FASHION'
    },
    ar: {
        // Navigation
        home: 'الرئيسية',
        men: 'رجالي',
        women: 'نسائي',
        checkout: 'الدفع',

        // Hero
        heroTitle: 'مجموعة VIP الحصرية',
        heroSubtitle: 'أزياء فاخرة للنخبة',
        shopNow: 'تسوق الآن',
        discoverMen: 'اكتشف الرجالي',
        discoverWomen: 'اكتشف النسائي',

        // Products
        menCollection: 'مجموعة الرجال',
        womenCollection: 'مجموعة النساء',
        addToCart: 'أضف للسلة',
        piecesLeft: 'قطع متبقية',
        price: 'ج.م',
        vipEdition: 'إصدار VIP',
        premiumPiece: 'قطعة فاخرة',

        // Checkout
        orderSummary: 'ملخص الطلب',
        customerInfo: 'معلومات العميل',
        name: 'الاسم الكامل',
        address: 'عنوان التوصيل',
        phone: 'رقم الهاتف',
        vodafoneCash: 'الدفع عبر فودافون كاش',
        copyNumber: 'نسخ الرقم',
        copied: 'تم النسخ!',
        uploadScreenshot: 'رفع صورة التحويل',
        uploadHint: 'اضغط أو اسحب لرفع إثبات الدفع',
        placeOrder: 'تأكيد الطلب',
        whatsappSupport: 'دعم واتساب',
        total: 'المجموع',
        emptyCart: 'السلة فارغة',

        // Footer
        designedFor: 'مصمم لأفضل 1%',
        luxuryFashion: 'أزياء فاخرة'
    }
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');

    const t = (key) => translations[language][key] || key;

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'ar' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
