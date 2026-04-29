import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';

const AdminContext = createContext();

/* ─── API Base URL ─── */
const API_BASE = '/api';

/* ─── VAPID Public Key for Push Notifications ─── */
const VAPID_PUBLIC_KEY = 'BKdOg_84LUt592Fxx3ApvjQab8m6LbfI02WdPWkyujIedjOsRd16MOrFp-Z_adC-ETNIMub1fmaIovrAf47Ffqo';

/* ─── Default Admin Credentials ─── */
const ADMIN_CREDENTIALS = {
  email: 'VIP_Salah_Admin',
  password: 'Vip@Salah#2026!Rafat',
  name: 'VIP Admin',
};

/* ─── Default 100 Products (fallback only) ─── */
const toAr = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);

const buildDefaults = () =>
  Array.from({ length: 100 }, (_, i) => {
    const num = i + 1;
    return {
      id: num,
      name: `🔥 Inter lock ${num} 🔥`,
      nameAr: `🔥 انترلوك ${toAr(num)} 🔥`,
      img: `/images/${num}.jpg`,
      price: 500,
      gender: num <= 50 ? 'boys' : 'girls',
      inStock: true,
      sizes: ['M', 'L', 'XL', '2XL'],
    };
  });

/* ─── Default Pricing ─── */
const DEFAULT_PRICING = {
  kafrElSheikh: { M: 370, L: 380, XL: 390, '2XL': 395 },
  other: { M: 410, L: 420, XL: 430, '2XL': 440 },
  sizes: ['M', 'L', 'XL', '2XL'],
};

/* ─── Default Reward Costs ─── */
const DEFAULT_REWARD_COSTS = { spinCost: 75, mysteryCost: 100 };

/* ─── Default Site Texts ─── */
const DEFAULT_SITE_TEXTS = {
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
};

/* ─── Default Prizes ─── */
const DEFAULT_PRIZES = [
  { id: 'discount_10', labelAr: 'خصم ١٠٪', color: '#ff6b6b', icon: '🏷️' },
  { id: 'bonus_30', labelAr: '+٣٠ نقطة', color: '#ffd43b', icon: '⭐' },
  { id: 'free_shipping', labelAr: 'شحن مجاني', color: '#69db7c', icon: '🚚' },
  { id: 'discount_20', labelAr: 'خصم ٢٠٪', color: '#da77f2', icon: '🔥' },
  { id: 'try_again', labelAr: 'حاول تاني', color: '#868e96', icon: '🔄' },
  { id: 'free_tshirt', labelAr: 'تيشيرت مجاني!', color: '#00ff66', icon: '👕' },
];

export const AdminProvider = ({ children }) => {
  /* ── Auth ── */
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return localStorage.getItem('vip_admin_auth') === 'true'; } catch { return false; }
  });

  /* ── Products: start with defaults, immediately replaced by API data ── */
  const [products, setProducts] = useState(() => buildDefaults());

  /* ── Loading & Error state ── */
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /* ══════════════════════════════════════════════════════
     POLL GUARD — Prevents polling from overwriting
     optimistic updates while an admin write is in-flight.
     After any admin write, polling pauses for 5 seconds
     then does a fresh fetch to get the saved data.
     ══════════════════════════════════════════════════════ */
  const pollGuardUntilRef = useRef(0); // timestamp until which polling is paused

  const startPollGuard = useCallback(() => {
    pollGuardUntilRef.current = Date.now() + 10000; // pause polling 10 seconds
  }, []);

  const isPollGuarded = useCallback(() => {
    return Date.now() < pollGuardUntilRef.current;
  }, []);

  /* ── Legacy Orders (localStorage) ── */
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('vip_orders');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  /* ── Store Orders (MongoDB-backed) ── */
  const [storeOrders, setStoreOrders] = useState([]);
  const [storeOrdersLoading, setStoreOrdersLoading] = useState(true);

  /* ── New Order Notification System ── */
  const [newOrderAlert, setNewOrderAlert] = useState(null); // { order, timestamp }
  const prevOrderCountRef = useRef(null); // null = first load, don't alert
  const prevOrderIdsRef = useRef(new Set());

  /* ── Push Notification State ── */
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushLoading, setPushLoading] = useState(false);
  const pushCheckedRef = useRef(false);

  /* Play notification sound using Web Audio API */
  const playNotificationSound = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      // Play a pleasant two-tone chime
      const playTone = (freq, startTime, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(0.4, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
        osc.start(startTime);
        osc.stop(startTime + duration);
      };
      const now = ctx.currentTime;
      playTone(880, now, 0.15);        // A5
      playTone(1174.66, now + 0.15, 0.15); // D6
      playTone(1396.91, now + 0.3, 0.3);  // F6
    } catch (e) {
      console.warn('[VIP] Could not play notification sound:', e);
    }
  }, []);

  /* Send browser notification */
  const sendBrowserNotification = useCallback((order) => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      try {
        const n = new Notification('🛍️ طلب جديد - VIP Brand!', {
          body: `👤 ${order.customerName || 'عميل جديد'}\n👕 ${order.productName} - ${order.size}\n💰 ${order.price} ج.م`,
          icon: '/favicon.svg',
          tag: 'vip-new-order',
          requireInteraction: true,
        });
        n.onclick = () => { window.focus(); n.close(); };
      } catch (e) { console.warn('[VIP] Notification error:', e); }
    }
  }, []);

  /* ── Helper: Convert VAPID key to Uint8Array ── */
  const urlBase64ToUint8Array = useCallback((base64String) => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }, []);

  /* ── Register Service Worker & Subscribe to Push ── */
  const registerAndSubscribePush = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('[VIP] Push not supported in this browser');
      return false;
    }

    try {
      setPushLoading(true);

      // Register service worker
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      await navigator.serviceWorker.ready;
      console.log('[VIP] Service Worker registered');

      // Check existing subscription
      let subscription = await registration.pushManager.getSubscription();

      // If existing subscription, try to validate it by re-saving
      // If no subscription, create a new one
      if (!subscription) {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          console.warn('[VIP] Notification permission denied');
          setPushLoading(false);
          return false;
        }

        // Subscribe to push
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
        console.log('[VIP] Push subscription created');
      } else {
        console.log('[VIP] Existing push subscription found, re-saving to server');
      }

      // Always send subscription to server (upsert) to keep it fresh
      const res = await fetch(`${API_BASE}/push-subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription: subscription.toJSON(),
          label: 'admin',
        }),
      });

      if (res.ok) {
        setPushEnabled(true);
        console.log('[VIP] ✅ Push subscription saved to server');
        return true;
      }
    } catch (err) {
      console.error('[VIP] Push subscription failed:', err);
      // If subscription is expired/broken, try to re-subscribe
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        if (reg) {
          const oldSub = await reg.pushManager.getSubscription();
          if (oldSub) await oldSub.unsubscribe();
          // Retry fresh subscribe
          const newSub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          });
          const res2 = await fetch(`${API_BASE}/push-subscribe`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription: newSub.toJSON(), label: 'admin' }),
          });
          if (res2.ok) {
            setPushEnabled(true);
            console.log('[VIP] ✅ Push RE-subscribed successfully');
            return true;
          }
        }
      } catch (retryErr) {
        console.error('[VIP] Push re-subscribe also failed:', retryErr);
      }
    } finally {
      setPushLoading(false);
    }
    return false;
  }, [urlBase64ToUint8Array]);

  /* ── Check push subscription status ── */
  const checkPushStatus = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        setPushEnabled(!!subscription);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  /* Auto-register push on admin auth */
  useEffect(() => {
    if (isAuthenticated && !pushCheckedRef.current) {
      pushCheckedRef.current = true;
      // Check status first, auto-subscribe if not already
      checkPushStatus().then((status) => {
        // Auto-subscribe on first login
        registerAndSubscribePush();
      });
    }
  }, [isAuthenticated, checkPushStatus, registerAndSubscribePush]);

  /* ══════════════════════════════════════════════
     SETTINGS — ALL from MongoDB API (NOT localStorage)
     ══════════════════════════════════════════════ */
  const [maintenance, setMaintenance] = useState(false);
  const [videos, setVideos] = useState([]);
  const [siteTexts, setSiteTexts] = useState(DEFAULT_SITE_TEXTS);
  const [storePricing, setStorePricing] = useState(DEFAULT_PRICING);
  const [rewardCosts, setRewardCosts] = useState(DEFAULT_REWARD_COSTS);
  const [prizes, setPrizes] = useState(DEFAULT_PRIZES);
  const [mysteryText, setMysteryText] = useState('🎉 ألف مبروك! كسبت معانا هدية حصرية!');
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [installCount, setInstallCount] = useState(() => {
    try { return parseInt(localStorage.getItem('vip_install_count') || '0', 10); }
    catch { return 0; }
  });

  /* ── Newsletters (MongoDB-backed) ── */
  const [newsletters, setNewsletters] = useState([]);
  const [newslettersLoading, setNewslettersLoading] = useState(true);

  /* ─────────────────────────────────────────
     Fetch Settings from API (MongoDB)
     ───────────────────────────────────────── */
  const fetchSettings = useCallback(async (force = false) => {
    // Skip if poll guard is active (admin just made a change) — unless forced
    if (!force && isPollGuarded()) return;
    try {
      const ts = Date.now();
      const res = await fetch(`${API_BASE}/settings?_t=${ts}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      if (!res.ok) throw new Error(`Settings API error: ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setMaintenance(d.maintenance ?? false);
        setVideos(d.videos ?? []);
        setSiteTexts({ ...DEFAULT_SITE_TEXTS, ...(d.siteTexts || {}) });
        setStorePricing(d.storePricing ?? DEFAULT_PRICING);
        setRewardCosts({ ...DEFAULT_REWARD_COSTS, ...(d.rewardCosts || {}) });
        setPrizes(d.prizes?.length ? d.prizes : DEFAULT_PRIZES);
        setMysteryText(d.mysteryText || '🎉 ألف مبروك! كسبت معانا هدية حصرية!');
        const ic = d.installCount ?? 0;
        setInstallCount(ic);
        try { localStorage.setItem('vip_install_count', String(ic)); } catch {}
        setSettingsLoaded(true);
      }
    } catch (err) {
      console.warn('[VIP] Settings API fetch failed:', err.message);
    }
  }, [isPollGuarded]);

  /* ─────────────────────────────────────────
     Update Settings on API (MongoDB)
     ───────────────────────────────────────── */
  const updateSettings = useCallback(async (updates) => {
    startPollGuard(); // ⛔ Pause polling to prevent overwriting optimistic updates
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
      const json = await res.json();
      if (json.success && json.data) {
        const d = json.data;
        setMaintenance(d.maintenance ?? false);
        setVideos(d.videos ?? []);
        setSiteTexts({ ...DEFAULT_SITE_TEXTS, ...(d.siteTexts || {}) });
        setStorePricing(d.storePricing ?? DEFAULT_PRICING);
        setRewardCosts({ ...DEFAULT_REWARD_COSTS, ...(d.rewardCosts || {}) });
        setPrizes(d.prizes?.length ? d.prizes : DEFAULT_PRIZES);
        setMysteryText(d.mysteryText || '🎉 ألف مبروك! كسبت معانا هدية حصرية!');
        const ic2 = d.installCount ?? 0;
        setInstallCount(ic2);
        try { localStorage.setItem('vip_install_count', String(ic2)); } catch {}
      }
      return json;
    } catch (err) {
      console.error('[VIP] Settings update failed:', err);
      // On failure, force re-fetch to restore correct state
      setTimeout(() => fetchSettings(true), 500);
      return { success: false };
    }
  }, [startPollGuard, fetchSettings]);

  /* ─────────────────────────────────────────
     Convenience update functions for admin pages
     ───────────────────────────────────────── */
  const updateMaintenance = useCallback(async (val) => {
    setMaintenance(val); // optimistic
    return updateSettings({ maintenance: val });
  }, [updateSettings]);

  const updateVideos = useCallback(async (newVideos) => {
    setVideos(newVideos); // optimistic
    return updateSettings({ videos: newVideos });
  }, [updateSettings]);

  const updateSiteTexts = useCallback(async (newTexts) => {
    const merged = { ...siteTexts, ...newTexts };
    setSiteTexts(merged); // optimistic
    return updateSettings({ siteTexts: merged });
  }, [updateSettings, siteTexts]);

  const updateStorePricing = useCallback(async (newPricing) => {
    setStorePricing(newPricing); // optimistic
    return updateSettings({ storePricing: newPricing });
  }, [updateSettings]);

  const updateRewardCosts = useCallback(async (newCosts) => {
    const merged = { ...rewardCosts, ...newCosts };
    setRewardCosts(merged); // optimistic
    return updateSettings({ rewardCosts: merged });
  }, [updateSettings, rewardCosts]);

  const updatePrizes = useCallback(async (newPrizes) => {
    setPrizes(newPrizes); // optimistic
    return updateSettings({ prizes: newPrizes });
  }, [updateSettings]);

  const incrementInstallCount = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ incrementInstall: true }),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setInstallCount(json.data.installCount ?? 0);
      }
    } catch (err) {
      console.warn('[VIP] Install count increment failed:', err);
    }
  }, []);

  const updateMysteryText = useCallback(async (text) => {
    setMysteryText(text); // optimistic
    return updateSettings({ mysteryText: text });
  }, [updateSettings]);

  /* ─────────────────────────────────────────
     Fetch Products from API
     ───────────────────────────────────────── */
  // Image cache — persists across re-renders
  const imgCacheRef = useRef({});

  const fetchProducts = useCallback(async (showLoading = false, force = false) => {
    // Skip if poll guard is active — unless forced
    if (!force && isPollGuarded()) return;
    try {
      if (showLoading) setIsLoading(true);
      const ts = Date.now();
      const res = await fetch(`${API_BASE}/products?_t=${ts}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const json = await res.json();
      if (json.success && json.data && json.data.length > 0) {
        // Merge with cached images
        const merged = json.data.map(p => ({
          ...p,
          img: imgCacheRef.current[p.id] || p.img || '',
        }));
        setProducts(merged);

        // Load images in background for products that don't have them cached
        const needImages = merged.filter(p => !p.img && !imgCacheRef.current[p.id]);
        if (needImages.length > 0) {
          // Load in batches of 5
          for (let i = 0; i < needImages.length; i += 5) {
            const batch = needImages.slice(i, i + 5);
            const promises = batch.map(async (p) => {
              try {
                const imgRes = await fetch(`${API_BASE}/products?imgFor=${p.id}&_t=${ts}`);
                if (imgRes.ok) {
                  const imgJson = await imgRes.json();
                  if (imgJson.success && imgJson.data?.img) {
                    imgCacheRef.current[p.id] = imgJson.data.img;
                    return { id: p.id, img: imgJson.data.img };
                  }
                }
              } catch {}
              return null;
            });
            const results = await Promise.all(promises);
            const updates = results.filter(Boolean);
            if (updates.length > 0) {
              setProducts(prev => prev.map(p => {
                const found = updates.find(u => u.id === p.id);
                return found ? { ...p, img: found.img } : p;
              }));
            }
          }
        }
      }
      setApiError(null);
    } catch (err) {
      console.warn('[VIP] API fetch failed, using current products:', err.message);
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [isPollGuarded]);

  /* ─────────────────────────────────────────
     Fetch Store Orders from MongoDB
     ───────────────────────────────────────── */
  const fetchStoreOrders = useCallback(async () => {
    try {
      const ts = Date.now();
      const res = await fetch(`${API_BASE}/store-orders?_t=${ts}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      if (!res.ok) throw new Error(`Store orders API error: ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        const newOrders = json.data;
        const newIds = new Set(newOrders.map(o => o.id));

        // Detect genuinely new orders (only after initial load)
        if (prevOrderCountRef.current !== null && isAuthenticated) {
          const freshOrders = newOrders.filter(o => !prevOrderIdsRef.current.has(o.id));
          if (freshOrders.length > 0) {
            const latest = freshOrders[0]; // most recent new order
            setNewOrderAlert({ order: latest, timestamp: Date.now(), count: freshOrders.length });
            playNotificationSound();
            sendBrowserNotification(latest);
          }
        }

        // Update refs for next comparison
        prevOrderCountRef.current = newOrders.length;
        prevOrderIdsRef.current = newIds;

        setStoreOrders(newOrders);
      }
    } catch (err) {
      console.warn('[VIP] Store orders fetch failed:', err.message);
    } finally {
      setStoreOrdersLoading(false);
    }
  }, [isAuthenticated, playNotificationSound, sendBrowserNotification]);

  /* ─────────────────────────────────────────
     Fetch Newsletters from MongoDB
     ───────────────────────────────────────── */
  const fetchNewsletters = useCallback(async () => {
    try {
      const ts = Date.now();
      const res = await fetch(`${API_BASE}/newsletter?_t=${ts}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
      });
      if (!res.ok) throw new Error(`Newsletter API error: ${res.status}`);
      const json = await res.json();
      if (json.success && json.data) {
        setNewsletters(json.data);
      }
    } catch (err) {
      console.warn('[VIP] Newsletters fetch failed:', err.message);
    } finally {
      setNewslettersLoading(false);
    }
  }, []);

  /* ── Fetch on mount ── */
  useEffect(() => {
    fetchProducts(true);
    fetchStoreOrders();
    fetchSettings();
    fetchNewsletters();
  }, [fetchProducts, fetchStoreOrders, fetchSettings, fetchNewsletters, refreshTrigger]);

  /* ── Poll products every 3 seconds (guard-aware) ── */
  useEffect(() => {
    const interval = setInterval(() => { fetchProducts(false); }, 3000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  /* ── Poll store orders and newsletters every 5 seconds ── */
  useEffect(() => {
    const interval = setInterval(() => { 
      fetchStoreOrders(); 
      fetchNewsletters();
    }, 5000);
    return () => clearInterval(interval);
  }, [fetchStoreOrders, fetchNewsletters]);

  /* ══════════════════════════════════════════════════
     Poll settings every 2 seconds (guard-aware) —
     admin changes appear for customers within 2 sec!
     Polling is auto-paused during admin writes.
     ══════════════════════════════════════════════════ */
  useEffect(() => {
    const interval = setInterval(() => { fetchSettings(); }, 2000);
    return () => clearInterval(interval);
  }, [fetchSettings]);

  /* ── Persist legacy orders to localStorage ── */
  useEffect(() => { localStorage.setItem('vip_orders', JSON.stringify(orders)); }, [orders]);

  /* ── Auth Actions ── */
  const login = useCallback((email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem('vip_admin_auth', 'true');
      return { success: true };
    }
    return { success: false, error: 'بيانات الدخول غلط' };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem('vip_admin_auth');
  }, []);

  /* ─────────────────────────────────────────
     Products CRUD — synced with API + immediate re-fetch
     ───────────────────────────────────────── */
  const addProduct = useCallback(async (product) => {
    startPollGuard(); // ⛔ Pause polling
    const tempId = Date.now();
    const newProduct = { ...product, id: tempId };
    setProducts((prev) => [...prev, newProduct]);

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          // Wait a moment for DB consistency, then force re-fetch
          await new Promise(r => setTimeout(r, 500));
          await fetchProducts(false, true);
          return json.data;
        }
      }
    } catch (err) {
      console.error('[VIP] Failed to add product to API:', err);
    }

    return newProduct;
  }, [startPollGuard, fetchProducts]);

  const updateProduct = useCallback(async (id, updates) => {
    startPollGuard(); // ⛔ Pause polling
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        // Wait a moment for DB consistency, then force re-fetch
        await new Promise(r => setTimeout(r, 500));
        await fetchProducts(false, true);
      } else {
        console.error('[VIP] Failed to update product in API');
      }
    } catch (err) {
      console.error('[VIP] Failed to update product in API:', err);
    }
  }, [startPollGuard, fetchProducts]);

  const deleteProduct = useCallback(async (id) => {
    startPollGuard(); // ⛔ Pause polling
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Wait a moment for DB consistency, then force re-fetch
        await new Promise(r => setTimeout(r, 500));
        await fetchProducts(false, true);
      } else {
        console.error('[VIP] Failed to delete product from API');
      }
    } catch (err) {
      console.error('[VIP] Failed to delete product from API:', err);
    }
  }, [startPollGuard, fetchProducts]);

  /* ── Legacy Orders ── */
  const addOrder = useCallback((order) => {
    const newOrder = { ...order, id: Date.now(), status: 'pending', createdAt: new Date().toISOString() };
    setOrders((prev) => {
      const updated = [...prev, newOrder];
      localStorage.setItem('vip_orders', JSON.stringify(updated));
      return updated;
    });
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      localStorage.setItem('vip_orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      localStorage.setItem('vip_orders', JSON.stringify(updated));
      return updated;
    });
  }, []);

  /* ── Store Orders (MongoDB-backed) ── */
  const addStoreOrder = useCallback(async (orderData) => {
    try {
      const res = await fetch(`${API_BASE}/store-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setStoreOrders((prev) => [json.data, ...prev]);
        return json.data;
      }
    } catch (err) {
      console.error('[VIP] Failed to create store order:', err);
    }
    const fallbackOrder = {
      ...orderData,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setStoreOrders((prev) => [fallbackOrder, ...prev]);
    return fallbackOrder;
  }, []);

  const updateStoreOrderStatus = useCallback(async (orderId, status) => {
    setStoreOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    try {
      await fetch(`${API_BASE}/store-orders`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId, status }),
      });
    } catch (err) {
      console.error('[VIP] Failed to update store order:', err);
    }
  }, []);

  const deleteStoreOrder = useCallback(async (orderId) => {
    setStoreOrders((prev) => prev.filter((o) => o.id !== orderId));
    try {
      await fetch(`${API_BASE}/store-orders`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: orderId }),
      });
    } catch (err) {
      console.error('[VIP] Failed to delete store order:', err);
    }
  }, []);

  const deleteNewsletter = useCallback(async (id) => {
    setNewsletters((prev) => prev.filter((n) => n.id !== id));
    try {
      await fetch(`${API_BASE}/newsletter`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
    } catch (err) {
      console.error('[VIP] Failed to delete newsletter:', err);
    }
  }, []);

  /* ── Stats ── */
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalStoreOrders: storeOrders.length,
    totalRevenue: storeOrders.reduce((sum, o) => sum + (o.price || 0), 0),
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    pendingStoreOrders: storeOrders.filter((o) => o.status === 'pending').length,
    completedOrders: orders.filter((o) => o.status === 'completed').length,
    completedStoreOrders: storeOrders.filter((o) => o.status === 'completed').length,
    cancelledOrders: orders.filter((o) => o.status === 'cancelled').length,
    boysProducts: products.filter((p) => p.gender === 'boys').length,
    girlsProducts: products.filter((p) => p.gender === 'girls').length,
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated, login, logout,
        adminName: ADMIN_CREDENTIALS.name,
        products, addProduct, updateProduct, deleteProduct,
        orders, addOrder, updateOrderStatus, deleteOrder,
        storeOrders, addStoreOrder, updateStoreOrderStatus, deleteStoreOrder,
        /* Settings — all from MongoDB API */
        maintenance, updateMaintenance,
        videos, updateVideos,
        siteTexts, updateSiteTexts,
        storePricing, updateStorePricing,
        rewardCosts, updateRewardCosts,
        prizes, updatePrizes,
        mysteryText, updateMysteryText,
        settingsLoaded,
        fetchSettings,
        stats,
        isLoading, apiError,
        fetchStoreOrders,
        newsletters, deleteNewsletter, newslettersLoading,
        /* Install Count */
        installCount, incrementInstallCount,
        /* New Order Notification */
        newOrderAlert, setNewOrderAlert,
        /* Push Notifications */
        pushEnabled, pushLoading, registerAndSubscribePush,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within AdminProvider');
  return context;
};
