ALTER TABLE projects ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

COMMENT ON COLUMN projects.latitude IS 'Latitude coordinate of the property location';
COMMENT ON COLUMN projects.longitude IS 'Longitude coordinate of the property location';
