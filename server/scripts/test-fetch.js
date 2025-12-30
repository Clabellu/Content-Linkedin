import { saveArticle, saveFingerprint } from '../src/services/articleService.js';
import { generateFingerprint, createFingerprintData } from '../src/services/fingerprintService.js';
import { calculateQualityScore, categorizeArticle } from '../src/services/qualityScoreService.js';
import { createHash } from 'crypto';

function generateId() {
  return createHash('sha256')
    .update(Date.now().toString() + Math.random().toString())
    .digest('base64url')
    .slice(0, 16);
}

// Mock articles for testing
const MOCK_ARTICLES = [
  {
    title: "How AI is Transforming Digital Marketing Strategies in 2025",
    description: "Artificial intelligence is revolutionizing how marketers approach content creation, customer engagement, and campaign optimization. Machine learning algorithms now power personalized experiences at scale.",
    content: "Artificial intelligence and machine learning are fundamentally changing the digital marketing landscape. From predictive analytics to automated content generation, AI tools enable marketers to create more targeted campaigns, improve ROI, and deliver personalized customer experiences. This comprehensive guide explores how leading brands leverage AI for marketing automation, social media management, and data-driven decision making.",
    url: "https://example.com/ai-marketing-2025",
    source: "AI Marketing Weekly",
    publishedAt: Date.now() - (1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    title: "GPT-4 and Claude: Comparing the Latest Large Language Models",
    description: "A technical deep dive into the capabilities, architecture, and performance of GPT-4 and Claude Sonnet",
    content: "Large language models like GPT-4 and Claude represent the cutting edge of artificial intelligence. These transformer-based neural networks demonstrate remarkable abilities in natural language understanding, code generation, and complex reasoning. This article compares their architectures, training methodologies, and real-world performance across various benchmarks.",
    url: "https://example.com/gpt4-vs-claude",
    source: "AI Research Daily",
    publishedAt: Date.now() - (1000 * 60 * 60 * 12) // 12 hours ago
  },
  {
    title: "Content Marketing ROI: Measuring Success in the Age of AI",
    description: "How to track and optimize content marketing campaigns using AI-powered analytics",
    content: "Measuring content marketing ROI has become more sophisticated with AI analytics tools. Marketers can now track engagement metrics, conversion rates, and customer journey touchpoints with unprecedented accuracy. This guide covers key performance indicators, attribution models, and best practices for data-driven content strategy.",
    url: "https://example.com/content-roi-ai",
    source: "Marketing Institute",
    publishedAt: Date.now() - (1000 * 60 * 60 * 24) // 1 day ago
  },
  {
    title: "Neural Networks for Social Media Sentiment Analysis",
    description: "Using deep learning to understand customer sentiment at scale",
    content: "Deep learning neural networks enable real-time sentiment analysis of social media conversations. Brands can now monitor customer opinions, detect emerging trends, and respond to feedback faster than ever. This technical guide explores BERT, transformers, and other NLP models for sentiment classification.",
    url: "https://example.com/sentiment-analysis-nn",
    source: "Data Science Blog",
    publishedAt: Date.now() - (1000 * 60 * 60 * 48) // 2 days ago
  },
  {
    title: "Short Article",
    description: "This is too short",
    content: "Not enough content here.",
    url: "https://example.com/short",
    source: "Test Source",
    publishedAt: Date.now() - (1000 * 60 * 60 * 24 * 10) // 10 days ago (will have low quality)
  }
];

console.log('🧪 Testing Article Fetch & Save System\n');
console.log('='.repeat(60));

const stats = {
  processed: 0,
  saved: 0,
  lowQuality: 0
};

for (const mockArticle of MOCK_ARTICLES) {
  stats.processed++;

  console.log(`\n📄 Processing: ${mockArticle.title.substring(0, 50)}...`);

  // Generate fingerprint
  const fingerprint = generateFingerprint(mockArticle.title, mockArticle.url);
  console.log(`   Fingerprint: ${fingerprint}`);

  // Calculate quality score
  const quality = calculateQualityScore(mockArticle);
  console.log(`   Quality Score: ${quality.score}/10`);
  console.log(`   Breakdown: Length=${quality.breakdown.length}, Freshness=${quality.breakdown.freshness}, Relevance=${quality.breakdown.relevance}`);

  // Check if processable
  if (!quality.isProcessable) {
    stats.lowQuality++;
    console.log(`   ⬇️  SKIPPED: Quality too low (${quality.score} < 6)`);
    continue;
  }

  // Categorize
  const category = categorizeArticle(mockArticle);
  console.log(`   Category: ${category}`);

  // Prepare article for DB
  const article = {
    id: generateId(),
    title: mockArticle.title,
    description: mockArticle.description,
    content: mockArticle.content,
    url: mockArticle.url,
    source: mockArticle.source,
    publishedAt: mockArticle.publishedAt,
    fetchedAt: Date.now(),
    fingerprint,
    status: 'new',
    category,
    qualityScore: quality.score,
    scoreBreakdown: JSON.stringify(quality.breakdown),
    createdAt: Date.now()
  };

  // Save
  try {
    saveArticle(article);
    const fingerprintData = createFingerprintData(fingerprint, mockArticle.url);
    saveFingerprint(fingerprintData);

    stats.saved++;
    console.log(`   ✅ SAVED to database`);
  } catch (error) {
    console.log(`   ❌ ERROR: ${error.message}`);
  }
}

console.log('\n' + '='.repeat(60));
console.log('\n📊 RESULTS:');
console.log(`   Processed: ${stats.processed}`);
console.log(`   Saved: ${stats.saved}`);
console.log(`   Low Quality: ${stats.lowQuality}`);
console.log('\n✨ Test complete!\n');
