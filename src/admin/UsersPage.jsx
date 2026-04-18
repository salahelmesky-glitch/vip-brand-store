import { useState, useEffect, useCallback } from 'react';

/**
 * ────────────────────────────────────────
 *  Admin › Users Management Page
 *  - View all registered users & emails
 *  - Add / remove points manually
 *  - Edit user names
 *  - Track purchases per user
 * ────────────────────────────────────────
 */
export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [ptsMod, setPtsMod] = useState({});
  const [editingName, setEditingName] = useState(null);
  const [newName, setNewName] = useState('');
  const [success, setSuccess] = useState('');

  /* ── Fetch all users with emails ── */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/users?action=admin-users');
      const json = await res.json();
      if (json.success) setUsers(json.data);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  /* ── Add points to user ── */
  const addPoints = async (email, pts) => {
    if (!pts || pts <= 0) return;
    setActionLoading(email);
    try {
      const res = await fetch('/api/users?action=admin-addpoints', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admin-addpoints', email, points: parseInt(pts) }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(`✅ تم إضافة ${pts} نقطة لـ ${email}`);
        setTimeout(() => setSuccess(''), 3000);
        fetchUsers();
        setPtsMod(prev => ({ ...prev, [email]: '' }));
      }
    } catch {} finally { setActionLoading(null); }
  };

  /* ── Edit user name ── */
  const updateName = async (email) => {
    if (!newName.trim()) return;
    setActionLoading(email + '-name');
    try {
      const res = await fetch('/api/users?action=admin-editname', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'admin-editname', email, name: newName.trim() }),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(`✅ تم تغيير اسم ${email} إلى "${newName}"`);
        setTimeout(() => setSuccess(''), 3000);
        fetchUsers();
        setEditingName(null); setNewName('');
      }
    } catch {} finally { setActionLoading(null); }
  };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#f2f2f7' }}>
            👥 الأعضاء المسجلين
          </h2>
          <p style={{ fontSize: 11, color: '#888', margin: '4px 0 0' }}>
            Registered Users · {users.length} members
          </p>
        </div>
        <button
          onClick={fetchUsers}
          style={{
            padding: '8px 16px', borderRadius: 10, border: '1px solid rgba(191,64,191,0.2)',
            background: 'rgba(191,64,191,0.06)', color: '#bf40bf', fontSize: 12,
            fontWeight: 600, cursor: 'pointer',
          }}
        >🔄 تحديث</button>
      </div>

      {/* Success message */}
      {success && (
        <div style={{
          padding: '10px 16px', borderRadius: 12, marginBottom: 14,
          background: 'rgba(0,255,102,0.08)', border: '1px solid rgba(0,255,102,0.2)',
          fontSize: 13, color: '#00ff66', fontWeight: 600, textAlign: 'center',
        }}>
          {success}
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#888', padding: 40 }}>جاري التحميل...</p>
      ) : users.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>لا يوجد أعضاء بعد</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {users.map((u, i) => (
            <div key={u.id || i} style={{
              padding: '14px 16px', borderRadius: 14,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(191,64,191,0.1)',
            }}>
              {/* User info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 15, fontWeight: 800, color: '#fff',
                }}>
                  {u.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7', margin: 0 }}>{u.name}</p>
                    <button onClick={() => { setEditingName(u.email); setNewName(u.name); }} style={{
                      background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, color: '#bf40bf',
                    }}>✏️</button>
                  </div>
                  <p style={{ fontSize: 11, color: '#bf40bf', margin: '2px 0 0', wordBreak: 'break-all' }}>
                    📧 {u.email}
                  </p>
                </div>
              </div>

              {/* Edit name */}
              {editingName === u.email && (
                <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                  <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="الاسم الجديد"
                    style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(191,64,191,0.2)', background: 'rgba(255,255,255,0.04)', color: '#f2f2f7', fontSize: 12, outline: 'none', minWidth: 0 }} />
                  <button onClick={() => updateName(u.email)} disabled={actionLoading === u.email + '-name'} style={{
                    padding: '6px 10px', borderRadius: 8, border: 'none', background: '#bf40bf', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer',
                  }}>💾</button>
                  <button onClick={() => setEditingName(null)} style={{
                    padding: '6px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#888', fontSize: 10, cursor: 'pointer',
                  }}>✖</button>
                </div>
              )}

              {/* Stats row */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
                <span style={statBadge}>🏆 {u.points} نقطة</span>
                <span style={statBadge}>👕 {u.tshirts} تيشيرت</span>
                <span style={statBadge}>🔄 {u.totalCycles} دورة</span>
                <span style={statBadge}>🎁 {u.giftsClaimed} هدية</span>
              </div>

              {/* Joined date */}
              <p style={{ fontSize: 10, color: '#666', margin: '0 0 8px' }}>
                📅 انضم: {new Date(u.createdAt).toLocaleDateString('ar-EG')} · {new Date(u.createdAt).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
              </p>

              {/* Add points controls */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <input
                  type="number" min="1" placeholder="عدد النقاط"
                  value={ptsMod[u.email] || ''}
                  onChange={e => setPtsMod(prev => ({ ...prev, [u.email]: e.target.value }))}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: 10,
                    border: '1px solid rgba(191,64,191,0.15)',
                    background: 'rgba(255,255,255,0.04)', color: '#f2f2f7',
                    fontSize: 12, outline: 'none', minWidth: 0,
                  }}
                />
                <button disabled={actionLoading === u.email} onClick={() => addPoints(u.email, ptsMod[u.email])} style={{
                  padding: '8px 14px', borderRadius: 10, border: 'none',
                  background: 'linear-gradient(135deg, #25D366, #128C7E)',
                  color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  whiteSpace: 'nowrap', flexShrink: 0,
                }}>
                  {actionLoading === u.email ? '...' : '➕ نقاط'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const statBadge = {
  fontSize: 10, fontWeight: 600, color: '#aaa',
  padding: '3px 8px', borderRadius: 6,
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
};
