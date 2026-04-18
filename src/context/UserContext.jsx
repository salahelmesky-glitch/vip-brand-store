import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const UserContext = createContext();
const API = '/api';

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('vip_user');
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);

  const isLoggedIn = !!user;

  /* persist user */
  useEffect(() => {
    if (user) localStorage.setItem('vip_user', JSON.stringify(user));
    else localStorage.removeItem('vip_user');
  }, [user]);

  /* Auto-sync from server on mount (fixes stale localStorage points) */
  useEffect(() => {
    if (!user?.email) return;
    fetch(`${API}/users?email=${encodeURIComponent(user.email)}`)
      .then(r => r.json())
      .then(json => { if (json.success && json.data) setUser(json.data); })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Register ── */
  const register = useCallback(async (email, password, name) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/users?action=register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password, name }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setUser(json.data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally { setLoading(false); }
  }, []);

  /* ── Login ── */
  const login = useCallback(async (email, password) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/users?action=login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error);
      setUser(json.data);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally { setLoading(false); }
  }, []);

  /* ── Logout ── */
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  /* ── Refresh profile ── */
  const refreshProfile = useCallback(async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${API}/users?email=${encodeURIComponent(user.email)}`);
      const json = await res.json();
      if (json.success) setUser(json.data);
    } catch {}
  }, [user?.email]);

  /* ── Record purchase ── */
  const recordPurchase = useCallback(async (quantity = 1) => {
    if (!user?.email) return { success: false };
    setLoading(true);
    try {
      const res = await fetch(`${API}/users?action=purchase`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'purchase', email: user.email, quantity }),
      });
      const json = await res.json();
      if (json.success) setUser(json.data);
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    } finally { setLoading(false); }
  }, [user?.email]);

  /* ── Spin wheel ── */
  const spinWheel = useCallback(async () => {
    if (!user?.email) return { success: false };
    setLoading(true);
    try {
      const res = await fetch(`${API}/users?action=spin`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'spin', email: user.email }),
      });
      const json = await res.json();
      if (json.success) setUser(json.data);
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    } finally { setLoading(false); }
  }, [user?.email]);

  /* ── Claim gift ── */
  const claimGift = useCallback(async () => {
    if (!user?.email) return { success: false };
    setLoading(true);
    try {
      const res = await fetch(`${API}/users?action=gift`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'gift', email: user.email }),
      });
      const json = await res.json();
      if (json.success) setUser(json.data);
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    } finally { setLoading(false); }
  }, [user?.email]);

  /* ── Claim mystery box ── */
  const claimMystery = useCallback(async () => {
    if (!user?.email) return { success: false };
    setLoading(true);
    try {
      const res = await fetch(`${API}/users?action=mystery`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mystery', email: user.email }),
      });
      const json = await res.json();
      if (json.success) setUser(json.data);
      return json;
    } catch (err) {
      return { success: false, error: err.message };
    } finally { setLoading(false); }
  }, [user?.email]);

  /* ── Fetch leaderboard ── */
  const fetchLeaderboard = useCallback(async () => {
    try {
      const res = await fetch(`${API}/users?action=leaderboard`);
      const json = await res.json();
      if (json.success) setLeaderboard(json.data);
    } catch {}
  }, []);

  return (
    <UserContext.Provider value={{
      user, isLoggedIn, loading, error,
      register, login, logout,
      refreshProfile, recordPurchase,
      spinWheel, claimGift, claimMystery,
      leaderboard, fetchLeaderboard,
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
};
