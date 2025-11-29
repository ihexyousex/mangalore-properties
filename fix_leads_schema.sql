-- Fix leads table schema by adding potentially missing columns
ALTER TABLE leads ADD COLUMN IF NOT EXISTS message TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS property_id TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS builder_name TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS email TEXT;
