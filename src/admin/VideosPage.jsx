import { useState, useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';

/**
 * ────────────────────────────────────────
 *  Admin › Videos Management
 *  Add up to 50 videos (TikTok/Instagram links)
 *  Stored in MongoDB (synced to all clients instantly!)
 * ────────────────────────────────────────
 */
export default function VideosPage() {
  const { videos, updateVideos } = useAdmin();
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newThumb, setNewThumb] = useState('');
  const [saving, setSaving] = useState(false);

  const addVideo = async () => {
    if (!newUrl) return;
    if (videos.length >= 50) return alert('الحد الأقصى 50 فيديو!');
    setSaving(true);
    const updated = [{ url: newUrl, title: newTitle || `فيديو #${videos.length + 1}`, thumbnail: newThumb || '' }, ...videos];
    await updateVideos(updated);
    setNewUrl(''); setNewTitle(''); setNewThumb('');
    setSaving(false);
  };

  const removeVideo = async (idx) => {
    setSaving(true);
    const updated = videos.filter((_, i) => i !== idx);
    await updateVideos(updated);
    setSaving(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#f2f2f7' }}>🎬 الفيديوهات</h2>
          <p style={{ fontSize: 11, color: '#888', margin: '4px 0 0' }}>Videos · {videos.length}/50 — التغييرات بتبان عند كل العملاء فوراً!</p>
        </div>
      </div>

      {/* Add video form */}
      <div style={{
        padding: 16, borderRadius: 14, marginBottom: 16,
        background: 'rgba(191,64,191,0.04)', border: '1px solid rgba(191,64,191,0.12)',
      }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: '#bf40bf', margin: '0 0 10px' }}>➕ إضافة فيديو جديد</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            value={newUrl} onChange={e => setNewUrl(e.target.value)}
            placeholder="رابط الفيديو (TikTok / Instagram / YouTube)"
            style={inpStyle}
          />
          <input
            value={newTitle} onChange={e => setNewTitle(e.target.value)}
            placeholder="عنوان الفيديو (اختياري)"
            style={inpStyle}
          />
          <input
            value={newThumb} onChange={e => setNewThumb(e.target.value)}
            placeholder="رابط الصورة المصغرة (اختياري)"
            style={inpStyle}
          />
          <button onClick={addVideo} disabled={saving} style={{
            padding: '10px 0', borderRadius: 10, border: 'none',
            background: saving ? '#333' : 'linear-gradient(135deg, #bf40bf, #7b2fff)',
            color: '#fff', fontSize: 13, fontWeight: 700, cursor: saving ? 'wait' : 'pointer',
          }}>
            {saving ? '⏳ جاري الحفظ...' : '➕ إضافة / Add Video'}
          </button>
        </div>
      </div>

      {/* Videos list */}
      {videos.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', padding: 40 }}>لا يوجد فيديوهات بعد</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {videos.map((v, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px',
              borderRadius: 12, background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}>
              <span style={{ fontSize: 20 }}>🎬</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: '#f2f2f7', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.title}</p>
                <p style={{ fontSize: 10, color: '#888', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.url}</p>
              </div>
              <a href={v.url} target="_blank" rel="noopener noreferrer" style={{
                padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#00ff66',
                border: '1px solid rgba(0,255,102,0.2)', background: 'rgba(0,255,102,0.06)',
                textDecoration: 'none',
              }}>🔗</a>
              <button onClick={() => removeVideo(i)} disabled={saving} style={{
                padding: '4px 8px', borderRadius: 6, fontSize: 10, color: '#ff6b6b',
                border: '1px solid rgba(255,100,100,0.2)', background: 'rgba(255,100,100,0.06)',
                cursor: saving ? 'wait' : 'pointer',
              }}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const inpStyle = {
  padding: '10px 14px', borderRadius: 10,
  border: '1px solid rgba(191,64,191,0.15)',
  background: 'rgba(255,255,255,0.04)', color: '#f2f2f7',
  fontSize: 12, outline: 'none', width: '100%', boxSizing: 'border-box',
};
