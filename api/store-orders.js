/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/store-orders
 *  Handles store orders (MongoDB-backed)
 *  GET    → return all orders
 *  POST   → create a new order + push notification
 *  PUT    → update order status
 *  DELETE → delete an order
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import webpush from 'web-push';

/* ─── VAPID Configuration for Push Notifications ─── */
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BKdOg_84LUt592Fxx3ApvjQab8m6LbfI02WdPWkyujIedjOsRd16MOrFp-Z_adC-ETNIMub1fmaIovrAf47Ffqo';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '6w7xsIXJ05pHbxe0EcM7cNOv1-y7FfIOtSVZjlzjlSU';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:admin@vipbrand.com';

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/* ─── Cached Connection (Serverless-Safe) ─── */
let cached = global._mongooseStoreOrderCache;
if (!cached) {
  cached = global._mongooseStoreOrderCache = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('MONGODB_URI not set');
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

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

/* ─── Push Subscription Schema ─── */
const pushSubSchema = new mongoose.Schema({
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  userAgent: { type: String, default: '' },
  label: { type: String, default: 'admin' },
}, { timestamps: true });

const PushSubscription = mongoose.models.PushSubscription || mongoose.model('PushSubscription', pushSubSchema);

/* ─── Send Push to All Admins ─── */
async function sendPushToAdmins(order) {
  try {
    const subscriptions = await PushSubscription.find().lean();
    if (subscriptions.length === 0) return;

    const payload = JSON.stringify({
      title: '🛍️ طلب جديد - VIP Brand!',
      body: `👤 ${order.customerName || 'عميل جديد'}\n👕 ${order.productName} - ${order.size}\n💰 ${order.price} ج.م`,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: 'vip-order-' + order._id,
      url: '/admin',
    });

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification({ endpoint: sub.endpoint, keys: sub.keys }, payload);
        } catch (error) {
          if (error.statusCode === 410 || error.statusCode === 404) {
            await PushSubscription.findOneAndDelete({ endpoint: sub.endpoint });
          }
        }
      })
    );
  } catch (e) {
    console.warn('[Push] Failed to send push notifications:', e.message);
  }
}

/* ─── CORS Headers ─── */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();

    /* ── GET: Fetch all orders ── */
    if (req.method === 'GET') {
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
      return res.status(200).json({ success: true, data: mapped });
    }

    /* ── POST: Create a new order + push notification ── */
    if (req.method === 'POST') {
      const { productName, productImg, governorate, size, price, customerName, address, phone } = req.body;
      if (!productName || !governorate || !size || !price || !address || !phone) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
      }
      const order = await StoreOrder.create({
        productName, productImg, governorate, size, price, customerName: customerName || '', address, phone,
        status: 'pending',
      });

      // 🔔 Send push notification to all admins (non-blocking)
      sendPushToAdmins(order).catch(() => {});

      return res.status(201).json({
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
    }

    /* ── PUT: Update order status ── */
    if (req.method === 'PUT') {
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
      return res.status(200).json({
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
    }

    /* ── DELETE: Remove an order ── */
    if (req.method === 'DELETE') {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json({ success: false, error: 'Missing order id' });
      }
      await StoreOrder.findByIdAndDelete(id);
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /store-orders Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
