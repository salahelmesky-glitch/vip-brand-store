/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/seed
 *  POST → seed the database with 100 default products
 *  Only works if the database is empty (safety check)
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';

/* ─── Cached Connection ─── */
let cached = global._mongooseCache;
if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).then((m) => m);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

/* ─── Product Schema (same as products.js) ─── */
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

const Product = mongoose.models.StoreProduct || mongoose.model('StoreProduct', productSchema);

/* ─── Arabic number helper ─── */
const toAr = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

/* ─── CORS ─── */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Use POST to seed' });
  }

  try {
    await dbConnect();

    // Check if already seeded
    const count = await Product.countDocuments();
    if (count > 0) {
      return res.status(200).json({
        success: true,
        message: `Database already has ${count} products. Skipping seed.`,
        count,
      });
    }

    // Build 100 products
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

    await Product.insertMany(products);

    return res.status(201).json({
      success: true,
      message: `Successfully seeded ${products.length} products`,
      count: products.length,
    });
  } catch (error) {
    console.error('[API /seed Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
