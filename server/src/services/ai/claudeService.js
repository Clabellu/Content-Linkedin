import Anthropic from '@anthropic-ai/sdk';
import { withRetry } from '../../utils/retry.js';
import { LINKEDIN_REWRITE_PROMPT, fillTemplate, TONES } from './promptTemplates.js';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

/**
 * Generate LinkedIn post from article using Claude
 * @param {Object} article - Article object
 * @param {string} tone - Tone for the post (professional, casual, inspirational)
 * @returns {Promise<Object>} Generated content { linkedinPost, imagePrompt }
 */
export async function generateLinkedInPost(article, tone = TONES.PROFESSIONAL) {
  console.log(`🤖 Generating LinkedIn post with Claude (tone: ${tone})...`);

  // Fill prompt template
  const prompt = fillTemplate(LINKEDIN_REWRITE_PROMPT, article, tone);

  // Call Claude API with retry
  const result = await withRetry(
    async () => {
      const message = await anthropic.messages.create({
        model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20250929',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: prompt
        }]
      });

      return message;
    },
    {
      maxRetries: 3,
      initialDelay: 2000,
      onRetry: (attempt, maxRetries, delay, error) => {
        console.log(`⏳ Claude API retry ${attempt}/${maxRetries} after ${delay}ms...`);
        console.log(`   Error: ${error.message}`);
      }
    }
  );

  // Extract text from response
  const responseText = result.content[0].text;

  // Parse JSON response
  let parsedResponse;
  try {
    // Try to extract JSON from response (in case there's extra text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      parsedResponse = JSON.parse(jsonMatch[0]);
    } else {
      parsedResponse = JSON.parse(responseText);
    }
  } catch (error) {
    console.error('❌ Failed to parse Claude response as JSON:', error.message);
    console.error('Response:', responseText);
    throw new Error('Claude response is not valid JSON');
  }

  // Validate response structure
  if (!parsedResponse.linkedin_post || !parsedResponse.image_prompt) {
    console.error('❌ Invalid Claude response structure');
    console.error('Response:', parsedResponse);
    throw new Error('Claude response missing required fields');
  }

  console.log('✅ LinkedIn post generated successfully');
  console.log(`   Post length: ${parsedResponse.linkedin_post.length} characters`);
  console.log(`   Image prompt length: ${parsedResponse.image_prompt.length} characters`);

  return {
    linkedinPost: parsedResponse.linkedin_post,
    imagePrompt: parsedResponse.image_prompt
  };
}

/**
 * Test Claude API connection
 */
export async function testClaudeConnection() {
  try {
    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 50,
      messages: [{
        role: 'user',
        content: 'Rispondi solo con "OK" se ricevi questo messaggio.'
      }]
    });

    return {
      success: true,
      model: message.model,
      response: message.content[0].text
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

export default {
  generateLinkedInPost,
  testClaudeConnection
};
