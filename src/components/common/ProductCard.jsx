import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Eye } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { userAPI } from '../../utils/api';
import { formatPrice, getProductImage, getDiscountPercent } from '../../utils/helpers';
import toast from 'react-hot-toast';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { isAuthenticated, user } = useAuth();
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(
    user?.wishlist?.includes(product._id) || false
  );
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  const discountPercent = getDiscountPercent(product.price, product.discountPrice);
  const effectivePrice = product.discountPrice && product.discountPrice < product.price
    ? product.discountPrice : product.price;

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please login to add to wishlist'); return; }
    setWishlistLoading(true);
    try {
      const { data } = await userAPI.toggleWishlist(product._id);
      setIsWishlisted(data.action === 'added');
      toast.success(data.message, { icon: data.action === 'added' ? '❤️' : '💔' });
    } catch {
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product.slug}`} className="product-card__image-wrap">
        <img
          src={imgError ? 'https://placehold.co/400x500?text=No+Image' : getProductImage(product)}
          alt={product.name}
          className="product-card__image product-card__image--main"
          onError={() => setImgError(true)}
          loading="lazy"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1].url}
            alt={product.name + ' alt'}
            className="product-card__image product-card__image--hover"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="product-card__badges">
          {product.isNew && <span className="product-card__badge product-card__badge--new">New</span>}
          {discountPercent > 0 && (
            <span className="product-card__badge product-card__badge--sale">-{discountPercent}%</span>
          )}
          {product.isBestseller && (
            <span className="product-card__badge product-card__badge--best">Best Seller</span>
          )}
        </div>

        {/* Overlay actions */}
        <div className="product-card__overlay">
          <button
            className={`product-card__action ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlist}
            disabled={wishlistLoading}
            aria-label="Wishlist"
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <button
            className="product-card__action product-card__action--cart"
            onClick={handleAddToCart}
            aria-label="Add to Cart"
          >
            <ShoppingBag size={16} />
          </button>
          <Link
            to={`/product/${product.slug}`}
            className="product-card__action"
            onClick={e => e.stopPropagation()}
            aria-label="Quick view"
          >
            <Eye size={16} />
          </Link>
        </div>
      </Link>

      <div className="product-card__info">
        {product.category?.name && (
          <span className="product-card__category">{product.category.name}</span>
        )}
        <h3 className="product-card__name">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>

        {/* Rating */}
        {product.ratings?.count > 0 && (
          <div className="product-card__rating">
            <div className="product-card__stars">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={11}
                  fill={s <= Math.round(product.ratings.average) ? 'var(--gold)' : 'none'}
                  stroke={s <= Math.round(product.ratings.average) ? 'var(--gold)' : 'var(--muted)'}
                />
              ))}
            </div>
            <span className="product-card__rating-count">({product.ratings.count})</span>
          </div>
        )}

        <div className="product-card__prices">
          <span className="product-card__price">{formatPrice(effectivePrice)}</span>
          {discountPercent > 0 && (
            <span className="product-card__original">{formatPrice(product.price)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
