ALTER TABLE projects ADD COLUMN IF NOT EXISTS user_id TEXT;
COMMENT ON COLUMN projects.user_id IS 'Phone number or ID of the user who listed the property';
