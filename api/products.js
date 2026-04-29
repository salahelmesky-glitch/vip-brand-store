/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/products
 *  GET    → return all products (with compact images)
 *  PUT    → update a product by pid
 *  POST   → add a new product
 *  DELETE → remove a product by pid
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';

/* ─── Cached Connection (Serverless-Safe) ─── */
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

/* ─── Product Schema ─── */
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

/* ─── CORS Headers ─── */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  // Prevent ALL caching — browser, CDN, and Vercel Edge
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  setCors(res);

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await dbConnect();

    /* ── GET: Fetch all products ── */
    if (req.method === 'GET') {
      // Check if requesting a single product image
      // Single product image
      const { imgFor, imgBatch, page, noImg } = req.query;
      if (imgFor) {
        const product = await Product.findOne({ pid: Number(imgFor) }).select('pid img').lean();
        if (product) {
          return res.status(200).json({ success: true, data: { id: product.pid, img: product.img } });
        }
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      // Batch image load: ?imgBatch=1,2,3,4,5
      if (imgBatch) {
        const pids = imgBatch.split(',').map(Number).filter(n => !isNaN(n)).slice(0, 10);
        const products = await Product.find({ pid: { $in: pids } }).select('pid img').lean();
        const mapped = products.map(p => ({ id: p.pid, img: p.img }));
        return res.status(200).json({ success: true, data: mapped });
      }

      // List without images (fast for polling): ?noImg=1
      if (noImg === '1') {
        const products = await Product.find().sort({ pid: 1 }).select('-img').lean();
        const mapped = products.map((p) => ({
          id: p.pid, name: p.name, nameAr: p.nameAr, img: '',
          price: p.price, gender: p.gender, inStock: p.inStock, sizes: p.sizes,
        }));
        return res.status(200).json({ success: true, data: mapped });
      }

      // Default: paginated with images (20 per page)
      const pageNum = Math.max(1, parseInt(page) || 1);
      const limit = 20;
      const skip = (pageNum - 1) * limit;
      const total = await Product.countDocuments();
      const products = await Product.find().sort({ pid: 1 }).skip(skip).limit(limit).lean();

      const mapped = products.map((p) => ({
        id: p.pid,
        name: p.name,
        nameAr: p.nameAr,
        img: p.img,
        price: p.price,
        gender: p.gender,
        inStock: p.inStock,
        sizes: p.sizes,
      }));

      return res.status(200).json({ success: true, data: mapped, total, page: pageNum, pages: Math.ceil(total / limit) });
    }

    /* ── PUT: Update a product ── */
    if (req.method === 'PUT') {
      const { id, ...updates } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing product id' });
      }

      // Map frontend fields → DB fields
      const dbUpdates = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.nameAr !== undefined) dbUpdates.nameAr = updates.nameAr;
      if (updates.img !== undefined) dbUpdates.img = updates.img;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
      if (updates.inStock !== undefined) dbUpdates.inStock = updates.inStock;
      if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;

      const product = await Product.findOneAndUpdate(
        { pid: id },
        { $set: dbUpdates },
        { returnDocument: 'after', lean: true }
      );

      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' });
      }

      return res.status(200).json({
        success: true,
        data: {
          id: product.pid,
          name: product.name,
          nameAr: product.nameAr,
          img: product.img,
          price: product.price,
          gender: product.gender,
          inStock: product.inStock,
          sizes: product.sizes,
        },
      });
    }

    /* ── POST: Add a new product ── */
    if (req.method === 'POST') {
      const { name, nameAr, img, price, gender, inStock, sizes } = req.body;

      // Auto-generate pid
      const last = await Product.findOne().sort({ pid: -1 }).lean();
      const newPid = last ? last.pid + 1 : 1;

      const product = await Product.create({
        pid: newPid,
        name: name || `Model #${newPid}`,
        nameAr: nameAr || '',
        img: img || `/images/${newPid}.jpg`,
        price: price ?? 500,
        gender: gender || 'boys',
        inStock: inStock !== false,
        sizes: sizes || ['M', 'L', 'XL', '2XL'],
      });

      return res.status(201).json({
        success: true,
        data: {
          id: product.pid,
          name: product.name,
          nameAr: product.nameAr,
          img: product.img,
          price: product.price,
          gender: product.gender,
          inStock: product.inStock,
          sizes: product.sizes,
        },
      });
    }

    /* ── DELETE: Remove a product ── */
    if (req.method === 'DELETE') {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing product id' });
      }

      await Product.findOneAndDelete({ pid: id });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /products Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
