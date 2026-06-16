import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import uploadRoutes from "./routes/uploadRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Starting Mehran Mobile index.js');
connectDB();

const app = express();

// Stripe webhook needs raw body BEFORE express.json()
app.use(
  '/api/payment/webhook',
  express.raw({ type: 'application/json' })
);

app.use(express.json());

// CORS Configuration: Localhost aur Production Vercel URL dono ko handle karega
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/upload', uploadRoutes); // Upload route missing tha, woh bhi add kar diya

// Health check
app.get('/', (req, res) => {
  res.send('Mehran Mobile API running...');
});

if (!process.env.MONGO_URI || process.env.MONGO_URI.includes('your_mongodb')) {
  console.log('MONGO_URI not set or placeholder detected; skipping MongoDB connection.');
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mehran Mobile server running on port ${PORT}`);
});

// Vercel serverless environment ke liye app export karna lazmi hai
export default app;