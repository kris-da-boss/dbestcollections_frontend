import React, { useEffect, useState } from 'react';
import { orderAPI } from '../../utils/api';
import { formatPrice, formatDate, ORDER_STATUS, PAYMENT_STATUS } from '../../utils/helpers';
import { Search } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending','confirmed','processing','shipped','delivered','cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;
      const { data } = await orderAPI.getAll(params);
      setOrders(data.orders || []);
      setPages(data.pages || 1);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, statusFilter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await orderAPI.updateStatus(id, { status });
      toast.success('Order status updated');
      load();
    } catch { toast.error('Update failed'); }
  };

  return (
    <div className="page-enter">
      <div className="admin-page-header">
        <h1 className="admin-page-title">Orders</h1>
      </div>

      <div className="admin-search" style={{ gap: 12, marginBottom: 20 }}>
        <div style={{ position: 'relative', maxWidth: 280 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => e.key === 'Enter' && load()} className="form-control" style={{ paddingLeft: 38 }} placeholder="Search order #..." />
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="form-control" style={{ maxWidth: 180 }}>
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="admin-card">
        {loading ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> : (
          <table className="admin-table">
            <thead><tr><th>Order #</th><th>Customer</th><th>Items</th><th>Total</th><th>Payment</th><th>Status</th><th>Date</th><th>Update</th></tr></thead>
            <tbody>
              {orders.map(order => {
                const status = ORDER_STATUS[order.status];
                const pay = PAYMENT_STATUS[order.paymentStatus];
                return (
                  <tr key={order._id}>
                    <td style={{ fontWeight: 700, color: 'var(--gold)' }}>#{order.orderNumber}</td>
                    <td>{order.user?.firstName} {order.user?.lastName}<br /><span style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>{order.user?.email}</span></td>
                    <td>{order.items?.length}</td>
                    <td style={{ fontWeight: 600 }}>{formatPrice(order.total)}</td>
                    <td><span className="badge" style={{ color: pay?.color }}>{pay?.label}</span></td>
                    <td><span className="badge" style={{ background: status?.bg, color: status?.color }}>{status?.label}</span></td>
                    <td style={{ fontSize: '0.78rem' }}>{formatDate(order.createdAt)}</td>
                    <td>
                      <select defaultValue={order.status}
                        onChange={e => handleStatusUpdate(order._id, e.target.value)}
                        className="form-control" style={{ padding: '6px 10px', fontSize: '0.8rem', minWidth: 120 }}>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                      </select>
                    </td>
                  </tr>
                );
              })}
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

export default AdminOrders;
