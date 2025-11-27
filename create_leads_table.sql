-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    property_id TEXT,
    builder_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow public inserts (since we are using Mock Auth for now)
CREATE POLICY "Allow public inserts" ON leads
    FOR INSERT
    WITH CHECK (true);

-- Create a policy to allow reading only for authenticated users (optional, for admin dashboard later)
-- CREATE POLICY "Allow authenticated read" ON leads
--     FOR SELECT
--     USING (auth.role() = 'authenticated');
