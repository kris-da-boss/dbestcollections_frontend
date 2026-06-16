// Format price in Naira
export const formatPrice = (amount) => {
  if (amount == null) return '₦0';
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// Format date
export const formatDate = (dateStr, options = {}) => {
  const defaults = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString('en-NG', { ...defaults, ...options });
};

// Truncate text
export const truncate = (str, n = 100) =>
  str?.length > n ? str.slice(0, n) + '...' : str;

// Get first image URL from product
export const getProductImage = (product, index = 0) =>
  product?.images?.[index]?.url || 'https://placehold.co/400x400?text=No+Image';

// Calculate discount percentage
export const getDiscountPercent = (price, discountPrice) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

// Order status colors and labels
export const ORDER_STATUS = {
  pending: { label: 'Pending', color: '#f59e0b', bg: '#fef3c7' },
  confirmed: { label: 'Confirmed', color: '#3b82f6', bg: '#dbeafe' },
  processing: { label: 'Processing', color: '#8b5cf6', bg: '#ede9fe' },
  shipped: { label: 'Shipped', color: '#06b6d4', bg: '#cffafe' },
  delivered: { label: 'Delivered', color: '#10b981', bg: '#d1fae5' },
  cancelled: { label: 'Cancelled', color: '#ef4444', bg: '#fee2e2' },
  returned: { label: 'Returned', color: '#6b7280', bg: '#f3f4f6' }
};

export const PAYMENT_STATUS = {
  pending: { label: 'Pending', color: '#f59e0b' },
  paid: { label: 'Paid', color: '#10b981' },
  failed: { label: 'Failed', color: '#ef4444' },
  refunded: { label: 'Refunded', color: '#6b7280' }
};

// Star rating array
export const getStarArray = (rating) => {
  return Array.from({ length: 5 }, (_, i) => {
    if (i < Math.floor(rating)) return 'full';
    if (i < rating) return 'half';
    return 'empty';
  });
};

// Debounce
export const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

// Validate email
export const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Scroll to top
export const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
