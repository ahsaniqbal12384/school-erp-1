-- =============================================
-- MULTI-TENANT SCHOOL ERP DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. SCHOOLS TABLE (Core tenant table)
-- =============================================
CREATE TABLE IF NOT EXISTS schools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- Used for subdomain: slug.yourapp.com
    logo_url TEXT,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Pakistan',
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    principal_name VARCHAR(255),
    established_year INTEGER,
    subscription_plan VARCHAR(50) DEFAULT 'basic', -- basic, standard, premium, enterprise
    subscription_status VARCHAR(50) DEFAULT 'trial', -- trial, active, suspended, expired, cancelled
    subscription_starts_at TIMESTAMP DEFAULT NOW(),
    subscription_expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '30 days'),
    max_students INTEGER DEFAULT 100,
    max_staff INTEGER DEFAULT 20,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 2. SCHOOL SETTINGS TABLE (Branding & Preferences)
-- =============================================
CREATE TABLE IF NOT EXISTS school_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
    -- Branding
    primary_color VARCHAR(20) DEFAULT '#3b82f6',
    secondary_color VARCHAR(20) DEFAULT '#8b5cf6',
    accent_color VARCHAR(20) DEFAULT '#10b981',
    favicon_url TEXT,
    banner_url TEXT,
    -- School Info
    school_motto TEXT,
    school_vision TEXT,
    school_mission TEXT,
    -- Academic Settings
    academic_year VARCHAR(20) DEFAULT '2024-2025',
    term_system VARCHAR(20) DEFAULT 'semester', -- semester, trimester, quarterly, annual
    grading_system VARCHAR(20) DEFAULT 'percentage', -- percentage, gpa, grades
    -- Localization
    currency VARCHAR(10) DEFAULT 'PKR',
    currency_symbol VARCHAR(5) DEFAULT 'Rs.',
    timezone VARCHAR(50) DEFAULT 'Asia/Karachi',
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    time_format VARCHAR(10) DEFAULT '12h', -- 12h, 24h
    -- Features
    sms_enabled BOOLEAN DEFAULT false,
    email_enabled BOOLEAN DEFAULT true,
    parent_portal_enabled BOOLEAN DEFAULT true,
    student_portal_enabled BOOLEAN DEFAULT true,
    online_payment_enabled BOOLEAN DEFAULT false,
    biometric_attendance BOOLEAN DEFAULT false,
    -- Working Days
    working_days JSONB DEFAULT '["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]',
    school_timing_start TIME DEFAULT '08:00',
    school_timing_end TIME DEFAULT '14:00',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 3. SCHOOL MODULES TABLE (Module Permissions)
-- =============================================
CREATE TABLE IF NOT EXISTS school_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    module_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    enabled_at TIMESTAMP DEFAULT NOW(),
    disabled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(school_id, module_name)
);

-- Available modules:
-- students, staff, fees, exams, transport, library, 
-- communications, admissions, reports, timetable, 
-- homework, attendance, inventory, hostel, cafeteria

-- =============================================
-- 4. USERS TABLE (All users in the system)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE, -- NULL for super_admin
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL, -- super_admin, school_admin, teacher, parent, student, accountant, librarian, transport_manager
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP,
    login_count INTEGER DEFAULT 0,
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMP,
    password_reset_token TEXT,
    password_reset_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 5. SESSIONS TABLE (User sessions)
-- =============================================
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 6. AUDIT LOG TABLE (Track important actions)
-- =============================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- create, update, delete, login, logout, etc.
    entity_type VARCHAR(100), -- school, user, student, fee, etc.
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 7. SUBSCRIPTION PLANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL, -- basic, standard, premium, enterprise
    description TEXT,
    price_monthly DECIMAL(10,2) DEFAULT 0,
    price_yearly DECIMAL(10,2) DEFAULT 0,
    max_students INTEGER DEFAULT 100,
    max_staff INTEGER DEFAULT 20,
    max_admins INTEGER DEFAULT 2,
    storage_gb INTEGER DEFAULT 5,
    modules JSONB DEFAULT '[]', -- List of included modules
    features JSONB DEFAULT '[]', -- Additional features
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- 8. SCHOOL INVOICES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS school_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'PKR',
    status VARCHAR(50) DEFAULT 'pending', -- pending, paid, overdue, cancelled
    due_date DATE NOT NULL,
    paid_date DATE,
    payment_method VARCHAR(50), -- bank_transfer, credit_card, cash, cheque
    payment_reference VARCHAR(255),
    billing_period_start DATE,
    billing_period_end DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_status ON schools(subscription_status);
CREATE INDEX idx_users_school ON users(school_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_school_modules_school ON school_modules(school_id);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token);
CREATE INDEX idx_audit_school ON audit_logs(school_id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_schools_updated_at BEFORE UPDATE ON schools
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_school_settings_updated_at BEFORE UPDATE ON school_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INSERT DEFAULT SUBSCRIPTION PLANS
-- =============================================
INSERT INTO subscription_plans (name, slug, description, price_monthly, price_yearly, max_students, max_staff, max_admins, storage_gb, modules, sort_order)
VALUES 
    ('Basic', 'basic', 'Perfect for small schools', 2999, 29990, 100, 20, 2, 5, 
     '["students", "staff", "fees", "attendance", "communications"]', 1),
    ('Standard', 'standard', 'Great for growing schools', 5999, 59990, 500, 50, 5, 20, 
     '["students", "staff", "fees", "attendance", "communications", "exams", "admissions", "reports", "homework"]', 2),
    ('Premium', 'premium', 'Complete solution for established schools', 9999, 99990, 2000, 200, 10, 50, 
     '["students", "staff", "fees", "attendance", "communications", "exams", "admissions", "reports", "homework", "transport", "library", "timetable"]', 3),
    ('Enterprise', 'enterprise', 'Unlimited access for large institutions', 19999, 199990, -1, -1, -1, 100, 
     '["students", "staff", "fees", "attendance", "communications", "exams", "admissions", "reports", "homework", "transport", "library", "timetable", "inventory", "hostel", "cafeteria"]', 4)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- INSERT DEFAULT SUPER ADMIN USER
-- Password: admin123 (hashed with bcrypt)
-- =============================================
INSERT INTO users (id, school_id, email, password_hash, role, first_name, last_name, is_active, email_verified)
VALUES (
    uuid_generate_v4(),
    NULL,
    'superadmin@erp.pk',
    '$2a$10$rQZ5xMRqtdX0lVOBaBlKJ.KwGHhIJYNJE2VKwV5nWPJYq0ZKxG6Gy', -- admin123
    'super_admin',
    'Super',
    'Admin',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_invoices ENABLE ROW LEVEL SECURITY;

-- Schools: Super admins can see all, others only their school
CREATE POLICY "Super admins can manage all schools" ON schools
    FOR ALL USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
    );

CREATE POLICY "Users can view their own school" ON schools
    FOR SELECT USING (
        id = (SELECT school_id FROM users WHERE id = auth.uid())
    );

-- Users: Can only see users from same school (except super admin)
CREATE POLICY "Users can view same school users" ON users
    FOR SELECT USING (
        school_id = (SELECT school_id FROM users WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
    );

-- School Modules: View only own school's modules
CREATE POLICY "Users can view own school modules" ON school_modules
    FOR SELECT USING (
        school_id = (SELECT school_id FROM users WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
    );

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

-- Function to check if school has access to a module
CREATE OR REPLACE FUNCTION has_module_access(p_school_id UUID, p_module_name VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM school_modules 
        WHERE school_id = p_school_id 
        AND module_name = p_module_name 
        AND is_enabled = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get school by slug
CREATE OR REPLACE FUNCTION get_school_by_slug(p_slug VARCHAR)
RETURNS TABLE (
    id UUID,
    name VARCHAR,
    slug VARCHAR,
    logo_url TEXT,
    is_active BOOLEAN,
    subscription_status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.name, s.slug, s.logo_url, s.is_active, s.subscription_status
    FROM schools s WHERE s.slug = p_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new school with default settings and modules
CREATE OR REPLACE FUNCTION create_school_with_defaults(
    p_name VARCHAR,
    p_slug VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR,
    p_plan VARCHAR DEFAULT 'basic'
)
RETURNS UUID AS $$
DECLARE
    v_school_id UUID;
    v_plan_modules JSONB;
BEGIN
    -- Insert school
    INSERT INTO schools (name, slug, email, phone, subscription_plan)
    VALUES (p_name, p_slug, p_email, p_phone, p_plan)
    RETURNING id INTO v_school_id;
    
    -- Insert default settings
    INSERT INTO school_settings (school_id)
    VALUES (v_school_id);
    
    -- Get modules for this plan
    SELECT modules INTO v_plan_modules
    FROM subscription_plans WHERE slug = p_plan;
    
    -- Insert modules
    INSERT INTO school_modules (school_id, module_name, is_enabled)
    SELECT v_school_id, jsonb_array_elements_text(v_plan_modules), true;
    
    RETURN v_school_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- DONE! Database schema is ready.
-- =============================================
