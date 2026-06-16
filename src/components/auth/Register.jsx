import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

const Register = () => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register({ firstName: form.firstName, lastName: form.lastName, email: form.email, phone: form.phone, password: form.password });
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-card auth-card--wide">
        <div className="auth-card__brand">
          <span className="auth-brand-d">D</span>
          <span>Best Collections</span>
        </div>
        <h2 className="auth-card__title">Create Account</h2>
        <p className="auth-card__subtitle">Join the exclusive circle</p>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">First Name</label>
              <input value={form.firstName} onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))} className="form-control" placeholder="John" required />
            </div>
            <div className="form-group">
              <label className="form-label">Last Name</label>
              <input value={form.lastName} onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))} className="form-control" placeholder="Doe" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className="form-control" placeholder="you@email.com" required />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="form-control" placeholder="+234 800 000 0000" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="auth-input-wrap">
              <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} className="form-control" placeholder="Min 6 characters" required />
              <button type="button" className="auth-pwd-toggle" onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))} className="form-control" placeholder="Repeat password" required />
          </div>
          <button type="submit" className="btn btn-primary btn-full btn-lg auth-submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
};

export default Register;
