/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/users
 *  Handles user auth + loyalty system
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

/* ─── Cached Connection (Serverless-Safe) ─── */
let cached = global._mongooseUserCache;
if (!cached) {
  cached = global._mongooseUserCache = { conn: null, promise: null };
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

/* ─── CORS Headers ─── */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
}

/* ─── Sanitize user for frontend ─── */
function sanitize(u) {
  return {
    id: u._id,
    email: u.email,
    name: u.name,
    tshirtsPurchased: u.tshirtsPurchased,
    points: u.points,
    checkpointProgress: u.checkpointProgress,
    totalCycles: u.totalCycles,
    rewardsUnlocked: u.rewardsUnlocked,
    spinHistory: u.spinHistory,
    giftsClaimed: u.giftsClaimed,
    mysteryBoxesClaimed: u.mysteryBoxesClaimed,
    createdAt: u.createdAt,
  };
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();
    const action = req.query.action || req.body?.action;

    /* ══ REGISTER ══ */
    if (req.method === 'POST' && action === 'register') {
      const { email, password, name } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password required' });
      }
      const exists = await User.findOne({ email: email.toLowerCase() });
      if (exists) {
        return res.status(409).json({ success: false, error: 'Email already registered / الإيميل مسجل بالفعل' });
      }
      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({
        email: email.toLowerCase(),
        password: hashed,
        name: name || 'VIP Member',
      });
      return res.status(201).json({ success: true, data: sanitize(user) });
    }

    /* ══ LOGIN ══ */
    if (req.method === 'POST' && action === 'login') {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password required' });
      }
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password / إيميل أو باسورد غلط' });
      }
      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ success: false, error: 'Invalid email or password / إيميل أو باسورد غلط' });
      }
      return res.status(200).json({ success: true, data: sanitize(user) });
    }

    /* ══ GET PROFILE ══ */
    if (req.method === 'GET' && req.query.email) {
      const user = await User.findOne({ email: req.query.email.toLowerCase() });
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }
      return res.status(200).json({ success: true, data: sanitize(user) });
    }

    /* ══ PURCHASE ══ */
    if (req.method === 'PUT' && action === 'purchase') {
      const { email, quantity } = req.body;
      const qty = quantity || 1;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });

      user.tshirtsPurchased += qty;
      user.points += qty * 10;
      user.checkpointProgress += qty;

      // Check for completed cycles (every 4 shirts)
      while (user.checkpointProgress >= 4) {
        user.checkpointProgress -= 4;
        user.totalCycles += 1;
        user.points += 20; // Bonus for completing a cycle
      }

      await user.save();
      return res.status(200).json({ success: true, data: sanitize(user), bonus: qty > 0 });
    }

    /* ══ SPIN WHEEL ══ */
    if (req.method === 'PUT' && action === 'spin') {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      if (user.points < 75) {
        return res.status(400).json({ success: false, error: 'Not enough points (need 75) / محتاج ٧٥ نقطة' });
      }

      // Determine prize
      const rand = Math.random() * 100;
      let prize;
      if (rand < 30) prize = 'discount_10';
      else if (rand < 45) prize = 'discount_20';
      else if (rand < 70) prize = 'free_shipping';
      else if (rand < 75) prize = 'free_tshirt';
      else if (rand < 90) prize = 'bonus_30';
      else prize = 'try_again';

      const prizeIds = ['discount_10', 'bonus_30', 'free_shipping', 'discount_20', 'try_again', 'free_tshirt'];
      const prizeIndex = prizeIds.indexOf(prize);

      user.points -= 75;
      if (prize === 'bonus_30') user.points += 30;
      user.spinHistory.push({ prize, date: new Date() });
      if (!user.rewardsUnlocked.includes('spin')) user.rewardsUnlocked.push('spin');

      await user.save();
      return res.status(200).json({ success: true, data: sanitize(user), prize, prizeIndex });
    }

    /* ══ GIFT REWARD ══ */
    if (req.method === 'PUT' && action === 'gift') {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      if (user.points < 100) {
        return res.status(400).json({ success: false, error: 'Not enough points (need 100) / محتاج ١٠٠ نقطة' });
      }
      user.points -= 100;
      user.giftsClaimed += 1;
      if (!user.rewardsUnlocked.includes('gift')) user.rewardsUnlocked.push('gift');
      await user.save();
      return res.status(200).json({ success: true, data: sanitize(user) });
    }

    /* ══ MYSTERY BOX ══ */
    if (req.method === 'PUT' && action === 'mystery') {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      if (user.points < 100) {
        return res.status(400).json({ success: false, error: 'Not enough points (need 100) / محتاج ١٠٠ نقطة' });
      }
      user.points -= 100;
      user.mysteryBoxesClaimed += 1;
      if (!user.rewardsUnlocked.includes('mystery')) user.rewardsUnlocked.push('mystery');
      await user.save();
      return res.status(200).json({ success: true, data: sanitize(user) });
    }

    /* ══ LEADERBOARD ══ */
    if (req.method === 'GET' && action === 'leaderboard') {
      const top = await User.find().sort({ points: -1 }).limit(10).lean();
      const board = top.map((u, i) => ({
        rank: i + 1,
        name: u.name,
        points: u.points,
        tshirts: u.tshirtsPurchased,
      }));
      return res.status(200).json({ success: true, data: board });
    }

    /* ══ ADMIN — GET ALL USERS ══ */
    if (req.method === 'GET' && action === 'admin-users') {
      const all = await User.find().sort({ createdAt: -1 }).lean();
      const list = all.map(u => ({
        id: u._id, email: u.email, name: u.name,
        points: u.points, tshirts: u.tshirtsPurchased,
        checkpointProgress: u.checkpointProgress, totalCycles: u.totalCycles,
        giftsClaimed: u.giftsClaimed, mysteryBoxesClaimed: u.mysteryBoxesClaimed,
        createdAt: u.createdAt,
      }));
      return res.status(200).json({ success: true, data: list });
    }

    /* ══ ADMIN — ADD POINTS ══ */
    if (req.method === 'PUT' && action === 'admin-addpoints') {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      const pts = parseInt(req.body.points) || 0;
      if (pts === 0) return res.status(400).json({ success: false, error: 'Points must be non-zero' });
      user.points += pts;
      if (user.points < 0) user.points = 0;
      await user.save();
      return res.status(200).json({ success: true, data: sanitize(user) });
    }

    /* ══ ADMIN — EDIT NAME ══ */
    if (req.method === 'PUT' && action === 'admin-editname') {
      const { email } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) return res.status(404).json({ success: false, error: 'User not found' });
      const nm = (req.body.name || '').trim();
      if (!nm) return res.status(400).json({ success: false, error: 'Name is required' });
      user.name = nm;
      await user.save();
      return res.status(200).json({ success: true, data: sanitize(user) });
    }

    /* ══ ADMIN — DELETE USER ══ */
    if (req.method === 'DELETE' && action === 'admin-delete') {
      const { email } = req.body;
      if (!email) return res.status(400).json({ success: false, error: 'Email required' });
      const result = await User.findOneAndDelete({ email: email.toLowerCase() });
      if (!result) return res.status(404).json({ success: false, error: 'User not found' });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, error: 'Method/action not supported' });
  } catch (error) {
    console.error('[API /users Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
