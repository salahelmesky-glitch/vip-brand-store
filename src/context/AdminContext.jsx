import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';

const AdminContext = createContext();

const STORAGE_KEYS = {
  AUTH: 'vip_admin_auth',
  PRODUCTS: 'vip_admin_products',
  ORDERS: 'vip_orders',
};

/* ─── API Base URL ─── */
const API_BASE = '/api';

/* ─── Default Admin Credentials ─── */
const ADMIN_CREDENTIALS = {
  email: 'admin@vip.com',
  password: 'admin123',
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

export const AdminProvider = ({ children }) => {
  /* ── Auth ── */
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return localStorage.getItem(STORAGE_KEYS.AUTH) === 'true'; } catch { return false; }
  });

  /* ── Products: start with defaults, immediately replaced by API data ── */
  const [products, setProducts] = useState(() => buildDefaults());

  /* ── Loading & Error state ── */
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  /* ── Version counter to force re-fetch after admin actions ── */
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  /* ── Orders ── */
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  /* ─────────────────────────────────────────
     Shared fetch function — always fresh from API
     ───────────────────────────────────────── */
  const fetchProducts = useCallback(async (showLoading = false) => {
    try {
      if (showLoading) setIsLoading(true);
      const ts = Date.now(); // cache-buster
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

  /* ── Fetch on mount and whenever refreshTrigger changes ── */
  useEffect(() => {
    fetchProducts(true);
  }, [fetchProducts, refreshTrigger]);

  /* ─────────────────────────────────────────
     Auto-refresh products every 5 seconds
     (so visitors see admin changes quickly)
     ───────────────────────────────────────── */
  useEffect(() => {
    const interval = setInterval(() => {
      fetchProducts(false);
    }, 5000); // 5 seconds

    return () => clearInterval(interval);
  }, [fetchProducts]);

  /* ── Persist orders to localStorage ── */
  useEffect(() => { localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders)); }, [orders]);

  /* ── Sync orders from storefront ── */
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (JSON.stringify(parsed) !== JSON.stringify(orders)) setOrders(parsed);
        }
      } catch {}
    }, 2000);
    return () => clearInterval(interval);
  }, [orders]);

  /* ── Auth Actions ── */
  const login = useCallback((email, password) => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      localStorage.setItem(STORAGE_KEYS.AUTH, 'true');
      return { success: true };
    }
    return { success: false, error: 'بيانات الدخول غلط' };
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH);
  }, []);

  /* ─────────────────────────────────────────
     Products CRUD — synced with API + immediate re-fetch
     ───────────────────────────────────────── */
  const addProduct = useCallback(async (product) => {
    // Optimistic update with temp id
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
          // Force re-fetch all products from DB to stay in sync
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
    // Optimistic update (instant UI feedback for admin)
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );

    // Sync to API
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        // Force re-fetch from DB so all clients get fresh data
        setRefreshTrigger((n) => n + 1);
      } else {
        console.error('[VIP] Failed to update product in API');
      }
    } catch (err) {
      console.error('[VIP] Failed to update product in API:', err);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    // Optimistic update
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // Sync to API
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Force re-fetch from DB
        setRefreshTrigger((n) => n + 1);
      } else {
        console.error('[VIP] Failed to delete product from API');
      }
    } catch (err) {
      console.error('[VIP] Failed to delete product from API:', err);
    }
  }, []);

  /* ── Orders ── */
  const addOrder = useCallback((order) => {
    const newOrder = { ...order, id: Date.now(), status: 'pending', createdAt: new Date().toISOString() };
    setOrders((prev) => {
      const updated = [...prev, newOrder];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });
    return newOrder;
  }, []);

  const updateOrderStatus = useCallback((orderId, status) => {
    setOrders((prev) => {
      const updated = prev.map((o) => (o.id === orderId ? { ...o, status } : o));
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const deleteOrder = useCallback((orderId) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.id !== orderId);
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
      return updated;
    });
  }, []);

  /* ── Stats ── */
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    pendingOrders: orders.filter((o) => o.status === 'pending').length,
    completedOrders: orders.filter((o) => o.status === 'completed').length,
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
        stats,
        isLoading, apiError,
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
