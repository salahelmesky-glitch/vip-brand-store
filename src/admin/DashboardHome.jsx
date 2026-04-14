import { useAdmin } from '../context/AdminContext';

export default function DashboardHome() {
  const { stats, orders, products } = useAdmin();

  const recentOrders = [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

  const statCards = [
    { label: 'إجمالي المنتجات', value: stats.totalProducts, icon: '📦', color: '#bf40bf' },
    { label: 'إجمالي الطلبات', value: stats.totalOrders, icon: '🛒', color: '#7b2fff' },
    { label: 'الإيرادات', value: `${stats.totalRevenue.toLocaleString()} EGP`, icon: '💰', color: '#25D366' },
    { label: 'طلبات معلقة', value: stats.pendingOrders, icon: '⏳', color: '#f59e0b' },
    { label: 'طلبات مكتملة', value: stats.completedOrders, icon: '✅', color: '#10b981' },
    { label: 'ملغية', value: stats.cancelledOrders, icon: '❌', color: '#ef4444' },
  ];

  const statusColor = {
    pending: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    completed: { bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.2)' },
    cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  };

  const statusLabel = { pending: 'معلق', completed: 'مكتمل', cancelled: 'ملغي' };

  return (
    <div>
      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: 16, marginBottom: 32,
      }}>
        {statCards.map((card, i) => (
          <div key={i} style={{
            padding: '22px 20px', borderRadius: 16,
            background: 'linear-gradient(145deg, rgba(12,12,18,0.9), rgba(8,8,12,0.95))',
            border: '1px solid rgba(191,64,191,0.08)',
            position: 'relative', overflow: 'hidden',
            transition: 'all 0.3s',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${card.color}33`;
              e.currentTarget.style.boxShadow = `0 0 30px ${card.color}15`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(191,64,191,0.08)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{
              position: 'absolute', top: -20, right: -20,
              width: 80, height: 80, borderRadius: '50%',
              background: `radial-gradient(circle, ${card.color}10, transparent)`,
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{
                  fontSize: 11, color: 'rgba(153,153,159,0.5)',
                  fontFamily: "'Noto Sans Arabic', sans-serif",
                  marginBottom: 6, direction: 'rtl',
                }}>{card.label}</p>
                <p style={{
                  fontSize: 26, fontWeight: 800, color: '#f2f2f7',
                  fontFamily: "'Orbitron', sans-serif",
                }}>{card.value}</p>
              </div>
              <span style={{
                fontSize: 32, opacity: 0.6,
                filter: `drop-shadow(0 0 10px ${card.color}50)`,
              }}>{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Info */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16,
      }}>
        {/* Recent Orders */}
        <div style={{
          padding: '24px', borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(12,12,18,0.9), rgba(8,8,12,0.95))',
          border: '1px solid rgba(191,64,191,0.08)',
        }}>
          <h3 style={{
            fontSize: 15, fontWeight: 700, color: '#f2f2f7', marginBottom: 16,
            fontFamily: "'Montserrat', sans-serif",
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>🕐</span> آخر الطلبات
          </h3>

          {recentOrders.length === 0 ? (
            <p style={{ fontSize: 13, color: 'rgba(153,153,159,0.4)', textAlign: 'center', padding: 20 }}>
              لا توجد طلبات بعد
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recentOrders.map((order) => {
                const sc = statusColor[order.status] || statusColor.pending;
                return (
                  <div key={order.id} style={{
                    padding: '12px 14px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: '#f2f2f7' }}>
                        #{String(order.id).slice(-5)}
                      </p>
                      <p style={{ fontSize: 10, color: 'rgba(153,153,159,0.4)', marginTop: 2 }}>
                        {order.total?.toLocaleString()} EGP
                      </p>
                    </div>
                    <span style={{
                      fontSize: 10, fontWeight: 600, padding: '4px 10px', borderRadius: 8,
                      background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`,
                      fontFamily: "'Noto Sans Arabic', sans-serif",
                    }}>{statusLabel[order.status] || order.status}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Product Summary */}
        <div style={{
          padding: '24px', borderRadius: 16,
          background: 'linear-gradient(145deg, rgba(12,12,18,0.9), rgba(8,8,12,0.95))',
          border: '1px solid rgba(191,64,191,0.08)',
        }}>
          <h3 style={{
            fontSize: 15, fontWeight: 700, color: '#f2f2f7', marginBottom: 16,
            fontFamily: "'Montserrat', sans-serif",
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>📊</span> ملخص المنتجات
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Boys bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(153,153,159,0.6)' }}>Boys Collection</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#bf40bf' }}>{stats.boysProducts}</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.04)' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${(stats.boysProducts / (stats.totalProducts || 1)) * 100}%`,
                  background: 'linear-gradient(90deg, #bf40bf, #7b2fff)',
                  transition: 'width 0.5s',
                }} />
              </div>
            </div>

            {/* Girls bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'rgba(153,153,159,0.6)' }}>Girls Collection</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#d966d9' }}>{stats.girlsProducts}</span>
              </div>
              <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.04)' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  width: `${(stats.girlsProducts / (stats.totalProducts || 1)) * 100}%`,
                  background: 'linear-gradient(90deg, #d966d9, #ff6bff)',
                  transition: 'width 0.5s',
                }} />
              </div>
            </div>

            {/* Total */}
            <div style={{
              marginTop: 8, paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.04)',
              display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 12, color: 'rgba(153,153,159,0.5)' }}>إجمالي</span>
              <span style={{
                fontSize: 14, fontWeight: 800, color: '#f2f2f7',
                fontFamily: "'Orbitron', sans-serif",
              }}>{stats.totalProducts}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
