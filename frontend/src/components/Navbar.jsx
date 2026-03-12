import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const { cart } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const cartCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      isActive(path)
        ? 'text-white bg-white/10'
        : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`;

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5">
      {/* Glassmorphism background */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-500 group-hover:scale-105">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              Shop<span className="text-gradient-purple">Verse</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className={navLinkClass('/')}>
              Products
            </Link>

            {user ? (
              <>
                <Link to="/cart" className={navLinkClass('/cart')}>
                  <span className="flex items-center gap-1.5">
                    Cart
                    {cartCount > 0 && (
                      <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1.5 shadow-lg shadow-violet-500/30">
                        {cartCount}
                      </span>
                    )}
                  </span>
                </Link>
                <Link to="/orders" className={navLinkClass('/orders')}>
                  Orders
                </Link>
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className={`${navLinkClass('/admin')} !text-amber-400 hover:!text-amber-300`}
                  >
                    ⚡ Admin
                  </Link>
                )}

                <div className="w-px h-6 bg-white/10 mx-2" />

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-violet-500/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-300 text-sm font-medium hidden lg:block">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-slate-500 hover:text-red-400 text-sm transition-all duration-300 hover:bg-red-500/10 px-3 py-1.5 rounded-lg cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-400 hover:text-white p-2 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-1 animate-fade-in-up">
            <Link to="/" className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Products</Link>
            {user ? (
              <>
                <Link to="/cart" className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Cart {cartCount > 0 && `(${cartCount})`}</Link>
                <Link to="/orders" className="block px-3 py-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>Orders</Link>
                {user.role === 'admin' && <Link to="/admin" className="block px-3 py-2 text-amber-400 hover:bg-white/5 rounded-lg text-sm" onClick={() => setMobileOpen(false)}>⚡ Admin</Link>}
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="block w-full text-left px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm cursor-pointer">Logout</button>
              </>
            ) : (
              <Link to="/login" className="block px-3 py-2 text-violet-400 hover:bg-white/5 rounded-lg text-sm font-medium" onClick={() => setMobileOpen(false)}>Sign In</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
