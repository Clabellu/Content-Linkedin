import express from 'express';
import * as generationController from '../controllers/generationController.js';

const router = express.Router();

// POST /api/generate - Generate content from article
router.post('/', generationController.generateContent);

// GET /api/generate - Get all generated contents
router.get('/', generationController.getGeneratedContents);

// GET /api/generate/:id - Get single generated content
router.get('/:id', generationController.getGeneratedContentById);

// PUT /api/generate/:id - Update generated content
router.put('/:id', generationController.updateGeneratedContent);

// DELETE /api/generate/:id - Delete generated content
router.delete('/:id', generationController.deleteGeneratedContent);

// POST /api/generate/:id/image - Generate image for content
router.post('/:id/image', generationController.generateImage);

export default router;
