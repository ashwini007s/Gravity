import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';
import {
  fetchCart,
  updateCartItemAPI,
  removeFromCartAPI,
} from '../services/api';

export default function CartPage() {
  const { token } = useAuthStore();
  const { cart, setCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadCart();
  }, [token]);

  const loadCart = async () => {
    try {
      const data = await fetchCart(token);
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQty = async (productId, newQty) => {
    try {
      const data = await updateCartItemAPI(productId, newQty, token);
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      const data = await removeFromCartAPI(productId, token);
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  const itemCount = cart?.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <div className="min-h-screen bg-[#030712] py-12 relative">
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-violet-600/[0.03] rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Shopping Cart</h1>
            <p className="text-slate-500 text-sm mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-slate-500 hover:text-violet-400 text-sm transition-colors cursor-pointer"
          >
            ← Continue Shopping
          </button>
        </div>

        {!cart || cart.items.length === 0 ? (
          <div className="text-center py-24 animate-fade-in-up">
            <div className="text-6xl mb-4">🛒</div>
            <p className="text-slate-300 text-xl font-medium mb-2">Your cart is empty</p>
            <p className="text-slate-500 text-sm mb-6">Looks like you haven't added anything yet.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 cursor-pointer hover:scale-105"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in-up">
            {cart.items.map((item, idx) => (
              <div
                key={item.productId?._id || item.productId}
                className="glass-card rounded-2xl p-5 flex items-center gap-5 group hover:border-violet-500/20 transition-all duration-300"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Image */}
                <img
                  src={
                    item.productId?.imageUrl ||
                    'https://placehold.co/80x80/0f172a/334155?text=Item'
                  }
                  alt={item.productId?.name || 'Product'}
                  className="w-20 h-20 object-cover rounded-xl border border-white/5"
                />

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-base truncate">
                    {item.productId?.name || 'Product'}
                  </h3>
                  <p className="text-slate-500 text-sm mt-0.5">
                    ${item.price.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity controls */}
                <div className="flex items-center bg-white/5 rounded-xl border border-white/5">
                  <button
                    onClick={() =>
                      handleUpdateQty(
                        item.productId?._id || item.productId,
                        item.quantity - 1
                      )
                    }
                    className="px-3 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 text-white font-medium text-sm border-x border-white/5">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      handleUpdateQty(
                        item.productId?._id || item.productId,
                        item.quantity + 1
                      )
                    }
                    className="px-3 py-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <p className="text-white font-bold text-lg min-w-[80px] text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>

                {/* Remove */}
                <button
                  onClick={() =>
                    handleRemove(item.productId?._id || item.productId)
                  }
                  className="text-slate-600 hover:text-red-400 transition-colors cursor-pointer p-1.5 hover:bg-red-500/10 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}

            {/* Summary */}
            <div className="glass-card rounded-2xl p-6 mt-6 animate-glow">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Subtotal ({itemCount} items)</span>
                <span className="text-slate-300 font-medium">${cart.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Shipping</span>
                <span className="text-emerald-400 font-medium text-sm">Free</span>
              </div>
              <div className="border-t border-white/5 my-4" />
              <div className="flex justify-between items-center mb-6">
                <span className="text-white text-lg font-semibold">Total</span>
                <span className="text-3xl font-bold text-gradient-green">
                  ${cart.totalPrice.toFixed(2)}
                </span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 cursor-pointer text-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
