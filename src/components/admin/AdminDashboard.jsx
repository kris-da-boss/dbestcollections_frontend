import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../utils/api';
import { formatPrice, formatDate, ORDER_STATUS } from '../../utils/helpers';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import './Admin.css';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAnalytics().then(({ data }) => setAnalytics(data.analytics))
      .catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}><div className="spinner" /></div>;
  if (!analytics) return <p style={{ color: 'var(--muted)' }}>Failed to load analytics.</p>;

  const statsCards = [
    { label: 'Total Revenue', value: formatPrice(analytics.totalRevenue), Icon: DollarSign, color: 'var(--gold)', trend: `+${analytics.revenueGrowth}%` },
    { label: 'Monthly Revenue', value: formatPrice(analytics.monthRevenue), Icon: TrendingUp, color: 'var(--success)' },
    { label: 'Total Orders', value: analytics.totalOrders, Icon: ShoppingCart, color: 'var(--info)' },
    { label: 'Pending Orders', value: analytics.pendingOrders, Icon: Package, color: 'var(--warning)' },
    { label: 'Products', value: analytics.totalProducts, Icon: Package, color: 'var(--gold)' },
    { label: 'Customers', value: analytics.totalUsers, Icon: Users, color: '#a78bfa' }
  ];

  // Simple bar chart using CSS
  const maxRevenue = Math.max(...(analytics.monthlySales?.map(m => m.revenue) || [1]));
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  return (
    <div className="admin-dashboard page-enter">
      <div className="admin-dashboard__header">
        <h1 className="admin-dashboard__title">Dashboard</h1>
        <p className="admin-dashboard__subtitle">Welcome to D Best Collections Admin</p>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        {statsCards.map(({ label, value, Icon, color, trend }) => (
          <div key={label} className="admin-stat-card">
            <div className="admin-stat-card__icon" style={{ background: `${color}18`, color }}>
              <Icon size={22} />
            </div>
            <div className="admin-stat-card__info">
              <p className="admin-stat-card__value">{value}</p>
              <p className="admin-stat-card__label">{label}</p>
            </div>
            {trend && (
              <div className="admin-stat-card__trend" style={{ color: trend.startsWith('+') ? 'var(--success)' : 'var(--error)' }}>
                {trend.startsWith('+') ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                <span>{trend}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="admin-dashboard__grid">
        {/* Revenue Chart */}
        <div className="admin-card">
          <h3 className="admin-card__title">Monthly Revenue</h3>
          <div className="bar-chart">
            {analytics.monthlySales?.map((m, i) => (
              <div key={i} className="bar-chart__item">
                <div className="bar-chart__bar-wrap">
                  <div className="bar-chart__bar" style={{ height: `${(m.revenue / maxRevenue) * 100}%` }}>
                    <span className="bar-chart__tooltip">{formatPrice(m.revenue)}</span>
                  </div>
                </div>
                <span className="bar-chart__label">{monthNames[(m._id?.month || 1) - 1]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="admin-card">
          <h3 className="admin-card__title">Recent Orders</h3>
          <div className="admin-orders-list">
            {analytics.recentOrders?.map(order => {
              const status = ORDER_STATUS[order.status] || ORDER_STATUS.pending;
              return (
                <div key={order._id} className="admin-order-row">
                  <div>
                    <p className="admin-order-row__num">#{order.orderNumber}</p>
                    <p className="admin-order-row__customer">{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                  <span className="badge" style={{ background: status.bg, color: status.color }}>{status.label}</span>
                  <p className="admin-order-row__amount">{formatPrice(order.total)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <h3 className="admin-card__title">Top Selling Products</h3>
        <div className="admin-top-products">
          {analytics.topProducts?.map((product, i) => (
            <div key={product._id} className="admin-product-row">
              <span className="admin-product-row__rank">#{i + 1}</span>
              <img src={product.images?.[0]?.url} alt={product.name} className="admin-product-row__img" />
              <div className="admin-product-row__info">
                <p className="admin-product-row__name">{product.name}</p>
                <p className="admin-product-row__sold">{product.soldCount} sold</p>
              </div>
              <p className="admin-product-row__price">{formatPrice(product.price)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
