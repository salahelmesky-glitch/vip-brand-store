/**
 * ─────────────────────────────────────────────
 *  User Routes — Auth + Loyalty System
 *  Express routes for local development
 * ─────────────────────────────────────────────
 */

import { Router } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const router = Router();

/* ─── User Schema ─── */
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  name: { type: String, default: 'VIP Member', trim: true },
  tshirtsPurchased: { type: Number, default: 0 },
  points: { type: Number, default: 0 },
  checkpointProgress: { type: Number, default: 0, min: 0, max: 3 },
  totalCycles: { type: Number, default: 0 },
  rewardsUnlocked: [{ type: String }],
  spinHistory: [{
    prize: String,
    date: { type: Date, default: Date.now },
  }],
  giftsClaimed: { type: Number, default: 0 },
  mysteryBoxesClaimed: { type: Number, default: 0 },
}, { timestamps: true });

const User = mongoose.models.VipUser || mongoose.model('VipUser', userSchema);

/* ─── Sanitize ─── */
function sanitize(u) {
  return {
    id: u._id, email: u.email, name: u.name,
    tshirtsPurchased: u.tshirtsPurchased, points: u.points,
    checkpointProgress: u.checkpointProgress, totalCycles: u.totalCycles,
    rewardsUnlocked: u.rewardsUnlocked, spinHistory: u.spinHistory,
    giftsClaimed: u.giftsClaimed, mysteryBoxesClaimed: u.mysteryBoxesClaimed,
    createdAt: u.createdAt,
  };
}

/* ─── Unified handler — uses ?action= query param ─── */

/* GET /api/users?email=... or ?action=leaderboard or ?action=admin-users */
router.get('/', async (req, res, next) => {
  try {
    const { action, email } = req.query;

    if (action === 'leaderboard') {
      const top = await User.find().sort({ points: -1 }).limit(10).lean();
      const board = top.map((u, i) => ({
        rank: i + 1, name: u.name, points: u.points, tshirts: u.tshirtsPurchased,
      }));
      return res.json({ success: true, data: board });
    }

    /* Admin — get ALL users with emails */
    if (action === 'admin-users') {
      const all = await User.find().sort({ createdAt: -1 }).lean();
      const list = all.map(u => ({
        id: u._id, email: u.email, name: u.name,
        points: u.points, tshirts: u.tshirtsPurchased,
        checkpointProgress: u.checkpointProgress, totalCycles: u.totalCycles,
        giftsClaimed: u.giftsClaimed, mysteryBoxesClaimed: u.mysteryBoxesClaimed,
        createdAt: u.createdAt,
      }));
      return res.json({ success: true, data: list });
    }

    if (email) {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      return res.json({ success: true, data: sanitize(user) });
    }

    return res.status(400).json({ success: false, error: 'Missing email or action' });
  } catch (err) { next(err); }
});

/* POST /api/users?action=register or login */
router.post('/', async (req, res, next) => {
  try {
    const action = req.query.action || req.body?.action;

    if (action === 'register') {
      const { email, password, name } = req.body;
      if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) return res.status(409).json({ success: false, error: 'Email already registered / الإيميل مسجل بالفعل' });
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ email: email.toLowerCase(), password: hashed, name: name || 'VIP Member' });
      return res.status(201).json({ success: true, data: sanitize(user) });
    }

    if (action === 'login') {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ success: false, error: 'Email and password required' });
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(401).json({ success: false, error: 'Invalid email or password / إيميل أو باسورد غلط' });
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ success: false, error: 'Invalid email or password / إيميل أو باسورد غلط' });
      return res.json({ success: true, data: sanitize(user) });
    }

    return res.status(400).json({ success: false, error: 'Missing action' });
  } catch (err) { next(err); }
});

/* PUT /api/users?action=purchase|spin|gift|mystery */
router.put('/', async (req, res, next) => {
  try {
    const action = req.query.action || req.body?.action;
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    if (action === 'purchase') {
      const qty = req.body.quantity || 1;
      user.tshirtsPurchased += qty;
      user.points += qty * 10;
      user.checkpointProgress += qty;
      while (user.checkpointProgress >= 4) {
        user.checkpointProgress -= 4;
        user.totalCycles += 1;
        user.points += 20;
      }
      await user.save();
      return res.json({ success: true, data: sanitize(user) });
    }

    if (action === 'spin') {
      if (user.points < 75) return res.status(400).json({ success: false, error: 'Not enough points (need 75)' });
      const rand = Math.random() * 100;
      let prize;
      if (rand < 30) prize = 'discount_10';
      else if (rand < 45) prize = 'discount_20';
      else if (rand < 70) prize = 'free_shipping';
      else if (rand < 75) prize = 'free_tshirt';
      else if (rand < 90) prize = 'bonus_30';
      else prize = 'try_again';
      user.points -= 75;
      if (prize === 'bonus_30') user.points += 30;
      user.spinHistory.push({ prize, date: new Date() });
      if (!user.rewardsUnlocked.includes('spin')) user.rewardsUnlocked.push('spin');
      await user.save();
      return res.json({ success: true, data: sanitize(user), prize });
    }

    if (action === 'gift') {
      if (user.points < 100) return res.status(400).json({ success: false, error: 'Not enough points (need 100)' });
      user.points -= 100;
      user.giftsClaimed += 1;
      if (!user.rewardsUnlocked.includes('gift')) user.rewardsUnlocked.push('gift');
      await user.save();
      return res.json({ success: true, data: sanitize(user) });
    }

    if (action === 'mystery') {
      if (user.points < 100) return res.status(400).json({ success: false, error: 'Not enough points (need 100)' });
      user.points -= 100;
      user.mysteryBoxesClaimed += 1;
      if (!user.rewardsUnlocked.includes('mystery')) user.rewardsUnlocked.push('mystery');
      await user.save();
      return res.json({ success: true, data: sanitize(user) });
    }

    /* Admin — manually add points */
    if (action === 'admin-addpoints') {
      const pts = parseInt(req.body.points) || 0;
      if (pts === 0) return res.status(400).json({ success: false, error: 'Points must be non-zero' });
      user.points += pts;
      if (user.points < 0) user.points = 0;
      await user.save();
      return res.json({ success: true, data: sanitize(user) });
    }

    /* Admin — edit user name */
    if (action === 'admin-editname') {
      const nm = (req.body.name || '').trim();
      if (!nm) return res.status(400).json({ success: false, error: 'Name is required' });
      user.name = nm;
      await user.save();
      return res.json({ success: true, data: sanitize(user) });
    }

    return res.status(400).json({ success: false, error: 'Unknown action' });
  } catch (err) { next(err); }
});

export default router;
