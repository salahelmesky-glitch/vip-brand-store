/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/push-subscribe
 *  Manages push notification subscriptions (MongoDB-backed)
 *  POST   → save a new subscription
 *  DELETE → remove a subscription
 *  GET    → return all subscriptions (for debugging)
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';

/* ─── Cached Connection (Serverless-Safe) ─── */
let cached = global._mongoosePushCache;
if (!cached) {
  cached = global._mongoosePushCache = { conn: null, promise: null };
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

/* ─── CORS Headers ─── */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();

    /* ── POST: Save subscription ── */
    if (req.method === 'POST') {
      const { subscription, label } = req.body;
      if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(400).json({ success: false, error: 'Invalid subscription data' });
      }

      // Upsert — update if endpoint exists, create if not
      await PushSubscription.findOneAndUpdate(
        { endpoint: subscription.endpoint },
        {
          endpoint: subscription.endpoint,
          keys: subscription.keys,
          userAgent: req.headers['user-agent'] || '',
          label: label || 'admin',
        },
        { upsert: true, new: true }
      );

      return res.status(201).json({ success: true, message: 'Subscription saved' });
    }

    /* ── DELETE: Remove subscription ── */
    if (req.method === 'DELETE') {
      const { endpoint } = req.body;
      if (!endpoint) {
        return res.status(400).json({ success: false, error: 'Missing endpoint' });
      }
      await PushSubscription.findOneAndDelete({ endpoint });
      return res.status(200).json({ success: true });
    }

    /* ── GET: List subscriptions count ── */
    if (req.method === 'GET') {
      const count = await PushSubscription.countDocuments();
      return res.status(200).json({ success: true, count });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /push-subscribe Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
