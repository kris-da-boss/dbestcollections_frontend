import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderAPI, paymentAPI, userAPI, authAPI } from '../../utils/api';
import { formatPrice, formatDate, ORDER_STATUS, PAYMENT_STATUS } from '../../utils/helpers';
import { User, ShoppingBag, MapPin, Heart, CreditCard, Settings, ChevronRight, Package, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import './Dashboard.css';

/* ─── Sidebar Nav ─────────────────────────────────────────────── */
const DashboardNav = ({ user }) => {
  const navItems = [
    { to: '/dashboard', label: 'Overview', Icon: User, end: true },
    { to: '/dashboard/orders', label: 'My Orders', Icon: ShoppingBag },
    { to: '/dashboard/transactions', label: 'Transactions', Icon: CreditCard },
    { to: '/dashboard/addresses', label: 'Addresses', Icon: MapPin },
    { to: '/dashboard/profile', label: 'Profile', Icon: Settings },
  ];
  return (
    <aside className="dashboard__sidebar">
      <div className="dashboard__user-card">
        <div className="dashboard__avatar">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
        <div>
          <p className="dashboard__user-name">{user?.firstName} {user?.lastName}</p>
          <p className="dashboard__user-email">{user?.email}</p>
        </div>
      </div>
      <nav className="dashboard__nav">
        {navItems.map(({ to, label, Icon, end }) => (
          <NavLink key={to} to={to} end={end}
            className={({ isActive }) => `dashboard__nav-item ${isActive ? 'active' : ''}`}>
            <Icon size={17} /> {label} <ChevronRight size={14} style={{ marginLeft: 'auto' }} />
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

/* ─── Overview ────────────────────────────────────────────────── */
const Overview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ orders: 0, spent: 0, wishlist: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    Promise.all([
      orderAPI.getMyOrders({ limit: 3 }),
      paymentAPI.getTransactions({ limit: 1 })
    ]).then(([ordRes, txRes]) => {
      setRecentOrders(ordRes.data.orders || []);
      setStats({ orders: ordRes.data.total || 0, spent: txRes.data.stats?.totalSpent || 0, wishlist: user?.wishlist?.length || 0 });
    }).catch(() => {});
  }, [user]);

  return (
    <div className="dashboard__content">
      <h2 className="dashboard__title">Welcome back, {user?.firstName}! 👋</h2>
      <div className="dashboard__stats">
        {[
          { label: 'Total Orders', value: stats.orders, Icon: Package },
          { label: 'Total Spent', value: formatPrice(stats.spent), Icon: CreditCard },
          { label: 'Wishlist Items', value: stats.wishlist, Icon: Heart }
        ].map(({ label, value, Icon }) => (
          <div key={label} className="dashboard__stat-card">
            <div className="dashboard__stat-icon"><Icon size={20} /></div>
            <div>
              <p className="dashboard__stat-value">{value}</p>
              <p className="dashboard__stat-label">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {recentOrders.length > 0 && (
        <div className="dashboard__section">
          <div className="dashboard__section-header">
            <h3>Recent Orders</h3>
            <NavLink to="/dashboard/orders" className="btn btn-ghost btn-sm">View All</NavLink>
          </div>
          <div className="orders-list">
            {recentOrders.map(order => <OrderRow key={order._id} order={order} />)}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Orders ──────────────────────────────────────────────────── */
const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    orderAPI.getMyOrders({ page, limit: 10 }).then(({ data }) => {
      setOrders(data.orders || []);
      setPages(data.pages || 1);
    }).catch(() => toast.error('Failed to load orders')).finally(() => setLoading(false));
  }, [page]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await orderAPI.cancel(id, 'Cancelled by customer');
      toast.success('Order cancelled');
      setOrders(prev => prev.map(o => o._id === id ? { ...o, status: 'cancelled' } : o));
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot cancel this order'); }
  };

  if (loading) return <div className="dashboard__content"><div className="spinner" /></div>;

  return (
    <div className="dashboard__content">
      <h2 className="dashboard__title">My Orders</h2>
      {orders.length === 0 ? (
        <div className="dashboard__empty">
          <ShoppingBag size={48} strokeWidth={1} />
          <p>No orders yet.</p>
          <NavLink to="/shop" className="btn btn-primary">Start Shopping</NavLink>
        </div>
      ) : (
        <>
          <div className="orders-list">
            {orders.map(order => <OrderRow key={order._id} order={order} onCancel={handleCancel} showCancel />)}
          </div>
          {pages > 1 && (
            <div className="dashboard__pagination">
              {[...Array(pages)].map((_, i) => (
                <button key={i} className={`shop__page-btn ${page === i+1 ? 'active' : ''}`} onClick={() => setPage(i+1)}>{i+1}</button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

/* ─── Order Row ───────────────────────────────────────────────── */
const OrderRow = ({ order, onCancel, showCancel }) => {
  const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
  const payStatus = PAYMENT_STATUS[order.paymentStatus] || PAYMENT_STATUS.pending;
  const navigate = useNavigate();

  return (
    <div className="order-row">
      <div className="order-row__main">
        <div>
          <p className="order-row__number">#{order.orderNumber}</p>
          <p className="order-row__date">{formatDate(order.createdAt)}</p>
          <p className="order-row__items">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="order-row__badges">
          <span className="badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
          <span className="badge" style={{ color: payStatus.color }}>{payStatus.label}</span>
        </div>
        <p className="order-row__total">{formatPrice(order.total)}</p>
        <div className="order-row__actions">
          <button className="btn btn-dark btn-sm" onClick={() => navigate(`/dashboard/orders/${order._id}`)}>
            <Eye size={14} /> View
          </button>
          {showCancel && ['pending', 'confirmed'].includes(order.status) && (
            <button className="btn btn-ghost btn-sm" style={{ color: 'var(--error)' }} onClick={() => onCancel(order._id)}>Cancel</button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Transactions ────────────────────────────────────────────── */
const Transactions = () => {
  const [txs, setTxs] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paymentAPI.getTransactions({ limit: 20 }).then(({ data }) => {
      setTxs(data.transactions || []);
      setStats(data.stats || {});
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="dashboard__content"><div className="spinner" /></div>;

  return (
    <div className="dashboard__content">
      <h2 className="dashboard__title">Transaction History</h2>

      {/* Stats cards */}
      <div className="dashboard__stats" style={{ marginBottom: 32 }}>
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon"><CreditCard size={20} /></div>
          <div>
            <p className="dashboard__stat-value">{formatPrice(stats.totalSpent || 0)}</p>
            <p className="dashboard__stat-label">Total Spent</p>
          </div>
        </div>
        <div className="dashboard__stat-card">
          <div className="dashboard__stat-icon"><Package size={20} /></div>
          <div>
            <p className="dashboard__stat-value">{stats.count || 0}</p>
            <p className="dashboard__stat-label">Paid Orders</p>
          </div>
        </div>
      </div>

      {txs.length === 0 ? (
        <div className="dashboard__empty">
          <CreditCard size={48} strokeWidth={1} />
          <p>No transactions found.</p>
        </div>
      ) : (
        <div className="transactions-table">
          <div className="transactions-table__header">
            <span>Order</span>
            <span>Date</span>
            <span>Reference</span>
            <span>Status</span>
            <span>Amount</span>
          </div>
          {txs.map(tx => {
            const payStatus = PAYMENT_STATUS[tx.paymentStatus];
            return (
              <div key={tx._id} className="transactions-table__row">
                <span className="tx-order">#{tx.orderNumber}</span>
                <span className="tx-date">{formatDate(tx.createdAt)}</span>
                <span className="tx-ref">{tx.paystackReference?.slice(-12) || '—'}</span>
                <span><span className="badge" style={{ color: payStatus?.color }}>{payStatus?.label}</span></span>
                <span className="tx-amount">{formatPrice(tx.total)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* ─── Addresses ───────────────────────────────────────────────── */
const Addresses = () => {
  const { user, loadUser } = useAuth();
  const [form, setForm] = useState({ label: 'Home', fullName: '', phone: '', street: '', city: '', state: '', country: 'Nigeria', postalCode: '', isDefault: false });
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await userAPI.addAddress(form);
      toast.success('Address added');
      await loadUser();
      setAdding(false);
      setForm({ label: 'Home', fullName: '', phone: '', street: '', city: '', state: '', country: 'Nigeria', postalCode: '', isDefault: false });
    } catch (err) { toast.error('Failed to add address'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    try {
      await userAPI.deleteAddress(id);
      toast.success('Address removed');
      await loadUser();
    } catch { toast.error('Failed to remove address'); }
  };

  return (
    <div className="dashboard__content">
      <div className="dashboard__section-header">
        <h2 className="dashboard__title">Saved Addresses</h2>
        <button className="btn btn-outline btn-sm" onClick={() => setAdding(!adding)}>{adding ? 'Cancel' : '+ Add Address'}</button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="address-form card" style={{ padding: 28, marginBottom: 24 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[['label', 'Label (Home/Work)'], ['fullName', 'Full Name'], ['phone', 'Phone'], ['street', 'Street Address'], ['city', 'City'], ['state', 'State']].map(([name, label]) => (
              <div key={name} className="form-group" style={{ margin: 0 }}>
                <label className="form-label">{label}</label>
                <input value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} className="form-control" required={name !== 'label'} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
            <input type="checkbox" id="default-addr" checked={form.isDefault} onChange={e => setForm(f => ({ ...f, isDefault: e.target.checked }))} />
            <label htmlFor="default-addr" style={{ fontSize: '0.85rem', color: 'var(--light-muted)', cursor: 'pointer' }}>Set as default address</label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: 16 }} disabled={saving}>{saving ? 'Saving...' : 'Save Address'}</button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {user?.addresses?.map(addr => (
          <div key={addr._id} className={`address-card card ${addr.isDefault ? 'address-card--default' : ''}`} style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
              <span className="badge badge-gold">{addr.label}</span>
              {addr.isDefault && <span className="badge badge-success">Default</span>}
            </div>
            <p style={{ fontWeight: 600, color: 'var(--off-white)', marginBottom: 6 }}>{addr.fullName}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.7 }}>{addr.street}<br />{addr.city}, {addr.state}<br />{addr.country}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 6 }}>{addr.phone}</p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12, color: 'var(--error)' }} onClick={() => handleDelete(addr._id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─── Profile ─────────────────────────────────────────────────── */
const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ firstName: user?.firstName || '', lastName: user?.lastName || '', phone: user?.phone || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userAPI.updateProfile(form);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch { toast.error('Update failed'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { toast.error('Passwords do not match'); return; }
    setSavingPwd(true);
    try {
      await authAPI.updatePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      toast.success('Password updated');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Update failed'); }
    finally { setSavingPwd(false); }
  };

  return (
    <div className="dashboard__content">
      <h2 className="dashboard__title">Profile Settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <form onSubmit={handleProfileSave} className="card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 20 }}>Personal Info</h3>
          {[['firstName', 'First Name'], ['lastName', 'Last Name'], ['phone', 'Phone']].map(([name, label]) => (
            <div key={name} className="form-group">
              <label className="form-label">{label}</label>
              <input value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} className="form-control" />
            </div>
          ))}
          <div className="form-group">
            <label className="form-label">Email (read-only)</label>
            <input value={user?.email} className="form-control" disabled style={{ opacity: 0.6 }} />
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
        </form>

        <form onSubmit={handlePasswordChange} className="card" style={{ padding: 28 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: 20 }}>Change Password</h3>
          {[['currentPassword', 'Current Password'], ['newPassword', 'New Password'], ['confirmPassword', 'Confirm New Password']].map(([name, label]) => (
            <div key={name} className="form-group">
              <label className="form-label">{label}</label>
              <input type="password" value={pwdForm[name]} onChange={e => setPwdForm(f => ({ ...f, [name]: e.target.value }))} className="form-control" required />
            </div>
          ))}
          <button type="submit" className="btn btn-primary" disabled={savingPwd}>{savingPwd ? 'Updating...' : 'Update Password'}</button>
        </form>
      </div>
    </div>
  );
};

/* ─── Dashboard Shell ─────────────────────────────────────────── */
const UserDashboard = () => {
  const { user } = useAuth();
  return (
    <div className="user-dashboard page-enter">
      <div className="container user-dashboard__layout">
        <DashboardNav user={user} />
        <main className="user-dashboard__main">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="orders" element={<Orders />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
