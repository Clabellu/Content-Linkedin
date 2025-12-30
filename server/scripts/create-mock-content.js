import { getDb } from '../src/config/database.js';
import { createHash } from 'crypto';

function generateId() {
  return createHash('sha256')
    .update(Date.now().toString() + Math.random().toString())
    .digest('base64url')
    .slice(0, 16);
}

console.log('🔨 Creating mock generated content for testing...\n');

const db = getDb();

// Get first article
const article = db.prepare('SELECT * FROM Article ORDER BY qualityScore DESC LIMIT 1').get();

if (!article) {
  console.log('❌ No articles in database! Run test:fetch first.');
  process.exit(1);
}

const mockLinkedInText = `🚀 L'intelligenza artificiale sta rivoluzionando il modo in cui lavoriamo

Tre trend chiave da osservare nel 2025:

✅ Automazione intelligente - I processi ripetitivi vengono gestiti da AI, liberando tempo per lavoro creativo
✅ Personalizzazione su scala - Ogni cliente riceve un'esperienza unica grazie al machine learning
✅ Decisioni data-driven - L'AI analizza milioni di punti dati per insights azionabili

La vera domanda non è "se" adottare l'AI, ma "come" integrarla strategicamente nella tua organizzazione.

Qual è la vostra esperienza con l'AI? Condividete nei commenti! 💬

#ArtificialIntelligence #Innovation #DigitalTransformation #AI #FutureOfWork`;

const mockImagePrompt = `A modern, sleek workspace with floating holographic AI interfaces displaying data visualizations and neural network patterns. Show interconnected nodes in electric blue and purple gradients, representing machine learning algorithms. Clean, minimalist aesthetic with a futuristic corporate feel. Professional lighting, 16:9 composition, contemporary tech-forward design with subtle geometric patterns.`;

const contentId = generateId();
const now = Date.now();

const insertContent = db.prepare(`
  INSERT INTO GeneratedContent (
    id, articleId, linkedinText, imagePrompt,
    generationModel, tone, status,
    createdAt, updatedAt
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertContent.run(
  contentId,
  article.id,
  mockLinkedInText,
  mockImagePrompt,
  'claude-sonnet-4-5',
  'professional',
  'draft',
  now,
  now
);

console.log(`✅ Mock content created successfully!`);
console.log(`   Content ID: ${contentId}`);
console.log(`   Article: ${article.title.substring(0, 50)}...`);
console.log(`\nNow you can test image generation with:`);
console.log(`npm run test:images\n`);
