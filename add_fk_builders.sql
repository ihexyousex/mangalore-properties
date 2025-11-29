ALTER TABLE projects
ADD CONSTRAINT fk_projects_builders
FOREIGN KEY (builder_id)
REFERENCES builders (id);
