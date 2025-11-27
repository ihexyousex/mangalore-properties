-- Make 'project' column nullable to support general inquiries
ALTER TABLE leads ALTER COLUMN project DROP NOT NULL;
