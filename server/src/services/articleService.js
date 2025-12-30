import { getDb } from '../config/database.js';
import { generateFingerprint, createFingerprintData } from './fingerprintService.js';
import { calculateQualityScore, categorizeArticle } from './qualityScoreService.js';
import { fetchAllFeeds } from './rssService.js';
import { createHash } from 'crypto';

/**
 * Generate unique ID
 */
function generateId() {
  return createHash('sha256')
    .update(Date.now().toString() + Math.random().toString())
    .digest('base64url')
    .slice(0, 16);
}

/**
 * Save article to database
 */
export function saveArticle(article) {
  const db = getDb();

  const insertArticle = db.prepare(`
    INSERT INTO Article (
      id, title, description, content, url, source, publishedAt, fetchedAt,
      fingerprint, status, category, qualityScore, scoreBreakdown, createdAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertArticle.run(
    article.id,
    article.title,
    article.description,
    article.content,
    article.url,
    article.source,
    article.publishedAt,
    article.fetchedAt,
    article.fingerprint,
    article.status,
    article.category,
    article.qualityScore,
    article.scoreBreakdown,
    article.createdAt
  );

  return article;
}

/**
 * Save fingerprint to database
 */
export function saveFingerprint(fingerprintData) {
  const db = getDb();

  const insertFingerprint = db.prepare(`
    INSERT OR REPLACE INTO Fingerprint (
      id, fingerprint, articleUrl, firstSeenAt, lastSeenAt, useCount
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  insertFingerprint.run(
    fingerprintData.id,
    fingerprintData.fingerprint,
    fingerprintData.articleUrl,
    fingerprintData.firstSeenAt,
    fingerprintData.lastSeenAt,
    fingerprintData.useCount
  );
}

/**
 * Process and save articles from RSS feeds
 */
export async function fetchAndSaveArticles(sources, maxArticlesPerFeed = 10) {
  const stats = {
    fetched: 0,
    duplicates: 0,
    lowQuality: 0,
    saved: 0,
    errors: []
  };

  try {
    // Fetch from all sources
    const rawArticles = await fetchAllFeeds(sources, maxArticlesPerFeed);
    stats.fetched = rawArticles.length;

    const db = getDb();
    const findFingerprint = db.prepare('SELECT * FROM Fingerprint WHERE fingerprint = ?');
    const findArticleByUrl = db.prepare('SELECT * FROM Article WHERE url = ?');

    for (const rawArticle of rawArticles) {
      try {
        // Generate fingerprint
        const fingerprint = generateFingerprint(rawArticle.title, rawArticle.url);

        // Check for duplicates by URL
        const existingArticle = findArticleByUrl.get(rawArticle.url);
        if (existingArticle) {
          stats.duplicates++;
          console.log(`⏭️  Duplicate (URL): ${rawArticle.title.substring(0, 50)}...`);
          continue;
        }

        // Check for duplicates by fingerprint
        const existingFingerprint = findFingerprint.get(fingerprint);
        if (existingFingerprint) {
          stats.duplicates++;
          console.log(`⏭️  Duplicate (fingerprint): ${rawArticle.title.substring(0, 50)}...`);
          continue;
        }

        // Calculate quality score
        const quality = calculateQualityScore(rawArticle);

        // Skip low quality articles
        if (!quality.isProcessable) {
          stats.lowQuality++;
          console.log(`⬇️  Low quality (${quality.score}/10): ${rawArticle.title.substring(0, 50)}...`);
          continue;
        }

        // Categorize article
        const category = categorizeArticle(rawArticle);

        // Prepare article for DB
        const article = {
          id: generateId(),
          title: rawArticle.title,
          description: rawArticle.description,
          content: rawArticle.content,
          url: rawArticle.url,
          source: rawArticle.source,
          publishedAt: rawArticle.publishedAt,
          fetchedAt: rawArticle.fetchedAt,
          fingerprint,
          status: 'new',
          category,
          qualityScore: quality.score,
          scoreBreakdown: JSON.stringify(quality.breakdown),
          createdAt: Date.now()
        };

        // Save article
        saveArticle(article);

        // Save fingerprint
        const fingerprintData = createFingerprintData(fingerprint, rawArticle.url);
        saveFingerprint(fingerprintData);

        stats.saved++;
        console.log(`✅ Saved (${quality.score}/10): ${rawArticle.title.substring(0, 50)}...`);

      } catch (error) {
        stats.errors.push({
          article: rawArticle.title,
          error: error.message
        });
        console.error(`❌ Error processing article:`, error.message);
      }
    }

  } catch (error) {
    console.error('❌ Error in fetchAndSaveArticles:', error);
    throw error;
  }

  return stats;
}

/**
 * Get all articles from database
 */
export function getAllArticles(limit = 100) {
  const db = getDb();
  return db.prepare('SELECT * FROM Article ORDER BY fetchedAt DESC LIMIT ?').all(limit);
}

/**
 * Get articles by status
 */
export function getArticlesByStatus(status, limit = 100) {
  const db = getDb();
  return db.prepare('SELECT * FROM Article WHERE status = ? ORDER BY fetchedAt DESC LIMIT ?').all(status, limit);
}

/**
 * Get articles by quality score
 */
export function getArticlesByQuality(minScore = 6, limit = 100) {
  const db = getDb();
  return db.prepare('SELECT * FROM Article WHERE qualityScore >= ? ORDER BY qualityScore DESC, fetchedAt DESC LIMIT ?').all(minScore, limit);
}

export default {
  saveArticle,
  saveFingerprint,
  fetchAndSaveArticles,
  getAllArticles,
  getArticlesByStatus,
  getArticlesByQuality
};
