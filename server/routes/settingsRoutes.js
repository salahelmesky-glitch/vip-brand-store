/**
 * ─────────────────────────────────────────────
 *  Settings Routes — Express (local dev)
 *  Single document in MongoDB for ALL site settings
 *  GET → return current settings
 *  PUT → update settings (admin)
 * ─────────────────────────────────────────────
 */

import { Router } from 'express';
import mongoose from 'mongoose';

const router = Router();

/* ─── Settings Schema (single document) ─── */
const settingsSchema = new mongoose.Schema({
  key: { type: String, default: 'main', unique: true },
  maintenance: { type: Boolean, default: false },
  videos: { type: Array, default: [] },
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
  storePricing: {
    type: Object,
    default: {
      kafrElSheikh: { M: 370, L: 380, XL: 390, '2XL': 395 },
      other: { M: 410, L: 420, XL: 430, '2XL': 440 },
      sizes: ['M', 'L', 'XL', '2XL'],
    },
  },
  rewardCosts: {
    type: Object,
    default: { spinCost: 75, mysteryCost: 100 },
  },
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
  mysteryText: { type: String, default: '🎉 ألف مبروك! كسبت معانا هدية حصرية!' },
}, { timestamps: true, minimize: false });

const Settings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', settingsSchema);

/* ─── Get or create settings ─── */
async function getSettings() {
  let doc = await Settings.findOne({ key: 'main' }).lean();
  if (!doc) {
    doc = await Settings.create({ key: 'main' });
    doc = doc.toObject();
  }
  return doc;
}

/* ── GET: Fetch settings ── */
router.get('/', async (req, res, next) => {
  try {
    const doc = await getSettings();
    res.json({
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
  } catch (err) { next(err); }
});

/* ── PUT: Update settings ── */
router.put('/', async (req, res, next) => {
  try {
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

    res.json({
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
  } catch (err) { next(err); }
});

export default router;
