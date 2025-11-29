-- Update Master Admin email
UPDATE admins
SET email = 'admin@mangaloreproperties.in'
WHERE email = 'admin@mangaloreproperties.com';

-- Update Partner Admin email
UPDATE admins
SET email = 'partner@mangaloreproperties.in'
WHERE email = 'partner@mangaloreproperties.com';
