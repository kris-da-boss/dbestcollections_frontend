import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ChevronLeft, ZoomIn, Minus, Plus, Share2, Shield, Truck, RefreshCw } from 'lucide-react';
import { productAPI, reviewAPI, userAPI } from '../../utils/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../common/ProductCard';
import { formatPrice, formatDate, getStarArray } from '../../utils/helpers';
import toast from 'react-hot-toast';
import LoadingPage from '../common/LoadingPage';
import './ProductDetail.css';

const ProductDetail = () => {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const { isAuthenticated, user } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await productAPI.getOne(slug);
        setProduct(data.product);
        setRelated(data.related || []);
        setIsWishlisted(user?.wishlist?.includes(data.product._id) || false);
        // Load reviews separately
        const revRes = await reviewAPI.getForProduct(data.product._id);
        setReviews(revRes.data.reviews || []);
      } catch (err) {
        toast.error('Product not found');
      } finally {
        setLoading(false);
      }
    };
    load();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  };

  const handleAddToCart = () => {
    const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean))];
    if (sizes.length > 0 && !selectedSize) { toast.error('Please select a size'); return; }
    const colors = [...new Set(product.variants?.map(v => v.color).filter(Boolean))];
    if (colors.length > 0 && !selectedColor) { toast.error('Please select a color'); return; }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login to wishlist items'); return; }
    try {
      const { data } = await userAPI.toggleWishlist(product._id);
      setIsWishlisted(data.action === 'added');
      toast.success(data.message, { icon: data.action === 'added' ? '❤️' : '💔' });
    } catch { toast.error('Failed to update wishlist'); }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to leave a review'); return; }
    setSubmittingReview(true);
    try {
      await reviewAPI.create({ product: product._id, ...reviewForm });
      toast.success('Review submitted!');
      const revRes = await reviewAPI.getForProduct(product._id);
      setReviews(revRes.data.reviews || []);
      setReviewForm({ rating: 5, title: '', comment: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingPage />;
  if (!product) return <div className="loading-page"><p>Product not found.</p></div>;

  const effectivePrice = product.discountPrice && product.discountPrice < product.price ? product.discountPrice : product.price;
  const sizes = [...new Set(product.variants?.map(v => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants?.map(v => v.color).filter(Boolean))];
  const colorData = product.variants?.filter(v => v.color) || [];

  return (
    <div className="product-detail page-enter">
      {/* Breadcrumb */}
      <div className="container product-detail__breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <Link to={`/shop?type=${product.type}`}>{product.type}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      {/* Main Layout */}
      <div className="container product-detail__main">
        {/* Gallery */}
        <div className="product-detail__gallery">
          {/* Thumbnails */}
          <div className="product-detail__thumbs">
            {product.images.map((img, i) => (
              <button
                key={i}
                className={`product-detail__thumb ${selectedImage === i ? 'active' : ''}`}
                onClick={() => setSelectedImage(i)}
              >
                <img src={img.url} alt={img.alt || product.name} />
              </button>
            ))}
          </div>

          {/* Main Image with Zoom */}
          <div
            className={`product-detail__main-image ${zoomed ? 'zoomed' : ''}`}
            onMouseEnter={() => setZoomed(true)}
            onMouseLeave={() => setZoomed(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={product.images[selectedImage]?.url}
              alt={product.name}
              style={zoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`, transform: 'scale(2)' } : {}}
            />
            {!zoomed && (
              <div className="product-detail__zoom-hint">
                <ZoomIn size={14} /> Hover to zoom
              </div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="product-detail__info">
          {product.category?.name && <span className="product-detail__category">{product.category.name}</span>}
          <h1 className="product-detail__name">{product.name}</h1>

          {/* Rating */}
          {product.ratings?.count > 0 && (
            <div className="product-detail__rating">
              <div className="product-detail__stars">
                {getStarArray(product.ratings.average).map((type, i) => (
                  <Star key={i} size={14}
                    fill={type === 'full' ? 'var(--gold)' : type === 'half' ? 'url(#half)' : 'none'}
                    stroke={type === 'empty' ? 'var(--muted)' : 'var(--gold)'}
                  />
                ))}
              </div>
              <span className="product-detail__rating-text">
                {product.ratings.average} ({product.ratings.count} reviews)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="product-detail__prices">
            <span className="product-detail__price">{formatPrice(effectivePrice)}</span>
            {product.discountPrice && product.discountPrice < product.price && (
              <>
                <span className="product-detail__original">{formatPrice(product.price)}</span>
                <span className="badge badge-error" style={{ fontSize: '0.72rem' }}>
                  Save {Math.round(((product.price - product.discountPrice) / product.price) * 100)}%
                </span>
              </>
            )}
          </div>

          <p className="product-detail__short-desc">{product.shortDescription || product.description?.slice(0, 200)}</p>

          <div className="product-detail__divider" />

          {/* Color Selector */}
          {colorData.length > 0 && (
            <div className="product-detail__option">
              <span className="product-detail__option-label">Color: <strong>{selectedColor}</strong></span>
              <div className="product-detail__colors">
                {[...new Set(colorData.map(v => JSON.stringify({ color: v.color, hex: v.colorHex })))].map(c => {
                  const { color, hex } = JSON.parse(c);
                  return (
                    <button key={color}
                      className={`product-detail__color-btn ${selectedColor === color ? 'active' : ''}`}
                      style={{ background: hex || '#ccc' }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {sizes.length > 0 && (
            <div className="product-detail__option">
              <span className="product-detail__option-label">Size: <strong>{selectedSize}</strong></span>
              <div className="product-detail__sizes">
                {sizes.map(size => (
                  <button key={size}
                    className={`product-detail__size-btn ${selectedSize === size ? 'active' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="product-detail__option">
            <span className="product-detail__option-label">Quantity</span>
            <div className="product-detail__qty">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="product-detail__qty-btn"><Minus size={14} /></button>
              <span className="product-detail__qty-val">{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="product-detail__qty-btn"><Plus size={14} /></button>
            </div>
          </div>

          {/* Actions */}
          <div className="product-detail__actions">
            <button className="btn btn-primary btn-lg product-detail__add-btn" onClick={handleAddToCart}>
              <ShoppingBag size={18} /> Add to Cart
            </button>
            <button
              className={`btn-icon ${isWishlisted ? 'btn-icon--active' : ''}`}
              onClick={handleWishlist}
              style={{ width: 52, height: 52 }}
              aria-label="Wishlist"
            >
              <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
            </button>
            <button className="btn-icon" style={{ width: 52, height: 52 }} aria-label="Share"
              onClick={() => navigator.share?.({ title: product.name, url: window.location.href }) || navigator.clipboard?.writeText(window.location.href).then(() => toast.success('Link copied!'))}>
              <Share2 size={18} />
            </button>
          </div>

          {/* Trust Badges */}
          <div className="product-detail__trust">
            {[
              { Icon: Truck, text: 'Free shipping over ₦50,000' },
              { Icon: Shield, text: 'Authentic luxury product' },
              { Icon: RefreshCw, text: '14-day easy returns' }
            ].map(({ Icon, text }) => (
              <div key={text} className="product-detail__trust-item">
                <Icon size={14} /> {text}
              </div>
            ))}
          </div>

          {/* Meta */}
          <div className="product-detail__meta">
            {product.brand && <p><span>Brand:</span> {product.brand}</p>}
            {product.material && <p><span>Material:</span> {product.material}</p>}
            <p><span>Category:</span> {product.category?.name}</p>
            {product.tags?.length > 0 && (
              <p><span>Tags:</span> {product.tags.join(', ')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Description / Features / Reviews */}
      <div className="container product-detail__tabs-wrap">
        <div className="product-detail__tabs">
          {['description', 'features', 'reviews'].map(tab => (
            <button key={tab} className={`product-detail__tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'reviews' && product.ratings?.count > 0 && ` (${product.ratings.count})`}
            </button>
          ))}
        </div>

        <div className="product-detail__tab-content">
          {activeTab === 'description' && (
            <div className="product-detail__description">
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === 'features' && (
            <ul className="product-detail__features">
              {product.features?.length > 0
                ? product.features.map((f, i) => <li key={i}>{f}</li>)
                : <li>No features listed for this product.</li>
              }
            </ul>
          )}
          {activeTab === 'reviews' && (
            <div className="product-detail__reviews">
              {/* Review Form */}
              {isAuthenticated && (
                <form onSubmit={handleReviewSubmit} className="review-form">
                  <h4>Leave a Review</h4>
                  <div className="review-form__stars">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={24}
                        fill={s <= reviewForm.rating ? 'var(--gold)' : 'none'}
                        stroke={s <= reviewForm.rating ? 'var(--gold)' : 'var(--muted)'}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setReviewForm(f => ({ ...f, rating: s }))}
                      />
                    ))}
                  </div>
                  <div className="form-group">
                    <input type="text" placeholder="Review title (optional)" value={reviewForm.title}
                      onChange={e => setReviewForm(f => ({ ...f, title: e.target.value }))} className="form-control" />
                  </div>
                  <div className="form-group">
                    <textarea rows={4} placeholder="Share your experience..." value={reviewForm.comment}
                      onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                      className="form-control" required />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p style={{ color: 'var(--muted)' }}>No reviews yet. Be the first to review this product!</p>
                ) : reviews.map(review => (
                  <div key={review._id} className="review-item">
                    <div className="review-item__header">
                      <div className="review-item__avatar">
                        {review.user?.firstName?.[0] || 'U'}
                      </div>
                      <div>
                        <p className="review-item__name">{review.user?.firstName} {review.user?.lastName}</p>
                        <p className="review-item__date">{formatDate(review.createdAt)}</p>
                      </div>
                      {review.isVerifiedPurchase && <span className="badge badge-success" style={{ marginLeft: 'auto' }}>Verified Purchase</span>}
                    </div>
                    <div className="review-item__stars">
                      {[1,2,3,4,5].map(s => <Star key={s} size={13} fill={s <= review.rating ? 'var(--gold)' : 'none'} stroke={s <= review.rating ? 'var(--gold)' : 'var(--muted)'} />)}
                    </div>
                    {review.title && <p className="review-item__title">{review.title}</p>}
                    <p className="review-item__text">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <span className="section-label">You May Also Like</span>
            <h2 className="section-title">Related Products</h2>
            <div className="divider" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {related.map(p => <ProductCard key={p._id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
