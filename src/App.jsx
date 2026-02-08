import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Components
import Header from './components/Header';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ParticleBackground from './components/ParticleBackground';

// Pages
import HomePage from './pages/HomePage';
import MenPage from './pages/MenPage';
import WomenPage from './pages/WomenPage';
import CheckoutPage from './pages/CheckoutPage';
import AdminDashboard from './pages/AdminDashboard';

// Page transition wrapper
function AnimatedRoutes({ cart, setCart, wishlist, setWishlist, cartOpen, setCartOpen }) {
  const location = useLocation();

  // Don't show header/footer on admin page
  const isAdminPage = location.pathname === '/admin';

  if (isAdminPage) {
    return (
      <Routes location={location}>
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <Routes location={location}>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/men"
            element={
              <MenPage
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
              />
            }
          />
          <Route
            path="/women"
            element={
              <WomenPage
                cart={cart}
                setCart={setCart}
                wishlist={wishlist}
                setWishlist={setWishlist}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                cart={cart}
                setCart={setCart}
              />
            }
          />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

function AppContent() {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const location = useLocation();

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('vipCart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) { }
    }
    const savedWishlist = localStorage.getItem('vipWishlist');
    if (savedWishlist) {
      try { setWishlist(JSON.parse(savedWishlist)); } catch (e) { }
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('vipCart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('vipWishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const isAdminPage = location.pathname === '/admin';

  // Admin page has its own layout
  if (isAdminPage) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Header */}
      <Header
        cartCount={cartCount}
        onCartClick={() => setCartOpen(true)}
      />

      {/* Main Content with Page Transitions */}
      <main className="relative z-10 pt-28 lg:pt-32">
        <AnimatedRoutes
          cart={cart}
          setCart={setCart}
          wishlist={wishlist}
          setWishlist={setWishlist}
          cartOpen={cartOpen}
          setCartOpen={setCartOpen}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Drawer */}
      <CartDrawer
        cart={cart}
        setCart={setCart}
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;