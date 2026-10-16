/*
# Create profiles table for زين نوت users

1. New Tables
- `profiles`
  - `id` (uuid, primary key, matches auth.users id)
  - `full_name` (text, user's full name)
  - `birth_date` (date, user's birth date)
  - `grade` (text, default 'الأول الإعدادي')
  - `account_type` (text, 'student' or 'parent')
  - `avatar_url` (text, optional profile picture URL)
  - `points` (integer, default 0 — gamification points)
  - `level` (integer, default 1 — user's current level)
  - `created_at` (timestamptz, default now())
  - `updated_at` (timestamptz, default now())

2. Security
- Enable RLS on `profiles`.
- Owner-scoped CRUD: each authenticated user can only access their own profile row.
- SELECT, INSERT, UPDATE, DELETE policies scoped to `auth.uid() = id`.
- The `id` column defaults to `auth.uid()` so inserts that omit it still satisfy the INSERT policy.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  birth_date date,
  grade text NOT NULL DEFAULT 'الأول الإعدادي',
  account_type text NOT NULL DEFAULT 'student' CHECK (account_type IN ('student', 'parent')),
  avatar_url text,
  points integer NOT NULL DEFAULT 0,
  level integer NOT NULL DEFAULT 1,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = id);
