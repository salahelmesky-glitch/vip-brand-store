/**
 * ─────────────────────────────────────────────
 *  VIP Brand — Backend Server
 *  Express + MongoDB (Mongoose)
 * ─────────────────────────────────────────────
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { connectDB } from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import storeOrderRoutes from './routes/storeOrderRoutes.js';
import settingsRoutes from './routes/settingsRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGES_DIR = path.resolve(__dirname, '..', 'images');

const app = express();
const PORT = process.env.PORT || 5000;

/* ─── Multer Config ──────────────────────── */
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    // Ensure images dir exists
    if (!fs.existsSync(IMAGES_DIR)) {
      fs.mkdirSync(IMAGES_DIR, { recursive: true });
    }
    cb(null, IMAGES_DIR);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp + random + original extension
    const ext = path.extname(file.originalname) || '.jpg';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/* ─── Middleware ──────────────────────────── */
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

/* ─── Serve Images Statically ────────────── */
app.use('/images', express.static(IMAGES_DIR));

/* ─── Health Check ───────────────────────── */
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'operational',
    brand: 'VIP',
    timestamp: new Date().toISOString(),
  });
});

/* ─── Image Upload Endpoint ──────────────── */
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No image file uploaded' });
  }
  const imagePath = `/images/${req.file.filename}`;
  res.json({ success: true, path: imagePath });
});

/* ─── Routes ─────────────────────────────── */
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/store-orders', storeOrderRoutes);
app.use('/api/settings', settingsRoutes);

/* ─── 404 Handler ────────────────────────── */
app.use((_req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

/* ─── Global Error Handler ───────────────── */
app.use((err, _req, res, _next) => {
  console.error(`[VIP Server Error] ${err.message}`);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
  });
});

/* ─── Start Server ───────────────────────── */
const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n  ⚡ VIP Backend running on http://localhost:${PORT}`);
    console.log(`  📦 API:  http://localhost:${PORT}/api/products\n`);
  });
};

start();
