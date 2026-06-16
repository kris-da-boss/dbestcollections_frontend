import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './Auth.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
    } catch (err) {
      toast.error('Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card">
        <div className="auth-card__brand">
          <span className="auth-brand-d">D</span>
          <span>Best Collections</span>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📧</div>
            <h2 className="auth-card__title">Check Your Email</h2>
            <p style={{ color: 'var(--muted)', marginBottom: 24 }}>If that email exists, we have sent a password reset link.</p>
            <Link to="/login" className="btn btn-outline btn-full">Back to Login</Link>
          </div>
        ) : (
          <>
            <h2 className="auth-card__title">Forgot Password?</h2>
            <p className="auth-card__subtitle">Enter your email to receive a reset link</p>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="form-control" placeholder="you@email.com" required />
              </div>
              <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
            <p className="auth-footer"><Link to="/login">Back to login</Link></p>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
