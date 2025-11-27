-- Add new columns to the builders table
ALTER TABLE builders 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS logo_url TEXT,
ADD COLUMN IF NOT EXISTS established_year INTEGER,
ADD COLUMN IF NOT EXISTS total_projects INTEGER,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS portfolio_images TEXT[]; -- Array of image URLs

-- Enable RLS if not already enabled (good practice)
ALTER TABLE builders ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public read access (if not already exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE tablename = 'builders' AND policyname = 'Public builders are viewable by everyone'
    ) THEN
        CREATE POLICY "Public builders are viewable by everyone" 
        ON builders FOR SELECT 
        USING (true);
    END IF;
END
$$;
