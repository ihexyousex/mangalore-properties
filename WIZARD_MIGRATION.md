# Smart Wizard Migration Instructions

## Prerequisites

Before running the migration, ensure you have:
- Access to Supabase SQL Editor
- Backup of your `projects` table (optional but recommended)

## Step 1: Run the Database Migration

1. Open your **Supabase Dashboard**
2. Navigate to **SQL Editor** in the sidebar
3. Copy the contents of `migrations/add_wizard_fields.sql`
4. Paste into SQL Editor
5. Click **RUN**

You should see output confirming:
- `listing_type` enum created
- New columns added (`listing_type`, `property_meta`, `is_approved`, etc.)
- Indexes created
- Existing projects migrated to default listing types

## Step 2: Verify the Migration

Run this SQL to check:

```sql
SELECT 
    id,
    name,
    listing_type,
    is_approved,
    property_meta
FROM projects
LIMIT 5;
```

You should see:
- `listing_type` populated for existing rows
- `is_approved` set to `true` for existing projects
- `property_meta` as empty JSON `{}`

## Step 3: Configure AI Service (Optional)

The wizard includes AI description generation. To enable:

1. Choose your AI provider (OpenAI, Anthropic, or Gemini)
2. Add to `.env.local`:

```bash
# For OpenAI
NEXT_PUBLIC_AI_PROVIDER=openai
OPENAI_API_KEY=sk-...

# For Anthropic Claude
NEXT_PUBLIC_AI_PROVIDER=anthropic
ANTHROPIC_API_KEY=sk-ant-...

# For Google Gemini
NEXT_PUBLIC_AI_PROVIDER=gemini
GOOGLE_AI_API_KEY=...
```

If no API key is provided, the wizard will use a template-based fallback.

## Step 4: Test the Wizard

1. Navigate to http://localhost:3000/admin/projects/add
2. You should see the new 4-step wizard interface
3. Test each listing type:
   - Builder/New Construction
   - Resale Property
   - Rental Home
   - Commercial Space

## Step 5: Rollback (If Needed)

If you need to revert to the old form:

Edit `app/admin/projects/add/page.tsx`:

```typescript
// Comment out new wizard
// import ListingWizard from "@/components/admin/ListingWizard";
// return <ListingWizard />;

// Uncomment old form
import ProjectForm from "@/components/admin/ProjectForm";
return <ProjectForm />;
```

The database migration is non-destructive - existing data remains intact.

## Troubleshooting

**Issue: "column does not exist" error**
- Solution: Rerun the migration SQL

**Issue: AI generation not working**
- Solution: Check API key in `.env.local` and provider setting

**Issue: Toast notifications not showing**
- Solution: Verify `sonner` is installed (`npm list sonner`)

**Issue: Map not loading**
- Solution: Check `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`
