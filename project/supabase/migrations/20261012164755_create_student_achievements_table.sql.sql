/*
# Create student_achievements table for admin-issued certificates and achievements

1. New Tables
- `student_achievements`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, defaults to auth.uid())
  - `type` (text, 'certificate' or 'achievement')
  - `title` (text, title of the achievement/certificate)
  - `description` (text, description of what the student did)
  - `points_awarded` (integer, points given with this achievement, default 0)
  - `issued_at` (timestamptz, when the admin issued it, default now())
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `student_achievements`.
- SELECT: authenticated users can only read their own achievements.
- INSERT/UPDATE/DELETE: authenticated users can manage their own rows.
  In practice, the admin (service role) will insert achievements for students.
  The INSERT policy allows users to insert their own rows (needed if admin acts as the user),
  but the real admin insert goes through the service role key which bypasses RLS.

3. Indexes
- Index on `user_id` for fast lookups.
- Index on `type` for filtering by achievement type.
*/

CREATE TABLE IF NOT EXISTS student_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('certificate', 'achievement')),
  title text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  points_awarded integer NOT NULL DEFAULT 0,
  issued_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE student_achievements ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_achievements" ON student_achievements;
CREATE POLICY "select_own_achievements"
ON student_achievements FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_achievements" ON student_achievements;
CREATE POLICY "insert_own_achievements"
ON student_achievements FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_achievements" ON student_achievements;
CREATE POLICY "update_own_achievements"
ON student_achievements FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_achievements" ON student_achievements;
CREATE POLICY "delete_own_achievements"
ON student_achievements FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_student_achievements_user_id ON student_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_student_achievements_type ON student_achievements(type);