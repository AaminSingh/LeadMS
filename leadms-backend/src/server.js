try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile();
  }
} catch (e) {
  // .env might be passed via cloud environment or container
}

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { errorHandler, notFound } from './middlewares/errorMiddleware.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import vendorRoutes from './routes/vendorRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/admin', adminRoutes);

// Fallback aliases without /api prefix
app.use('/auth', authRoutes);
app.use('/products', productRoutes);
app.use('/vendor', vendorRoutes);
app.use('/leads', leadRoutes);
app.use('/admin', adminRoutes);

// Base route for health check / welcome
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Welcome to the CRM Backend API. Services are running smoothly.' });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://leadms:leadms1234@cluster0.cfs57yw.mongodb.net/leadms';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB Connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start server only if not running in a serverless environment (like Vercel)
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the app for Vercel serverless function
export default app;
