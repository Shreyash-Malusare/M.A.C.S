import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Cart } from './components/Cart';
import { Navbar } from './components/navigation/Navbar';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { Footer } from './components/Footer';
import { ScrollToTop } from './components/ScrollToTop';
import { Chatbot } from './components/Chatbot';
import { HomePage } from './pages/HomePage';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { Dashboard } from './pages/user/Dashboard';
import { CartItem, Product } from './types';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import {Checkout} from  './components/payment/checkout';
// Create a wrapper component that uses hooks
function AppContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.productId._id === product._id);
      if (existingItem) {
        return prev.map(item =>
          item.productId._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { 
        _id: product._id, // Use product ID as cart item ID
        productId: product, // Ensure correct property name
        quantity: 1 
      }];
    });
    setIsCartOpen(true);
  };  
  

  const updateCartItemQuantity = (id: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item._id === id
          ? { ...item, quantity }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeCartItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item._id !== id));
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setIsLoginOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors">
      <Navbar
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={setSearchQuery}
        onProfileClick={handleProfileClick}
        searchQuery={searchQuery}
        isLoggedIn={!!user}
      />

      <main className="flex-1 text-gray-900 dark:text-gray-100">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:category" element={<CategoryPage searchQuery={searchQuery} onAddToCart={addToCart} />} />
          <Route path="/product/:id" element={<ProductPage/>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </main>

      <Footer />

      <Cart
        items={cartItems}
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateCartItemQuantity}
        onRemoveItem={removeCartItem}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <ScrollToTop />
      <Chatbot />
    </div>
  );
}

// Main App component that provides context
export default function App() {
  return (
    <Router> {/* Move Router to wrap everything */}
      <AuthProvider> {/* Now useNavigate is inside Router */}
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}
