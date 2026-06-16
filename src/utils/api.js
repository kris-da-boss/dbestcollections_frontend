import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' }
});

// ─── Request Interceptor: attach JWT ─────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: handle 401 ────────────────────────
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Clear auth and redirect to login
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// ─── Auth endpoints ───────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  forgotPassword: (email) => API.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => API.put(`/auth/reset-password/${token}`, { password }),
  updatePassword: (data) => API.put('/auth/update-password', data),
  verifyEmail: (token) => API.get(`/auth/verify-email/${token}`)
};

// ─── Product endpoints ────────────────────────────────────────
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (slug) => API.get(`/products/${slug}`),
  getFeatured: () => API.get('/products/featured'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`)
};

// ─── Category endpoints ───────────────────────────────────────
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  update: (id, data) => API.put(`/categories/${id}`, data),
  delete: (id) => API.delete(`/categories/${id}`)
};

// ─── Order endpoints ──────────────────────────────────────────
export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: (params) => API.get('/orders/my-orders', { params }),
  getOne: (id) => API.get(`/orders/${id}`),
  cancel: (id, reason) => API.put(`/orders/${id}/cancel`, { reason }),
  // Admin
  getAll: (params) => API.get('/orders', { params }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data)
};

// ─── Payment endpoints ────────────────────────────────────────
export const paymentAPI = {
  initialize: (orderId) => API.post('/payments/initialize', { orderId }),
  verify: (reference) => API.get(`/payments/verify/${reference}`),
  getTransactions: (params) => API.get('/payments/transactions', { params })
};

// ─── User endpoints ───────────────────────────────────────────
export const userAPI = {
  updateProfile: (data) => API.put('/users/profile', data),
  addAddress: (data) => API.post('/users/addresses', data),
  updateAddress: (id, data) => API.put(`/users/addresses/${id}`, data),
  deleteAddress: (id) => API.delete(`/users/addresses/${id}`),
  getWishlist: () => API.get('/users/wishlist'),
  toggleWishlist: (productId) => API.post(`/users/wishlist/${productId}`),
  // Admin
  getAllUsers: (params) => API.get('/users', { params }),
  updateStatus: (id, data) => API.put(`/users/${id}/status`, data)
};

// ─── Review endpoints ─────────────────────────────────────────
export const reviewAPI = {
  create: (data) => API.post('/reviews', data),
  getForProduct: (productId, params) => API.get(`/reviews/product/${productId}`, { params }),
  update: (id, data) => API.put(`/reviews/${id}`, data),
  delete: (id) => API.delete(`/reviews/${id}`)
};

// ─── Blog endpoints ───────────────────────────────────────────
export const blogAPI = {
  getAll: (params) => API.get('/blog', { params }),
  getOne: (slug) => API.get(`/blog/${slug}`),
  create: (data) => API.post('/blog', data),
  update: (id, data) => API.put(`/blog/${id}`, data),
  delete: (id) => API.delete(`/blog/${id}`)
};

// ─── Admin endpoints ──────────────────────────────────────────
export const adminAPI = {
  getAnalytics: () => API.get('/admin/analytics')
};

export default API;
