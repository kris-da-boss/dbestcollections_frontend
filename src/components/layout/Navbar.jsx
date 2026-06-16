import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const searchRef = useRef(null);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setUserMenuOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop', dropdown: [
      { to: '/shop?type=shoes', label: 'Shoes' },
      { to: '/shop?type=bags', label: 'Bags' },
      { to: '/shop?newArrivals=true', label: 'New Arrivals' },
      { to: '/shop?featured=true', label: 'Featured' },
      { to: '/shop?bestseller=true', label: 'Best Sellers' }
    ]},
    { to: '/blog', label: 'Blog' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' }
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          {/* Logo */}
          <Link to="/" className="navbar__logo" onClick={() => setMobileOpen(false)}>
            <span className="navbar__logo-d">D</span>
            <span className="navbar__logo-text">Best Collections</span>
          </Link>

          {/* Desktop Nav */}
          <ul className="navbar__links">
            {navLinks.map((link) => (
              <li key={link.to} className={`navbar__item ${link.dropdown ? 'has-dropdown' : ''}`}>
                <NavLink to={link.to} className={({ isActive }) => `navbar__link ${isActive ? 'active' : ''}`}>
                  {link.label}
                  {link.dropdown && <ChevronDown size={14} />}
                </NavLink>
                {link.dropdown && (
                  <div className="navbar__dropdown">
                    {link.dropdown.map(d => (
                      <Link key={d.to} to={d.to} className="navbar__dropdown-item">{d.label}</Link>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar__actions">
            {/* Search */}
            <div ref={searchRef} className="navbar__search-wrap">
              <button className="navbar__icon-btn" onClick={() => setSearchOpen(!searchOpen)} aria-label="Search">
                <Search size={20} />
              </button>
              {searchOpen && (
                <form onSubmit={handleSearch} className="navbar__search-box">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search shoes, bags..."
                    className="navbar__search-input"
                  />
                  <button type="submit" className="navbar__search-btn">
                    <Search size={16} />
                  </button>
                </form>
              )}
            </div>

            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/wishlist" className="navbar__icon-btn" aria-label="Wishlist">
                <Heart size={20} />
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="navbar__icon-btn navbar__cart-btn" aria-label="Cart">
              <ShoppingBag size={20} />
              {itemCount > 0 && <span className="navbar__cart-badge">{itemCount > 99 ? '99+' : itemCount}</span>}
            </Link>

            {/* User Menu */}
            <div ref={userMenuRef} className="navbar__user-wrap">
              <button
                className="navbar__icon-btn"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Account"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.firstName} className="navbar__avatar" />
                ) : (
                  <User size={20} />
                )}
              </button>
              {userMenuOpen && (
                <div className="navbar__user-menu">
                  {isAuthenticated ? (
                    <>
                      <div className="navbar__user-info">
                        <p className="navbar__user-name">{user.firstName} {user.lastName}</p>
                        <p className="navbar__user-email">{user.email}</p>
                      </div>
                      <div className="navbar__menu-divider" />
                      <Link to="/dashboard" className="navbar__menu-item" onClick={() => setUserMenuOpen(false)}>
                        <LayoutDashboard size={15} /> My Account
                      </Link>
                      <Link to="/dashboard/orders" className="navbar__menu-item" onClick={() => setUserMenuOpen(false)}>
                        <ShoppingBag size={15} /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to="/admin" className="navbar__menu-item" onClick={() => setUserMenuOpen(false)}>
                          <Settings size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="navbar__menu-divider" />
                      <button className="navbar__menu-item navbar__menu-item--danger" onClick={handleLogout}>
                        <LogOut size={15} /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="navbar__menu-item" onClick={() => setUserMenuOpen(false)}>Sign In</Link>
                      <Link to="/register" className="navbar__menu-item" onClick={() => setUserMenuOpen(false)}>Create Account</Link>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Toggle */}
            <button className="navbar__mobile-toggle" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'mobile-menu--open' : ''}`}>
        <div className="mobile-menu__inner">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mobile-menu__search">
            <Search size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
            />
          </form>

          <nav className="mobile-menu__nav">
            {navLinks.map(link => (
              <div key={link.to}>
                <NavLink
                  to={link.to}
                  className="mobile-menu__link"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </NavLink>
                {link.dropdown && (
                  <div className="mobile-menu__sub">
                    {link.dropdown.map(d => (
                      <Link key={d.to} to={d.to} className="mobile-menu__sub-link" onClick={() => setMobileOpen(false)}>
                        {d.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="mobile-menu__footer">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-outline btn-full" onClick={() => setMobileOpen(false)}>My Account</Link>
                <button className="btn btn-dark btn-full" style={{marginTop:8}} onClick={() => { handleLogout(); setMobileOpen(false); }}>Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-full" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-full" style={{marginTop:8}} onClick={() => setMobileOpen(false)}>Create Account</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {mobileOpen && <div className="mobile-backdrop" onClick={() => setMobileOpen(false)} />}
    </>
  );
};

export default Navbar;
