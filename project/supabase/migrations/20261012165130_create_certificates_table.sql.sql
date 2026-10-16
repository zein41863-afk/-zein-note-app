/*
# Create certificates table for student certificates

1. New Tables
- `certificates`
  - `id` (uuid, primary key)
  - `student_id` (uuid, references profiles id, ON DELETE CASCADE)
  - `student_name` (text, denormalized for display)
  - `certificate_type` (text, one of 9 types: course_completion, academic_excellence, contest_win, points_excellence, friend_invite, continuous_excellence, financial_reward, appreciation, special_achievement)
  - `grade` (text, student's grade, optional)
  - `subject` (text, subject name, optional)
  - `title` (text, certificate title shown on the card)
  - `description` (text, description of what the certificate is for)
  - `metadata` (jsonb, default '{}', for extra data like contest name, points, etc.)
  - `issue_date` (timestamptz, default now())
  - `status` (text, default 'active', CHECK in ('active', 'revoked'))

2. Security
- Enable RLS on `certificates`.
- SELECT: authenticated users can only read certificates issued to them.
- INSERT/UPDATE/DELETE: authenticated users can manage their own rows.
  Admin (service role) will insert certificates for students, bypassing RLS.

3. Indexes
- Index on `student_id` for fast lookups.
- Index on `certificate_type` for filtering by type.
*/

CREATE TABLE IF NOT EXISTS certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  student_name text NOT NULL DEFAULT '',
  certificate_type text NOT NULL CHECK (
    certificate_type IN (
      'course_completion',
      'academic_excellence',
      'contest_win',
      'points_excellence',
      'friend_invite',
      'continuous_excellence',
      'financial_reward',
      'appreciation',
      'special_achievement'
    )
  ),
  grade text,
  subject text,
  title text NOT NULL DEFAULT '',
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  issue_date timestamptz NOT NULL DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked'))
);

ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_certificates" ON certificates;
CREATE POLICY "select_own_certificates"
ON certificates FOR SELECT
TO authenticated
USING (auth.uid() = student_id);

DROP POLICY IF EXISTS "insert_own_certificates" ON certificates;
CREATE POLICY "insert_own_certificates"
ON certificates FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "update_own_certificates" ON certificates;
CREATE POLICY "update_own_certificates"
ON certificates FOR UPDATE
TO authenticated
USING (auth.uid() = student_id)
WITH CHECK (auth.uid() = student_id);

DROP POLICY IF EXISTS "delete_own_certificates" ON certificates;
CREATE POLICY "delete_own_certificates"
ON certificates FOR DELETE
TO authenticated
USING (auth.uid() = student_id);

CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON certificates(student_id);
CREATE INDEX IF NOT EXISTS idx_certificates_type ON certificates(certificate_type);