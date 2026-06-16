import React, { useEffect, useState } from 'react';
import { userAPI } from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (search) params.search = search;
      const { data } = await userAPI.getAllUsers(params);
      setUsers(data.users || []);
      setPages(data.pages || 1);
    } catch { toast.error('Failed to load users'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const toggleStatus = async (id, current) => {
    try {
      await userAPI.updateStatus(id, { isActive: !current });
      toast.success('User status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Users</h1>
      </div>

      <div className="admin-search">
        <div style={{ position: 'relative', maxWidth: 320 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} className="form-control" style={{ paddingLeft: 38 }} placeholder="Search by name or email..." />
        </div>
        <button className="btn btn-dark btn-sm" onClick={load}><Search size={14} /> Search</button>
      </div>

      <div className="admin-card">
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td style={{ fontWeight: 600, color: 'var(--off-white)' }}>{u.firstName} {u.lastName}</td>
                  <td style={{ fontSize: '0.82rem' }}>{u.email}</td>
                  <td style={{ fontSize: '0.82rem' }}>{u.phone || '—'}</td>
                  <td><span className={`badge ${u.role === 'admin' ? 'badge-warning' : 'badge-gold'}`}>{u.role}</span></td>
                  <td style={{ fontSize: '0.78rem' }}>{formatDate(u.createdAt)}</td>
                  <td>
                    <span className={`badge ${u.isActive ? 'badge-success' : 'badge-error'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button className={`btn btn-sm ${u.isActive ? 'btn-dark' : 'btn-outline'}`}
                      style={{ fontSize: '0.75rem', padding: '6px 14px' }}
                      onClick={() => toggleStatus(u._id, u.isActive)}>
                      {u.isActive ? 'Deactivate' : 'Activate'}
                    </button>
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

export default AdminUsers;
