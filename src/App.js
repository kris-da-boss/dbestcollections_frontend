import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';
import LoadingPage from './components/common/LoadingPage';

// ─── Lazy-loaded pages ───────────────────────────────────────────
const Home = lazy(() => import('./components/home/Home'));
const Shop = lazy(() => import('./components/shop/Shop'));
const ProductDetail = lazy(() => import('./components/shop/ProductDetail'));
const Cart = lazy(() => import('./components/cart/Cart'));
const Checkout = lazy(() => import('./components/cart/Checkout'));
const Wishlist = lazy(() => import('./components/cart/Wishlist'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./components/auth/VerifyEmail'));
const UserDashboard = lazy(() => import('./components/dashboard/UserDashboard'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./components/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./components/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./components/admin/AdminUsers'));
const AdminCategories = lazy(() => import('./components/admin/AdminCategories'));
const BlogList = lazy(() => import('./components/blog/BlogList'));
const BlogPost = lazy(() => import('./components/blog/BlogPost'));
const About = lazy(() => import('./components/pages/About'));
const Contact = lazy(() => import('./components/pages/Contact'));
const FAQ = lazy(() => import('./components/pages/FAQ'));
const Privacy = lazy(() => import('./components/pages/Privacy'));
const Terms = lazy(() => import('./components/pages/Terms'));
const SearchResults = lazy(() => import('./components/shop/SearchResults'));
const PaymentSuccess = lazy(() => import('./components/cart/PaymentSuccess'));
const PaymentFail = lazy(() => import('./components/cart/PaymentFail'));
const PaymentPage = lazy(() => import('./components/cart/PaymentPage'));
const NotFound = lazy(() => import('./components/pages/NotFound'));

// ─── Route Guards ────────────────────────────────────────────────
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingPage />;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useAuth();
  if (loading) return <LoadingPage />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return children;
};

const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <LoadingPage />;
  return !isAuthenticated ? children : <Navigate to="/" replace />;
};

// ─── App Component ───────────────────────────────────────────────
function AppRoutes() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Public routes with main layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/category/:slug" element={<Shop />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/payment/failed" element={<PaymentFail />} />

          {/* Guest only */}
          <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
          <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
          <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
          <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />

          {/* Private routes */}
          <Route path="/wishlist" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
          <Route path="/checkout" element={<PrivateRoute><Checkout /></PrivateRoute>} />
          <Route path="/payment" element={<PrivateRoute><PaymentPage /></PrivateRoute>} />
          <Route path="/dashboard/*" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        </Route>

        {/* Admin routes with admin layout */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1a1a1a',
                color: '#f5f0e8',
                border: '1px solid #2d2d2d',
                fontFamily: "'Jost', sans-serif"
              },
              success: { iconTheme: { primary: '#c9a84c', secondary: '#0a0a0a' } },
              error: { iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' } }
            }}
          />
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
