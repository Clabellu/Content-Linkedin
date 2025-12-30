import { getDb } from '../src/config/database.js';

console.log('🧪 Testing LinkedIn Content Generation System\n');
console.log('='.repeat(60));

const db = getDb();

// Get first article from database
const article = db.prepare('SELECT * FROM Article ORDER BY qualityScore DESC LIMIT 1').get();

if (!article) {
  console.log('\n❌ No articles in database!');
  console.log('   Run "node scripts/test-fetch.js" first to add articles.');
  process.exit(1);
}

console.log('\n📄 Selected Article for Generation:\n');
console.log(`   Title: ${article.title}`);
console.log(`   Source: ${article.source}`);
console.log(`   Quality: ${article.qualityScore}/10`);
console.log(`   Category: ${article.category}`);
console.log(`   URL: ${article.url}`);

console.log('\n' + '='.repeat(60));
console.log('\n⚠️  NOTE: This test requires a valid ANTHROPIC_API_KEY in .env');
console.log('\nTo test the generation system:');
console.log('\n1. Add your API key to server/.env:');
console.log('   ANTHROPIC_API_KEY=sk-ant-your-key-here');
console.log('\n2. Start the server:');
console.log('   npm run dev');
console.log('\n3. Call the API:');
console.log(`   curl -X POST http://localhost:3001/api/generate \\`);
console.log(`     -H "Content-Type: application/json" \\`);
console.log(`     -d '{"articleId": "${article.id}", "tone": "professional"}'`);
console.log('\n' + '='.repeat(60));

console.log('\n📋 Expected Response Structure:\n');
console.log(JSON.stringify({
  success: true,
  message: 'Content generated successfully',
  content: {
    id: 'generated_content_id',
    articleId: article.id,
    linkedinText: 'Generated LinkedIn post text (150-300 words)...',
    imagePrompt: 'Detailed prompt for image generation...',
    generationModel: 'claude-sonnet-4-5',
    tone: 'professional',
    status: 'draft',
    article: {
      id: article.id,
      title: article.title,
      url: article.url,
      source: article.source
    }
  }
}, null, 2));

console.log('\n' + '='.repeat(60));
console.log('\n📝 Mock Generated Content Example:\n');

const mockLinkedInPost = `🚀 L'intelligenza artificiale sta rivoluzionando il digital marketing nel 2025

Tre trend da non perdere:

✅ Personalizzazione predittiva - L'AI anticipa le esigenze dei clienti prima ancora che se ne rendano conto
✅ Content automation - Generazione di contenuti su misura in tempo reale
✅ Analytics avanzate - Comprensione profonda del customer journey con ML

La vera sfida? Non è più "se" adottare l'AI, ma "come" integrarla strategicamente.

Qual è la vostra esperienza con l'AI nel marketing? 💬

#AIMarketing #DigitalTransformation #MarketingAutomation #AI #Innovation`;

const mockImagePrompt = `A modern, sleek digital marketing workspace with holographic AI interfaces. Show floating data visualizations, neural network patterns in blue and purple gradients, and subtle robotic elements symbolizing automation. Clean, professional aesthetic with a futuristic feel. 16:9 aspect ratio, vibrant but not overwhelming colors, corporate-friendly style.`;

console.log('LinkedIn Post:');
console.log('-'.repeat(60));
console.log(mockLinkedInPost);
console.log('\n' + '-'.repeat(60));
console.log('\nImage Prompt:');
console.log('-'.repeat(60));
console.log(mockImagePrompt);

console.log('\n' + '='.repeat(60));
console.log('\n✨ Test information displayed successfully!\n');
