-- Migration: 008_staff_hr_management.sql (v2)
-- Description: Staff/HR Management - Employee records, payroll, leave management
-- SAFE VERSION: Handles existing tables by adding missing columns/features

-- ============================================
-- SECTION 1: CREATE ENUMS (SAFE)
-- ============================================

DO $$ BEGIN
    CREATE TYPE employment_type_v2 AS ENUM ('full_time', 'part_time', 'contract', 'temporary', 'intern');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE employment_status_v2 AS ENUM ('active', 'on_leave', 'suspended', 'terminated', 'resigned', 'retired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE hr_gender_type AS ENUM ('male', 'female', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE hr_marital_status AS ENUM ('single', 'married', 'divorced', 'widowed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE hr_attendance_status AS ENUM ('present', 'absent', 'late', 'half_day', 'on_leave', 'holiday', 'weekend');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE hr_leave_status AS ENUM ('pending', 'approved', 'rejected', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE hr_payroll_status AS ENUM ('draft', 'processing', 'approved', 'paid', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- SECTION 2: STAFF DEPARTMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS staff_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    head_id UUID,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

-- ============================================
-- SECTION 3: STAFF DESIGNATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS staff_designations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    department_id UUID REFERENCES staff_departments(id) ON DELETE SET NULL,
    base_salary DECIMAL(12, 2) DEFAULT 0,
    is_teaching BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

-- ============================================
-- SECTION 4: ENHANCE EXISTING STAFF TABLE
-- ============================================

-- Add new columns to existing staff table if they don't exist
DO $$ 
BEGIN
    -- Add department_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'department_id') THEN
        ALTER TABLE staff ADD COLUMN department_id UUID REFERENCES staff_departments(id) ON DELETE SET NULL;
    END IF;
    
    -- Add designation_id column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'designation_id') THEN
        ALTER TABLE staff ADD COLUMN designation_id UUID REFERENCES staff_designations(id) ON DELETE SET NULL;
    END IF;
    
    -- Add first_name and last_name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'first_name') THEN
        ALTER TABLE staff ADD COLUMN first_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'last_name') THEN
        ALTER TABLE staff ADD COLUMN last_name TEXT;
    END IF;
    
    -- Add personal details
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'date_of_birth') THEN
        ALTER TABLE staff ADD COLUMN date_of_birth DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'gender') THEN
        ALTER TABLE staff ADD COLUMN gender TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'marital_status') THEN
        ALTER TABLE staff ADD COLUMN marital_status TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'cnic') THEN
        ALTER TABLE staff ADD COLUMN cnic TEXT;
    END IF;
    
    -- Add contact details
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'email') THEN
        ALTER TABLE staff ADD COLUMN email TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'phone') THEN
        ALTER TABLE staff ADD COLUMN phone TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'emergency_contact') THEN
        ALTER TABLE staff ADD COLUMN emergency_contact TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'emergency_phone') THEN
        ALTER TABLE staff ADD COLUMN emergency_phone TEXT;
    END IF;
    
    -- Add address
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'address') THEN
        ALTER TABLE staff ADD COLUMN address TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'city') THEN
        ALTER TABLE staff ADD COLUMN city TEXT;
    END IF;
    
    -- Add salary details
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'gross_salary') THEN
        ALTER TABLE staff ADD COLUMN gross_salary DECIMAL(12, 2) DEFAULT 0;
    END IF;
    
    -- Add document URLs
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'photo_url') THEN
        ALTER TABLE staff ADD COLUMN photo_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'resume_url') THEN
        ALTER TABLE staff ADD COLUMN resume_url TEXT;
    END IF;
    
    -- Add qualifications as JSON
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'qualifications_json') THEN
        ALTER TABLE staff ADD COLUMN qualifications_json JSONB DEFAULT '[]';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'experience_json') THEN
        ALTER TABLE staff ADD COLUMN experience_json JSONB DEFAULT '[]';
    END IF;
    
    -- Add bank_branch
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'bank_branch') THEN
        ALTER TABLE staff ADD COLUMN bank_branch TEXT;
    END IF;
    
    -- Add is_active
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'is_active') THEN
        ALTER TABLE staff ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;
    
    -- Add confirmation and termination dates
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'confirmation_date') THEN
        ALTER TABLE staff ADD COLUMN confirmation_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'resignation_date') THEN
        ALTER TABLE staff ADD COLUMN resignation_date DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff' AND column_name = 'termination_date') THEN
        ALTER TABLE staff ADD COLUMN termination_date DATE;
    END IF;
END $$;

-- Add foreign key for department head
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_department_head'
    ) THEN
        ALTER TABLE staff_departments 
        ADD CONSTRAINT fk_department_head 
        FOREIGN KEY (head_id) REFERENCES staff(id) ON DELETE SET NULL;
    END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- ============================================
-- SECTION 5: ENHANCE STAFF ATTENDANCE
-- ============================================

DO $$
BEGIN
    -- Add check_in_time if not exists
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff_attendance' AND column_name = 'check_in_time') THEN
        ALTER TABLE staff_attendance ADD COLUMN check_in_time TIME;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff_attendance' AND column_name = 'check_out_time') THEN
        ALTER TABLE staff_attendance ADD COLUMN check_out_time TIME;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff_attendance' AND column_name = 'working_hours') THEN
        ALTER TABLE staff_attendance ADD COLUMN working_hours DECIMAL(4, 2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff_attendance' AND column_name = 'overtime_hours') THEN
        ALTER TABLE staff_attendance ADD COLUMN overtime_hours DECIMAL(4, 2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff_attendance' AND column_name = 'remarks') THEN
        ALTER TABLE staff_attendance ADD COLUMN remarks TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'staff_attendance' AND column_name = 'marked_by') THEN
        ALTER TABLE staff_attendance ADD COLUMN marked_by UUID;
    END IF;
END $$;

-- ============================================
-- SECTION 6: LEAVE MANAGEMENT
-- ============================================

-- Leave Types Configuration per School
CREATE TABLE IF NOT EXISTS leave_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    description TEXT,
    days_allowed INTEGER DEFAULT 0,
    is_paid BOOLEAN DEFAULT true,
    is_carry_forward BOOLEAN DEFAULT false,
    max_carry_forward INTEGER DEFAULT 0,
    requires_document BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, code)
);

-- Staff Leave Balance
CREATE TABLE IF NOT EXISTS staff_leave_balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    total_days INTEGER DEFAULT 0,
    used_days INTEGER DEFAULT 0,
    carried_forward INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(staff_id, leave_type_id, academic_year)
);

-- Leave Applications
CREATE TABLE IF NOT EXISTS leave_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES leave_types(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    document_url TEXT,
    status TEXT DEFAULT 'pending',
    applied_on TIMESTAMPTZ DEFAULT NOW(),
    reviewed_by UUID,
    reviewed_on TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 7: PAYROLL MANAGEMENT
-- ============================================

-- Salary Components (Allowances & Deductions)
CREATE TABLE IF NOT EXISTS salary_components (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('earning', 'deduction')),
    calculation_type TEXT NOT NULL CHECK (calculation_type IN ('fixed', 'percentage')),
    percentage_of TEXT,
    default_value DECIMAL(12, 2) DEFAULT 0,
    is_taxable BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, code)
);

-- Staff Salary Structure
CREATE TABLE IF NOT EXISTS staff_salary_structure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES salary_components(id) ON DELETE CASCADE,
    amount DECIMAL(12, 2) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly Payroll
CREATE TABLE IF NOT EXISTS payroll (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    staff_id UUID NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    year INTEGER NOT NULL,
    
    -- Attendance Summary
    working_days INTEGER DEFAULT 0,
    present_days INTEGER DEFAULT 0,
    absent_days INTEGER DEFAULT 0,
    leave_days INTEGER DEFAULT 0,
    late_days INTEGER DEFAULT 0,
    
    -- Salary Components
    basic_salary DECIMAL(12, 2) DEFAULT 0,
    gross_earnings DECIMAL(12, 2) DEFAULT 0,
    total_deductions DECIMAL(12, 2) DEFAULT 0,
    net_salary DECIMAL(12, 2) DEFAULT 0,
    
    -- Detailed breakdown (stored as JSON)
    earnings_breakdown JSONB DEFAULT '[]',
    deductions_breakdown JSONB DEFAULT '[]',
    
    -- Processing
    status TEXT DEFAULT 'draft',
    generated_by UUID,
    generated_on TIMESTAMPTZ,
    approved_by UUID,
    approved_on TIMESTAMPTZ,
    paid_on TIMESTAMPTZ,
    payment_method TEXT,
    payment_reference TEXT,
    
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(staff_id, month, year)
);

-- Payroll Transactions
CREATE TABLE IF NOT EXISTS payroll_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    payroll_id UUID NOT NULL REFERENCES payroll(id) ON DELETE CASCADE,
    transaction_date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_method TEXT NOT NULL,
    reference_number TEXT,
    bank_name TEXT,
    remarks TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 8: INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_staff_departments_school ON staff_departments(school_id);
CREATE INDEX IF NOT EXISTS idx_staff_designations_school ON staff_designations(school_id);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department_id);
CREATE INDEX IF NOT EXISTS idx_staff_designation ON staff(designation_id);
CREATE INDEX IF NOT EXISTS idx_leave_types_school ON leave_types(school_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_staff ON leave_applications(staff_id);
CREATE INDEX IF NOT EXISTS idx_leave_applications_status ON leave_applications(status);
CREATE INDEX IF NOT EXISTS idx_payroll_staff ON payroll(staff_id);
CREATE INDEX IF NOT EXISTS idx_payroll_month_year ON payroll(year, month);
CREATE INDEX IF NOT EXISTS idx_salary_components_school ON salary_components(school_id);

-- ============================================
-- SECTION 9: RLS POLICIES
-- ============================================

ALTER TABLE staff_departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_designations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_leave_balance ENABLE ROW LEVEL SECURITY;
ALTER TABLE leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE salary_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_salary_structure ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and create new ones
DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage departments" ON staff_departments;
    CREATE POLICY "School admins can manage departments"
    ON staff_departments FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = staff_departments.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage designations" ON staff_designations;
    CREATE POLICY "School admins can manage designations"
    ON staff_designations FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = staff_designations.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage leave types" ON leave_types;
    CREATE POLICY "School admins can manage leave types"
    ON leave_types FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = leave_types.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage leave applications" ON leave_applications;
    CREATE POLICY "School admins can manage leave applications"
    ON leave_applications FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = leave_applications.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Staff can view own leave applications" ON leave_applications;
    CREATE POLICY "Staff can view own leave applications"
    ON leave_applications FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM staff
            WHERE staff.id = leave_applications.staff_id
            AND staff.profile_id = auth.uid()
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage payroll" ON payroll;
    CREATE POLICY "School admins can manage payroll"
    ON payroll FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = payroll.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Staff can view own payroll" ON payroll;
    CREATE POLICY "Staff can view own payroll"
    ON payroll FOR SELECT TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM staff
            WHERE staff.id = payroll.staff_id
            AND staff.profile_id = auth.uid()
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage leave balance" ON staff_leave_balance;
    CREATE POLICY "School admins can manage leave balance"
    ON staff_leave_balance FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = staff_leave_balance.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage salary components" ON salary_components;
    CREATE POLICY "School admins can manage salary components"
    ON salary_components FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = salary_components.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage salary structure" ON staff_salary_structure;
    CREATE POLICY "School admins can manage salary structure"
    ON staff_salary_structure FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = staff_salary_structure.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "School admins can manage payroll transactions" ON payroll_transactions;
    CREATE POLICY "School admins can manage payroll transactions"
    ON payroll_transactions FOR ALL TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.user_id = auth.uid()
            AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = payroll_transactions.school_id))
        )
    );
EXCEPTION WHEN others THEN NULL;
END $$;

-- ============================================
-- SECTION 10: HELPER FUNCTIONS
-- ============================================

-- Function to calculate staff attendance summary for a month
CREATE OR REPLACE FUNCTION get_staff_attendance_summary(
    p_staff_id UUID,
    p_month INTEGER,
    p_year INTEGER
)
RETURNS TABLE (
    working_days INTEGER,
    present_days INTEGER,
    absent_days INTEGER,
    late_days INTEGER,
    leave_days INTEGER,
    half_days INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::INTEGER as working_days,
        COUNT(*) FILTER (WHERE status = 'present')::INTEGER as present_days,
        COUNT(*) FILTER (WHERE status = 'absent')::INTEGER as absent_days,
        COUNT(*) FILTER (WHERE status = 'late')::INTEGER as late_days,
        COUNT(*) FILTER (WHERE status = 'on_leave')::INTEGER as leave_days,
        COUNT(*) FILTER (WHERE status = 'half_day')::INTEGER as half_days
    FROM staff_attendance
    WHERE staff_id = p_staff_id
    AND EXTRACT(MONTH FROM date) = p_month
    AND EXTRACT(YEAR FROM date) = p_year
    AND status NOT IN ('holiday', 'weekend');
END;
$$ LANGUAGE plpgsql;
