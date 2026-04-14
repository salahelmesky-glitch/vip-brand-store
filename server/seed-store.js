/**
 * ─────────────────────────────────────────────
 *  Seed Script — StoreProduct Collection
 *  Seeds the SAME collection used by both the local
 *  Express server and the Vercel serverless functions.
 *  Run: node server/seed-store.js
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

/* ─── StoreProduct Schema (same as api/products.js) ─── */
const productSchema = new mongoose.Schema({
  pid: { type: Number, required: true, unique: true, index: true },
  name: { type: String, required: true },
  nameAr: { type: String, default: '' },
  img: { type: String, required: true },
  price: { type: Number, default: 500 },
  gender: { type: String, enum: ['boys', 'girls'], default: 'boys' },
  inStock: { type: Boolean, default: true },
  sizes: { type: [String], default: ['M', 'L', 'XL', '2XL'] },
}, { timestamps: true });

const StoreProduct = mongoose.models.StoreProduct || mongoose.model('StoreProduct', productSchema);

/* ─── Arabic number helper ─── */
const toAr = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('  ✅ Connected to MongoDB');

    // Check if already seeded
    const count = await StoreProduct.countDocuments();
    if (count > 0) {
      console.log(`  ⚠️  StoreProduct collection already has ${count} products.`);
      console.log('  🗑️  Clearing and re-seeding...');
      await StoreProduct.deleteMany({});
    }

    // Build 100 products (1-50 boys, 51-100 girls)
    const products = Array.from({ length: 100 }, (_, i) => {
      const num = i + 1;
      return {
        pid: num,
        name: `Model #${num}`,
        nameAr: `موديل #${toAr(num)}`,
        img: `/images/${num}.jpg`,
        price: 500,
        gender: num <= 50 ? 'boys' : 'girls',
        inStock: true,
        sizes: ['M', 'L', 'XL', '2XL'],
      };
    });

    await StoreProduct.insertMany(products);
    console.log(`  🌱 Seeded ${products.length} products into StoreProduct collection`);

    await mongoose.disconnect();
    console.log('  ✅ Done — database seeded successfully\n');
    process.exit(0);
  } catch (error) {
    console.error(`  ❌ Seed failed: ${error.message}`);
    process.exit(1);
  }
};

seed();
