-- Smart Wizard Listing System - Database Migration
-- This adds support for multi-type listings with approval workflow

-- Step 1: Add listing_type enum
DO $$ BEGIN
    CREATE TYPE listing_type AS ENUM (
        'builder_new',
        'resale_residential', 
        'rent_residential',
        'commercial_sell',
        'commercial_rent'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Add new columns to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS listing_type listing_type;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS property_meta JSONB DEFAULT '{}'::jsonb;

-- Step 3: Add approval system columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT true; -- Existing projects auto-approved
ALTER TABLE projects ADD COLUMN IF NOT EXISTS approved_by UUID;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS submitted_by TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS draft_data JSONB;

-- Step 4: Add foreign key for approved_by (if auth.users exists and constraint doesn't exist)
DO $$ BEGIN
    -- Check if constraint already exists
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_projects_approved_by'
    ) THEN
        ALTER TABLE projects 
        ADD CONSTRAINT fk_projects_approved_by 
        FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;
EXCEPTION
    WHEN undefined_table THEN null;
END $$;

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_listing_type ON projects(listing_type);
CREATE INDEX IF NOT EXISTS idx_projects_is_approved ON projects(is_approved);
CREATE INDEX IF NOT EXISTS idx_projects_property_meta ON projects USING GIN (property_meta);

-- Step 6: Update existing projects to have default listing_type based on category/type
UPDATE projects 
SET listing_type = CASE
    WHEN type = 'Rent' THEN 'rent_residential'::listing_type
    WHEN category = 'Resale' THEN 'resale_residential'::listing_type
    WHEN category = 'Commercial' AND type LIKE '%Rent%' THEN 'commercial_rent'::listing_type
    WHEN category = 'Commercial' THEN 'commercial_sell'::listing_type
    ELSE 'builder_new'::listing_type
END
WHERE listing_type IS NULL;

-- Step 7: Verify migration
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('listing_type', 'property_meta', 'is_approved', 'draft_data')
ORDER BY column_name;
