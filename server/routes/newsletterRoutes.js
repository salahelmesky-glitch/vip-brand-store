/**
 * ─────────────────────────────────────────────
 *  Newsletter Routes — VIP Brand
 *  GET    → return all newsletter subscribers
 *  POST   → add a new subscriber
 *  DELETE → remove a subscriber by email/id
 * ─────────────────────────────────────────────
 */

import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

/* ─── Newsletter Schema ─── */
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, index: true },
}, { timestamps: true });

const Newsletter = mongoose.models.Newsletter || mongoose.model('Newsletter', newsletterSchema);

/* ── GET: Fetch all subscribers ── */
router.get('/', async (_req, res) => {
  try {
    const subscribers = await Newsletter.find().sort({ createdAt: -1 }).lean();
    const mapped = subscribers.map((s) => ({
      id: s._id.toString(),
      email: s.email,
      createdAt: s.createdAt,
    }));
    res.json({ success: true, data: mapped });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ── POST: Add a new subscriber ── */
router.post('/', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'برجاء إدخال البريد الإلكتروني' });
    }

    const existing = await Newsletter.findOne({ email });
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed!' });
    }

    const newSubscriber = await Newsletter.create({ email });
    res.status(201).json({
      success: true,
      data: {
        id: newSubscriber._id.toString(),
        email: newSubscriber.email,
        createdAt: newSubscriber.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/* ── DELETE: Remove a subscriber ── */
router.delete('/', async (req, res) => {
  try {
    const { email, id } = req.body;
    if (id) {
      await Newsletter.findByIdAndDelete(id);
    } else if (email) {
      await Newsletter.findOneAndDelete({ email });
    } else {
      return res.status(400).json({ success: false, error: 'Missing email or id' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
