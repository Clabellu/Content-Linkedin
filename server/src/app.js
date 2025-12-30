import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import articleRoutes from './routes/articles.js';
import generationRoutes from './routes/generation.js';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'LinkedIn Content Automation API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      articles: '/api/articles',
      articlesFetch: 'POST /api/articles/fetch',
      generate: 'POST /api/generate',
      generatedContents: 'GET /api/generate',
      schedule: '/api/schedule (coming in Step 8)'
    }
  });
});

// API Routes
app.use('/api/articles', articleRoutes);
app.use('/api/generate', generationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

export default app;
