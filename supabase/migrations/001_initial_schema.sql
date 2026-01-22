-- ============================================
-- Pakistani School ERP - Complete Database Schema
-- Multi-Tenant SaaS with Row Level Security (RLS)
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- SECTION 1: SCHOOLS (TENANTS)
-- ============================================

CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(255),
    logo_url TEXT,
    plan VARCHAR(50) DEFAULT 'basic' CHECK (plan IN ('basic', 'standard', 'premium', 'enterprise')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'cancelled')),
    trial_ends_at TIMESTAMPTZ,
    subscription_ends_at TIMESTAMPTZ,
    settings JSONB DEFAULT '{}',
    grading_system VARCHAR(20) DEFAULT 'matric' CHECK (grading_system IN ('matric', 'cambridge', 'custom')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 2: USER PROFILES & AUTHENTICATION
-- ============================================

CREATE TYPE user_role AS ENUM (
    'super_admin',
    'school_admin', 
    'teacher',
    'student',
    'parent',
    'accountant',
    'librarian',
    'transport_manager',
    'staff'
);

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'staff',
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    cnic VARCHAR(15),
    phone VARCHAR(20),
    email VARCHAR(255),
    avatar_url TEXT,
    address TEXT,
    city VARCHAR(100),
    date_of_birth DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    emergency_contact VARCHAR(20),
    blood_group VARCHAR(5),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 3: ACADEMIC STRUCTURE
-- ============================================

CREATE TABLE IF NOT EXISTS academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    grade_level INTEGER,
    section VARCHAR(10),
    capacity INTEGER DEFAULT 40,
    class_teacher_id UUID REFERENCES profiles(id),
    academic_year_id UUID REFERENCES academic_years(id),
    monthly_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name, section, academic_year_id)
);

CREATE TABLE IF NOT EXISTS subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20),
    description TEXT,
    is_elective BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, code)
);

CREATE TABLE IF NOT EXISTS class_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES profiles(id),
    periods_per_week INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, subject_id)
);

-- ============================================
-- SECTION 4: STUDENTS
-- ============================================

CREATE TABLE IF NOT EXISTS students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    profile_id UUID REFERENCES profiles(id),
    admission_no VARCHAR(50) NOT NULL,
    roll_no VARCHAR(20),
    class_id UUID REFERENCES classes(id),
    admission_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'transferred', 'expelled')),
    father_name VARCHAR(100),
    father_phone VARCHAR(20),
    father_cnic VARCHAR(15),
    father_occupation VARCHAR(100),
    mother_name VARCHAR(100),
    mother_phone VARCHAR(20),
    mother_cnic VARCHAR(15),
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    guardian_relation VARCHAR(50),
    previous_school VARCHAR(255),
    medical_conditions TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, admission_no)
);

-- ============================================
-- SECTION 5: ADMISSIONS CRM
-- ============================================

CREATE TYPE inquiry_status AS ENUM ('new', 'contacted', 'visited', 'registered', 'admitted', 'rejected', 'lost');
CREATE TYPE inquiry_source AS ENUM ('facebook', 'google', 'billboard', 'referral', 'walk_in', 'newspaper', 'school_event', 'other');

CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_name VARCHAR(100) NOT NULL,
    parent_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    source inquiry_source DEFAULT 'walk_in',
    status inquiry_status DEFAULT 'new',
    class_interested UUID REFERENCES classes(id),
    notes TEXT,
    follow_up_date DATE,
    assigned_to UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    inquiry_id UUID REFERENCES inquiries(id),
    student_name VARCHAR(100) NOT NULL,
    parent_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    class_applied UUID REFERENCES classes(id),
    registration_fee DECIMAL(10,2) DEFAULT 0,
    registration_fee_paid BOOLEAN DEFAULT false,
    admission_test_date DATE,
    admission_test_score DECIMAL(5,2),
    documents_submitted JSONB DEFAULT '[]',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'test_scheduled', 'passed', 'admitted', 'rejected')),
    converted_to_student_id UUID REFERENCES students(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 6: STAFF & HR
-- ============================================

CREATE TABLE IF NOT EXISTS staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    profile_id UUID NOT NULL REFERENCES profiles(id),
    employee_id VARCHAR(50) NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    joining_date DATE DEFAULT CURRENT_DATE,
    employment_type VARCHAR(20) DEFAULT 'full_time' CHECK (employment_type IN ('full_time', 'part_time', 'contract', 'visiting')),
    qualification VARCHAR(255),
    experience_years INTEGER DEFAULT 0,
    bank_name VARCHAR(100),
    bank_account_no VARCHAR(50),
    basic_salary DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'resigned', 'terminated')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, employee_id)
);

CREATE TABLE IF NOT EXISTS staff_salaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    month DATE NOT NULL,
    basic_salary DECIMAL(10,2) NOT NULL,
    house_allowance DECIMAL(10,2) DEFAULT 0,
    transport_allowance DECIMAL(10,2) DEFAULT 0,
    medical_allowance DECIMAL(10,2) DEFAULT 0,
    other_allowances DECIMAL(10,2) DEFAULT 0,
    overtime_amount DECIMAL(10,2) DEFAULT 0,
    eobi_deduction DECIMAL(10,2) DEFAULT 0,
    tax_deduction DECIMAL(10,2) DEFAULT 0,
    loan_deduction DECIMAL(10,2) DEFAULT 0,
    other_deductions DECIMAL(10,2) DEFAULT 0,
    gross_salary DECIMAL(10,2) GENERATED ALWAYS AS (
        basic_salary + house_allowance + transport_allowance + 
        medical_allowance + other_allowances + overtime_amount
    ) STORED,
    total_deductions DECIMAL(10,2) GENERATED ALWAYS AS (
        eobi_deduction + tax_deduction + loan_deduction + other_deductions
    ) STORED,
    net_salary DECIMAL(10,2) GENERATED ALWAYS AS (
        basic_salary + house_allowance + transport_allowance + 
        medical_allowance + other_allowances + overtime_amount -
        eobi_deduction - tax_deduction - loan_deduction - other_deductions
    ) STORED,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'paid')),
    paid_date DATE,
    payment_method VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, month)
);

CREATE TABLE IF NOT EXISTS staff_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'half_day', 'on_leave')),
    leave_type VARCHAR(50),
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, date)
);

CREATE TABLE IF NOT EXISTS leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('casual', 'sick', 'annual', 'maternity', 'paternity', 'unpaid', 'other')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 7: ATTENDANCE (Students)
-- ============================================

CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remarks TEXT,
    marked_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- ============================================
-- SECTION 8: EXAMS & GRADES
-- ============================================

CREATE TYPE exam_type AS ENUM ('monthly', 'mid_term', 'final', 'quiz', 'assignment', 'practical');

CREATE TABLE IF NOT EXISTS exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    exam_type exam_type NOT NULL,
    academic_year_id UUID REFERENCES academic_years(id),
    start_date DATE,
    end_date DATE,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'ongoing', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS exam_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    exam_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    total_marks DECIMAL(5,2) DEFAULT 100,
    passing_marks DECIMAL(5,2) DEFAULT 33,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(exam_id, class_id, subject_id)
);

CREATE TABLE IF NOT EXISTS grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES subjects(id),
    marks_obtained DECIMAL(5,2),
    total_marks DECIMAL(5,2),
    percentage DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE WHEN total_marks > 0 THEN (marks_obtained / total_marks) * 100 ELSE 0 END
    ) STORED,
    grade VARCHAR(5),
    remarks TEXT,
    entered_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, exam_id, subject_id)
);

-- Grade scale configuration per school
CREATE TABLE IF NOT EXISTS grade_scales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    grading_system VARCHAR(20) NOT NULL,
    min_percentage DECIMAL(5,2) NOT NULL,
    max_percentage DECIMAL(5,2) NOT NULL,
    grade VARCHAR(5) NOT NULL,
    grade_point DECIMAL(3,2),
    remarks VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, grading_system, grade)
);

-- ============================================
-- SECTION 9: FEES & FINANCE
-- ============================================

CREATE TYPE fee_type AS ENUM ('tuition', 'admission', 'registration', 'transport', 'library', 'lab', 'exam', 'sports', 'uniform', 'other');
CREATE TYPE payment_method AS ENUM ('cash', 'jazzcash', 'easypaisa', 'bank_transfer', 'cheque', 'online');
CREATE TYPE invoice_status AS ENUM ('pending', 'partial', 'paid', 'overdue', 'cancelled', 'waived');

CREATE TABLE IF NOT EXISTS fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID REFERENCES classes(id),
    fee_type fee_type NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    frequency VARCHAR(20) DEFAULT 'monthly' CHECK (frequency IN ('one_time', 'monthly', 'quarterly', 'yearly')),
    is_optional BOOLEAN DEFAULT false,
    academic_year_id UUID REFERENCES academic_years(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, class_id, fee_type, academic_year_id)
);

CREATE TABLE IF NOT EXISTS fee_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    invoice_no VARCHAR(50) NOT NULL,
    month DATE NOT NULL,
    due_date DATE NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    paid_amount DECIMAL(10,2) DEFAULT 0,
    balance DECIMAL(10,2) GENERATED ALWAYS AS (total_amount - discount_amount - paid_amount) STORED,
    status invoice_status DEFAULT 'pending',
    late_fee DECIMAL(10,2) DEFAULT 0,
    remarks TEXT,
    generated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, invoice_no)
);

CREATE TABLE IF NOT EXISTS fee_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES fee_invoices(id) ON DELETE CASCADE,
    fee_type fee_type NOT NULL,
    description VARCHAR(255),
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS fee_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES fee_invoices(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id),
    receipt_no VARCHAR(50) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method payment_method NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    transaction_ref VARCHAR(100),
    bank_name VARCHAR(100),
    cheque_no VARCHAR(50),
    remarks TEXT,
    received_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, receipt_no)
);

CREATE TABLE IF NOT EXISTS fee_discounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    discount_type VARCHAR(50) NOT NULL CHECK (discount_type IN ('sibling', 'merit', 'staff_child', 'scholarship', 'financial_aid', 'other')),
    discount_percentage DECIMAL(5,2),
    discount_amount DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    reason TEXT,
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 10: TRANSPORT
-- ============================================

CREATE TABLE IF NOT EXISTS transport_vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    vehicle_no VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(50) DEFAULT 'bus' CHECK (vehicle_type IN ('bus', 'van', 'coaster', 'hiace')),
    capacity INTEGER NOT NULL,
    driver_name VARCHAR(100),
    driver_phone VARCHAR(20),
    driver_cnic VARCHAR(15),
    conductor_name VARCHAR(100),
    conductor_phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, vehicle_no)
);

CREATE TABLE IF NOT EXISTS transport_routes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    vehicle_id UUID REFERENCES transport_vehicles(id),
    monthly_fee DECIMAL(10,2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

CREATE TABLE IF NOT EXISTS transport_stops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    route_id UUID NOT NULL REFERENCES transport_routes(id) ON DELETE CASCADE,
    stop_name VARCHAR(100) NOT NULL,
    stop_order INTEGER NOT NULL,
    pickup_time TIME,
    drop_time TIME,
    additional_fee DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(route_id, stop_order)
);

CREATE TABLE IF NOT EXISTS student_transport (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    route_id UUID NOT NULL REFERENCES transport_routes(id),
    stop_id UUID REFERENCES transport_stops(id),
    pickup_type VARCHAR(20) DEFAULT 'both' CHECK (pickup_type IN ('pickup', 'drop', 'both')),
    monthly_fee DECIMAL(10,2) NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, route_id)
);

-- ============================================
-- SECTION 11: LIBRARY
-- ============================================

CREATE TABLE IF NOT EXISTS library_books (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    isbn VARCHAR(20),
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    edition VARCHAR(50),
    category VARCHAR(100),
    shelf_location VARCHAR(50),
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS library_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES library_books(id),
    student_id UUID REFERENCES students(id),
    staff_id UUID REFERENCES staff(id),
    issue_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    fine_amount DECIMAL(10,2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'lost', 'damaged')),
    issued_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK ((student_id IS NOT NULL AND staff_id IS NULL) OR (student_id IS NULL AND staff_id IS NOT NULL))
);

-- ============================================
-- SECTION 12: HOMEWORK & DIARY
-- ============================================

CREATE TABLE IF NOT EXISTS homework (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    subject_id UUID NOT NULL REFERENCES subjects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachment_url TEXT,
    assigned_date DATE DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    assigned_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homework_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    homework_id UUID NOT NULL REFERENCES homework(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id),
    submission_date DATE DEFAULT CURRENT_DATE,
    attachment_url TEXT,
    remarks TEXT,
    marks DECIMAL(5,2),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('pending', 'submitted', 'late', 'graded')),
    graded_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(homework_id, student_id)
);

CREATE TABLE IF NOT EXISTS diary_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id),
    date DATE DEFAULT CURRENT_DATE,
    content TEXT NOT NULL,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 13: COMMUNICATION & BROADCASTS
-- ============================================

CREATE TYPE broadcast_status AS ENUM ('draft', 'scheduled', 'sent', 'failed');
CREATE TYPE recipient_type AS ENUM ('all', 'students', 'parents', 'staff', 'teachers', 'class');

CREATE TABLE IF NOT EXISTS broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    recipient_type recipient_type DEFAULT 'all',
    target_class_id UUID REFERENCES classes(id),
    channel VARCHAR(20) DEFAULT 'whatsapp' CHECK (channel IN ('whatsapp', 'sms', 'email', 'app')),
    status broadcast_status DEFAULT 'draft',
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    sent_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS broadcast_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broadcast_id UUID NOT NULL REFERENCES broadcasts(id) ON DELETE CASCADE,
    recipient_phone VARCHAR(20),
    recipient_email VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 14: SUPPORT & TICKETS
-- ============================================

CREATE TYPE ticket_status AS ENUM ('open', 'in_progress', 'waiting', 'resolved', 'closed');
CREATE TYPE ticket_priority AS ENUM ('low', 'medium', 'high', 'urgent');

CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    ticket_no VARCHAR(50) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    status ticket_status DEFAULT 'open',
    priority ticket_priority DEFAULT 'medium',
    created_by UUID NOT NULL REFERENCES profiles(id),
    assigned_to UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ticket_no)
);

CREATE TABLE IF NOT EXISTS ticket_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT false,
    attachment_url TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 15: PARENT LINKING
-- ============================================

CREATE TABLE IF NOT EXISTS parent_students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    relation VARCHAR(50) NOT NULL CHECK (relation IN ('father', 'mother', 'guardian', 'other')),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(parent_profile_id, student_id)
);

-- ============================================
-- SECTION 16: ACTIVITY LOGS
-- ============================================

CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id UUID,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 17: INDEXES FOR PERFORMANCE
-- ============================================

-- Schools
CREATE INDEX idx_schools_status ON schools(status);
CREATE INDEX idx_schools_slug ON schools(slug);

-- Profiles
CREATE INDEX idx_profiles_school_id ON profiles(school_id);
CREATE INDEX idx_profiles_role ON profiles(role);
CREATE INDEX idx_profiles_user_id ON profiles(user_id);

-- Students
CREATE INDEX idx_students_school_id ON students(school_id);
CREATE INDEX idx_students_admission_no ON students(school_id, admission_no);
CREATE INDEX idx_students_class_id ON students(class_id);
CREATE INDEX idx_students_status ON students(status);

-- Staff
CREATE INDEX idx_staff_school_id ON staff(school_id);
CREATE INDEX idx_staff_employee_id ON staff(school_id, employee_id);

-- Inquiries
CREATE INDEX idx_inquiries_school_id ON inquiries(school_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
CREATE INDEX idx_inquiries_phone ON inquiries(phone);

-- Fee Invoices
CREATE INDEX idx_fee_invoices_school_id ON fee_invoices(school_id);
CREATE INDEX idx_fee_invoices_student_id ON fee_invoices(student_id);
CREATE INDEX idx_fee_invoices_status ON fee_invoices(status);
CREATE INDEX idx_fee_invoices_month ON fee_invoices(month);
CREATE INDEX idx_fee_invoices_due_date ON fee_invoices(due_date);

-- Fee Transactions
CREATE INDEX idx_fee_transactions_school_id ON fee_transactions(school_id);
CREATE INDEX idx_fee_transactions_invoice_id ON fee_transactions(invoice_id);

-- Attendance
CREATE INDEX idx_attendance_school_id ON attendance(school_id);
CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_class_date ON attendance(class_id, date);

-- Staff Attendance
CREATE INDEX idx_staff_attendance_school_id ON staff_attendance(school_id);
CREATE INDEX idx_staff_attendance_staff_id ON staff_attendance(staff_id);
CREATE INDEX idx_staff_attendance_date ON staff_attendance(date);

-- Grades
CREATE INDEX idx_grades_school_id ON grades(school_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_exam_id ON grades(exam_id);

-- Library
CREATE INDEX idx_library_books_school_id ON library_books(school_id);
CREATE INDEX idx_library_books_isbn ON library_books(isbn);
CREATE INDEX idx_library_issues_school_id ON library_issues(school_id);
CREATE INDEX idx_library_issues_book_id ON library_issues(book_id);

-- Transport
CREATE INDEX idx_student_transport_school_id ON student_transport(school_id);
CREATE INDEX idx_student_transport_student_id ON student_transport(student_id);

-- ============================================
-- SECTION 18: ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_salaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaves ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE grade_scales ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_structures ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_discounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport_stops ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework ENABLE ROW LEVEL SECURITY;
ALTER TABLE homework_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE diary_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE broadcast_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Helper function to get user's school_id
-- ============================================

CREATE OR REPLACE FUNCTION get_user_school_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT school_id FROM profiles 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM profiles 
        WHERE user_id = auth.uid() 
        AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get user's role
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS user_role AS $$
BEGIN
    RETURN (
        SELECT role FROM profiles 
        WHERE user_id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES: SCHOOLS
-- ============================================

-- Super admins can see all schools
CREATE POLICY "Super admins can view all schools" ON schools
    FOR SELECT USING (is_super_admin());

-- Super admins can manage schools
CREATE POLICY "Super admins can manage schools" ON schools
    FOR ALL USING (is_super_admin());

-- School users can view their own school
CREATE POLICY "Users can view their own school" ON schools
    FOR SELECT USING (id = get_user_school_id());

-- ============================================
-- RLS POLICIES: PROFILES
-- ============================================

-- Super admins can see all profiles
CREATE POLICY "Super admins can view all profiles" ON profiles
    FOR SELECT USING (is_super_admin());

-- Users can view profiles in their school
CREATE POLICY "Users can view profiles in their school" ON profiles
    FOR SELECT USING (school_id = get_user_school_id() OR user_id = auth.uid());

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (user_id = auth.uid());

-- School admins can manage profiles in their school
CREATE POLICY "School admins can manage profiles" ON profiles
    FOR ALL USING (
        school_id = get_user_school_id() 
        AND get_user_role() IN ('school_admin', 'super_admin')
    );

-- ============================================
-- RLS POLICIES: Generic school-scoped tables
-- ============================================

-- Macro for creating standard school-based RLS policies
-- Applied to most tables

-- STUDENTS
CREATE POLICY "School users can view students" ON students
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "School admins can manage students" ON students
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'teacher', 'accountant'))
        OR is_super_admin()
    );

-- CLASSES
CREATE POLICY "School users can view classes" ON classes
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "School admins can manage classes" ON classes
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() = 'school_admin')
        OR is_super_admin()
    );

-- ATTENDANCE
CREATE POLICY "School users can view attendance" ON attendance
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Teachers and admins can manage attendance" ON attendance
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'teacher'))
        OR is_super_admin()
    );

-- FEE INVOICES
CREATE POLICY "School users can view fee invoices" ON fee_invoices
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Accountants and admins can manage fee invoices" ON fee_invoices
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'accountant'))
        OR is_super_admin()
    );

-- FEE TRANSACTIONS
CREATE POLICY "School users can view fee transactions" ON fee_transactions
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Accountants and admins can manage fee transactions" ON fee_transactions
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'accountant'))
        OR is_super_admin()
    );

-- STAFF
CREATE POLICY "School users can view staff" ON staff
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "School admins can manage staff" ON staff
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() = 'school_admin')
        OR is_super_admin()
    );

-- STAFF SALARIES
CREATE POLICY "HR can view salaries" ON staff_salaries
    FOR SELECT USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'accountant'))
        OR is_super_admin()
    );

CREATE POLICY "School admins can manage salaries" ON staff_salaries
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() = 'school_admin')
        OR is_super_admin()
    );

-- LIBRARY BOOKS
CREATE POLICY "School users can view library books" ON library_books
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Librarians and admins can manage library books" ON library_books
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'librarian'))
        OR is_super_admin()
    );

-- LIBRARY ISSUES
CREATE POLICY "School users can view library issues" ON library_issues
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Librarians can manage library issues" ON library_issues
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'librarian'))
        OR is_super_admin()
    );

-- TRANSPORT
CREATE POLICY "School users can view transport vehicles" ON transport_vehicles
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Admins can manage transport vehicles" ON transport_vehicles
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'transport_manager'))
        OR is_super_admin()
    );

CREATE POLICY "School users can view transport routes" ON transport_routes
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Admins can manage transport routes" ON transport_routes
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'transport_manager'))
        OR is_super_admin()
    );

CREATE POLICY "School users can view student transport" ON student_transport
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Admins can manage student transport" ON student_transport
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'transport_manager'))
        OR is_super_admin()
    );

-- INQUIRIES & REGISTRATIONS
CREATE POLICY "School users can view inquiries" ON inquiries
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Admins can manage inquiries" ON inquiries
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() = 'school_admin')
        OR is_super_admin()
    );

CREATE POLICY "School users can view registrations" ON registrations
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Admins can manage registrations" ON registrations
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() = 'school_admin')
        OR is_super_admin()
    );

-- EXAMS & GRADES
CREATE POLICY "School users can view exams" ON exams
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Admins and teachers can manage exams" ON exams
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'teacher'))
        OR is_super_admin()
    );

CREATE POLICY "School users can view grades" ON grades
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Teachers and admins can manage grades" ON grades
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'teacher'))
        OR is_super_admin()
    );

-- HOMEWORK
CREATE POLICY "School users can view homework" ON homework
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Teachers can manage homework" ON homework
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() IN ('school_admin', 'teacher'))
        OR is_super_admin()
    );

-- BROADCASTS
CREATE POLICY "School users can view broadcasts" ON broadcasts
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Admins can manage broadcasts" ON broadcasts
    FOR ALL USING (
        (school_id = get_user_school_id() AND get_user_role() = 'school_admin')
        OR is_super_admin()
    );

-- SUPPORT TICKETS
CREATE POLICY "School users can view their tickets" ON support_tickets
    FOR SELECT USING (school_id = get_user_school_id() OR is_super_admin());

CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (school_id = get_user_school_id());

CREATE POLICY "Super admins can manage all tickets" ON support_tickets
    FOR ALL USING (is_super_admin());

-- ACTIVITY LOGS
CREATE POLICY "Super admins can view all logs" ON activity_logs
    FOR SELECT USING (is_super_admin());

CREATE POLICY "School admins can view their logs" ON activity_logs
    FOR SELECT USING (
        school_id = get_user_school_id() AND get_user_role() = 'school_admin'
    );

-- ============================================
-- SECTION 19: Seed Default Grade Scales
-- ============================================

-- This will be run after school creation to populate grade scales

-- ============================================
-- SECTION 20: Triggers for Updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to relevant tables
CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE ON inquiries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_salaries_updated_at BEFORE UPDATE ON staff_salaries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leaves_updated_at BEFORE UPDATE ON leaves
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fee_invoices_updated_at BEFORE UPDATE ON fee_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transport_vehicles_updated_at BEFORE UPDATE ON transport_vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_books_updated_at BEFORE UPDATE ON library_books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_library_issues_updated_at BEFORE UPDATE ON library_issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SECTION 21: Function to create default grade scales for a school
-- ============================================

CREATE OR REPLACE FUNCTION create_default_grade_scales(p_school_id UUID, p_grading_system VARCHAR)
RETURNS VOID AS $$
BEGIN
    IF p_grading_system = 'matric' THEN
        INSERT INTO grade_scales (school_id, grading_system, min_percentage, max_percentage, grade, grade_point, remarks) VALUES
        (p_school_id, 'matric', 80, 100, 'A+', 4.00, 'Outstanding'),
        (p_school_id, 'matric', 70, 79.99, 'A', 3.50, 'Excellent'),
        (p_school_id, 'matric', 60, 69.99, 'B', 3.00, 'Very Good'),
        (p_school_id, 'matric', 50, 59.99, 'C', 2.50, 'Good'),
        (p_school_id, 'matric', 40, 49.99, 'D', 2.00, 'Satisfactory'),
        (p_school_id, 'matric', 33, 39.99, 'E', 1.50, 'Pass'),
        (p_school_id, 'matric', 0, 32.99, 'F', 0.00, 'Fail');
    ELSIF p_grading_system = 'cambridge' THEN
        INSERT INTO grade_scales (school_id, grading_system, min_percentage, max_percentage, grade, grade_point, remarks) VALUES
        (p_school_id, 'cambridge', 90, 100, 'A*', 4.00, 'Outstanding'),
        (p_school_id, 'cambridge', 80, 89.99, 'A', 3.75, 'Excellent'),
        (p_school_id, 'cambridge', 70, 79.99, 'B', 3.25, 'Very Good'),
        (p_school_id, 'cambridge', 60, 69.99, 'C', 2.75, 'Good'),
        (p_school_id, 'cambridge', 50, 59.99, 'D', 2.25, 'Satisfactory'),
        (p_school_id, 'cambridge', 40, 49.99, 'E', 1.75, 'Pass'),
        (p_school_id, 'cambridge', 0, 39.99, 'U', 0.00, 'Ungraded');
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- END OF SCHEMA
-- ============================================
