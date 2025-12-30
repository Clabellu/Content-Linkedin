import { getDb } from '../src/config/database.js';

console.log('🧪 Testing OpenAI Image Generation System\n');
console.log('='.repeat(60));

const db = getDb();

// Get first generated content with image prompt
const content = db.prepare(`
  SELECT * FROM GeneratedContent
  WHERE imagePrompt IS NOT NULL
  ORDER BY createdAt DESC
  LIMIT 1
`).get();

if (!content) {
  console.log('\n❌ No generated content with image prompt found!');
  console.log('   Run content generation first:');
  console.log('   curl -X POST http://localhost:3001/api/generate \\');
  console.log('     -H "Content-Type: application/json" \\');
  console.log('     -d \'{"articleId": "article_id", "tone": "professional"}\'');
  process.exit(1);
}

console.log('\n📝 Selected Content for Image Generation:\n');
console.log(`   Content ID: ${content.id}`);
console.log(`   Article ID: ${content.articleId}`);
console.log(`   Status: ${content.status}`);
console.log(`   Has Image: ${content.imageUrl ? 'YES ✅' : 'NO ❌'}`);

if (content.imagePrompt) {
  console.log(`\n   Image Prompt:`);
  console.log(`   "${content.imagePrompt.substring(0, 150)}..."`);
}

console.log('\n' + '='.repeat(60));
console.log('\n⚠️  NOTE: This test requires a valid OPENAI_API_KEY in .env');
console.log('\nTo test the image generation system:');
console.log('\n1. Add your API key to server/.env:');
console.log('   OPENAI_API_KEY=sk-your-key-here');
console.log('\n2. Start the server:');
console.log('   npm run dev');
console.log('\n3. Generate image:');
console.log(`   curl -X POST http://localhost:3001/api/generate/${content.id}/image \\`);
console.log(`     -H "Content-Type: application/json" \\`);
console.log(`     -d '{}'`);

console.log('\n' + '='.repeat(60));
console.log('\n📋 Expected Response:\n');
console.log(JSON.stringify({
  success: true,
  message: 'Image generated successfully',
  content: {
    id: content.id,
    articleId: content.articleId,
    linkedinText: '...',
    imageUrl: '/uploads/linkedin-abc123-1234567890.png',
    imagePrompt: content.imagePrompt,
    generationModel: 'claude-sonnet-4-5',
    tone: 'professional',
    status: 'draft'
  }
}, null, 2));

console.log('\n' + '='.repeat(60));
console.log('\n🎨 Image Generation Features:\n');
console.log('✅ OpenAI DALL-E 3 integration');
console.log('✅ Dynamic prompts from Claude (unique per post)');
console.log('✅ Auto-download and save locally');
console.log('✅ Retry logic with exponential backoff');
console.log('✅ Professional style guidelines applied');
console.log('✅ Served via /uploads endpoint');

console.log('\n' + '='.repeat(60));
console.log('\n💰 Cost Estimate:\n');
console.log('   Standard quality: ~$0.040 per image');
console.log('   HD quality: ~$0.080 per image');
console.log('   Size: 1024x1024 (default)');

console.log('\n' + '='.repeat(60));
console.log('\n📝 Available Options:\n');
console.log(JSON.stringify({
  size: '1024x1024 | 1024x1792 | 1792x1024',
  quality: 'standard | hd',
  model: 'dall-e-3'
}, null, 2));

console.log('\n' + '='.repeat(60));
console.log('\n✨ Test information displayed successfully!\n');
