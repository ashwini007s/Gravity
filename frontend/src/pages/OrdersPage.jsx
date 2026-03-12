import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { fetchOrders } from '../services/api';

export default function OrdersPage() {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    loadOrders();
  }, [token]);

  const loadOrders = async () => {
    try {
      const data = await fetchOrders(token);
      setOrders(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    Pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: '⏳' },
    Completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '✓' },
    Failed: { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: '✕' },
    Processing: { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: '⚙' },
    Shipped: { color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', icon: '📦' },
    Delivered: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: '✓' },
  };

  const getStatus = (status) => statusConfig[status] || { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: '•' };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] py-12 relative">
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-fuchsia-600/[0.03] rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Order History</h1>
            <p className="text-slate-500 text-sm mt-1">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-24 animate-fade-in-up">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-slate-300 text-xl font-medium mb-2">No orders yet</p>
            <p className="text-slate-500 text-sm mb-6">Your order history will appear here.</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white px-8 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-violet-500/20 cursor-pointer hover:scale-105"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4 stagger-children">
            {orders.map((order) => {
              const payStatus = getStatus(order.paymentStatus);
              const delStatus = getStatus(order.deliveryStatus);

              return (
                <div
                  key={order._id}
                  className="glass-card rounded-2xl p-6 hover:border-white/10 transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                    <div>
                      <p className="text-slate-600 text-xs font-mono tracking-wider">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-slate-400 text-sm mt-1.5">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${payStatus.bg} ${payStatus.color} ${payStatus.border} flex items-center gap-1.5`}>
                        <span>{payStatus.icon}</span> {order.paymentStatus}
                      </span>
                      <span className={`text-xs font-medium px-3 py-1.5 rounded-full border ${delStatus.bg} ${delStatus.color} ${delStatus.border} flex items-center gap-1.5`}>
                        <span>{delStatus.icon}</span> {order.deliveryStatus}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="bg-white/[0.02] rounded-xl p-4 mb-4">
                    {order.orderItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-sm py-2 border-b border-white/[0.03] last:border-0"
                      >
                        <span className="text-slate-300 flex items-center gap-2">
                          <span className="text-slate-600">×{item.quantity}</span>
                          {item.name}
                        </span>
                        <span className="text-slate-400 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center">
                    <div className="text-slate-600 text-xs flex items-center gap-1.5">
                      <span>📍</span>
                      {order.shippingAddress.address}, {order.shippingAddress.city}
                    </div>
                    <span className="text-xl font-bold text-white">
                      ${order.totalPrice.toFixed(2)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
