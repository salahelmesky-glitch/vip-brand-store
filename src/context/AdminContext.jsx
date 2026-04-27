import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';

const AdminContext = createContext();

/* ─── API Base URL ─── */
const API_BASE = '/api';

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
      name: `Model #${num}`,
      nameAr: `موديل #${toAr(num)}`,
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

  /* Request notification permission on admin auth */
  useEffect(() => {
    if (isAuthenticated && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [isAuthenticated]);

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

  /* ── Newsletters (MongoDB-backed) ── */
  const [newsletters, setNewsletters] = useState([]);
  const [newslettersLoading, setNewslettersLoading] = useState(true);

  /* ─────────────────────────────────────────
     Fetch Settings from API (MongoDB)
     ───────────────────────────────────────── */
  const fetchSettings = useCallback(async () => {
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
        setSettingsLoaded(true);
      }
    } catch (err) {
      console.warn('[VIP] Settings API fetch failed:', err.message);
    }
  }, []);

  /* ─────────────────────────────────────────
     Update Settings on API (MongoDB)
     ───────────────────────────────────────── */
  const updateSettings = useCallback(async (updates) => {
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
      }
      return json;
    } catch (err) {
      console.error('[VIP] Settings update failed:', err);
      return { success: false };
    }
  }, []);

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

  const updateMysteryText = useCallback(async (text) => {
    setMysteryText(text); // optimistic
    return updateSettings({ mysteryText: text });
  }, [updateSettings]);

  /* ─────────────────────────────────────────
     Fetch Products from API
     ───────────────────────────────────────── */
  const fetchProducts = useCallback(async (showLoading = false) => {
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
        setProducts(json.data);
      }
      setApiError(null);
    } catch (err) {
      console.warn('[VIP] API fetch failed, using current products:', err.message);
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

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

  /* ── Poll products every 8 seconds ── */
  useEffect(() => {
    const interval = setInterval(() => { fetchProducts(false); }, 8000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  /* ── Poll store orders and newsletters every 1 second ── */
  useEffect(() => {
    const interval = setInterval(() => { 
      fetchStoreOrders(); 
      fetchNewsletters();
    }, 1000);
    return () => clearInterval(interval);
  }, [fetchStoreOrders, fetchNewsletters]);

  /* ══════════════════════════════════════════════════
     Poll settings every 1 second — ALL clients see
     admin changes instantly!
     ══════════════════════════════════════════════════ */
  useEffect(() => {
    const interval = setInterval(() => { fetchSettings(); }, 1000);
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
          setRefreshTrigger((n) => n + 1);
          return json.data;
        }
      }
    } catch (err) {
      console.error('[VIP] Failed to add product to API:', err);
    }

    return newProduct;
  }, []);

  const updateProduct = useCallback(async (id, updates) => {
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
        setRefreshTrigger((n) => n + 1);
      } else {
        console.error('[VIP] Failed to update product in API');
      }
    } catch (err) {
      console.error('[VIP] Failed to update product in API:', err);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setRefreshTrigger((n) => n + 1);
      } else {
        console.error('[VIP] Failed to delete product from API');
      }
    } catch (err) {
      console.error('[VIP] Failed to delete product from API:', err);
    }
  }, []);

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
        /* New Order Notification */
        newOrderAlert, setNewOrderAlert,
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
