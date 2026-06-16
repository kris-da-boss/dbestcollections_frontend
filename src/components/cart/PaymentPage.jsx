// PaymentPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { paymentAPI } from '../../utils/api';
import { formatPrice } from '../../utils/helpers';
import { Lock, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../../context/CartContext';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const order = location.state?.order;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!order) navigate('/cart');
  }, [order, navigate]);

  if (!order) return null;

  const handlePaystack = async () => {
    setLoading(true);
    try {
      const { data } = await paymentAPI.initialize(order._id);
      // Redirect to Paystack payment page
      window.location.href = data.authorizationUrl;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{ padding: '60px 0 100px', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 64, height: 64, background: 'var(--gold-pale)', border: '1px solid var(--gold-border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--gold)' }}>
              <CreditCard size={28} />
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Complete Payment</h2>
            <p style={{ color: 'var(--muted)', marginTop: 8 }}>Order #{order.orderNumber}</p>
          </div>

          <div style={{ background: 'var(--dark-2)', borderRadius: 12, padding: 20, marginBottom: 28 }}>
            {[
              ['Order Number', order.orderNumber],
              ['Items', order.items?.length],
              ['Shipping', order.shippingFee === 0 ? 'Free' : formatPrice(order.shippingFee)],
              ['Total Amount', formatPrice(order.total)]
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--dark-3)' }}>
                <span style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>{label}</span>
                <span style={{ fontWeight: 600, color: label === 'Total Amount' ? 'var(--gold)' : 'var(--off-white)', fontSize: '0.9rem' }}>{val}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={handlePaystack} disabled={loading}>
            <Lock size={16} /> {loading ? 'Redirecting to Paystack...' : `Pay ${formatPrice(order.total)}`}
          </button>
          <p style={{ textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted)', marginTop: 12 }}>
            🔒 Secured by Paystack. We never store your card details.
          </p>
        </div>
      </div>
    </div>
  );
};

export { PaymentPage as default };
