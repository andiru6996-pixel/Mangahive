-- ═══════════════════════════════════════════════════════════════════════════════
-- MANGAHIVE DATABASE MIGRATION: Add Video Drama Support
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/uhjptxhhaipckshgytul/sql
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────────────────────────────────────────
-- STEP 1: Add new columns to STORIES table
-- ─────────────────────────────────────────────────────────────────────────────────

-- Content type: 'manga' or 'video'
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'manga';

-- Preview video URL (for video stories - plays on detail page)
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS preview_url TEXT;

-- Update existing stories to be 'manga' type
UPDATE stories SET type = 'manga' WHERE type IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────────
-- STEP 2: Add new columns to CHAPTERS table
-- ─────────────────────────────────────────────────────────────────────────────────

-- Content type: 'manga' or 'video'  
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'manga';

-- Video URL for video episodes
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Duration in seconds for video episodes
ALTER TABLE chapters 
ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Update existing chapters to be 'manga' type
UPDATE chapters SET type = 'manga' WHERE type IS NULL;


-- ─────────────────────────────────────────────────────────────────────────────────
-- STEP 3: Create helper function to increment chapters_count
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION increment_chapters(story_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE stories 
  SET chapters_count = COALESCE(chapters_count, 0) + 1 
  WHERE id = story_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- ─────────────────────────────────────────────────────────────────────────────────
-- STEP 4: Add indexes for faster filtering
-- ─────────────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_stories_type ON stories(type);
CREATE INDEX IF NOT EXISTS idx_chapters_type ON chapters(type);


-- ─────────────────────────────────────────────────────────────────────────────────
-- VERIFICATION: Check the new columns exist
-- ─────────────────────────────────────────────────────────────────────────────────

-- Run this to verify:
-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'stories' AND column_name IN ('type', 'preview_url');

-- SELECT column_name, data_type FROM information_schema.columns 
-- WHERE table_name = 'chapters' AND column_name IN ('type', 'video_url', 'duration');


-- ═══════════════════════════════════════════════════════════════════════════════
-- DONE! Your database now supports both Manga and Video Drama content.
-- ═══════════════════════════════════════════════════════════════════════════════
