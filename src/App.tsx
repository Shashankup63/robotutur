import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, LogOut, Menu, X, Cpu, Bot, Zap, Radio, Layers } from 'lucide-react';
import { useState } from 'react';
import { RootState, AppDispatch } from './store';
import { logout } from './store/slices/authSlice';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import AdminDashboard from './pages/AdminDashboard';
import Orders from './pages/Orders';

function Navbar() {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="bg-zinc-950 text-white border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="p-1.5 bg-emerald-500 rounded-lg group-hover:rotate-12 transition-transform">
                <Bot className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tighter">ROBOTUTUR</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link to="/products" className="hover:text-emerald-400 transition-colors text-sm font-medium uppercase tracking-wider">Shop</Link>
              {isAuthenticated && (
                <Link to="/orders" className="hover:text-emerald-400 transition-colors text-sm font-medium uppercase tracking-wider">Orders</Link>
              )}
              {user?.role === 'ADMIN' && (
                <Link to="/admin" className="hover:text-emerald-400 transition-colors text-sm font-medium uppercase tracking-wider">Admin</Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition-colors">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-medium">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-emerald-400 transition-colors">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
             <Link to="/cart" className="relative p-2">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-white/10 px-4 pt-2 pb-6 space-y-4">
          <Link to="/products" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Shop</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="block text-lg font-medium" onClick={() => setIsMenuOpen(false)}>Admin</Link>
          )}
          <div className="pt-4 border-t border-white/10">
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-emerald-400" />
                  <span className="text-lg">{user?.name}</span>
                </div>
                <button onClick={handleLogout} className="w-full text-left text-lg text-zinc-400">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="block text-lg font-medium text-emerald-400" onClick={() => setIsMenuOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="bg-zinc-950 text-white py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Bot className="w-8 h-8 text-emerald-500" />
              <span className="text-2xl font-bold tracking-tighter">ROBOTUTUR</span>
            </div>
            <p className="text-zinc-400 max-w-md leading-relaxed">
              Empowering the next generation of engineers with premium robotics kits, 
              IoT modules, and embedded systems hardware. Build the future, today.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-emerald-500">Categories</h4>
            <ul className="space-y-4 text-zinc-400">
              <li><Link to="/products?cat=Robotics" className="hover:text-white transition-colors">Robotics Kits</Link></li>
              <li><Link to="/products?cat=IoT" className="hover:text-white transition-colors">IoT Modules</Link></li>
              <li><Link to="/products?cat=Drones" className="hover:text-white transition-colors">Drone Hardware</Link></li>
              <li><Link to="/products?cat=Embedded" className="hover:text-white transition-colors">Embedded Systems</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest mb-6 text-emerald-500">Support</h4>
            <ul className="space-y-4 text-zinc-400">
              <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-white/5 text-center text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} Robotutur. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-zinc-900 text-zinc-100 font-sans">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
