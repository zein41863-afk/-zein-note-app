/*
# Create student_points table for points history tracking

1. New Tables
- `student_points`
  - `id` (uuid, primary key)
  - `user_id` (uuid, references auth.users, defaults to auth.uid())
  - `points` (integer, points earned for this action — positive)
  - `action` (text, machine-readable action key: lesson_complete, quiz_complete, quiz_high_score, contest_win, friend_invite, daily_login, ai_teacher_use)
  - `description` (text, human-readable Arabic description of the action)
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `student_points`.
- Owner-scoped CRUD: each authenticated user can only access their own points rows.
- SELECT, INSERT, UPDATE, DELETE policies scoped to `auth.uid() = user_id`.
- The `user_id` column defaults to `auth.uid()` so inserts that omit it still satisfy the INSERT policy.

3. Indexes
- Index on `user_id` for fast lookups of a user's points history.
- Index on `created_at` (descending) for chronological ordering.
*/

CREATE TABLE IF NOT EXISTS student_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  points integer NOT NULL CHECK (points > 0),
  action text NOT NULL,
  description text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE student_points ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_points" ON student_points;
CREATE POLICY "select_own_points"
ON student_points FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_points" ON student_points;
CREATE POLICY "insert_own_points"
ON student_points FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_points" ON student_points;
CREATE POLICY "update_own_points"
ON student_points FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_points" ON student_points;
CREATE POLICY "delete_own_points"
ON student_points FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_student_points_user_id ON student_points(user_id);
CREATE INDEX IF NOT EXISTS idx_student_points_created_at ON student_points(created_at DESC);