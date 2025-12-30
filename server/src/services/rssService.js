import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000, // 10 seconds
  customFields: {
    item: [
      ['content:encoded', 'content'],
      ['description', 'description']
    ]
  }
});

/**
 * Fetch articles from a single RSS feed
 */
export async function fetchRSSFeed(source, maxArticles = 10) {
  try {
    console.log(`📡 Fetching: ${source.name}...`);

    const feed = await parser.parseURL(source.url);

    const articles = feed.items
      .slice(0, maxArticles)
      .map(item => ({
        title: item.title || 'Untitled',
        description: item.contentSnippet || item.description || '',
        content: item.content || item['content:encoded'] || item.contentSnippet || '',
        url: item.link || item.guid || '',
        source: source.name,
        publishedAt: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
        fetchedAt: Date.now()
      }))
      .filter(article => article.url && article.title); // Must have URL and title

    console.log(`✅ Fetched ${articles.length} articles from ${source.name}`);
    return articles;

  } catch (error) {
    console.error(`❌ Error fetching ${source.name}:`, error.message);
    return [];
  }
}

/**
 * Fetch articles from multiple RSS feeds
 */
export async function fetchAllFeeds(sources, maxArticlesPerFeed = 10) {
  console.log(`\n📰 Fetching from ${sources.length} RSS sources...\n`);

  const results = await Promise.allSettled(
    sources.map(source => fetchRSSFeed(source, maxArticlesPerFeed))
  );

  // Collect successful results
  const allArticles = results
    .filter(result => result.status === 'fulfilled')
    .flatMap(result => result.value);

  console.log(`\n📊 Total articles fetched: ${allArticles.length}`);

  return allArticles;
}

/**
 * Retry wrapper with exponential backoff
 */
export async function withRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = Math.pow(2, i + 1) * 1000; // 2s, 4s, 8s
      console.log(`⏳ Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export default {
  fetchRSSFeed,
  fetchAllFeeds,
  withRetry
};
