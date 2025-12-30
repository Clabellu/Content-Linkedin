// Shared constants between client and server

export const ARTICLE_STATUS = {
  NEW: 'new',
  PROCESSED: 'processed',
  REJECTED: 'rejected',
  ARCHIVED: 'archived'
};

export const CONTENT_STATUS = {
  DRAFT: 'draft',
  APPROVED: 'approved',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published'
};

export const SCHEDULE_STATUS = {
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published',
  CANCELLED: 'cancelled'
};

export const QUALITY_THRESHOLDS = {
  MIN_SCORE: 6,
  MAX_SCORE: 10
};

export const CONTENT_TONE = {
  PROFESSIONAL: 'professional',
  CASUAL: 'casual',
  INSPIRATIONAL: 'inspirational'
};
