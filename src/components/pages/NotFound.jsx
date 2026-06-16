import React from 'react';

const NotFound = () => (
  <div className="page-enter" style={{ minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
    <div className="container" style={{ textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '8rem', color: 'var(--gold)', lineHeight: 1, marginBottom: 0 }}>404</p>
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 16 }}>Page Not Found</h2>
      <p style={{ color: 'var(--muted)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <a href="/" className="btn btn-primary btn-lg">Go Home</a>
        <a href="/shop" className="btn btn-outline btn-lg">Browse Shop</a>
      </div>
    </div>
  </div>
);

export default NotFound;
