/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/newsletter
 *  GET    → return all newsletter subscribers
 *  POST   → add a new subscriber
 *  DELETE → remove a subscriber by email
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

/* ─── Newsletter Schema ─── */
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

/* ─── CORS Headers ─── */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  setCors(res);

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    await dbConnect();

    /* ── GET: Fetch all subscribers ── */
    if (req.method === 'GET') {
      const subscribers = await Newsletter.find().sort({ createdAt: -1 }).lean();
      
      const mapped = subscribers.map((s) => ({
        id: s._id.toString(),
        email: s.email,
        createdAt: s.createdAt,
      }));

      return res.status(200).json({ success: true, data: mapped });
    }

    /* ── POST: Add a new subscriber ── */
    if (req.method === 'POST') {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ success: false, error: 'برجاء إدخال البريد الإلكتروني' });
      }

      // Check if already subscribed
      const existing = await Newsletter.findOne({ email });
      if (existing) {
        return res.status(200).json({ success: true, message: 'You are already subscribed!' });
      }

      const newSubscriber = await Newsletter.create({ email });

      return res.status(201).json({
        success: true,
        data: {
          id: newSubscriber._id.toString(),
          email: newSubscriber.email,
          createdAt: newSubscriber.createdAt,
        },
      });
    }

    /* ── DELETE: Remove a subscriber ── */
    if (req.method === 'DELETE') {
      const { email, id } = req.body;

      if (id) {
        await Newsletter.findByIdAndDelete(id);
      } else if (email) {
        await Newsletter.findOneAndDelete({ email });
      } else {
        return res.status(400).json({ success: false, error: 'Missing email or id' });
      }

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /newsletter Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
