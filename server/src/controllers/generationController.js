import * as generationService from '../services/generationService.js';

/**
 * POST /api/generate
 * Generate LinkedIn content from article
 */
export async function generateContent(req, res) {
  try {
    const { articleId, tone } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        error: 'articleId is required'
      });
    }

    console.log(`\n🚀 Starting content generation for article: ${articleId}`);

    const content = await generationService.generateContentForArticle(articleId, tone);

    res.json({
      success: true,
      message: 'Content generated successfully',
      content
    });

  } catch (error) {
    console.error('Error generating content:', error);

    // Handle specific errors
    if (error.message.includes('Article not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }

    if (error.message.includes('API key')) {
      return res.status(500).json({
        success: false,
        error: 'AI service configuration error. Please check API keys.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /api/generate
 * Get all generated contents
 */
export async function getGeneratedContents(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const contents = generationService.getAllGeneratedContents(limit);

    res.json({
      success: true,
      count: contents.length,
      contents
    });
  } catch (error) {
    console.error('Error getting generated contents:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * GET /api/generate/:id
 * Get single generated content
 */
export async function getGeneratedContentById(req, res) {
  try {
    const { id } = req.params;
    const content = generationService.getGeneratedContentById(id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: 'Generated content not found'
      });
    }

    res.json({
      success: true,
      content
    });
  } catch (error) {
    console.error('Error getting generated content:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * PUT /api/generate/:id
 * Update generated content (manual edits)
 */
export async function updateGeneratedContent(req, res) {
  try {
    const { id } = req.params;
    const updates = req.body;

    const content = generationService.updateGeneratedContent(id, updates);

    res.json({
      success: true,
      message: 'Content updated successfully',
      content
    });
  } catch (error) {
    console.error('Error updating generated content:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

/**
 * DELETE /api/generate/:id
 * Delete generated content
 */
export async function deleteGeneratedContent(req, res) {
  try {
    const { id } = req.params;
    const result = generationService.deleteGeneratedContent(id);

    res.json({
      success: true,
      message: 'Content deleted successfully',
      ...result
    });
  } catch (error) {
    console.error('Error deleting generated content:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}

export default {
  generateContent,
  getGeneratedContents,
  getGeneratedContentById,
  updateGeneratedContent,
  deleteGeneratedContent
};
