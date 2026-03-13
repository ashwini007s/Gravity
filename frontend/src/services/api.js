const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const getHeaders = (token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
};

// ─── Auth ────────────────────────────────────────────
export const registerUser = async (name, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const loginUser = async (email, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ─── Products ────────────────────────────────────────
export const fetchProducts = async (category) => {
  const url = category
    ? `${API_BASE}/products?category=${encodeURIComponent(category)}`
    : `${API_BASE}/products`;
  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchProductById = async (id) => {
  const res = await fetch(`${API_BASE}/products/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchCategories = async () => {
  const res = await fetch(`${API_BASE}/products/categories`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const createProduct = async (productData, token) => {
  const res = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const updateProduct = async (id, productData, token) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify(productData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const deleteProduct = async (id, token) => {
  const res = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ─── Upload ──────────────────────────────────────────
export const uploadImage = async (file, token) => {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ─── Cart ────────────────────────────────────────────
export const fetchCart = async (token) => {
  const res = await fetch(`${API_BASE}/cart`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const addToCartAPI = async (productId, quantity, token) => {
  const res = await fetch(`${API_BASE}/cart`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ productId, quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const updateCartItemAPI = async (productId, quantity, token) => {
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'PUT',
    headers: getHeaders(token),
    body: JSON.stringify({ quantity }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const removeFromCartAPI = async (productId, token) => {
  const res = await fetch(`${API_BASE}/cart/${productId}`, {
    method: 'DELETE',
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

// ─── Orders ──────────────────────────────────────────
export const placeOrderAPI = async (shippingAddress, token) => {
  const res = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: getHeaders(token),
    body: JSON.stringify({ shippingAddress }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchOrders = async (token) => {
  const res = await fetch(`${API_BASE}/orders`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};

export const fetchOrderById = async (id, token) => {
  const res = await fetch(`${API_BASE}/orders/${id}`, {
    headers: getHeaders(token),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
};
