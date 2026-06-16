import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderAPI } from '../../utils/api';
import { formatPrice, getProductImage } from '../../utils/helpers';
import { Lock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { items, subtotal, shippingFee, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultAddr = user?.addresses?.find(a => a.isDefault) || {};
  const [form, setForm] = useState({
    fullName: defaultAddr.fullName || `${user.firstName} ${user.lastName}`,
    phone: defaultAddr.phone || user.phone || '',
    street: defaultAddr.street || '',
    city: defaultAddr.city || '',
    state: defaultAddr.state || '',
    country: defaultAddr.country || 'Nigeria',
    postalCode: defaultAddr.postalCode || ''
  });
  const [paymentMethod] = useState('paystack');
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const orderItems = items.map(item => ({
        product: item.product._id,
        quantity: item.quantity,
        size: item.size,
        color: item.color
      }));
      const { data } = await orderAPI.create({
        items: orderItems,
        shippingAddress: form,
        paymentMethod,
        notes
      });
      // Navigate to payment with order data
      navigate('/payment', { state: { order: data.order } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout page-enter">
      <div className="container">
        <div className="checkout__header">
          <span className="section-label">Checkout</span>
          <h1>Complete Your Order</h1>
        </div>

        <div className="checkout__layout">
          <form onSubmit={handleSubmit} className="checkout__form">
            {/* Shipping Address */}
            <div className="checkout__section">
              <h3 className="checkout__section-title">Shipping Address</h3>

              {/* Saved addresses */}
              {user?.addresses?.length > 0 && (
                <div className="checkout__saved-addresses">
                  {user.addresses.map(addr => (
                    <button type="button" key={addr._id}
                      className={`checkout__address-card ${form.street === addr.street ? 'active' : ''}`}
                      onClick={() => setForm({ fullName: addr.fullName, phone: addr.phone, street: addr.street, city: addr.city, state: addr.state, country: addr.country, postalCode: addr.postalCode || '' })}>
                      <strong>{addr.label}</strong>
                      <p>{addr.fullName}</p>
                      <p>{addr.street}, {addr.city}</p>
                    </button>
                  ))}
                </div>
              )}

              <div className="checkout__grid-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input name="fullName" value={form.fullName} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="form-control" required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input name="street" value={form.street} onChange={handleChange} className="form-control" required />
              </div>
              <div className="checkout__grid-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input name="city" value={form.city} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">State</label>
                  <input name="state" value={form.state} onChange={handleChange} className="form-control" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input name="postalCode" value={form.postalCode} onChange={handleChange} className="form-control" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input name="country" value={form.country} onChange={handleChange} className="form-control" required />
              </div>
            </div>

            {/* Order Notes */}
            <div className="checkout__section">
              <h3 className="checkout__section-title">Order Notes (Optional)</h3>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Any special instructions for your order..."
                className="form-control" />
            </div>

            {/* Payment Method */}
            <div className="checkout__section">
              <h3 className="checkout__section-title">Payment Method</h3>
              <div className="checkout__payment-option active">
                <div className="checkout__payment-radio" />
                <div>
                  <p className="checkout__payment-name">Paystack</p>
                  <p className="checkout__payment-desc">Pay securely with card, bank transfer, or USSD</p>
                </div>
                <div className="checkout__payment-icons">
                  <span>Visa</span><span>Mastercard</span><span>Verve</span>
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
              <Lock size={16} /> {loading ? 'Processing...' : 'Place Order & Pay'}
            </button>
          </form>

          {/* Order Summary */}
          <div className="checkout__summary">
            <h3 className="checkout__summary-title">Order Summary</h3>
            <div className="checkout__items">
              {items.map(item => (
                <div key={item.key} className="checkout__item">
                  <div className="checkout__item-img-wrap">
                    <img src={getProductImage(item.product)} alt={item.product.name} />
                    <span className="checkout__item-qty">{item.quantity}</span>
                  </div>
                  <div className="checkout__item-info">
                    <p className="checkout__item-name">{item.product.name}</p>
                    {item.size && <p className="checkout__item-variant">Size: {item.size}</p>}
                  </div>
                  <p className="checkout__item-price">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
            <div className="checkout__totals">
              <div className="checkout__total-row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="checkout__total-row"><span>Shipping</span><span>{shippingFee === 0 ? 'Free' : formatPrice(shippingFee)}</span></div>
              <div className="checkout__total-row checkout__total-row--final"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
