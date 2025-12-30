import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Uploads directory
const UPLOADS_DIR = join(__dirname, '..', '..', 'uploads');

/**
 * Download image from URL and save locally
 * @param {string} imageUrl - URL of the image to download
 * @param {string} contentId - ID of the generated content
 * @returns {Promise<string>} Local file path
 */
export async function downloadAndSaveImage(imageUrl, contentId) {
  console.log(`📥 Downloading image...`);

  try {
    // Generate filename
    const timestamp = Date.now();
    const hash = createHash('md5').update(contentId).digest('hex').slice(0, 8);
    const filename = `linkedin-${hash}-${timestamp}.png`;
    const filepath = join(UPLOADS_DIR, filename);

    // Download image
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to download image: ${response.statusText}`);
    }

    // Save to file
    const fileStream = createWriteStream(filepath);
    await pipeline(response.body, fileStream);

    console.log(`✅ Image saved: ${filename}`);
    console.log(`   Path: ${filepath}`);

    // Return relative path for database
    return `/uploads/${filename}`;

  } catch (error) {
    console.error(`❌ Error downloading image:`, error.message);
    throw error;
  }
}

/**
 * Get absolute path for uploaded image
 */
export function getImagePath(relativePath) {
  return join(__dirname, '..', '..', relativePath);
}

/**
 * Generate image URL for client
 */
export function getImageUrl(relativePath, baseUrl = '') {
  return `${baseUrl}${relativePath}`;
}

export default {
  downloadAndSaveImage,
  getImagePath,
  getImageUrl
};
