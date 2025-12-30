import OpenAI from 'openai';
import { withRetry } from '../../utils/retry.js';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Base style guidelines for all generated images
 */
const IMAGE_BASE_STYLE = `
Style requirements:
- Modern, clean design
- Corporate color palette (blues, whites, subtle gradients)
- Professional LinkedIn aesthetic
- 16:9 or square aspect ratio
- No faces or specific brand logos
- Minimal text (max 3-5 words if any)
- Tech-forward, contemporary feel
`;

/**
 * Generate image from prompt using OpenAI DALL-E
 * @param {string} dynamicPrompt - Custom prompt from Claude
 * @param {Object} options - Generation options
 * @returns {Promise<string>} URL of generated image
 */
export async function generateImage(dynamicPrompt, options = {}) {
  const {
    size = '1024x1024',
    quality = 'standard', // standard or hd
    model = 'dall-e-3'
  } = options;

  console.log(`🎨 Generating image with OpenAI DALL-E...`);
  console.log(`   Model: ${model}`);
  console.log(`   Size: ${size}`);
  console.log(`   Quality: ${quality}`);

  // Combine dynamic prompt with style guidelines
  const fullPrompt = `${dynamicPrompt}\n\n${IMAGE_BASE_STYLE}`.trim();

  // Generate image with retry logic
  const result = await withRetry(
    async () => {
      const response = await openai.images.generate({
        model,
        prompt: fullPrompt,
        n: 1,
        size,
        quality,
        response_format: 'url'
      });

      return response;
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
      onRetry: (attempt, maxRetries, delay, error) => {
        console.log(`⏳ OpenAI API retry ${attempt}/${maxRetries} after ${delay}ms...`);
        console.log(`   Error: ${error.message}`);
      }
    }
  );

  const imageUrl = result.data[0].url;

  console.log(`✅ Image generated successfully`);
  console.log(`   URL: ${imageUrl.substring(0, 80)}...`);

  return imageUrl;
}

/**
 * Test OpenAI API connection
 */
export async function testOpenAIConnection() {
  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: 'A simple white square on a blue background. Minimalist.',
      n: 1,
      size: '1024x1024',
      quality: 'standard'
    });

    return {
      success: true,
      model: 'dall-e-3',
      imageUrl: response.data[0].url
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  generateImage,
  testOpenAIConnection
};
