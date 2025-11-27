-- Add new comprehensive property detail columns
ALTER TABLE projects ADD COLUMN IF NOT EXISTS lifts_count INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS balconies_count INTEGER;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS facing TEXT;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS price_per_sqft DECIMAL(10,2);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS additional_rooms JSONB DEFAULT '[]'::jsonb;

-- Add comment for documentation
COMMENT ON COLUMN projects.lifts_count IS 'Number of lifts/elevators in the building';
COMMENT ON COLUMN projects.balconies_count IS 'Number of balconies in the unit';
COMMENT ON COLUMN projects.facing IS 'Direction the property faces (North, South, East, West, etc.)';
COMMENT ON COLUMN projects.price_per_sqft IS 'Price per square foot';
COMMENT ON COLUMN projects.additional_rooms IS 'Array of additional rooms like Study, Servant Room, Pooja Room, etc.';
