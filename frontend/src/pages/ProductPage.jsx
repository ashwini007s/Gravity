import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, addToCartAPI, fetchCart } from '../services/api';
import useAuthStore from '../store/authStore';
import useCartStore from '../store/cartStore';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const { setCart } = useCartStore();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchProductById(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleAddToCart = async () => {
    if (!token) {
      navigate('/login');
      return;
    }
    setAdding(true);
    try {
      await addToCartAPI(product._id, quantity, token);
      const updatedCart = await fetchCart(token);
      setCart(updatedCart);
      setMessage('Added to cart!');
      setTimeout(() => setMessage(''), 2500);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-slate-400 text-lg">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] py-12 relative">
      {/* Background accent */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-violet-600/[0.04] rounded-full blur-[100px]" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-white mb-8 inline-flex items-center gap-2 transition-all duration-300 group cursor-pointer text-sm"
        >
          <span className="group-hover:-translate-x-1 transition-transform duration-300">←</span>
          Back to products
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
          {/* Image */}
          <div className="glass-card rounded-3xl overflow-hidden group">
            <img
              src={product.imageUrl || 'https://placehold.co/600x500/0f172a/334155?text=No+Image'}
              alt={product.name}
              className="w-full h-[500px] object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            <span className="inline-flex items-center bg-violet-500/10 text-violet-400 text-sm font-medium px-4 py-1.5 rounded-full w-fit mb-5 border border-violet-500/20">
              {product.category}
            </span>

            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight">
              {product.name}
            </h1>

            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* Price + Stock */}
            <div className="flex items-end gap-4 mb-8">
              <span className="text-5xl font-bold text-gradient-green">
                ${product.price.toFixed(2)}
              </span>
              <span className={`text-sm font-medium px-3 py-1 rounded-full mb-1 ${
                product.stockCount > 10
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : product.stockCount > 0
                  ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {product.stockCount > 0
                  ? `${product.stockCount} in stock`
                  : 'Out of stock'}
              </span>
            </div>

            {/* Quantity + Add to Cart */}
            {product.stockCount > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-slate-400 text-sm font-medium">
                    Quantity
                  </label>
                  <div className="flex items-center glass-card rounded-xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-3 text-slate-400 hover:text-white transition-colors cursor-pointer text-lg"
                    >
                      −
                    </button>
                    <span className="px-5 py-3 text-white font-semibold min-w-[50px] text-center border-x border-white/5">
                      {quantity}
                    </span>
                    <button
                      onClick={() =>
                        setQuantity(Math.min(product.stockCount, quantity + 1))
                      }
                      className="px-4 py-3 text-slate-400 hover:text-white transition-colors cursor-pointer text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding}
                  className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 hover:shadow-violet-500/40 disabled:opacity-50 cursor-pointer text-lg hover:scale-[1.02] active:scale-[0.98]"
                >
                  {adding ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Adding...
                    </span>
                  ) : (
                    'Add to Cart'
                  )}
                </button>
              </div>
            )}

            {/* Success Message */}
            {message && (
              <div className="mt-4 text-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-xl text-sm font-medium animate-fade-in-up">
                ✓ {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
