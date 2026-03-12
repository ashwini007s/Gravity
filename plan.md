# MERN Stack E-Commerce Website Plan

This document outlines the high-level architecture, technology stack, and database schema required for building the MERN stack ecommerce application based on your requirements.

## 1. Tech Stack Overview

### Frontend
* **Library:** React.js (via Vite or Create React App)
* **Routing:** React Router DOM (for navigating between pages like Home, Cart, Product View, Login)
* **State Management:** Context API or Redux Toolkit (for managing cart state, user session)
* **Styling:** CSS Modules, TailwindCSS, or Material-UI for responsive design
* **Data Fetching:** Axios or native `fetch` API

### Backend
* **Framework:** Node.js with Express.js
* **Database:** MongoDB (using Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs (for password hashing)
* **CORS:** `cors` middleware to allow frontend to communicate with backend

---

## 2. Supported Functionalities

### User Roles
1. **User:**
   - Login / Signup
   - View products and categories
   - Add items to the shopping cart
   - View cart contents
   - Place an order
   - View order history
2. **Admin:**
   - Add / Remove products
   - Update existing product details

---

## 3. Database Schema Design (Mongoose)

### A. User Schema (`User`)
Manages both regular users and admins.
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  createdAt: { type: Date, default: Date.now }
}
```

### B. Product Schema (`Product`)
Stores all product details.
```javascript
{
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true }, // e.g., "Electronics", "Clothing"
  imageUrl: { type: String }, // Path or link to product image
  stockCount: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now }
}
```

### C. Cart Schema (`Cart` - Optional but Recommended)
For persisting carts in the database so users can access them across devices. Alternatively, the cart can be stored in the User schema or solely in the frontend's Local Storage.
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true }
    }
  ],
  totalPrice: { type: Number, required: true, default: 0 },
  updatedAt: { type: Date, default: Date.now }
}
```

### D. Order Schema (`Order`)
Tracks finalized purchases.
```javascript
{
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true }
    }
  ],
  shippingAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  deliveryStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered'], default: 'Processing' },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 4. Suggested Directory Structure

```text
ecommerce-app/
├── backend/
│   ├── config/       (Database connection, ENV variables)
│   ├── controllers/  (Logic for handling routes)
│   ├── middleware/   (Auth checks, error handlers)
│   ├── models/       (Mongoose schemas)
│   ├── routes/       (API route definitions)
│   └── server.js     (Express server entry point)
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/ (Reusable UI pieces)
    │   ├── context/    (Or redux store for state)
    │   ├── pages/      (View components for router)
    │   ├── services/   (API call helpers)
    │   ├── App.jsx
    │   └── index.css
    └── package.json
```
