import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authAPI } from '../../utils/api';
import toast from 'react-hot-toast';
import './Auth.css';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, form.password);
      toast.success('Password reset! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Reset failed. Link may have expired.');
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
        <h2 className="auth-card__title">Reset Password</h2>
        <p className="auth-card__subtitle">Enter your new password below</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">New Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="form-control" placeholder="Min 6 characters" required />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} className="form-control" placeholder="Repeat password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full auth-submit" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
