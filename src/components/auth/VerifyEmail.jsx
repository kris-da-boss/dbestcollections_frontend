import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import './Auth.css';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    authAPI.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="auth-page page-enter">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div className="auth-card__brand" style={{ justifyContent: 'center' }}>
          <span className="auth-brand-d">D</span>
          <span>Best Collections</span>
        </div>

        {status === 'loading' && (
          <>
            <div className="spinner" style={{ margin: '24px auto 16px' }} />
            <p style={{ color: 'var(--muted)' }}>Verifying your email...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>✅</div>
            <h2 className="auth-card__title">Email Verified!</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Your email has been verified successfully.</p>
            <Link to="/" className="btn btn-primary btn-full">Go to Home</Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>❌</div>
            <h2 className="auth-card__title">Verification Failed</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>The link is invalid or has expired.</p>
            <Link to="/login" className="btn btn-outline btn-full">Back to Login</Link>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
