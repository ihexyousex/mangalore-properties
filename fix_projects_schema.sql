-- Rename columns to match ProjectForm
ALTER TABLE projects RENAME COLUMN name TO title;
ALTER TABLE projects RENAME COLUMN type TO category;
ALTER TABLE projects RENAME COLUMN price TO price_text;
ALTER TABLE projects RENAME COLUMN image TO cover_image_url;

-- Add missing columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS gallery_images text[];

-- Handle builder column
-- First, check if builder is text or int. If text, we might need to map it or drop it.
-- For now, let's rename it to builder_id_old if it's not compatible, or try to cast.
-- Assuming 'builder' was text name. We want 'builder_id' as int FK.
-- Let's add builder_id column and try to populate it later, or just leave it null.
ALTER TABLE projects ADD COLUMN IF NOT EXISTS builder_id int;

-- Drop obsolete columns if desired, or keep them.
-- ALTER TABLE projects DROP COLUMN IF EXISTS builder; 
-- Keeping 'builder' for now to avoid data loss, but ProjectForm uses builder_id.

-- Make sure sub_category exists (it was added before)
-- ALTER TABLE projects ADD COLUMN IF NOT EXISTS sub_category text;
