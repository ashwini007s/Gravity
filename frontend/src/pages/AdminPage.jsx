import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from '../services/api';

export default function AdminPage() {
  const { user, token } = useAuthStore();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockCount: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    loadProducts();
  }, [user]);

  const loadProducts = async () => {
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      imageUrl: '',
      stockCount: '',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingProduct(null);
    setShowForm(false);
    setFormError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      imageUrl: product.imageUrl || '',
      stockCount: product.stockCount.toString(),
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || '');
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFileSelect = (file) => {
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');
    try {
      let imageUrl = form.imageUrl;

      // Upload image file if selected
      if (imageFile) {
        setUploading(true);
        const uploadRes = await uploadImage(imageFile, token);
        imageUrl = `http://localhost:5000${uploadRes.imageUrl}`;
        setUploading(false);
      }

      const payload = {
        ...form,
        imageUrl,
        price: parseFloat(form.price),
        stockCount: parseInt(form.stockCount),
      };

      if (editingProduct) {
        await updateProduct(editingProduct._id, payload, token);
      } else {
        await createProduct(payload, token);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      setUploading(false);
      setFormError(err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?'))
      return;
    try {
      await deleteProduct(id, token);
      loadProducts();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">
            Admin — Manage Products
          </h1>
          <button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 cursor-pointer"
          >
            {showForm ? 'Cancel' : '+ Add Product'}
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50 mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">
              {editingProduct ? 'Edit Product' : 'New Product'}
            </h2>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">
                {formError}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="Product name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Category
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="e.g. Electronics"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  rows="3"
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Price ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="29.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Stock Count
                </label>
                <input
                  type="number"
                  value={form.stockCount}
                  onChange={(e) =>
                    setForm({ ...form, stockCount: e.target.value })
                  }
                  required
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="100"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Product Image
                </label>

                {/* File Upload Area */}
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  onClick={() => fileInputRef.current?.click()}
                  className="relative border-2 border-dashed border-slate-600 hover:border-purple-500 rounded-xl p-6 text-center cursor-pointer transition-all duration-300 bg-slate-900/30 hover:bg-slate-900/50 group"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileSelect(e.target.files[0])}
                    className="hidden"
                  />

                  {imagePreview ? (
                    <div className="flex items-center gap-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded-xl border border-slate-600"
                      />
                      <div className="text-left flex-1">
                        <p className="text-white text-sm font-medium">
                          {imageFile ? imageFile.name : 'Current image'}
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                          {imageFile
                            ? `${(imageFile.size / 1024).toFixed(1)} KB`
                            : 'Click or drop to replace'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImageFile(null);
                          setImagePreview('');
                          setForm({ ...form, imageUrl: '' });
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="text-red-400 hover:text-red-300 text-sm transition-colors cursor-pointer"
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                        📁
                      </div>
                      <p className="text-slate-300 text-sm font-medium">
                        Click to browse or drag & drop
                      </p>
                      <p className="text-slate-500 text-xs mt-1">
                        PNG, JPG, GIF, WEBP up to 5MB
                      </p>
                    </>
                  )}
                </div>

                {/* OR divider + URL fallback */}
                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-slate-700" />
                  <span className="text-slate-500 text-xs">OR paste URL</span>
                  <div className="flex-1 h-px bg-slate-700" />
                </div>
                <input
                  type="text"
                  value={form.imageUrl}
                  onChange={(e) => {
                    setForm({ ...form, imageUrl: e.target.value });
                    setImageFile(null);
                    setImagePreview(e.target.value);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-purple-500/25 disabled:opacity-50 cursor-pointer"
                >
                  {uploading
                    ? 'Uploading image...'
                    : formLoading
                    ? 'Saving...'
                    : editingProduct
                    ? 'Update Product'
                    : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Product Table */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                    Product
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                    Category
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                    Price
                  </th>
                  <th className="text-left text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                    Stock
                  </th>
                  <th className="text-right text-xs font-medium text-slate-400 uppercase tracking-wider px-6 py-4">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {products.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-slate-400 py-12"
                    >
                      No products yet. Add your first product above!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr
                      key={product._id}
                      className="hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.imageUrl ||
                              'https://placehold.co/48x48/1e293b/94a3b8?text=P'
                            }
                            alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <span className="text-white font-medium text-sm">
                            {product.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 text-sm">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 text-green-400 font-medium text-sm">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-slate-300 text-sm">
                        {product.stockCount}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleEdit(product)}
                          className="text-purple-400 hover:text-purple-300 text-sm font-medium mr-4 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
