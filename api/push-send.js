/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/push-send
 *  Sends push notifications to all subscribed admins
 *  POST → send notification with { title, body, url }
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import webpush from 'web-push';

/* ─── VAPID Configuration ─── */
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || 'BKdOg_84LUt592Fxx3ApvjQab8m6LbfI02WdPWkyujIedjOsRd16MOrFp-Z_adC-ETNIMub1fmaIovrAf47Ffqo';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '6w7xsIXJ05pHbxe0EcM7cNOv1-y7FfIOtSVZjlzjlSU';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:admin@vipbrand.com';

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

/* ─── Cached Connection (Serverless-Safe) ─── */
let cached = global._mongoosePushSendCache;
if (!cached) {
  cached = global._mongoosePushSendCache = { conn: null, promise: null };
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

/* ─── Push Subscription Schema (same as push-subscribe.js) ─── */
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
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const { title, body, url, tag } = req.body;

    const payload = JSON.stringify({
      title: title || '🛍️ طلب جديد - VIP Brand!',
      body: body || 'في طلب جديد على المتجر!',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      tag: tag || 'vip-new-order',
      url: url || '/admin',
    });

    // Get all subscriptions
    const subscriptions = await PushSubscription.find().lean();

    if (subscriptions.length === 0) {
      return res.status(200).json({ success: true, sent: 0, message: 'No subscriptions found' });
    }

    // Send to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: sub.keys,
            },
            payload
          );
          return { endpoint: sub.endpoint, status: 'sent' };
        } catch (error) {
          // If subscription is expired/invalid (410 Gone or 404), remove it
          if (error.statusCode === 410 || error.statusCode === 404) {
            await PushSubscription.findOneAndDelete({ endpoint: sub.endpoint });
            return { endpoint: sub.endpoint, status: 'removed (expired)' };
          }
          console.error(`[Push] Failed to send to ${sub.endpoint.slice(0, 50)}:`, error.message);
          return { endpoint: sub.endpoint, status: 'failed', error: error.message };
        }
      })
    );

    const sent = results.filter(r => r.status === 'fulfilled' && r.value.status === 'sent').length;

    return res.status(200).json({
      success: true,
      sent,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('[API /push-send Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
