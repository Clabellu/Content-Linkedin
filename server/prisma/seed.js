import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing sources (optional - comment out if you want to keep existing)
  // await prisma.source.deleteMany({});
  // console.log('🗑️  Cleared existing sources');

  // Seed sources
  for (const source of DEFAULT_SOURCES) {
    try {
      const created = await prisma.source.upsert({
        where: { url: source.url },
        update: {
          name: source.name,
          type: source.type,
          category: source.category,
          priority: source.priority,
          isActive: true
        },
        create: source
      });
      console.log(`✅ Created/Updated: ${created.name}`);
    } catch (error) {
      console.error(`❌ Error with ${source.name}:`, error.message);
    }
  }

  // Get count
  const count = await prisma.source.count();
  console.log(`\n📊 Total sources in database: ${count}`);

  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
