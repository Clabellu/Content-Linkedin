import db from '../src/config/database.js';

console.log('📊 LinkedIn Content Automation - Database Viewer\n');
console.log('='.repeat(60));

try {
  // Get stats
  const stats = db.getStats();

  console.log('\n📈 DATABASE STATISTICS\n');
  console.log(`Sources:      ${stats.sources}`);
  console.log(`Articles:     ${stats.articles}`);
  console.log(`Contents:     ${stats.contents}`);
  console.log(`Schedules:    ${stats.schedules}`);
  console.log(`Fingerprints: ${stats.fingerprints}`);

  // Show sources
  console.log('\n' + '='.repeat(60));
  console.log('\n📰 RSS SOURCES\n');

  const sources = db.getAllSources();
  sources.forEach((source, idx) => {
    console.log(`${idx + 1}. ${source.name}`);
    console.log(`   Type: ${source.type} | Category: ${source.category} | Priority: ${source.priority}`);
    console.log(`   URL: ${source.url}`);
    console.log('');
  });

  // Show recent articles (if any)
  if (stats.articles > 0) {
    console.log('='.repeat(60));
    console.log('\n📄 RECENT ARTICLES (Last 5)\n');

    const articles = db.getAllArticles(5);
    articles.forEach((article, idx) => {
      console.log(`${idx + 1}. ${article.title}`);
      console.log(`   Source: ${article.source}`);
      console.log(`   Quality Score: ${article.qualityScore}/10 | Status: ${article.status}`);
      console.log(`   URL: ${article.url}`);
      console.log('');
    });
  }

  console.log('='.repeat(60));
  console.log('\n✨ Database view complete!\n');

  db.closeDb();
} catch (error) {
  console.error('❌ Error viewing database:', error);
  process.exit(1);
}
