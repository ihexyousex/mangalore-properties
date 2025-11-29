-- Add new columns for detailed property information

-- General / New Projects
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_units int;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_size text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS launch_date date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS possession_date date;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS rera_id text;

-- Resale / Rent / Commercial
ALTER TABLE projects ADD COLUMN IF NOT EXISTS carpet_area text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS floor_number text; -- e.g. "5th" or "Ground"
ALTER TABLE projects ADD COLUMN IF NOT EXISTS total_floors int;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS furnished_status text; -- "Furnished", "Semi-Furnished", "Unfurnished"
ALTER TABLE projects ADD COLUMN IF NOT EXISTS bathrooms int;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS parking_count text; -- "1 Covered", "2 Open"
ALTER TABLE projects ADD COLUMN IF NOT EXISTS maintenance_charges text; -- e.g. "2000/month"

-- Rent Specific
ALTER TABLE projects ADD COLUMN IF NOT EXISTS security_deposit text;
ALTER TABLE projects ADD COLUMN IF NOT EXISTS preferred_tenants text; -- "Family", "Bachelors", "Any"
