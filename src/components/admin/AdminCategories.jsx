import React, { useEffect, useState } from 'react';
import { categoryAPI } from '../../utils/api';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });

  const load = () => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.categories || []))
      .catch(() => toast.error('Failed to load categories'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm({ name: '', description: '', image: '' }); setShowForm(true); };
  const openEdit = (c) => { setEditing(c._id); setForm({ name: c.name, description: c.description || '', image: c.image || '' }); setShowForm(true); };

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this category?')) return;
    try { await categoryAPI.delete(id); toast.success('Category removed'); load(); }
    catch { toast.error('Failed to remove category'); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) { await categoryAPI.update(editing, form); toast.success('Category updated'); }
      else { await categoryAPI.create(form); toast.success('Category created'); }
      setShowForm(false); load();
    } catch (err) { toast.error(err.response?.data?.message || 'Save failed'); }
  };

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Categories</h1>
        <button className="btn btn-primary btn-sm" onClick={openAdd}><Plus size={16} /> Add Category</button>
      </div>

      {showForm && (
        <div className="admin-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin-modal" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3>{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button className="btn-icon" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSubmit} className="admin-modal__body">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="form-control" required />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="form-control" />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} className="form-control" placeholder="https://..." />
              </div>
              <div className="admin-modal__footer">
                <button type="button" className="btn btn-dark" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="admin-card">
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
            <tbody>
              {categories.map(c => (
                <tr key={c._id}>
                  <td style={{ fontWeight: 600, color: 'var(--off-white)' }}>{c.name}</td>
                  <td style={{ fontSize: '0.78rem', color: 'var(--muted)', fontFamily: 'monospace' }}>{c.slug}</td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description || '—'}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="btn-icon" onClick={() => openEdit(c)} style={{ padding: 6 }}><Pencil size={14} /></button>
                      <button className="btn-icon" onClick={() => handleDelete(c._id)} style={{ padding: 6, color: 'var(--error)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminCategories;
