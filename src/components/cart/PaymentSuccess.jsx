// PaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import { paymentAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { formatPrice, formatDate } from '../../utils/helpers';
import toast from 'react-hot-toast';

export const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const { clearCart } = useCart();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!reference) { setLoading(false); return; }
    paymentAPI.verify(reference)
      .then(({ data }) => { setOrder(data.order); clearCart(); })
      .catch(() => toast.error('Could not verify payment'))
      .finally(() => setLoading(false));
  }, [reference]);

  return (
    <div className="page-enter" style={{ padding: '80px 0', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
      <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
        <div style={{ color: 'var(--success)', marginBottom: 24 }}>
          <CheckCircle size={72} strokeWidth={1.5} />
        </div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 16 }}>Payment Successful!</h1>
        <p style={{ color: 'var(--muted)', marginBottom: 32, fontSize: '1.05rem' }}>
          Thank you for your order. We've received your payment and will begin processing your order shortly.
        </p>
        {order && (
          <div className="card" style={{ padding: 24, marginBottom: 32, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Order Number</span>
              <span style={{ fontWeight: 700, color: 'var(--gold)' }}>#{order.orderNumber}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Amount Paid</span>
              <span style={{ fontWeight: 700 }}>{formatPrice(order.total)}</span>
            </div>
          </div>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/dashboard/orders" className="btn btn-primary btn-lg"><ShoppingBag size={16} /> Track Order</Link>
          <Link to="/shop" className="btn btn-outline btn-lg">Continue Shopping <ArrowRight size={16} /></Link>
        </div>
      </div>
    </div>
  );
};

// PaymentFail.jsx
export const PaymentFail = () => (
  <div className="page-enter" style={{ padding: '80px 0', minHeight: '70vh', display: 'flex', alignItems: 'center' }}>
    <div className="container" style={{ maxWidth: 500, textAlign: 'center' }}>
      <div style={{ fontSize: '5rem', marginBottom: 16 }}>😞</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: 16 }}>Payment Failed</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 32 }}>
        We couldn't process your payment. Your order has not been placed. Please try again or use a different payment method.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/checkout" className="btn btn-primary btn-lg">Try Again</Link>
        <Link to="/cart" className="btn btn-outline btn-lg">Back to Cart</Link>
      </div>
    </div>
  </div>
);

export default PaymentSuccess;
