import { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function OrdersPage() {
  const { orders, updateOrderStatus, deleteOrder } = useAdmin();
  const [filterStatus, setFilterStatus] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = useMemo(() => {
    if (filterStatus === 'all') return orders;
    return orders.filter((o) => o.status === filterStatus);
  }, [orders, filterStatus]);

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  [filtered]);

  const statusConfig = {
    pending: { label: 'معلق', bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    completed: { label: 'مكتمل', bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.2)' },
    cancelled: { label: 'ملغي', bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  };

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 12, marginBottom: 24,
      }}>
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: '#f2f2f7',
          fontFamily: "'Montserrat', sans-serif",
        }}>🛒 إدارة الطلبات ({sorted.length})</h2>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap',
      }}>
        {['all', 'pending', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            style={{
              padding: '10px 18px', borderRadius: 12, border: 'none',
              background: filterStatus === s
                ? 'linear-gradient(135deg, rgba(191,64,191,0.2), rgba(123,47,255,0.15))'
                : 'rgba(255,255,255,0.03)',
              color: filterStatus === s ? '#d966d9' : 'rgba(153,153,159,0.5)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              borderLeft: filterStatus === s ? '2px solid #bf40bf' : '2px solid transparent',
              transition: 'all 0.2s',
              fontFamily: "'Noto Sans Arabic', sans-serif",
            }}
          >
            {s === 'all' ? 'الكل' : statusConfig[s]?.label || s}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {sorted.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          color: 'rgba(153,153,159,0.4)',
        }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📭</p>
          <p style={{ fontSize: 15, fontFamily: "'Noto Sans Arabic', sans-serif" }}>
            لا توجد طلبات {filterStatus !== 'all' ? statusConfig[filterStatus]?.label : ''}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            return (
              <div key={order.id} style={{
                padding: '20px', borderRadius: 16,
                background: 'linear-gradient(145deg, rgba(12,12,18,0.9), rgba(8,8,12,0.95))',
                border: '1px solid rgba(191,64,191,0.08)',
                transition: 'all 0.3s',
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(191,64,191,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(191,64,191,0.08)';
                }}
              >
                {/* Order header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 10, marginBottom: 14,
                }}>
                  <div>
                    <span style={{
                      fontSize: 14, fontWeight: 700, color: '#f2f2f7',
                      fontFamily: "'Orbitron', sans-serif",
                    }}>#{String(order.id).slice(-6)}</span>
                    <span style={{
                      fontSize: 11, color: 'rgba(153,153,159,0.4)', marginLeft: 12,
                    }}>
                      {new Date(order.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric', month: 'short', day: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '5px 14px', borderRadius: 8,
                    background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                    fontFamily: "'Noto Sans Arabic', sans-serif",
                  }}>{sc.label}</span>
                </div>

                {/* Customer info */}
                {order.customer && (
                  <div style={{
                    padding: '12px 14px', borderRadius: 12, marginBottom: 14,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                  }}>
                    <p style={{ fontSize: 12, color: 'rgba(153,153,159,0.5)', marginBottom: 4 }}>
                      👤 {order.customer.name || 'غير معروف'}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(153,153,159,0.35)' }}>
                      📱 {order.customer.phone || 'غير متوفر'}
                    </p>
                  </div>
                )}

                {/* Items */}
                {order.items && order.items.length > 0 && (
                  <div style={{ marginBottom: 14 }}>
                    <p style={{
                      fontSize: 10, color: 'rgba(153,153,159,0.4)',
                      textTransform: 'uppercase', letterSpacing: '0.1em',
                      marginBottom: 8, fontFamily: "'Orbitron', sans-serif",
                    }}>المنتجات</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '8px 10px', borderRadius: 8,
                          background: 'rgba(255,255,255,0.02)',
                        }}>
                          <span style={{ fontSize: 12, color: '#f2f2f7' }}>
                            {item.name || `Product #${item.id}`} × {item.qty || 1}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 600, color: '#bf40bf' }}>
                            {(item.price * (item.qty || 1)).toLocaleString()} EGP
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  flexWrap: 'wrap', gap: 10,
                  paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <p style={{
                    fontSize: 16, fontWeight: 800, color: '#f2f2f7',
                    fontFamily: "'Orbitron', sans-serif",
                  }}>
                    💰 {(order.total || 0).toLocaleString()} EGP
                  </p>

                  <div style={{ display: 'flex', gap: 6 }}>
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(order.id, 'completed')}
                          style={{
                            padding: '7px 14px', borderRadius: 8, border: 'none',
                            background: 'rgba(16,185,129,0.12)', color: '#10b981',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(16,185,129,0.12)'}
                        >✅ إكمال</button>
                        <button
                          onClick={() => handleStatusChange(order.id, 'cancelled')}
                          style={{
                            padding: '7px 14px', borderRadius: 8, border: 'none',
                            background: 'rgba(239,68,68,0.08)', color: '#f87171',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                            transition: 'background 0.2s',
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                        >❌ إلغاء</button>
                      </>
                    )}
                    <button
                      onClick={() => setConfirmDelete(order.id)}
                      style={{
                        padding: '7px 14px', borderRadius: 8, border: 'none',
                        background: 'rgba(255,255,255,0.03)', color: 'rgba(153,153,159,0.4)',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                    >🗑 حذف</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.7)', zIndex: 9999, backdropFilter: 'blur(8px)',
        }} onClick={() => setConfirmDelete(null)}>
          <div style={{
            background: '#0c0c12', borderRadius: 16, padding: '28px 24px',
            border: '1px solid rgba(239,68,68,0.2)', maxWidth: 360, width: '90%',
            boxShadow: '0 0 60px rgba(0,0,0,0.5)',
          }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#f2f2f7', marginBottom: 8 }}>⚠️ تأكيد الحذف</h3>
            <p style={{ fontSize: 13, color: 'rgba(153,153,159,0.6)', marginBottom: 20 }}>
              هل أنت متأكد من حذف هذا الطلب؟
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
                  background: 'transparent', color: '#f2f2f7', fontSize: 13, cursor: 'pointer',
                }}
              >إلغاء</button>
              <button
                onClick={() => { deleteOrder(confirmDelete); setConfirmDelete(null); }}
                style={{
                  flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                  background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
                }}
              >حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
