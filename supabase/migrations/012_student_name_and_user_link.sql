-- Migration: Add student name fields and user_id to students table
-- This allows students to have their own names (separate from parents)
-- and links them directly to users table for login

-- Add name fields to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE students ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);

-- Update existing students: extract name from father_name as placeholder
-- This is a one-time migration to give existing students some name
UPDATE students 
SET first_name = COALESCE(
    SPLIT_PART(admission_no, '-', 3), 
    'Student'
)
WHERE first_name IS NULL;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON students TO authenticated;
