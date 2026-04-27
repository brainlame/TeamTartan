-- Complete Setup Script for TeamTartan
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/pqbwoypiibednfzibtkp/sql

-- ==================================
-- STEP 1: Create Events Table
-- ==================================

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  participants TEXT[] DEFAULT '{}',
  max_participants INTEGER,
  creator_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ==================================
-- STEP 2: Add max_participants if missing
-- ==================================

ALTER TABLE events ADD COLUMN IF NOT EXISTS max_participants INTEGER;
ALTER TABLE events ADD COLUMN IF NOT EXISTS creator_id UUID REFERENCES auth.users(id);

-- ==================================
-- STEP 3: Enable Row Level Security
-- ==================================

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- ==================================
-- STEP 4: Drop existing policies
-- ==================================

DROP POLICY IF EXISTS "Allow all operations on events" ON events;
DROP POLICY IF EXISTS "Allow public read access to events" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to insert events" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to update events" ON events;
DROP POLICY IF EXISTS "Allow authenticated users to delete events" ON events;

-- ==================================
-- STEP 5: Create new policies
-- ==================================

-- Allow ANYONE (logged in or not) to view events
CREATE POLICY "Enable read access for all users"
ON events FOR SELECT
USING (true);

-- Allow authenticated users to insert events
CREATE POLICY "Enable insert for authenticated users only"
ON events FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update any event (you can restrict to creator later)
CREATE POLICY "Enable update for authenticated users only"
ON events FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete any event (you can restrict to creator later)
CREATE POLICY "Enable delete for authenticated users only"
ON events FOR DELETE
TO authenticated
USING (true);

-- ==================================
-- STEP 6: Create updated_at trigger
-- ==================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_events_updated_at ON events;

CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON events
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ==================================
-- STEP 7: Create Profiles Table (if needed)
-- ==================================

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  year TEXT,
  profile_picture_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing profile policies
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on id" ON profiles;

-- Allow anyone to view profiles (for participant names)
CREATE POLICY "Enable read access for all users"
ON profiles FOR SELECT
USING (true);

-- Allow authenticated users to insert their own profile
CREATE POLICY "Enable insert for authenticated users only"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Enable update for users based on id"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ==================================
-- STEP 8: Verify Everything
-- ==================================

-- Check if events table exists and has correct columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'events'
ORDER BY ordinal_position;

-- Check RLS policies on events
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'events';

-- Check if profiles table exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check RLS policies on profiles
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'profiles';
