-- Migration: Add category column to projects table
-- This fixes the error: "column projects.category does not exist"
-- Affects: /lands, /commercial, /rent, /resale pages

-- Add the category column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Set default category for existing projects
-- You can customize this based on your data
UPDATE projects 
SET category = 'Residential' 
WHERE category IS NULL;

-- Optional: Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Optional: Add check constraint for valid categories
-- Uncomment if you want to restrict to specific categories
-- ALTER TABLE projects 
-- ADD CONSTRAINT check_category 
-- CHECK (category IN ('Residential', 'Commercial', 'Land', 'Rent', 'Resale'));
