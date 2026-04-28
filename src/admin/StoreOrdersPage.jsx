import { useState, useMemo } from 'react';
import { useAdmin } from '../context/AdminContext';

/* ─── Site base URL for product image links ─── */
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://salah-nine.vercel.app';

export default function StoreOrdersPage() {
  const { storeOrders, updateStoreOrderStatus, deleteStoreOrder } = useAdmin();
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGov, setFilterGov] = useState('all');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  /* ─── Format phone for WhatsApp ─── */
  const formatPhoneForWA = (phone) => {
    if (!phone) return '';
    // Remove everything except digits
    let p = phone.replace(/[^0-9]/g, '');
    // Egyptian number starting with 0 → add country code 20
    if (p.startsWith('0') && p.length === 11) {
      p = '20' + p.slice(1);
    }
    // If it's 10 digits and starts with 1 (Egyptian mobile without leading 0)
    if (p.length === 10 && p.startsWith('1')) {
      p = '20' + p;
    }
    return p;
  };

  /* ─── Get full image URL ─── */
  const getImageUrl = (img) => {
    if (!img) return '';
    if (img.startsWith('http')) return img;
    if (img.startsWith('data:')) return img; // base64 can't be shared as URL
    return `${SITE_URL}${img}`;
  };

  /* ─── Open WhatsApp direct chat (tries WhatsApp Business first on Android) ─── */
  const openWhatsApp = (phone, message) => {
    const formattedPhone = formatPhoneForWA(phone);
    const encodedMsg = encodeURIComponent(message);
    const isAndroid = /android/i.test(navigator.userAgent);
    
    if (isAndroid) {
      // Try WhatsApp Business first on Android (com.whatsapp.w4b)
      const intentUrl = `intent://send?phone=${formattedPhone}&text=${encodedMsg}#Intent;scheme=whatsapp;package=com.whatsapp.w4b;end`;
      window.location.href = intentUrl;
      // Fallback after 2 seconds if WhatsApp Business not installed
      setTimeout(() => {
        window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMsg}`, '_blank');
      }, 2000);
    } else {
      window.open(`https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodedMsg}`, '_blank');
    }
  };

  /* ─── Handle COMPLETE order → WhatsApp with design image ─── */
  const handleCompleteOrder = (order) => {
    updateStoreOrderStatus(order.id, 'completed');
    const name = order.customerName || 'عميلنا العزيز';
    const imgUrl = getImageUrl(order.productImg);
    const imgLine = imgUrl && !imgUrl.startsWith('data:') ? `\n\n👕 التصميم اللي اخترته:\n${imgUrl}\n\nهل ده التصميم الصحيح؟ ✨` : '';
    const msg = `مرحباً ${name} 🌟\n\n✅ *تم تأكيد طلبك بنجاح!*\n\n📦 المنتج: ${order.productName}\n📏 المقاس: ${order.size}\n💰 السعر: ${order.price} ج.م${imgLine}\n\nهنتواصل معاك في أقرب وقت لتأكيد التوصيل 🚚\n\nشكراً لثقتك في *VIP Brand* 💜`;
    openWhatsApp(order.phone, msg);
  };

  /* ─── Handle CANCEL order → WhatsApp notification ─── */
  const handleCancelOrder = (order) => {
    updateStoreOrderStatus(order.id, 'cancelled');
    const name = order.customerName || 'عميلنا العزيز';
    const msg = `مرحباً ${name} 🙏\n\n❌ *تم إلغاء طلبك*\n\n📦 المنتج: ${order.productName}\n📏 المقاس: ${order.size}\n\nلو حابب تطلب تاني أو عندك أي استفسار، تواصل معانا في أي وقت! 💜\n\n*VIP Brand* ✨`;
    openWhatsApp(order.phone, msg);
  };

  const filtered = useMemo(() => {
    let list = storeOrders;
    if (filterStatus !== 'all') list = list.filter((o) => o.status === filterStatus);
    if (filterGov !== 'all') list = list.filter((o) => o.governorate === filterGov);
    return list;
  }, [storeOrders, filterStatus, filterGov]);

  const sorted = useMemo(() =>
    [...filtered].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
  [filtered]);

  const totalRevenue = useMemo(() =>
    storeOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + (o.price || 0), 0),
  [storeOrders]);

  const statusConfig = {
    pending: { label: 'معلق', emoji: '⏳', bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
    completed: { label: 'مكتمل', emoji: '✅', bg: 'rgba(16,185,129,0.1)', text: '#10b981', border: 'rgba(16,185,129,0.2)' },
    cancelled: { label: 'ملغي', emoji: '❌', bg: 'rgba(239,68,68,0.1)', text: '#f87171', border: 'rgba(239,68,68,0.2)' },
  };

  return (
    <div>
      {/* Header / Stats */}
      <div style={{ marginBottom: 20 }}>
        <h2 style={{
          fontSize: 20, fontWeight: 700, color: '#f2f2f7',
          fontFamily: "'Montserrat', sans-serif", marginBottom: 14,
        }}>🛍️ طلبات المتجر ({storeOrders.length})</h2>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'إجمالي', value: storeOrders.length, color: '#bf40bf', icon: '📦' },
            { label: 'معلقة', value: storeOrders.filter(o => o.status === 'pending').length, color: '#f59e0b', icon: '⏳' },
            { label: 'مكتملة', value: storeOrders.filter(o => o.status === 'completed').length, color: '#10b981', icon: '✅' },
            { label: 'الإيرادات', value: `${totalRevenue} ج.م`, color: '#00ff66', icon: '💰' },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '12px 14px', borderRadius: 12,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(191,64,191,0.08)',
            }}>
              <p style={{ fontSize: 10, color: '#888', margin: '0 0 4px' }}>{s.icon} {s.label}</p>
              <p style={{ fontSize: 18, fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {['all', 'pending', 'completed', 'cancelled'].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)} style={{
            padding: '8px 14px', borderRadius: 10, border: 'none',
            background: filterStatus === s ? 'linear-gradient(135deg, rgba(191,64,191,0.2), rgba(123,47,255,0.15))' : 'rgba(255,255,255,0.03)',
            color: filterStatus === s ? '#d966d9' : 'rgba(153,153,159,0.5)',
            fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          }}>{s === 'all' ? 'الكل' : statusConfig[s]?.label || s}</button>
        ))}
        <div style={{ width: 1, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />
        {['all', 'كفر الشيخ', 'محافظة أخرى'].map((g) => (
          <button key={g} onClick={() => setFilterGov(g)} style={{
            padding: '8px 14px', borderRadius: 10, border: 'none',
            background: filterGov === g ? 'linear-gradient(135deg, rgba(0,255,102,0.12), rgba(16,185,129,0.08))' : 'rgba(255,255,255,0.03)',
            color: filterGov === g ? '#00ff66' : 'rgba(153,153,159,0.5)',
            fontSize: 11, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
          }}>{g === 'all' ? '📍 كل المحافظات' : `📍 ${g}`}</button>
        ))}
      </div>

      {/* Orders List */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(153,153,159,0.4)' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>📭</p>
          <p style={{ fontSize: 15 }}>لا توجد طلبات</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((order) => {
            const sc = statusConfig[order.status] || statusConfig.pending;
            const isExpanded = expandedOrder === order.id;
            return (
              <div key={order.id} style={{
                padding: '16px', borderRadius: 14,
                background: 'linear-gradient(145deg, rgba(12,12,18,0.9), rgba(8,8,12,0.95))',
                border: `1px solid ${order.status === 'pending' ? 'rgba(245,158,11,0.15)' : 'rgba(191,64,191,0.08)'}`,
                transition: 'all 0.3s',
              }}>
                {/* Order header */}
                <div
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 8, cursor: 'pointer',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#f2f2f7' }}>#{String(order.id).slice(-6)}</span>
                    <span style={{
                      fontSize: 10, padding: '3px 10px', borderRadius: 6,
                      background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, fontWeight: 600,
                    }}>{sc.emoji} {sc.label}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: '#bf40bf' }}>{order.price} ج.م</span>
                    <span style={{ fontSize: 14, color: '#666', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                  </div>
                </div>

                {/* Quick info */}
                <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', fontSize: 11, color: '#888', alignItems: 'center' }}>
                  <span>👤 {order.customerName || 'بدون اسم'}</span>
                  <span
                    onClick={(e) => { e.stopPropagation(); if (order.productImg) setImagePreview(order); }}
                    style={{
                      cursor: order.productImg ? 'pointer' : 'default',
                      color: order.productImg ? '#bf40bf' : '#888',
                      textDecoration: order.productImg ? 'underline' : 'none',
                      fontWeight: order.productImg ? 600 : 400,
                    }}
                  >👕 {order.productName} {order.productImg ? '🔍' : ''}</span>
                  <span>📏 {order.size}</span>
                  <span>📍 {order.governorate}</span>
                  {order.paymentMethod && (
                    <span style={{ color: order.paymentMethod === 'فودافون كاش' ? '#e60012' : '#00ff66', fontWeight: 600 }}>
                      💳 {order.paymentMethod}
                    </span>
                  )}
                  <span style={{ marginLeft: 'auto', fontSize: 10, color: '#555' }}>
                    {new Date(order.createdAt).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div style={{ marginTop: 12, animation: 'fadeInUp 0.2s ease-out' }}>
                    {/* Product Image Preview */}
                    {order.productImg && (
                      <div
                        onClick={() => setImagePreview(order)}
                        style={{
                          marginBottom: 10, borderRadius: 10, overflow: 'hidden',
                          border: '1px solid rgba(191,64,191,0.15)', cursor: 'pointer',
                          maxHeight: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: 'rgba(255,255,255,0.02)',
                        }}
                      >
                        <img src={order.productImg} alt={order.productName}
                          style={{ maxWidth: '100%', maxHeight: 180, objectFit: 'contain' }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}

                    {/* Details */}
                    <div style={{
                      padding: '12px', borderRadius: 10,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(255,255,255,0.04)',
                      marginBottom: 10,
                    }}>
                      {order.customerName && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#ccc', marginBottom: 6, direction: 'rtl' }}>
                          <span>👤 الاسم:</span>
                          <span style={{ color: '#f2f2f7', fontWeight: 600 }}>{order.customerName}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#ccc', marginBottom: 6, direction: 'rtl' }}>
                        <span>📱 الرقم:</span>
                        <a href={`tel:${order.phone}`} style={{ color: '#00ff66', textDecoration: 'none', direction: 'ltr' }}>{order.phone}</a>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#ccc', direction: 'rtl' }}>
                        <span>📍 العنوان:</span>
                        <span style={{ color: '#f2f2f7', maxWidth: '60%', textAlign: 'left' }}>{order.address}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {order.status === 'pending' && (
                        <>
                          <button onClick={() => handleCompleteOrder(order)} style={{
                            padding: '7px 14px', borderRadius: 8, border: 'none',
                            background: 'rgba(16,185,129,0.12)', color: '#10b981',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          }}>✅ إكمال + واتساب</button>
                          <button onClick={() => handleCancelOrder(order)} style={{
                            padding: '7px 14px', borderRadius: 8, border: 'none',
                            background: 'rgba(239,68,68,0.08)', color: '#f87171',
                            fontSize: 11, fontWeight: 600, cursor: 'pointer',
                          }}>❌ إلغاء + واتساب</button>
                        </>
                      )}
                      {order.status !== 'pending' && (
                        <button onClick={() => updateStoreOrderStatus(order.id, 'pending')} style={{
                          padding: '7px 14px', borderRadius: 8, border: 'none',
                          background: 'rgba(245,158,11,0.08)', color: '#f59e0b',
                          fontSize: 11, fontWeight: 600, cursor: 'pointer',
                        }}>⏳ إعادة للمعلق</button>
                      )}
                      <button onClick={() => openWhatsApp(order.phone, `مرحباً ${order.customerName || ''}! بخصوص طلبك رقم #${String(order.id).slice(-6)} 📦`)} style={{
                        padding: '7px 14px', borderRadius: 8, border: 'none',
                        background: 'rgba(37,211,102,0.12)', color: '#25D366',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer',
                      }}>💬 واتساب</button>
                      <button onClick={() => setConfirmDelete(order.id)} style={{
                        padding: '7px 14px', borderRadius: 8, border: 'none',
                        background: 'rgba(255,255,255,0.03)', color: 'rgba(153,153,159,0.4)',
                        fontSize: 11, fontWeight: 600, cursor: 'pointer', marginLeft: 'auto',
                      }}>🗑 حذف</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {imagePreview && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)', zIndex: 9999, backdropFilter: 'blur(12px)',
        }} onClick={() => setImagePreview(null)}>
          <div style={{
            background: '#0c0c12', borderRadius: 18, padding: '20px',
            border: '1px solid rgba(191,64,191,0.2)', maxWidth: 400, width: '92%',
            boxShadow: '0 0 60px rgba(191,64,191,0.15)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#f2f2f7', margin: 0 }}>👕 {imagePreview.productName}</h3>
              <button onClick={() => setImagePreview(null)} style={{ background: 'none', border: 'none', color: '#888', fontSize: 18, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ borderRadius: 12, overflow: 'hidden', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(191,64,191,0.1)', marginBottom: 14 }}>
              <img src={imagePreview.productImg} alt={imagePreview.productName} style={{ width: '100%', display: 'block' }} />
            </div>
            <div style={{ fontSize: 11, color: '#888', textAlign: 'center' }}>
              <p style={{ margin: '0 0 4px' }}>👤 {imagePreview.customerName || 'بدون اسم'} · 📏 {imagePreview.size} · 💰 {imagePreview.price} ج.م</p>
              <p style={{ margin: 0, color: '#555' }}>📍 {imagePreview.governorate} · {imagePreview.address}</p>
            </div>
          </div>
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
            <p style={{ fontSize: 13, color: 'rgba(153,153,159,0.6)', marginBottom: 20 }}>هل أنت متأكد من حذف هذا الطلب؟</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmDelete(null)} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent', color: '#f2f2f7', fontSize: 13, cursor: 'pointer',
              }}>إلغاء</button>
              <button onClick={() => { deleteStoreOrder(confirmDelete); setConfirmDelete(null); }} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                background: '#ef4444', color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}>حذف</button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
