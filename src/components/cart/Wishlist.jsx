import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { userAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import ProductCard from '../common/ProductCard';
import LoadingPage from '../common/LoadingPage';
import toast from 'react-hot-toast';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const loadWishlist = async () => {
    try {
      const { data } = await userAPI.getWishlist();
      setWishlist(data.wishlist || []);
    } catch { toast.error('Failed to load wishlist'); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadWishlist(); }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="page-enter" style={{ padding: '40px 0 80px' }}>
      <div className="container">
        <div style={{ marginBottom: 40 }}>
          <span className="section-label">My Wishlist</span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem' }}>
            Saved Items ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <Heart size={60} strokeWidth={1} style={{ color: 'var(--muted)' }} />
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem' }}>Your wishlist is empty</h2>
            <p style={{ color: 'var(--muted)' }}>Save items you love to come back to them later.</p>
            <Link to="/shop" className="btn btn-primary btn-lg">Browse Products</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {wishlist.map(product => (
              <div key={product._id} style={{ position: 'relative' }}>
                <ProductCard product={product} />
                <button
                  className="btn btn-dark btn-sm"
                  style={{ width: '100%', marginTop: 8 }}
                  onClick={() => addToCart(product, 1)}
                >
                  <ShoppingBag size={14} /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
