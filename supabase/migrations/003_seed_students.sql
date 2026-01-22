-- ============================================
-- SECTION 8: Insert Sample Students
-- ============================================

-- Note: We first need to create profiles for these students, then the student records
-- Using valid UUID format (hex characters only: 0-9, a-f)

-- 1. Create Profiles for Students
INSERT INTO profiles (id, user_id, email, first_name, last_name, role, school_id) VALUES
('a001bc99-9c0b-4ef8-bb6d-6bb9bd380001', 'a001bc99-9c0b-4ef8-bb6d-6bb9bd380001', 'student1@school.pk', 'Ali', 'Khan', 'student', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a002bc99-9c0b-4ef8-bb6d-6bb9bd380002', 'a002bc99-9c0b-4ef8-bb6d-6bb9bd380002', 'student2@school.pk', 'Fatima', 'Bibi', 'student', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a003bc99-9c0b-4ef8-bb6d-6bb9bd380003', 'a003bc99-9c0b-4ef8-bb6d-6bb9bd380003', 'student3@school.pk', 'Ahmed', 'Raza', 'student', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a004bc99-9c0b-4ef8-bb6d-6bb9bd380004', 'a004bc99-9c0b-4ef8-bb6d-6bb9bd380004', 'student4@school.pk', 'Zainab', 'Noor', 'student', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a005bc99-9c0b-4ef8-bb6d-6bb9bd380005', 'a005bc99-9c0b-4ef8-bb6d-6bb9bd380005', 'student5@school.pk', 'Bilal', 'Ahmed', 'student', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ON CONFLICT DO NOTHING;

-- 2. Create Student Records
INSERT INTO students (
    id,
    school_id,
    profile_id,
    admission_no,
    roll_no,
    class_id,
    guardian_name,
    guardian_phone,
    status
) VALUES
(
    'b001bc99-9c0b-4ef8-bb6d-6bb9bd380001',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'a001bc99-9c0b-4ef8-bb6d-6bb9bd380001',
    'ANS-2024-001',
    'R-101',
    (SELECT id FROM classes WHERE name = 'Class 10' AND section = 'A' AND school_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' LIMIT 1),
    'Usman Khan',
    '0300-1111111',
    'active'
),
(
    'b002bc99-9c0b-4ef8-bb6d-6bb9bd380002',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'a002bc99-9c0b-4ef8-bb6d-6bb9bd380002',
    'ANS-2024-002',
    'R-102',
    (SELECT id FROM classes WHERE name = 'Class 10' AND section = 'A' AND school_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' LIMIT 1),
    'Yusuf Bibi',
    '0300-2222222',
    'active'
),
(
    'b003bc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'a003bc99-9c0b-4ef8-bb6d-6bb9bd380003',
    'ANS-2024-003',
    'R-201',
    (SELECT id FROM classes WHERE name = 'Class 9' AND section = 'A' AND school_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' LIMIT 1),
    'Hassan Raza',
    '0300-3333333',
    'active'
),
(
    'b004bc99-9c0b-4ef8-bb6d-6bb9bd380004',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'a004bc99-9c0b-4ef8-bb6d-6bb9bd380004',
    'ANS-2024-004',
    'R-202',
    (SELECT id FROM classes WHERE name = 'Class 9' AND section = 'A' AND school_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' LIMIT 1),
    'Omar Noor',
    '0300-4444444',
    'active'
),
(
    'b005bc99-9c0b-4ef8-bb6d-6bb9bd380005',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'a005bc99-9c0b-4ef8-bb6d-6bb9bd380005',
    'ANS-2024-005',
    'R-301',
    (SELECT id FROM classes WHERE name = 'Class 5' AND section = 'A' AND school_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' LIMIT 1),
    'Kamran Ahmed',
    '0300-5555555',
    'active'
)
ON CONFLICT DO NOTHING;
