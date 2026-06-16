// LoadingPage.jsx
import React from 'react';

const LoadingPage = ({ message = 'Loading...' }) => (
  <div className="loading-page">
    <div style={{ textAlign: 'center' }}>
      <div className="spinner" style={{ margin: '0 auto 16px' }} />
      <p style={{ color: 'var(--muted)', fontSize: '0.9rem' }}>{message}</p>
    </div>
  </div>
);

export default LoadingPage;
