/**
 * Keywords for relevance scoring
 */
const KEYWORDS = {
  ai: [
    'artificial intelligence', 'machine learning', 'ai', 'neural', 'gpt',
    'llm', 'deep learning', 'automation', 'chatbot', 'claude', 'openai',
    'generative', 'transformer', 'model', 'algorithm', 'data science'
  ],
  marketing: [
    'marketing', 'brand', 'content', 'social media', 'engagement', 'roi',
    'conversion', 'strategy', 'campaign', 'audience', 'growth', 'seo',
    'analytics', 'digital marketing', 'advertising', 'customer'
  ]
};

/**
 * Calculate quality score for an article (0-10)
 * Based on: content length, freshness, keyword relevance
 */
export function calculateQualityScore(article) {
  let score = 0;
  const breakdown = {};

  // 1. Content Length (max 3 points)
  const contentLength = (article.content || article.description || '').length;
  if (contentLength >= 500) {
    breakdown.length = 3;
  } else if (contentLength >= 200) {
    breakdown.length = 2;
  } else if (contentLength >= 100) {
    breakdown.length = 1;
  } else {
    breakdown.length = 0;
  }
  score += breakdown.length;

  // 2. Freshness - published date (max 3 points)
  if (article.publishedAt) {
    const publishedAt = new Date(article.publishedAt);
    const daysSincePublish = (Date.now() - publishedAt.getTime()) / (1000 * 60 * 60 * 24);

    if (daysSincePublish <= 1) {
      breakdown.freshness = 3;  // Last day
    } else if (daysSincePublish <= 3) {
      breakdown.freshness = 2;  // Last 3 days
    } else if (daysSincePublish <= 7) {
      breakdown.freshness = 1;  // Last week
    } else {
      breakdown.freshness = 0;  // Too old
    }
  } else {
    breakdown.freshness = 1; // Default if no date
  }
  score += breakdown.freshness;

  // 3. Keyword Relevance (max 4 points)
  const text = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();
  let keywordMatches = 0;

  [...KEYWORDS.ai, ...KEYWORDS.marketing].forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) {
      keywordMatches++;
    }
  });

  if (keywordMatches >= 5) {
    breakdown.relevance = 4;
  } else if (keywordMatches >= 3) {
    breakdown.relevance = 3;
  } else if (keywordMatches >= 2) {
    breakdown.relevance = 2;
  } else if (keywordMatches >= 1) {
    breakdown.relevance = 1;
  } else {
    breakdown.relevance = 0;
  }
  score += breakdown.relevance;

  return {
    score,           // Total 0-10
    breakdown,       // Detail per category
    isProcessable: score >= 6  // Only score >= 6 are processable
  };
}

/**
 * Determine article category based on keywords
 */
export function categorizeArticle(article) {
  const text = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase();

  let aiMatches = 0;
  let marketingMatches = 0;

  KEYWORDS.ai.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) aiMatches++;
  });

  KEYWORDS.marketing.forEach(keyword => {
    if (text.includes(keyword.toLowerCase())) marketingMatches++;
  });

  if (aiMatches > marketingMatches) {
    return 'ai';
  } else if (marketingMatches > aiMatches) {
    return 'marketing';
  } else {
    return 'general';
  }
}

export default {
  calculateQualityScore,
  categorizeArticle
};
