require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

// Product data for seeding
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

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/vip-brand');
        console.log('✅ Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('🗑️ Cleared existing products');

        const products = [];

        // Generate 50 men's products
        for (let i = 0; i < 50; i++) {
            const nameData = menProductNames[i % menProductNames.length];
            products.push({
                nameEn: nameData.en,
                nameAr: nameData.ar,
                category: 'men',
                price: 1500 + (i * 50),
                image: menImages[i % menImages.length],
                stock: Math.floor(Math.random() * 10) + 1,
                sold: Math.floor(Math.random() * 50) + 10,
                rating: (4 + Math.random()).toFixed(1),
                isPremium: i < 10,
                isLimited: i < 5
            });
        }

        // Generate 50 women's products
        for (let i = 0; i < 50; i++) {
            const nameData = womenProductNames[i % womenProductNames.length];
            products.push({
                nameEn: nameData.en,
                nameAr: nameData.ar,
                category: 'women',
                price: 1500 + (i * 50),
                image: womenImages[i % womenImages.length],
                stock: Math.floor(Math.random() * 10) + 1,
                sold: Math.floor(Math.random() * 50) + 10,
                rating: (4 + Math.random()).toFixed(1),
                isPremium: i < 10,
                isLimited: i < 5
            });
        }

        await Product.insertMany(products);
        console.log(`✅ Seeded ${products.length} products (50 Men + 50 Women)`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding products:', error.message);
        process.exit(1);
    }
}

seedProducts();
