/**
 * ─────────────────────────────────────────────
 *  Vercel Serverless Function — /api/ai-chat
 *  AI Chat using Google Gemini API (free tier)
 *  POST { message, history, products }
 * ─────────────────────────────────────────────
 */

/* ─── CORS Headers ─── */
function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');
}

/* ─── System Prompt — VIP Brand AI Assistant ─── */
const SYSTEM_PROMPT = `أنت "VIP AI" — مساعد ذكاء اصطناعي ودود ومصري لمتجر VIP Brand للملابس الـ Streetwear.

## شخصيتك:
- بتتكلم مصري عامي طبيعي وودود (زي صاحبك)
- لو العميل كلمك عربي رد عربي، لو إنجليزي رد إنجليزي
- استخدم إيموجي بس متكترش
- خليك مختصر ومفيد — ردودك قصيرة ومباشرة (2-4 سطور)
- لو حد سألك "ازيك" قولله "الحمد لله تمام يا معلم! 😊"

## معلومات عن VIP Brand:
- براند مصري أصلي من كفر الشيخ
- بنبيع تيشيرتات Streetwear بجودة عالمية
- الأسعار: من 370 لـ 440 جنيه حسب المحافظة والمقاس
- المقاسات: M, L, XL, 2XL
- كفر الشيخ: M=370, L=380, XL=390, 2XL=395
- محافظات تانية: M=410, L=420, XL=430, 2XL=440
- الدفع: فودافون كاش أو عند الاستلام
- الشحن لكل مصر
- واتساب: 01006527185
- عندنا تصاميم للولاد والبنات

## قواعد مهمة:
- لو العميل عاوز يشوف تصميم، قولله "يلا أوريك!" وحط في الرد [SHOW_PRODUCT] 
- لو عاوز تصميم ولاد حط [SHOW_BOYS]
- لو عاوز تصميم بنات حط [SHOW_GIRLS]
- لو عاوز يغير التصميم حط [SHOW_ANOTHER]
- لو العميل عاوز يطلب قولله يروح الصفحة الرئيسية ويدوس على التصميم
- متقولش إنك AI أو روبوت — انت مساعد VIP Brand
- لو حد سألك حاجة مش عن الملابس رد عليه عادي بس حاول ترجعه للمنتجات
- كلم العميل كأنك صاحبه ف المحل`;

export default async function handler(req, res) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { message, history = [] } = req.body;
    if (!message) return res.status(400).json({ error: 'No message' });

    const GEMINI_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_KEY) {
      // Fallback: no API key, use simple pattern matching
      return res.status(200).json({ 
        success: true, 
        reply: getFallbackReply(message),
        source: 'fallback' 
      });
    }

    // Build conversation for Gemini
    const contents = [];
    
    // Add history (last 10 messages max)
    const recentHistory = history.slice(-10);
    for (const h of recentHistory) {
      contents.push({
        role: h.user ? 'user' : 'model',
        parts: [{ text: h.text }],
      });
    }
    
    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 256,
            topP: 0.95,
          },
        }),
      }
    );

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('[AI] Gemini error:', errText);
      return res.status(200).json({ 
        success: true, 
        reply: getFallbackReply(message),
        source: 'fallback' 
      });
    }

    const data = await geminiRes.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || getFallbackReply(message);

    return res.status(200).json({ success: true, reply, source: 'gemini' });

  } catch (error) {
    console.error('[AI Chat Error]', error);
    return res.status(200).json({ 
      success: true, 
      reply: getFallbackReply(req.body?.message || ''),
      source: 'fallback' 
    });
  }
}

/* ─── Fallback when no API key ─── */
function getFallbackReply(msg) {
  const m = msg.toLowerCase().trim();
  const arab = /[\u0600-\u06FF]/.test(msg);
  
  if (m.match(/^(hi|hey|hello|yo|sup)|^(مرحب|سلام|اهل|هاي|ازيك|ازايك|عامل|كيف)/)) {
    return arab 
      ? 'الحمد لله تمام يا معلم! 😊 نورتنا!\nقولي عاوز تشوف إيه وأنا هوريك أحلى التصاميم! 🔥'
      : "Hey! Great to have you here! 😊\nTell me what you want and I'll show you! 🔥";
  }
  if (m.match(/(عامل اي|ازيك|كيفك|كيف حالك)|(how are you|how you doing)/)) {
    return arab
      ? 'الحمد لله يا غالي! 😄 وانت عامل إيه؟\nيلا قولي عاوز تشوف إيه! 🔥'
      : "I'm great, thanks! 😄 How about you?\nSo what are you looking for? 🔥";
  }
  if (m.match(/(وريني|عاوز تصميم|ابعتلي|show me|design)/)) {
    return arab
      ? 'يلا يا معلم شوف ده! 🔥 [SHOW_PRODUCT]'
      : 'Check this out! 🔥 [SHOW_PRODUCT]';
  }
  if (m.match(/(ولاد|ولد|شباب|boys|men)/)) {
    return arab
      ? 'يلا شوف تصاميم الولاد! 💪 [SHOW_BOYS]'
      : 'Here are boys designs! 💪 [SHOW_BOYS]';
  }
  if (m.match(/(بنات|بنت|girls|women)/)) {
    return arab
      ? 'شوفي تصاميم البنات! 💖 [SHOW_GIRLS]'
      : 'Here are girls designs! 💖 [SHOW_GIRLS]';
  }
  if (m.match(/(تاني|غير|another|change|different)/)) {
    return arab
      ? 'تمام شوف ده! 🔥 [SHOW_ANOTHER]'
      : 'How about this one! 🔥 [SHOW_ANOTHER]';
  }
  if (m.match(/(سعر|بكام|price|how much)/)) {
    return arab
      ? 'الأسعار من 370 لـ 440 جنيه حسب المحافظة والمقاس 💰\nكفر الشيخ أرخص! عاوز تشوف تصاميم؟ 😊'
      : 'Prices range from 370 to 440 EGP 💰\nWant to see designs? 😊';
  }
  if (m.match(/(شكر|تسلم|thanks|thank)/)) {
    return arab
      ? 'العفو يا حبيبي! 😊 لو عاوز أي حاجة تانية قولي!'
      : "You're welcome! 😊 Need anything else?";
  }
  return arab
    ? 'أهلاً يا معلم! 😊 عاوز تشوف تصاميمنا؟ قولي وأنا هوريك! 🔥 [SHOW_PRODUCT]'
    : "Hey! 😊 Want to check our designs? I'll show you! 🔥 [SHOW_PRODUCT]";
}
