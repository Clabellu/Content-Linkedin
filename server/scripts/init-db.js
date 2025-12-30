import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, '..', 'dev.db');
const sqlPath = join(__dirname, '..', 'prisma', 'init.sql');

console.log('🗄️  Initializing database...');
console.log(`📁 Database path: ${dbPath}`);

try {
  const db = new Database(dbPath);
  const sql = readFileSync(sqlPath, 'utf-8');

  // Split by semicolons and execute each statement
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`📝 Executing ${statements.length} SQL statements...`);

  for (const statement of statements) {
    try {
      db.exec(statement);
    } catch (error) {
      console.error(`❌ Error executing statement: ${error.message}`);
      console.error(`Statement: ${statement.substring(0, 100)}...`);
    }
  }

  // Verify tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log(`\n✅ Created ${tables.length} tables:`);
  tables.forEach(t => console.log(`   - ${t.name}`));

  db.close();
  console.log('\n✨ Database initialized successfully!');
} catch (error) {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
}
