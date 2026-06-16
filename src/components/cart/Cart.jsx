// Cart.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { formatPrice, getProductImage } from '../../utils/helpers';
import './Cart.css';

const Cart = () => {
  const { items, itemCount, subtotal, shippingFee, total, removeFromCart, updateQuantity } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) { navigate('/login?redirect=/checkout'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty page-enter">
        <div className="container cart-empty__inner">
          <ShoppingBag size={60} strokeWidth={1} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="btn btn-primary btn-lg">Start Shopping <ArrowRight size={18} /></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page page-enter">
      <div className="container">
        <div className="cart-page__header">
          <span className="section-label">Shopping Bag</span>
          <h1>Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})</h1>
        </div>

        <div className="cart-page__layout">
          {/* Items */}
          <div className="cart-items">
            {items.map(item => (
              <div key={item.key} className="cart-item">
                <div className="cart-item__image">
                  <img src={getProductImage(item.product)} alt={item.product.name} />
                </div>
                <div className="cart-item__info">
                  <Link to={`/product/${item.product.slug}`} className="cart-item__name">{item.product.name}</Link>
                  <div className="cart-item__variants">
                    {item.size && <span>Size: {item.size}</span>}
                    {item.color && <span>Color: {item.color}</span>}
                  </div>
                  <p className="cart-item__price">{formatPrice(item.price)}</p>
                </div>
                <div className="cart-item__controls">
                  <div className="cart-item__qty">
                    <button onClick={() => updateQuantity(item.key, item.quantity - 1)} disabled={item.quantity <= 1}><Minus size={12} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.key, item.quantity + 1)}><Plus size={12} /></button>
                  </div>
                  <p className="cart-item__subtotal">{formatPrice(item.price * item.quantity)}</p>
                  <button className="cart-item__remove" onClick={() => removeFromCart(item.key)} aria-label="Remove"><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="cart-summary">
            <h3 className="cart-summary__title">Order Summary</h3>
            <div className="cart-summary__rows">
              <div className="cart-summary__row"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="cart-summary__row">
                <span>Shipping</span>
                <span>{shippingFee === 0 ? <span style={{color:'var(--success)'}}>Free</span> : formatPrice(shippingFee)}</span>
              </div>
              {shippingFee > 0 && <p className="cart-summary__shipping-note">Add {formatPrice(50000 - subtotal)} more for free shipping</p>}
            </div>
            <div className="cart-summary__divider" />
            <div className="cart-summary__total"><span>Total</span><span>{formatPrice(total)}</span></div>
            <button className="btn btn-primary btn-full btn-lg" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight size={18} />
            </button>
            <Link to="/shop" className="btn btn-ghost btn-full" style={{ marginTop: 10 }}>Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
