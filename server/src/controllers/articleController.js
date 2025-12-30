import * as articleService from '../services/articleService.js';
import { getAllSources, getDb } from '../config/database.js';

/**
 * GET /api/articles
 * Get all articles
 */
export async function getArticles(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const status = req.query.status;
    const minScore = parseInt(req.query.minScore);

    let articles;

    if (status) {
      articles = articleService.getArticlesByStatus(status, limit);
    } else if (minScore) {
      articles = articleService.getArticlesByQuality(minScore, limit);
    } else {
      articles = articleService.getAllArticles(limit);
    }

    // Parse scoreBreakdown from JSON
    articles = articles.map(article => ({
      ...article,
      scoreBreakdown: article.scoreBreakdown ? JSON.parse(article.scoreBreakdown) : null
    }));

    res.json({
      success: true,
      count: articles.length,
      articles
    });
  } catch (error) {
    console.error('Error getting articles:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * POST /api/articles/fetch
 * Fetch new articles from RSS feeds
 */
export async function fetchArticles(req, res) {
  try {
    const maxArticlesPerFeed = parseInt(req.body.maxArticlesPerFeed) || 10;

    console.log('\n🚀 Starting article fetch...\n');

    // Get active sources
    const sources = getAllSources();

    if (sources.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No active RSS sources configured'
      });
    }

    // Fetch and save articles
    const stats = await articleService.fetchAndSaveArticles(sources, maxArticlesPerFeed);

    console.log('\n✨ Fetch complete!\n');

    res.json({
      success: true,
      message: 'Articles fetched successfully',
      stats: {
        sources: sources.length,
        fetched: stats.fetched,
        duplicates: stats.duplicates,
        lowQuality: stats.lowQuality,
        saved: stats.saved,
        errors: stats.errors.length
      },
      errors: stats.errors
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /api/articles/:id
 * Get single article by ID
 */
export async function getArticleById(req, res) {
  try {
    const { id } = req.params;
    const db = getDb();
    const article = db.prepare('SELECT * FROM Article WHERE id = ?').get(id);

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Article not found'
      });
    }

    // Parse scoreBreakdown
    article.scoreBreakdown = article.scoreBreakdown ? JSON.parse(article.scoreBreakdown) : null;

    res.json({
      success: true,
      article
    });
  } catch (error) {
    console.error('Error getting article:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export default {
  getArticles,
  fetchArticles,
  getArticleById
};
