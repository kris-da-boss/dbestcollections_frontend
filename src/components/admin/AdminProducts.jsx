import React, { useEffect, useState } from 'react';
import { productAPI, categoryAPI } from '../../utils/api';
import { formatPrice, formatDate, ORDER_STATUS } from '../../utils/helpers';
import { Plus, Pencil, Trash2, Search, Check, X } from 'lucide-react';
import toast from 'react-hot-toast';
import './Admin.css';

/* ─── Admin Products ──────────────────────────────────────────── */
export const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const emptyForm = { name: '', description: '', shortDescription: '', price: '', discountPrice: '', type: 'shoes', gender: 'unisex', brand: '', material: '', stock: 0, category: '', isFeatured: false, isNew: true, isBestseller: false, images: [], tags: '' };
  const [form, setForm] = useState(emptyForm);

  const load = async (pg = 1, q = '') => {
    setLoading(true);
    try {
      const params = { page: pg, limit: 15 };
      if (q) params.search = q;
      const [prodRes, catRes] = await Promise.all([productAPI.getAll(params), categoryAPI.getAll()]);
      setProducts(prodRes.data.products || []);
      setPages(prodRes.data.pages || 1);
      setCategories(catRes.data.categories || []);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(page, search); }, [page]);

  const handleSearch = (e) => { e.preventDefault(); load(1, search); setPage(1); };

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p._id);
    setForm({ ...p, tags: p.tags?.join(', ') || '', images: p.images || [] });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    try { await productAPI.delete(id); toast.success('Product removed'); load(page, search); }
    catch { toast.error('Failed to remove product'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [] };
    // Add a placeholder image if none provided
    if (!payload.images || payload.images.length === 0) {
      payload.images = [{ url: `https://placehold.co/400x500?text=${encodeURIComponent(payload.name)}`, alt: payload.name }];
    }
    try {
      if (editing) { await productAPI.update(editing, payload); toast.success('Product updated'); }
      else { await productAPI.create(payload); toast.success('Product created'); }
      setShowForm(false); load(page, search);
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Products</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={16} /> Add Product</button>
      </div>

      <form className="admin-search" onSubmit={handleSearch}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 340 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} className="form-control" style={{ paddingLeft: 38 }} placeholder="Search products..." />
        </div>
        <button type="submit" className="btn btn-dark btn-sm"><Search size={14} /></button>
      </form>

      {/* Product Form Modal */}
      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editing ? 'Edit Product' : 'Add Product'}</h3>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[['name', 'Product Name', 'text'], ['brand', 'Brand', 'text'], ['price', 'Price (₦)', 'number'], ['discountPrice', 'Discount Price (₦)', 'number'], ['material', 'Material', 'text'], ['stock', 'Stock', 'number']].map(([name, label, type]) => (
                  <div key={name} className="form-group" style={{ margin: 0 }}>
                    <label className="form-label">{label}</label>
                    <input type={type} value={form[name] || ''} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} className="form-control" required={['name', 'price'].includes(name)} />
                  </div>
                ))}
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="form-control" required>
                    <option value="">Select Category</option>
                    {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="form-control">
                    {['shoes', 'bags', 'accessories'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Gender</label>
                  <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))} className="form-control">
                    {['men', 'women', 'unisex', 'kids'].map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label className="form-label">Tags (comma-separated)</label>
                  <input value={form.tags || ''} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))} className="form-control" placeholder="luxury, leather, formal" />
                </div>
              </div>
              <div className="form-group" style={{ marginTop: 16, marginBottom: 0 }}>
                <label className="form-label">Short Description</label>
                <input value={form.shortDescription || ''} onChange={e => setForm(f => ({ ...f, shortDescription: e.target.value }))} className="form-control" />
              </div>
              <div className="form-group" style={{ marginTop: 16, marginBottom: 16 }}>
                <label className="form-label">Full Description</label>
                <textarea rows={4} value={form.description || ''} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="form-control" required />
              </div>
              <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Image URL (main image)</label>
                <input value={form.images?.[0]?.url || ''} onChange={e => setForm(f => ({ ...f, images: [{ url: e.target.value, alt: f.name }] }))} className="form-control" placeholder="https://..." />
              </div>
              <div style={{ display: 'flex', gap: 16, marginBottom: 0 }}>
                {[['isFeatured', 'Featured'], ['isNew', 'New Arrival'], ['isBestseller', 'Best Seller']].map(([key, label]) => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, font: 'var(--font-body)', fontSize: '0.85rem', color: 'var(--light-muted)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={form[key] || false} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} /> {label}
                  </label>
                ))}
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-dark" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'} Product</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> : (
          <table className="admin-table">
            <thead>
              <tr><th>Product</th><th>Type</th><th>Price</th><th>Stock</th><th>Rating</th><th>Featured</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <img src={p.images?.[0]?.url} alt={p.name} style={{ width: 40, height: 48, objectFit: 'cover', borderRadius: 4, background: 'var(--dark-2)' }} />
                      <div>
                        <p style={{ fontWeight: 600, color: 'var(--off-white)', fontSize: '0.88rem' }}>{p.name}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge badge-gold">{p.type}</span></td>
                  <td style={{ color: 'var(--gold)', fontWeight: 600 }}>{formatPrice(p.discountPrice || p.price)}</td>
                  <td style={{ color: p.stock < 5 ? 'var(--error)' : 'inherit' }}>{p.stock}</td>
                  <td>{p.ratings?.average || '—'} ⭐</td>
                  <td>{p.isFeatured ? <Check size={16} style={{ color: 'var(--success)' }} /> : <X size={16} style={{ color: 'var(--muted)' }} />}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-icon" onClick={() => openEdit(p)} style={{ padding: 6 }}><Pencil size={14} /></button>
                      <button className="btn-icon" onClick={() => handleDelete(p._id)} style={{ padding: 6, color: 'var(--error)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {pages > 1 && (
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', padding: 20 }}>
            {[...Array(pages)].map((_, i) => (
              <button key={i} className={`shop__page-btn ${page === i+1 ? 'active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
