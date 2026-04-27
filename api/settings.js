/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/settings
 *  Single document in MongoDB for ALL site settings
 *  GET → return current settings
 *  PUT → update settings (admin)
 * ─────────────────────────────────────────────
 */

import mongoose from 'mongoose';

/* ─── Cached Connection (Serverless-Safe) ─── */
let cached = global._mongooseSettingsCache;
if (!cached) {
  cached = global._mongooseSettingsCache = { conn: null, promise: null };
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

/* ─── Settings Schema (single document) ─── */
const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },

  /* Maintenance Mode */
  maintenance: { type: Boolean, default: false },

  /* Videos */
  videos: { type: Array, default: [] },

  /* Site Texts */
  siteTexts: {
    type: Object,
    default: {
      brandName: 'VIP',
      heroSubtitle: '★ Exclusive Luxury Streetwear / أزياء فاخرة حصرية ★',
      heroTaglineEn: 'Redefining luxury for the digital era.',
      heroTaglineAr: 'نعيد تعريف الفخامة لعصر جديد.',
      ctaButton: 'Shop Now / تسوق الآن',
      buyButton: 'إضغط للشراء 🛒',
      boysSectionEn: 'BOYS COLLECTION',
      boysSectionAr: 'قسم الولاد',
      girlsSectionEn: 'GIRLS COLLECTION',
      girlsSectionAr: 'قسم البنات',
      storeTitle: 'All Products',
      storeTitleAr: 'جميع المنتجات',
      orderSuccess: 'تم الطلب بنجاح! 🎉',
      orderSuccessDesc: 'سوف يتم التواصل معاك عبر الواتساب لتأكيد الطلب',
      whatsappNumber: '201006527185',
      tiktokUrl: 'https://tiktok.com/@vip0.4',
      instagramUrl: 'https://www.instagram.com/vipjs.js19?igsh=MTBwdG9hOTBhY2Mx',
      aboutAr: 'نحن VIP Brand، براند مصري طالع من قلب محافظة كفر الشيخ، بنقدم أحدث صيحات الـ Streetwear بجودة عالمية وتصاميم مستقبلية.',
      aboutEn: 'We are VIP Brand — Egyptian streetwear from the heart of Kafr El-Sheikh, delivering world-class quality and futuristic designs.',
      governorateQuestion: 'هل أنت من محافظة كفر الشيخ؟',
      kafrLabel: 'محافظة كفر الشيخ',
      otherLabel: 'محافظة أخرى',
    },
  },

  /* Store Pricing */
  storePricing: {
    type: Object,
    default: {
      kafrElSheikh: { M: 370, L: 380, XL: 390, '2XL': 395 },
      other: { M: 410, L: 420, XL: 430, '2XL': 440 },
      sizes: ['M', 'L', 'XL', '2XL'],
    },
  },

  /* Reward Costs */
  rewardCosts: {
    type: Object,
    default: { spinCost: 75, mysteryCost: 100 },
  },

  /* Spin Wheel Prizes */
  prizes: {
    type: Array,
    default: [
      { id: 'discount_10', labelAr: 'خصم ١٠٪', color: '#ff6b6b', icon: '🏷️' },
      { id: 'bonus_30', labelAr: '+٣٠ نقطة', color: '#ffd43b', icon: '⭐' },
      { id: 'free_shipping', labelAr: 'شحن مجاني', color: '#69db7c', icon: '🚚' },
      { id: 'discount_20', labelAr: 'خصم ٢٠٪', color: '#da77f2', icon: '🔥' },
      { id: 'try_again', labelAr: 'حاول تاني', color: '#868e96', icon: '🔄' },
      { id: 'free_tshirt', labelAr: 'تيشيرت مجاني!', color: '#00ff66', icon: '👕' },
    ],
  },

  /* Mystery Text */
  mysteryText: { type: String, default: '🎉 ألف مبروك! كسبت معانا هدية حصرية!' },

}, { timestamps: true, minimize: false });

const Settings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', settingsSchema);

/* ─── CORS Headers ─── */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
}

/* ─── Get or create settings document ─── */
async function getSettings() {
  let doc = await Settings.findOne({ key: 'main' }).lean();
  if (!doc) {
    doc = await Settings.create({ key: 'main' });
    doc = doc.toObject();
  }
  return doc;
}

/* ─── Handler ─── */
export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await dbConnect();

    /* ── GET: Fetch settings ── */
    if (req.method === 'GET') {
      const doc = await getSettings();
      return res.status(200).json({
        success: true,
        data: {
          maintenance: doc.maintenance,
          videos: doc.videos,
          siteTexts: doc.siteTexts,
          storePricing: doc.storePricing,
          rewardCosts: doc.rewardCosts,
          prizes: doc.prizes,
          mysteryText: doc.mysteryText,
        },
      });
    }

    /* ── PUT: Update settings ── */
    if (req.method === 'PUT') {
      const updates = {};
      const body = req.body;

      if (body.maintenance !== undefined) updates.maintenance = body.maintenance;
      if (body.videos !== undefined) updates.videos = body.videos;
      if (body.siteTexts !== undefined) updates.siteTexts = body.siteTexts;
      if (body.storePricing !== undefined) updates.storePricing = body.storePricing;
      if (body.rewardCosts !== undefined) updates.rewardCosts = body.rewardCosts;
      if (body.prizes !== undefined) updates.prizes = body.prizes;
      if (body.mysteryText !== undefined) updates.mysteryText = body.mysteryText;

      const doc = await Settings.findOneAndUpdate(
        { key: 'main' },
        { $set: updates },
        { returnDocument: 'after', lean: true, upsert: true }
      );

      return res.status(200).json({
        success: true,
        data: {
          maintenance: doc.maintenance,
          videos: doc.videos,
          siteTexts: doc.siteTexts,
          storePricing: doc.storePricing,
          rewardCosts: doc.rewardCosts,
          prizes: doc.prizes,
          mysteryText: doc.mysteryText,
        },
      });
    }

    return res.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('[API /settings Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
