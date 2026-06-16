// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './Layout.css';

const Layout = () => (
  <div className="site-layout">
    <Navbar />
    <main className="site-main">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
