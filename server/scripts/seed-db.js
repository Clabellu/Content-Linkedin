import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { randomBytes } from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'dev.db');

const DEFAULT_SOURCES = [
  // AI News
  {
    name: "Google AI Blog",
    url: "https://blog.google/technology/ai/rss/",
    type: "rss",
    category: "ai",
    priority: 8
  },
  {
    name: "OpenAI Blog",
    url: "https://openai.com/blog/rss/",
    type: "rss",
    category: "ai",
    priority: 9
  },
  {
    name: "Anthropic News",
    url: "https://www.anthropic.com/news/rss",
    type: "rss",
    category: "ai",
    priority: 9
  },
  {
    name: "MIT News - AI",
    url: "https://news.mit.edu/topic/mitartificial-intelligence2-rss.xml",
    type: "rss",
    category: "ai",
    priority: 7
  },
  {
    name: "VentureBeat AI",
    url: "https://venturebeat.com/category/ai/feed/",
    type: "rss",
    category: "ai",
    priority: 7
  },

  // Marketing
  {
    name: "HubSpot Marketing Blog",
    url: "https://blog.hubspot.com/marketing/rss.xml",
    type: "rss",
    category: "marketing",
    priority: 8
  },
  {
    name: "Marketing AI Institute",
    url: "http://www.marketingaiinstitute.com/blog/rss.xml",
    type: "rss",
    category: "marketing",
    priority: 9
  },
  {
    name: "Content Marketing Institute",
    url: "https://contentmarketinginstitute.com/feed/",
    type: "rss",
    category: "marketing",
    priority: 7
  },

  // Google News Searches (Dynamic)
  {
    name: "Google News - AI Marketing",
    url: "https://news.google.com/rss/search?q=AI+marketing&hl=it&gl=IT&ceid=IT:it",
    type: "google_news",
    category: "marketing",
    priority: 6
  },
  {
    name: "Google News - Artificial Intelligence",
    url: "https://news.google.com/rss/search?q=artificial+intelligence+business&hl=it&gl=IT&ceid=IT:it",
    type: "google_news",
    category: "ai",
    priority: 6
  }
];

function generateId() {
  return randomBytes(12).toString('base64url');
}

console.log('🌱 Starting database seed...');

try {
  const db = new Database(dbPath);

  // Prepare insert statement
  const insertSource = db.prepare(`
    INSERT OR REPLACE INTO Source (id, name, type, url, category, isActive, priority, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Check if source already exists
  const findSource = db.prepare('SELECT id FROM Source WHERE url = ?');

  let created = 0;
  let updated = 0;

  for (const source of DEFAULT_SOURCES) {
    const existing = findSource.get(source.url);
    const id = existing ? existing.id : generateId();
    const createdAt = Date.now();

    insertSource.run(
      id,
      source.name,
      source.type,
      source.url,
      source.category,
      1, // isActive = true
      source.priority,
      createdAt
    );

    if (existing) {
      updated++;
      console.log(`🔄 Updated: ${source.name}`);
    } else {
      created++;
      console.log(`✅ Created: ${source.name}`);
    }
  }

  // Get total count
  const count = db.prepare('SELECT COUNT(*) as count FROM Source').get();

  console.log(`\n📊 Summary:`);
  console.log(`   - Created: ${created}`);
  console.log(`   - Updated: ${updated}`);
  console.log(`   - Total sources: ${count.count}`);

  db.close();
  console.log('\n✨ Seed completed successfully!');
} catch (error) {
  console.error('❌ Seed failed:', error);
  process.exit(1);
}
