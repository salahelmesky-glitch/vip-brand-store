import { useAdmin } from '../context/AdminContext';

export default function NewsletterAdmin() {
  const { newsletters, deleteNewsletter, newslettersLoading } = useAdmin();

  if (newslettersLoading) {
    return (
      <div>
        <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 20px' }}>النشرة البريدية</h2>
        <div style={{ padding: 40, textAlign: 'center', background: '#0c0c12', borderRadius: 16 }}>
          <p style={{ color: '#888' }}>جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 4px' }}>النشرة البريدية</h2>
          <p style={{ color: '#888', margin: 0, fontSize: 13 }}>هنا هتلاقي كل اللي سجلوا ايميلاتهم في الموقع</p>
        </div>
        <div style={{ background: 'rgba(191,64,191,0.1)', padding: '8px 16px', borderRadius: 20, border: '1px solid rgba(191,64,191,0.2)' }}>
          <span style={{ color: '#bf40bf', fontWeight: 800, fontSize: 14 }}>{newsletters?.length || 0}</span> مشترك
        </div>
      </div>

      <div style={{ background: '#0c0c12', borderRadius: 16, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
        {newsletters?.length === 0 ? (
          <div style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 40, margin: '0 0 10px' }}>📭</p>
            <p style={{ color: '#666', margin: 0 }}>مفيش حد سجل لسه</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', direction: 'ltr' }}>
              <thead style={{ background: 'rgba(255,255,255,0.03)' }}>
                <tr>
                  <th style={thStyle}>Date & Time</th>
                  <th style={thStyle}>Email Address</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsletters.map((n) => (
                  <tr key={n.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={tdStyle}>
                      <span style={{ color: '#888', fontSize: 12 }}>
                        {new Date(n.createdAt).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: '#f2f2f7', fontWeight: 600, fontSize: 14 }}>{n.email}</span>
                    </td>
                    <td style={{ ...tdStyle, width: 100 }}>
                      <button 
                        onClick={() => {
                          if (window.confirm('هل تريد مسح هذا المشترك؟')) {
                            deleteNewsletter(n.id);
                          }
                        }}
                        style={{ padding: '6px 12px', background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 12, fontWeight: 700 }}
                      >
                        مسح
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const thStyle = { padding: '16px 20px', color: '#888', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' };
const tdStyle = { padding: '16px 20px' };
