-- LinkedIn Content Automation - Database Schema
-- SQLite Migration

-- ========================================
-- ARTICLES Table
-- ========================================
CREATE TABLE IF NOT EXISTS Article (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    content TEXT,
    url TEXT UNIQUE NOT NULL,
    source TEXT NOT NULL,
    publishedAt INTEGER,
    fetchedAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),

    fingerprint TEXT UNIQUE NOT NULL,
    status TEXT NOT NULL DEFAULT 'new',
    category TEXT,
    qualityScore INTEGER NOT NULL DEFAULT 0,
    scoreBreakdown TEXT,

    createdAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
);

CREATE INDEX IF NOT EXISTS Article_status_idx ON Article(status);
CREATE INDEX IF NOT EXISTS Article_qualityScore_idx ON Article(qualityScore);
CREATE INDEX IF NOT EXISTS Article_category_idx ON Article(category);

-- ========================================
-- GENERATED CONTENTS Table
-- ========================================
CREATE TABLE IF NOT EXISTS GeneratedContent (
    id TEXT PRIMARY KEY,
    articleId TEXT NOT NULL,

    linkedinText TEXT NOT NULL,
    imageUrl TEXT,
    imagePrompt TEXT,

    generationModel TEXT NOT NULL DEFAULT 'claude-sonnet-4-5',
    tone TEXT NOT NULL DEFAULT 'professional',
    status TEXT NOT NULL DEFAULT 'draft',

    editedText TEXT,

    createdAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),

    FOREIGN KEY (articleId) REFERENCES Article(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS GeneratedContent_status_idx ON GeneratedContent(status);
CREATE INDEX IF NOT EXISTS GeneratedContent_articleId_idx ON GeneratedContent(articleId);

-- ========================================
-- SCHEDULES Table
-- ========================================
CREATE TABLE IF NOT EXISTS Schedule (
    id TEXT PRIMARY KEY,
    contentId TEXT NOT NULL,

    scheduledDate INTEGER NOT NULL,
    scheduledTime TEXT NOT NULL DEFAULT '09:00:00',
    dayOfWeek INTEGER,
    status TEXT NOT NULL DEFAULT 'scheduled',

    createdAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),

    FOREIGN KEY (contentId) REFERENCES GeneratedContent(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS Schedule_scheduledDate_idx ON Schedule(scheduledDate);
CREATE INDEX IF NOT EXISTS Schedule_status_idx ON Schedule(status);

-- ========================================
-- FINGERPRINTS Table
-- ========================================
CREATE TABLE IF NOT EXISTS Fingerprint (
    id TEXT PRIMARY KEY,
    fingerprint TEXT UNIQUE NOT NULL,
    articleUrl TEXT,

    firstSeenAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
    lastSeenAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000),
    useCount INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX IF NOT EXISTS Fingerprint_fingerprint_idx ON Fingerprint(fingerprint);

-- ========================================
-- SOURCES Table
-- ========================================
CREATE TABLE IF NOT EXISTS Source (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    url TEXT UNIQUE NOT NULL,
    category TEXT,
    isActive INTEGER NOT NULL DEFAULT 1,
    priority INTEGER NOT NULL DEFAULT 5,

    createdAt INTEGER NOT NULL DEFAULT (strftime('%s','now') * 1000)
);

CREATE INDEX IF NOT EXISTS Source_isActive_idx ON Source(isActive);
CREATE INDEX IF NOT EXISTS Source_category_idx ON Source(category);
