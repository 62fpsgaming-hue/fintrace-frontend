# Database Migrations

This directory contains SQL migrations for the Supabase database.

## How to Apply Migrations

### Option 1: Using Supabase CLI (Recommended)

1. Install Supabase CLI if you haven't already:
```bash
npm install -g supabase
```

2. Link your project:
```bash
cd dashboard
supabase link --project-ref your-project-ref
```

3. Apply migrations:
```bash
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `001_enhanced_user_system.sql`
4. Paste and run the SQL in the editor

### Option 3: Manual Application

1. Connect to your Supabase database using your preferred SQL client
2. Execute the SQL file contents in order

## Migration Files

### 001_enhanced_user_system.sql

This migration creates the enhanced user management system with the following tables:

- `user_profiles` - Extended user profile information
- `user_settings` - User preferences and settings
- `analysis_history` - Enhanced with tags, notes, and favorites
- `saved_filters` - User's saved filter configurations
- `shared_analyses` - Analysis sharing and collaboration
- `activity_log` - User activity tracking

All tables include Row Level Security (RLS) policies to ensure users can only access their own data.

## Verification

After applying the migration, verify it was successful:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
  'user_profiles',
  'user_settings', 
  'analysis_history',
  'saved_filters',
  'shared_analyses',
  'activity_log'
);

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'user_profiles',
  'user_settings',
  'analysis_history', 
  'saved_filters',
  'shared_analyses',
  'activity_log'
);
```

## Rollback

If you need to rollback this migration:

```sql
-- Drop tables in reverse order (respecting foreign keys)
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS shared_analyses CASCADE;
DROP TABLE IF EXISTS saved_filters CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- Note: analysis_history table modifications would need to be reverted manually
-- if you had an existing analysis_history table
```

## Notes

- The migration is idempotent - it uses `IF NOT EXISTS` clauses where possible
- Existing `analysis_history` table will be altered to add new columns
- All new tables have RLS enabled by default
- Indexes are created for optimal query performance
