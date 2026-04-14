/**
 * ─────────────────────────────────────────────
 *  Seed Script — VIP Summer Collection
 *  Run: node server/seed.js
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vip-brand';

const summerCollection = [
  {
    name: 'Obsidian Phantom Hoodie',
    price: 289,
    description: 'Premium heavyweight hoodie with reflective VIP branding. Crafted from 400GSM organic cotton.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=750&fit=crop',
    category: 'hoodies',
    tag: 'New',
    collection: 'Summer 2026',
  },
  {
    name: 'Neon Edge Cargo Pants',
    price: 245,
    description: 'Tactical-inspired cargos with neon-cyan contrast stitching and hidden utility pockets.',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=750&fit=crop',
    category: 'pants',
    tag: 'Hot',
    collection: 'Summer 2026',
  },
  {
    name: 'Cyber Luxe Bomber',
    price: 399,
    description: 'Water-resistant bomber jacket with metallic finish and embossed VIP insignia.',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop',
    category: 'jackets',
    tag: 'Limited',
    collection: 'Summer 2026',
  },
  {
    name: 'Eclipse Stealth Tee',
    price: 149,
    description: 'Ultra-soft Pima cotton tee with minimalist VIP logo. Available in obsidian black.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop',
    category: 'tees',
    tag: null,
    collection: 'Summer 2026',
  },
  {
    name: 'Midnight Apex Jacket',
    price: 459,
    description: 'Technical outerwear with sealed seams, adjustable cuffs, and concealed hood.',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=750&fit=crop',
    category: 'jackets',
    tag: 'Exclusive',
    collection: 'Summer 2026',
  },
  {
    name: 'Void Runner Sneakers',
    price: 329,
    description: 'Lightweight performance sneakers with carbon-fiber reinforced sole and holographic accents.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=750&fit=crop',
    category: 'sneakers',
    tag: 'New',
    collection: 'Summer 2026',
  },
  {
    name: 'Prism Tech Vest',
    price: 275,
    description: 'Insulated puffer vest with iridescent ripstop shell and magnetic closures.',
    image: 'https://images.unsplash.com/photo-1559551409-dadc959f76b8?w=600&h=750&fit=crop',
    category: 'jackets',
    tag: 'New',
    collection: 'Summer 2026',
  },
  {
    name: 'Shadow Grid Hoodie',
    price: 310,
    description: 'Oversized drop-shoulder hoodie with laser-cut grid pattern and kangaroo pocket.',
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&h=750&fit=crop',
    category: 'hoodies',
    tag: 'Hot',
    collection: 'Summer 2026',
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('  ✅ Connected to MongoDB');

    await Product.deleteMany({});
    console.log('  🗑️  Cleared existing products');

    const created = await Product.insertMany(summerCollection);
    console.log(`  🌱 Seeded ${created.length} products into VIP Summer Collection`);

    await mongoose.disconnect();
    console.log('  ✅ Done — database seeded successfully\n');
    process.exit(0);
  } catch (error) {
    console.error(`  ❌ Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
