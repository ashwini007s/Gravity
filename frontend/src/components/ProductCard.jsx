import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative bg-slate-900/50 rounded-2xl overflow-hidden border border-white/5 hover:border-violet-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-violet-500/10 hover:-translate-y-2"
    >
      {/* Hover glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-fuchsia-600/0 group-hover:from-violet-600/5 group-hover:to-fuchsia-600/5 transition-all duration-500 z-0" />

      <div className="relative z-10">
        {/* Image */}
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.imageUrl || 'https://placehold.co/400x300/0f172a/334155?text=No+Image'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="bg-white/10 backdrop-blur-md text-white text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/10">
              {product.category}
            </span>
          </div>

          {/* Out of stock overlay */}
          {product.stockCount <= 0 && (
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-red-500/20 border border-red-500/30 text-red-400 font-semibold text-sm px-4 py-2 rounded-xl">
                Out of Stock
              </span>
            </div>
          )}

          {/* Quick view hint */}
          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <span className="bg-white/10 backdrop-blur-md text-white text-xs font-medium px-3 py-1.5 rounded-full border border-white/10">
              View Details →
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-white font-semibold text-base mb-1.5 group-hover:text-violet-300 transition-colors duration-300 truncate">
            {product.name}
          </h3>
          <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
          <div className="flex items-end justify-between">
            <div>
              <span className="text-2xl font-bold text-gradient-green">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
              product.stockCount > 10
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : product.stockCount > 0
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {product.stockCount > 0 ? `${product.stockCount} left` : 'Sold out'}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
