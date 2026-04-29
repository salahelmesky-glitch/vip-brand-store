import { useState, useMemo, useRef, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useAdmin();
  const [search, setSearch] = useState('');
  const [filterGender, setFilterGender] = useState('all');
  const [editingProduct, setEditingProduct] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.nameAr && p.nameAr.includes(search));
      const matchGender = filterGender === 'all' || p.gender === filterGender;
      return matchSearch && matchGender;
    });
  }, [products, search, filterGender]);

  const handleSave = async (formData) => {
    setSaving(true);
    try {
      if (editingProduct) {
        // ⚡ Only send fields that ACTUALLY changed — avoids sending huge base64 images
        const changes = {};
        Object.keys(formData).forEach(key => {
          if (JSON.stringify(formData[key]) !== JSON.stringify(editingProduct[key])) {
            changes[key] = formData[key];
          }
        });
        
        if (Object.keys(changes).length > 0) {
          await updateProduct(editingProduct.id, changes);
        }
        setEditingProduct(null);
      } else {
        await addProduct(formData);
        setIsAddingNew(false);
      }
    } catch (err) {
      console.error('[VIP] Save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    setConfirmDelete(null);
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
        }}>📦 إدارة المنتجات ({filtered.length})</h2>

        <button
          onClick={() => { setIsAddingNew(true); setEditingProduct(null); }}
          style={{
            padding: '10px 20px', borderRadius: 12, border: 'none',
            background: 'linear-gradient(135deg, #bf40bf, #7b2fff)',
            color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: '0 0 20px rgba(191,64,191,0.2)',
            fontFamily: "'Inter', sans-serif",
          }}
        >+ إضافة منتج</button>
      </div>

      {/* Filters */}
      <div style={{
        display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap',
      }}>
        <input
          type="text" placeholder="🔍 بحث..."
          value={search} onChange={(e) => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(191,64,191,0.1)',
            color: '#f2f2f7', fontSize: 13, outline: 'none',
          }}
        />
        {['all', 'boys', 'girls'].map((g) => (
          <button
            key={g}
            onClick={() => setFilterGender(g)}
            style={{
              padding: '10px 18px', borderRadius: 12, border: 'none',
              background: filterGender === g
                ? 'linear-gradient(135deg, rgba(191,64,191,0.2), rgba(123,47,255,0.15))'
                : 'rgba(255,255,255,0.03)',
              color: filterGender === g ? '#d966d9' : 'rgba(153,153,159,0.5)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              borderLeft: filterGender === g ? '2px solid #bf40bf' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {g === 'all' ? 'الكل' : g === 'boys' ? 'ولاد' : 'بنات'}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 14,
      }}>
        {filtered.map((product) => (
          <div key={product.id} style={{
            borderRadius: 14, overflow: 'hidden',
            background: 'linear-gradient(145deg, rgba(12,12,18,0.9), rgba(8,8,12,0.95))',
            border: '1px solid rgba(191,64,191,0.08)',
            transition: 'all 0.3s',
          }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(191,64,191,0.2)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(191,64,191,0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Image */}
            <div style={{
              width: '100%', aspectRatio: '1/1', overflow: 'hidden',
              background: 'linear-gradient(135deg, #0c0c12, #1a0b2e)',
              position: 'relative',
            }}>
              <img
                src={product.img}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              {/* Gender badge */}
              <span style={{
                position: 'absolute', top: 8, right: 8,
                padding: '3px 8px', borderRadius: 6, fontSize: 9, fontWeight: 700,
                background: product.gender === 'boys'
                  ? 'rgba(59,130,246,0.2)' : 'rgba(236,72,153,0.2)',
                color: product.gender === 'boys' ? '#60a5fa' : '#f472b6',
                border: `1px solid ${product.gender === 'boys'
                  ? 'rgba(59,130,246,0.3)' : 'rgba(236,72,153,0.3)'}`,
              }}>{product.gender === 'boys' ? 'ولاد' : 'بنات'}</span>
              {/* Stock toggle */}
              <span style={{
                position: 'absolute', top: 8, left: 8,
                width: 8, height: 8, borderRadius: '50%',
                background: product.inStock ? '#10b981' : '#ef4444',
                boxShadow: `0 0 8px ${product.inStock ? '#10b981' : '#ef4444'}`,
              }} />
            </div>

            {/* Info */}
            <div style={{ padding: '12px 14px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#f2f2f7', marginBottom: 2 }}>{product.name}</p>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#bf40bf' }}>{product.price} EGP</p>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                <button
                  onClick={() => { setEditingProduct(product); setIsAddingNew(false); }}
                  style={{
                    flex: 1, padding: '7px 0', borderRadius: 8, border: 'none',
                    background: 'rgba(191,64,191,0.1)', color: '#d966d9',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(191,64,191,0.2)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(191,64,191,0.1)'}
                >✏️ تعديل</button>
                <button
                  onClick={() => setConfirmDelete(product.id)}
                  style={{
                    flex: 1, padding: '7px 0', borderRadius: 8, border: 'none',
                    background: 'rgba(239,68,68,0.08)', color: '#f87171',
                    fontSize: 11, fontWeight: 600, cursor: 'pointer',
                    transition: 'background 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
                >🗑 حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Product Form Modal */}
      {(isAddingNew || editingProduct) && (
        <ProductFormModal
          product={editingProduct}
          onSave={handleSave}
          onClose={() => { setEditingProduct(null); setIsAddingNew(false); }}
        />
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
              هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء.
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
                onClick={() => handleDelete(confirmDelete)}
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

/* ─── Product Form Modal ─── */
function ProductFormModal({ product, onSave, onClose }) {
  const [form, setForm] = useState({
    name: product?.name || '',
    nameAr: product?.nameAr || '',
    img: product?.img || '',
    price: product?.price || 500,
    gender: product?.gender || 'boys',
    inStock: product?.inStock !== false,
    sizes: product?.sizes || ['M', 'L', 'XL', '2XL'],
  });

  const [imagePreview, setImagePreview] = useState(product?.img || '');
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleImageUpload = useCallback(async (file) => {
    if (!file) return;

    // Validate size (max 5MB for MongoDB storage)
    if (file.size > 5 * 1024 * 1024) {
      alert('الصورة كبيرة أوي! الحد الأقصى 5MB');
      return;
    }

    setUploading(true);

    // Convert to base64 data URL — stored directly in MongoDB
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setImagePreview(dataUrl);
      updateField('img', dataUrl);
      setUploading(false);
    };
    reader.onerror = () => {
      alert('حصل مشكلة في قراءة الصورة، حاول تاني');
      setUploading(false);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file);
    }
  }, [handleImageUpload]);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.img) {
      alert('من فضلك ارفع صورة للمنتج');
      return;
    }
    onSave(form);
  };

  const inputStyle = {
    width: '100%', padding: '12px 14px', borderRadius: 12,
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(191,64,191,0.12)',
    color: '#f2f2f7', fontSize: 13, outline: 'none',
    fontFamily: "'Inter', sans-serif",
  };

  const labelStyle = {
    display: 'block', fontSize: 10, color: 'rgba(153,153,159,0.5)',
    letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6,
    fontFamily: "'Orbitron', sans-serif",
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.7)', zIndex: 9999, backdropFilter: 'blur(8px)', padding: 20,
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(145deg, #0c0c12, #080810)',
        borderRadius: 20, padding: '28px 24px', maxWidth: 460, width: '100%',
        border: '1px solid rgba(191,64,191,0.15)',
        boxShadow: '0 0 80px rgba(0,0,0,0.5), 0 0 30px rgba(191,64,191,0.05)',
        maxHeight: '85vh', overflowY: 'auto',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{
          fontSize: 18, fontWeight: 700, color: '#f2f2f7', marginBottom: 20,
          fontFamily: "'Montserrat', sans-serif",
        }}>{product ? '✏️ تعديل المنتج' : '➕ إضافة منتج جديد'}</h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={labelStyle}>اسم المنتج (EN)</label>
            <input style={inputStyle} value={form.name} onChange={(e) => updateField('name', e.target.value)} required />
          </div>

          <div>
            <label style={labelStyle}>اسم المنتج (AR)</label>
            <input style={{ ...inputStyle, direction: 'rtl' }} value={form.nameAr} onChange={(e) => updateField('nameAr', e.target.value)} />
          </div>

          {/* ─── Image Upload Zone ─── */}
          <div>
            <label style={labelStyle}>صورة المنتج</label>

            {/* Current image preview */}
            {imagePreview && (
              <div style={{
                width: '100%', borderRadius: 14, overflow: 'hidden',
                marginBottom: 10, background: '#0c0c12',
                display: 'flex', justifyContent: 'center',
                border: '1px solid rgba(191,64,191,0.1)',
              }}>
                <img
                  src={imagePreview}
                  alt="صورة المنتج"
                  style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    if (e.target.nextElementSibling) e.target.nextElementSibling.style.display = 'flex';
                  }}
                />
                <div style={{
                  display: 'none', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: 30, color: 'rgba(153,153,159,0.4)',
                }}>
                  <span style={{ fontSize: 32 }}>🖼️</span>
                  <span style={{ fontSize: 11, marginTop: 6 }}>الصورة القديمة مش متاحة</span>
                </div>
              </div>
            )}

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />

            {/* Upload button — big, clear, mobile-friendly */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: 14,
                border: '2px dashed rgba(191,64,191,0.35)',
                background: uploading ? 'rgba(245,158,11,0.06)' : 'rgba(191,64,191,0.06)',
                color: '#d966d9',
                fontSize: 15,
                fontWeight: 700,
                cursor: uploading ? 'wait' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                fontFamily: "'Noto Sans Arabic', 'Inter', sans-serif",
                transition: 'all 0.3s',
              }}
            >
              {uploading ? (
                <>⏳ جاري تحميل الصورة...</>
              ) : (
                <>📷 {imagePreview ? 'تغيير الصورة من المعرض' : 'اختار صورة من المعرض'}</>
              )}
            </button>

            <p style={{
              fontSize: 9, color: 'rgba(153,153,159,0.3)',
              textAlign: 'center', marginTop: 6,
            }}>
              JPG, PNG, WEBP — حتى 5MB
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>السعر (EGP)</label>
              <input type="number" style={inputStyle} value={form.price} onChange={(e) => updateField('price', Number(e.target.value))} min={0} required />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>القسم</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.gender} onChange={(e) => updateField('gender', e.target.value)}>
                <option value="boys" style={{ background: '#0c0c12' }}>ولاد</option>
                <option value="girls" style={{ background: '#0c0c12' }}>بنات</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <label style={{ ...labelStyle, marginBottom: 0 }}>متاح؟</label>
            <button
              type="button"
              onClick={() => updateField('inStock', !form.inStock)}
              style={{
                width: 44, height: 24, borderRadius: 99, border: 'none', cursor: 'pointer',
                background: form.inStock
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'rgba(255,255,255,0.08)',
                position: 'relative', transition: 'background 0.3s',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: '50%', background: '#fff',
                position: 'absolute', top: 3,
                left: form.inStock ? 23 : 3,
                transition: 'left 0.3s',
                boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
              }} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '12px 0', borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'transparent', color: '#f2f2f7', fontSize: 13, cursor: 'pointer',
            }}>إلغاء</button>
            <button type="submit" disabled={uploading} style={{
              flex: 1, padding: '12px 0', borderRadius: 12, border: 'none',
              background: uploading
                ? 'rgba(191,64,191,0.3)'
                : 'linear-gradient(135deg, #bf40bf, #7b2fff)',
              color: '#fff', fontSize: 13, fontWeight: 600,
              cursor: uploading ? 'not-allowed' : 'pointer',
              boxShadow: '0 0 20px rgba(191,64,191,0.2)',
              opacity: uploading ? 0.6 : 1,
              transition: 'all 0.3s',
            }}>💾 حفظ</button>
          </div>
        </form>
      </div>
    </div>
  );
}

