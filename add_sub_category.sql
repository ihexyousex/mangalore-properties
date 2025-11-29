-- Add sub_category column to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS sub_category text;

-- Create an index for faster filtering by sub_category
CREATE INDEX IF NOT EXISTS idx_projects_sub_category ON projects(sub_category);

-- Comment on column
COMMENT ON COLUMN projects.sub_category IS 'Sub-category for Rent properties (e.g., House, Apartment, Commercial, Land)';
