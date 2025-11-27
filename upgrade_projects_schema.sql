
-- Add new columns to the 'projects' table

-- 1. Completion Percentage (0-100)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0;

-- 2. Floor Plans (JSONB to store array of objects: { name: '5BHK', image: 'url' })
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS floor_plans JSONB DEFAULT '[]'::jsonb;

-- 3. Map URL (Google Maps Embed Link)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS map_url TEXT;

-- 4. AI Local Insight (Neighborhood analysis)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS ai_local_insight TEXT;
