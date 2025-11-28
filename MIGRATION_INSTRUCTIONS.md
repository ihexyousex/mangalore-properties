# How to Add Category Column to Projects Table

## ⚠️ IMPORTANT: Manual Migration Required

The automatic migration script cannot run because Supabase doesn't allow DDL operations via the JavaScript client for security reasons. You need to run the SQL manually.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (in the left sidebar)
3. Click **New Query**

### Step 2: Copy and Paste This SQL

```sql
-- Migration: Add category column to projects table
-- This fixes the error: "column projects.category does not exist"
-- Affects: /lands, /commercial, /resale pages

-- Add the category column
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category TEXT;

-- Set default category for existing projects
-- You can customize this based on your data
UPDATE projects 
SET category = 'Residential' 
WHERE category IS NULL;

-- Optional: Add an index for better query performance
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
```

### Step 3: Run the Query

1. Click the **Run** button (or press `Ctrl+Enter`)
2. Wait for the success message
3. Verify the column was added

### Step 4: Verify the Migration

Run this query to check the column exists:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name = 'category';
```

You should see:
```
column_name | data_type
------------|----------
category    | text
```

---

## 🔄 After Migration: Update Your Data

Once the column is added, you'll need to set the correct category for your existing projects:

```sql
-- Set categories based on project type
UPDATE projects SET category = 'Land' WHERE type = 'Plot' OR title ILIKE '%plot%' OR title ILIKE '%land%';
UPDATE projects SET category = 'Commercial' WHERE type = 'Commercial' OR title ILIKE '%commercial%';
UPDATE projects SET category = 'Resale' WHERE type = 'Resale' OR title ILIKE '%resale%';
UPDATE projects SET category = 'Residential' WHERE category IS NULL;
```

**OR** if you want to be more precise, update each project manually in the Supabase Table Editor.

---

## 📄 Files Created

I've created these files in your project:

1. **[add_category_column.sql](file:///c:/mangalore-properties/add_category_column.sql)** - The SQL migration script
2. **[run_category_migration.js](file:///c:/mangalore-properties/run_category_migration.js)** - Attempted auto-runner (requires RPC, not available)

---

## ✅ Verification

After running the migration, test these pages:

- ✅ **http://localhost:3000/lands** - Should show land properties
- ✅ **http://localhost:3000/commercial** - Should show commercial properties  
- ✅ **http://localhost:3000/resale** - Should show resale properties

All three pages should work correctly once the `category` column exists and is populated with data!

---

## 🚨 Quick Reference: Affected Pages

| Page | Query Filter | Status |
|------|--------------|--------|
| `/lands` | `.eq('category', 'Land')` | ❌ Broken |
| `/commercial` | `.eq('category', 'Commercial')` | ❌ Broken |
| `/resale` | `.eq('category', 'Resale')` | ❌ Broken |
| `/rent` | `.eq('type', 'Rent')` | ✅ Working |
| `/projects` | No category filter | ✅ Working |
