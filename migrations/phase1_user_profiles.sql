-- Phase 1: User Profile System - Database Migration
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. Update projects table for user submissions
-- ============================================
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS submitted_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved',
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_submitted_by ON projects(submitted_by);
CREATE INDEX IF NOT EXISTS idx_projects_approval_status ON projects(approval_status);

-- ============================================
-- 2. Update leads table for user tracking
-- ============================================
ALTER TABLE leads 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'new';

CREATE INDEX IF NOT EXISTS idx_leads_user_id ON leads(user_id);

-- ============================================
-- 3. Create user_profiles table
-- ============================================
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  email_notifications BOOLEAN DEFAULT true,
  whatsapp_notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 4. Update favorites table (ensure it's correct)
-- ============================================
ALTER TABLE favorites 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

-- Enable RLS if not already
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policy
DROP POLICY IF EXISTS "Users can manage own favorites" ON favorites;
CREATE POLICY "Users can manage own favorites"
  ON favorites FOR ALL
  USING (auth.uid() = user_id);

-- ============================================
-- 5. Update projects RLS for user submissions
-- ============================================
-- Allow users to view their pending submissions
DROP POLICY IF EXISTS "Users can view own submissions" ON projects;
CREATE POLICY "Users can view own submissions"
  ON projects FOR SELECT
  USING (
    approval_status = 'approved' 
    OR submitted_by = auth.uid()
  );

-- Allow users to insert new submissions
DROP POLICY IF EXISTS "Users can insert submissions" ON projects;
CREATE POLICY "Users can insert submissions"
  ON projects FOR INSERT
  WITH CHECK (submitted_by = auth.uid());

-- Allow users to update their pending submissions
DROP POLICY IF EXISTS "Users can update own pending submissions" ON projects;
CREATE POLICY "Users can update own pending submissions"
  ON projects FOR UPDATE
  USING (
    submitted_by = auth.uid() 
    AND approval_status = 'pending'
  );

-- ============================================
-- 6. Create function to auto-create user profile
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name',
    NEW.raw_user_meta_data->>'phone'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 7. Create function to update user profile timestamp
-- ============================================
CREATE OR REPLACE FUNCTION public.update_user_profile_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_user_profile_updated ON user_profiles;
CREATE TRIGGER on_user_profile_updated
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_user_profile_timestamp();

-- ============================================
-- Migration Complete
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- Then verify tables were updated correctly
