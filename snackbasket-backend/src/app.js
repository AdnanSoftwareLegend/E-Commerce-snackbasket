const express = require('express');
const cors = require('cors');
const path = require('path');
const { errorHandler, notFound } = require('./middlewares/errorMiddleware');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const blogRoutes = require('./routes/blogRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middlewares
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
app.use(cors({
  origin: (origin, cb) => {
    const clientUrls = (process.env.CLIENT_URL || 'http://localhost:3000')
      .split(',')
      .map((url) => url.trim().replace(/\/$/, ''))
      .filter(Boolean);
    const allowedOrigins = [];
    clientUrls.forEach((url) => {
      allowedOrigins.push(url);
      if (url.includes('localhost')) {
        allowedOrigins.push(url.replace('localhost', '127.0.0.1'));
        allowedOrigins.push(url.replace('localhost', '[::1]'));
      }
    });
    if (!origin || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    return cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// Static Uploads
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Health Check
app.get('/', (req, res) => {
  res.send('SnackBasket API is running...');
});

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

module.exports = app;