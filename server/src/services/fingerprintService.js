import { createHash } from 'crypto';

/**
 * Generate a fingerprint for article deduplication
 * Based on normalized title + domain
 */
export function generateFingerprint(title, url) {
  // Normalize the title
  const normalizedTitle = title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '') // Remove special chars
    .split(/\s+/)                 // Split words
    .filter(w => w.length > 3)    // Only words > 3 chars
    .sort()                       // Sort alphabetically
    .join(' ');

  // Extract domain
  let domain;
  try {
    domain = new URL(url).hostname;
  } catch (error) {
    domain = 'unknown';
  }

  // Combine and hash
  const combined = `${normalizedTitle}|${domain}`;
  return createHash('sha256')
    .update(combined)
    .digest('hex')
    .slice(0, 16); // 16 chars is enough
}

/**
 * Check if an article can be used (not a duplicate or reuse allowed)
 */
export function canUseArticle(fingerprint, existingFingerprint, reuseAfterDays = 30) {
  if (!existingFingerprint) {
    return true; // Not seen before
  }

  // Check if enough time has passed for reuse
  const daysSinceUse = (Date.now() - existingFingerprint.lastSeenAt) / (1000 * 60 * 60 * 24);
  return daysSinceUse > reuseAfterDays;
}

/**
 * Update fingerprint tracking
 */
export function createFingerprintData(fingerprint, articleUrl) {
  return {
    id: generateId(),
    fingerprint,
    articleUrl,
    firstSeenAt: Date.now(),
    lastSeenAt: Date.now(),
    useCount: 1
  };
}

/**
 * Update existing fingerprint
 */
export function updateFingerprintData(existingFingerprint) {
  return {
    ...existingFingerprint,
    lastSeenAt: Date.now(),
    useCount: existingFingerprint.useCount + 1
  };
}

// Helper to generate IDs
function generateId() {
  return createHash('sha256')
    .update(Date.now().toString() + Math.random().toString())
    .digest('base64url')
    .slice(0, 16);
}

export default {
  generateFingerprint,
  canUseArticle,
  createFingerprintData,
  updateFingerprintData
};
