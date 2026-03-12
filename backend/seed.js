const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

const adminUser = {
  name: 'Admin',
  email: 'admin@shopverse.com',
  password: 'admin123',
  role: 'admin',
};

const sampleProducts = [
  // ─── Electronics ──────────────────────────
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation, 30-hour battery life, and crystal-clear audio quality.',
    price: 249.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    stockCount: 50,
  },
  {
    name: 'Smart Watch Pro',
    description:
      'Feature-packed smartwatch with health monitoring, GPS tracking, and a stunning AMOLED display.',
    price: 399.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    stockCount: 30,
  },
  {
    name: 'Portable Bluetooth Speaker',
    description:
      'Waterproof speaker with 360° surround sound, 20-hour playtime, and rugged outdoor design.',
    price: 79.99,
    category: 'Electronics',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500',
    stockCount: 100,
  },

  // ─── Clothing ─────────────────────────────
  {
    name: 'Classic Leather Jacket',
    description:
      'Genuine leather jacket with a timeless design. Perfect for casual and semi-formal occasions.',
    price: 189.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500',
    stockCount: 25,
  },
  {
    name: 'Premium Cotton T-Shirt',
    description:
      'Ultra-soft 100% organic cotton t-shirt. Available in multiple colors with a relaxed fit.',
    price: 34.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    stockCount: 200,
  },
  {
    name: 'Running Sneakers',
    description:
      'Lightweight and breathable running shoes with responsive cushioning and durable outsole.',
    price: 129.99,
    category: 'Clothing',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stockCount: 75,
  },

  // ─── Home & Living ────────────────────────
  {
    name: 'Minimalist Desk Lamp',
    description:
      'LED desk lamp with adjustable brightness, color temperature control, and sleek modern design.',
    price: 59.99,
    category: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=500',
    stockCount: 60,
  },
  {
    name: 'Ceramic Coffee Mug Set',
    description:
      'Set of 4 handcrafted ceramic mugs with elegant matte finish. Microwave and dishwasher safe.',
    price: 44.99,
    category: 'Home & Living',
    imageUrl: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500',
    stockCount: 120,
  },

  // ─── Books ────────────────────────────────
  {
    name: 'The Art of Clean Code',
    description:
      'A comprehensive guide to writing maintainable, readable, and efficient code. A must-read for every developer.',
    price: 29.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
    stockCount: 150,
  },
  {
    name: 'Mindful Living Journal',
    description:
      'A beautifully designed guided journal for daily reflection, gratitude, and personal growth.',
    price: 19.99,
    category: 'Books',
    imageUrl: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=500',
    stockCount: 80,
  },

  // ─── Accessories ──────────────────────────
  {
    name: 'Leather Crossbody Bag',
    description:
      'Compact and stylish genuine leather crossbody bag with multiple compartments and adjustable strap.',
    price: 89.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    stockCount: 40,
  },
  {
    name: 'Aviator Sunglasses',
    description:
      'Classic aviator sunglasses with UV400 protection, polarized lenses, and lightweight metal frame.',
    price: 54.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500',
    stockCount: 90,
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const createdAdmin = await User.create(adminUser);
    console.log(`👤 Admin created: ${createdAdmin.email} / password: admin123`);

    // Create products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`📦 ${createdProducts.length} products seeded`);

    console.log('\n✅ Database seeded successfully!\n');
    console.log('──────────────────────────────────');
    console.log('  Admin Login Credentials:');
    console.log('  Email:    admin@shopverse.com');
    console.log('  Password: admin123');
    console.log('──────────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seed error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
