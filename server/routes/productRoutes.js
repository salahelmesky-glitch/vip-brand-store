/**
 * ─────────────────────────────────────────────
 *  Product Routes — Full CRUD
 *  Uses StoreProduct model (same as Vercel serverless)
 * ─────────────────────────────────────────────
 */

import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

/* ─── StoreProduct Schema (matches api/products.js) ─── */
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

/* ─── Helper: Map DB doc → frontend format ─── */
const mapProduct = (p) => ({
  id: p.pid,
  name: p.name,
  nameAr: p.nameAr,
  img: p.img,
  price: p.price,
  gender: p.gender,
  inStock: p.inStock,
  sizes: p.sizes,
});

/**
 * GET /api/products
 * Fetch all products
 */
router.get('/', async (req, res, next) => {
  try {
    const products = await StoreProduct.find().sort({ pid: 1 }).lean();
    const mapped = products.map(mapProduct);

    // Prevent caching
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    res.json({ success: true, count: mapped.length, data: mapped });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/products
 * Add a new product
 */
router.post('/', async (req, res, next) => {
  try {
    const { name, nameAr, img, price, gender, inStock, sizes } = req.body;

    // Auto-generate pid
    const last = await StoreProduct.findOne().sort({ pid: -1 }).lean();
    const newPid = last ? last.pid + 1 : 1;

    const product = await StoreProduct.create({
      pid: newPid,
      name: name || `Model #${newPid}`,
      nameAr: nameAr || '',
      img: img || `/images/${newPid}.jpg`,
      price: price ?? 500,
      gender: gender || 'boys',
      inStock: inStock !== false,
      sizes: sizes || ['M', 'L', 'XL', '2XL'],
    });

    res.status(201).json({ success: true, data: mapProduct(product) });
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/products
 * Update a product by id (pid)
 */
router.put('/', async (req, res, next) => {
  try {
    const { id, ...updates } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing product id' });
    }

    const dbUpdates = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.nameAr !== undefined) dbUpdates.nameAr = updates.nameAr;
    if (updates.img !== undefined) dbUpdates.img = updates.img;
    if (updates.price !== undefined) dbUpdates.price = updates.price;
    if (updates.gender !== undefined) dbUpdates.gender = updates.gender;
    if (updates.inStock !== undefined) dbUpdates.inStock = updates.inStock;
    if (updates.sizes !== undefined) dbUpdates.sizes = updates.sizes;

    const product = await StoreProduct.findOneAndUpdate(
      { pid: id },
      { $set: dbUpdates },
      { returnDocument: 'after', lean: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    res.json({ success: true, data: mapProduct(product) });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/products
 * Delete a product by id (pid)
 */
router.delete('/', async (req, res, next) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing product id' });
    }

    await StoreProduct.findOneAndDelete({ pid: id });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
