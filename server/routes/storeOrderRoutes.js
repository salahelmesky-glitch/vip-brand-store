/**
 * ─────────────────────────────────────────────
 *  Store Order Routes — Express (local dev)
 *  Handles store orders CRUD via MongoDB
 * ─────────────────────────────────────────────
 */

import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

/* ─── Store Order Schema ─── */
const storeOrderSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  productImg: { type: String, default: '' },
  governorate: { type: String, required: true },
  size: { type: String, required: true },
  price: { type: Number, required: true },
  customerName: { type: String, default: '' },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
}, { timestamps: true });

const StoreOrder = mongoose.models.StoreOrder || mongoose.model('StoreOrder', storeOrderSchema);

/* ── GET: Fetch all orders ── */
router.get('/', async (req, res, next) => {
  try {
    const orders = await StoreOrder.find().sort({ createdAt: -1 }).lean();
    const mapped = orders.map((o) => ({
      id: o._id.toString(),
      productName: o.productName,
      productImg: o.productImg,
      governorate: o.governorate,
      size: o.size,
      price: o.price,
      customerName: o.customerName,
      address: o.address,
      phone: o.phone,
      status: o.status,
      createdAt: o.createdAt,
    }));
    res.json({ success: true, data: mapped });
  } catch (err) { next(err); }
});

/* ── POST: Create a new order ── */
router.post('/', async (req, res, next) => {
  try {
    const { productName, productImg, governorate, size, price, customerName, address, phone } = req.body;
    if (!productName || !governorate || !size || !price || !address || !phone) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    const order = await StoreOrder.create({
      productName, productImg, governorate, size, price, customerName: customerName || '', address, phone,
      status: 'pending',
    });
    res.status(201).json({
      success: true,
      data: {
        id: order._id.toString(),
        productName: order.productName,
        productImg: order.productImg,
        governorate: order.governorate,
        size: order.size,
        price: order.price,
        customerName: order.customerName,
        address: order.address,
        phone: order.phone,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (err) { next(err); }
});

/* ── PUT: Update order status ── */
router.put('/', async (req, res, next) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, error: 'Missing id or status' });
    }
    const order = await StoreOrder.findByIdAndUpdate(
      id,
      { $set: { status } },
      { returnDocument: 'after', lean: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({
      success: true,
      data: {
        id: order._id.toString(),
        productName: order.productName,
        productImg: order.productImg,
        governorate: order.governorate,
        size: order.size,
        price: order.price,
        customerName: order.customerName,
        address: order.address,
        phone: order.phone,
        status: order.status,
        createdAt: order.createdAt,
      },
    });
  } catch (err) { next(err); }
});

/* ── DELETE: Remove an order ── */
router.delete('/', async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Missing order id' });
    }
    await StoreOrder.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (err) { next(err); }
});

export default router;
