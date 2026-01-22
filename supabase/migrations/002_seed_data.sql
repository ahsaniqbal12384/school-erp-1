-- ============================================
-- Pakistani School ERP - Seed Data
-- Default configurations and sample data
-- ============================================

-- ============================================
-- SECTION 1: Insert sample school for testing
-- ============================================

-- Note: In production, schools are created via admin panel
-- This is for development/testing purposes

INSERT INTO schools (
    id,
    name,
    slug,
    address,
    city,
    phone,
    email,
    plan,
    status,
    grading_system,
    settings
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Al-Noor Public School',
    'al-noor-public-school',
    'Street 15, Block D, Gulberg III',
    'Lahore',
    '042-35761234',
    'info@alnoorschool.pk',
    'premium',
    'active',
    'matric',
    '{"currency": "PKR", "timezone": "Asia/Karachi", "academic_year_start": "April"}'::jsonb
) ON CONFLICT (slug) DO NOTHING;

-- Create default grade scales for the sample school
SELECT create_default_grade_scales('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'matric');

-- ============================================
-- SECTION 2: Insert Academic Year
-- ============================================

INSERT INTO academic_years (
    id,
    school_id,
    name,
    start_date,
    end_date,
    is_current
) VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '2024-2025',
    '2024-04-01',
    '2025-03-31',
    true
) ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 3: Insert Default Classes
-- ============================================

INSERT INTO classes (school_id, name, grade_level, section, capacity, monthly_fee, academic_year_id) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nursery', 0, 'A', 25, 3500.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nursery', 0, 'B', 25, 3500.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'KG', 1, 'A', 30, 4000.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'KG', 1, 'B', 30, 4000.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 1', 2, 'A', 35, 4500.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 1', 2, 'B', 35, 4500.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 2', 3, 'A', 35, 4500.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 3', 4, 'A', 35, 5000.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 4', 5, 'A', 35, 5000.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 5', 6, 'A', 40, 5500.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 6', 7, 'A', 40, 6000.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 7', 8, 'A', 40, 6500.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 8', 9, 'A', 40, 7000.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 9', 10, 'A', 40, 8000.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Class 10', 11, 'A', 40, 8500.00, 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11')
ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 4: Insert Default Subjects
-- ============================================

INSERT INTO subjects (school_id, name, code, is_elective) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'English', 'ENG', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Urdu', 'URD', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Mathematics', 'MATH', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Science', 'SCI', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Physics', 'PHY', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Chemistry', 'CHEM', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Biology', 'BIO', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Computer Science', 'CS', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Pakistan Studies', 'PST', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Islamiat', 'ISL', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'General Knowledge', 'GK', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Drawing', 'ART', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Physical Education', 'PE', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Nazra Quran', 'NAZ', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'History', 'HIST', false),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Geography', 'GEO', false)
ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 5: Insert Default Fee Structures
-- ============================================

-- Admission fees (one-time)
INSERT INTO fee_structures (school_id, class_id, fee_type, name, amount, frequency, is_optional, academic_year_id)
SELECT 
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    c.id,
    'admission',
    'Admission Fee',
    15000.00,
    'one_time',
    false,
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
FROM classes c
WHERE c.school_id = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 6: Insert Transport Data
-- ============================================

INSERT INTO transport_vehicles (school_id, vehicle_no, vehicle_type, capacity, driver_name, driver_phone, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LEA-1234', 'bus', 45, 'Muhammad Aslam', '0300-1234567', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LEA-5678', 'hiace', 15, 'Shahid Khan', '0301-2345678', true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'LEA-9012', 'coaster', 25, 'Imran Ali', '0302-3456789', true)
ON CONFLICT DO NOTHING;

INSERT INTO transport_routes (school_id, name, description, monthly_fee, is_active) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Route 1 - Gulberg', 'Gulberg I, II, III', 3000.00, true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Route 2 - DHA', 'DHA Phase 1-5', 3500.00, true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Route 3 - Model Town', 'Model Town, Faisal Town', 2500.00, true),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Route 4 - Johar Town', 'Johar Town, Wapda Town', 3000.00, true)
ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 7: Sample Library Books
-- ============================================

INSERT INTO library_books (school_id, isbn, title, author, publisher, category, total_copies, available_copies, price) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '978-0143127796', 'Pakistan: A Hard Country', 'Anatol Lieven', 'Penguin', 'Non-Fiction', 5, 5, 1500.00),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '978-0061120084', 'To Kill a Mockingbird', 'Harper Lee', 'Harper Perennial', 'Fiction', 10, 10, 800.00),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '978-0199535569', 'Pride and Prejudice', 'Jane Austen', 'Oxford', 'Fiction', 8, 8, 600.00),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '978-0521618700', 'A History of Pakistan', 'Ishtiaq Hussain', 'Cambridge', 'History', 6, 6, 2000.00),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '978-0486275437', 'The Republic', 'Plato', 'Dover', 'Philosophy', 4, 4, 500.00)
ON CONFLICT DO NOTHING;

-- ============================================
-- END OF SEED DATA
-- ============================================
