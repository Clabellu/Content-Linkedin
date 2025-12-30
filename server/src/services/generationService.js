import { getDb } from '../config/database.js';
import { generateLinkedInPost } from './ai/claudeService.js';
import { createHash } from 'crypto';

/**
 * Generate unique ID
 */
function generateId() {
  return createHash('sha256')
    .update(Date.now().toString() + Math.random().toString())
    .digest('base64url')
    .slice(0, 16);
}

/**
 * Generate LinkedIn content for an article
 * @param {string} articleId - Article ID from database
 * @param {string} tone - Tone for generation (professional, casual, inspirational)
 * @returns {Promise<Object>} Generated content object
 */
export async function generateContentForArticle(articleId, tone = 'professional') {
  const db = getDb();

  // Get article from database
  const article = db.prepare('SELECT * FROM Article WHERE id = ?').get(articleId);

  if (!article) {
    throw new Error(`Article not found: ${articleId}`);
  }

  console.log(`\n📝 Generating content for: "${article.title.substring(0, 50)}..."`);
  console.log(`   Source: ${article.source}`);
  console.log(`   Quality: ${article.qualityScore}/10`);

  // Check if content already exists
  const existing = db.prepare(
    'SELECT * FROM GeneratedContent WHERE articleId = ? ORDER BY createdAt DESC LIMIT 1'
  ).get(articleId);

  if (existing) {
    console.log(`⚠️  Content already exists for this article (ID: ${existing.id})`);
    console.log(`   You can regenerate or use the existing one.`);
  }

  try {
    // Generate with Claude
    const { linkedinPost, imagePrompt } = await generateLinkedInPost(article, tone);

    // Save to database
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
      articleId,
      linkedinPost,
      imagePrompt,
      process.env.CLAUDE_MODEL || 'claude-sonnet-4-5',
      tone,
      'draft',
      now,
      now
    );

    // Update article status
    db.prepare('UPDATE Article SET status = ? WHERE id = ?').run('processed', articleId);

    console.log(`✅ Content generated and saved (ID: ${contentId})`);

    // Return the generated content
    const savedContent = db.prepare('SELECT * FROM GeneratedContent WHERE id = ?').get(contentId);

    return {
      ...savedContent,
      article: {
        id: article.id,
        title: article.title,
        url: article.url,
        source: article.source
      }
    };

  } catch (error) {
    console.error(`❌ Failed to generate content:`, error.message);
    throw error;
  }
}

/**
 * Get all generated contents
 */
export function getAllGeneratedContents(limit = 100) {
  const db = getDb();

  const contents = db.prepare(`
    SELECT gc.*, a.title as articleTitle, a.source as articleSource, a.url as articleUrl
    FROM GeneratedContent gc
    LEFT JOIN Article a ON gc.articleId = a.id
    ORDER BY gc.createdAt DESC
    LIMIT ?
  `).all(limit);

  return contents;
}

/**
 * Get generated content by ID
 */
export function getGeneratedContentById(id) {
  const db = getDb();

  const content = db.prepare(`
    SELECT gc.*, a.title as articleTitle, a.source as articleSource, a.url as articleUrl
    FROM GeneratedContent gc
    LEFT JOIN Article a ON gc.articleId = a.id
    WHERE gc.id = ?
  `).get(id);

  return content;
}

/**
 * Update generated content (manual edits)
 */
export function updateGeneratedContent(id, updates) {
  const db = getDb();

  const { editedText, status } = updates;

  const updateStmt = db.prepare(`
    UPDATE GeneratedContent
    SET editedText = ?, status = ?, updatedAt = ?
    WHERE id = ?
  `);

  updateStmt.run(
    editedText || null,
    status || 'draft',
    Date.now(),
    id
  );

  return getGeneratedContentById(id);
}

/**
 * Delete generated content
 */
export function deleteGeneratedContent(id) {
  const db = getDb();
  db.prepare('DELETE FROM GeneratedContent WHERE id = ?').run(id);
  return { success: true, id };
}

export default {
  generateContentForArticle,
  getAllGeneratedContents,
  getGeneratedContentById,
  updateGeneratedContent,
  deleteGeneratedContent
};
