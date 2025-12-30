import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', '..', 'dev.db');

// Create singleton database connection
let db = null;

export function getDb() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL'); // Better performance
    console.log('✅ Database connected:', dbPath);
  }
  return db;
}

export function closeDb() {
  if (db) {
    db.close();
    db = null;
    console.log('🔒 Database closed');
  }
}

// Database helper functions
export const dbHelpers = {
  // Sources
  getAllSources: () => {
    const db = getDb();
    return db.prepare('SELECT * FROM Source WHERE isActive = 1 ORDER BY priority DESC').all();
  },

  getSourceById: (id) => {
    const db = getDb();
    return db.prepare('SELECT * FROM Source WHERE id = ?').get(id);
  },

  // Articles
  getAllArticles: (limit = 100) => {
    const db = getDb();
    return db.prepare('SELECT * FROM Article ORDER BY fetchedAt DESC LIMIT ?').all(limit);
  },

  getArticleById: (id) => {
    const db = getDb();
    return db.prepare('SELECT * FROM Article WHERE id = ?').get(id);
  },

  getArticleByUrl: (url) => {
    const db = getDb();
    return db.prepare('SELECT * FROM Article WHERE url = ?').get(url);
  },

  getArticleByFingerprint: (fingerprint) => {
    const db = getDb();
    return db.prepare('SELECT * FROM Article WHERE fingerprint = ?').get(fingerprint);
  },

  // Generated Contents
  getContentByArticleId: (articleId) => {
    const db = getDb();
    return db.prepare('SELECT * FROM GeneratedContent WHERE articleId = ? ORDER BY createdAt DESC').all(articleId);
  },

  // Fingerprints
  getFingerprintByHash: (fingerprint) => {
    const db = getDb();
    return db.prepare('SELECT * FROM Fingerprint WHERE fingerprint = ?').get(fingerprint);
  },

  // Schedules
  getSchedulesByDate: (date) => {
    const db = getDb();
    return db.prepare('SELECT * FROM Schedule WHERE scheduledDate = ? ORDER BY scheduledTime').all(date);
  },

  // Stats
  getStats: () => {
    const db = getDb();
    return {
      sources: db.prepare('SELECT COUNT(*) as count FROM Source').get().count,
      articles: db.prepare('SELECT COUNT(*) as count FROM Article').get().count,
      contents: db.prepare('SELECT COUNT(*) as count FROM GeneratedContent').get().count,
      schedules: db.prepare('SELECT COUNT(*) as count FROM Schedule').get().count,
      fingerprints: db.prepare('SELECT COUNT(*) as count FROM Fingerprint').get().count
    };
  }
};

export default {
  getDb,
  closeDb,
  ...dbHelpers
};
