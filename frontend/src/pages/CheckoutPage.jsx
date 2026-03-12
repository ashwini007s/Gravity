import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import { placeOrderAPI } from '../services/api';

export default function CheckoutPage() {
  const { token } = useAuthStore();
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!token) {
      navigate('/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await placeOrderAPI({ address, city, postalCode, country }, token);
      clearCart();
      navigate('/orders');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center animate-fade-in-up">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-slate-300 text-xl font-medium mb-2">Your cart is empty</p>
          <p className="text-slate-500 text-sm mb-6">Add some items before checking out.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 cursor-pointer hover:scale-105"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] py-12 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/[0.03] rounded-full blur-[100px]" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 text-xs font-bold">✓</div>
            <span className="text-slate-400 text-sm">Cart</span>
          </div>
          <div className="w-12 h-px bg-violet-500/30" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-bold">2</div>
            <span className="text-white text-sm font-medium">Checkout</span>
          </div>
          <div className="w-12 h-px bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 text-xs font-bold">3</div>
            <span className="text-slate-600 text-sm">Complete</span>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Shipping Form — 3 cols */}
          <div className="lg:col-span-3">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
                <span>📍</span> Shipping Address
              </h2>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-5 text-sm flex items-center gap-2">
                  <span>⚠️</span> {error}
                </div>
              )}

              <form onSubmit={handlePlaceOrder} className="space-y-4" id="checkout-form">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all duration-300"
                    placeholder="123 Main St, Apt 4B"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">
                      City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all duration-300"
                      placeholder="Mumbai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all duration-300"
                      placeholder="400001"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/30 transition-all duration-300"
                    placeholder="India"
                  />
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary — 2 cols */}
          <div className="lg:col-span-2">
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-white mb-5">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {cart.items.map((item) => (
                  <div
                    key={item.productId?._id || item.productId}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-400 truncate pr-2 flex-1">
                      {item.productId?.name || 'Item'} <span className="text-slate-600">×{item.quantity}</span>
                    </span>
                    <span className="text-slate-300 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="text-slate-300">${cart.totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Shipping</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="border-t border-white/5 pt-3 mt-3">
                  <div className="flex justify-between">
                    <span className="text-white font-semibold">Total</span>
                    <span className="text-xl font-bold text-gradient-green">${cart.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 disabled:opacity-50 cursor-pointer text-base mt-6 hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  `Place Order • $${cart.totalPrice.toFixed(2)}`
                )}
              </button>

              <p className="text-slate-600 text-xs text-center mt-4">
                🔒 Your data is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
