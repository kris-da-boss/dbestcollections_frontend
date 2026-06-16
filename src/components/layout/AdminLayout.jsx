import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, Package, ShoppingCart, Users,
  Tag, BarChart2, Menu, X, LogOut, Home
} from 'lucide-react';
import './AdminLayout.css';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };

  const navItems = [
    { to: '/admin', label: 'Dashboard', Icon: LayoutDashboard, end: true },
    { to: '/admin/products', label: 'Products', Icon: Package },
    { to: '/admin/orders', label: 'Orders', Icon: ShoppingCart },
    { to: '/admin/users', label: 'Users', Icon: Users },
    { to: '/admin/categories', label: 'Categories', Icon: Tag }
  ];

  return (
    <div className={`admin-layout ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <Link to="/" className="admin-sidebar__logo">
            <span className="admin-logo-d">D</span>
            {sidebarOpen && <span>Best Admin</span>}
          </Link>
          <button className="admin-sidebar__toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          {navItems.map(({ to, label, Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <Link to="/" className="admin-nav-item">
            <Home size={18} />
            {sidebarOpen && <span>View Store</span>}
          </Link>
          <button className="admin-nav-item admin-nav-item--danger" onClick={handleLogout}>
            <LogOut size={18} />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <div />
          <div className="admin-topbar__user">
            <span className="admin-topbar__name">{user?.firstName} {user?.lastName}</span>
            <span className="badge badge-gold">Admin</span>
          </div>
        </header>
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
