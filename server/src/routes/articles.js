import express from 'express';
import * as articleController from '../controllers/articleController.js';

const router = express.Router();

// GET /api/articles - Get all articles
router.get('/', articleController.getArticles);

// GET /api/articles/:id - Get single article
router.get('/:id', articleController.getArticleById);

// POST /api/articles/fetch - Fetch new articles from RSS
router.post('/fetch', articleController.fetchArticles);

export default router;
