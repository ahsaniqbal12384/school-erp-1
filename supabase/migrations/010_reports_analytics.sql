-- Migration: 010_reports_analytics.sql
-- Description: Reports & Analytics - Academic performance, financial reports, dashboards
-- Comprehensive reporting and analytics system

-- ============================================
-- SECTION 1: REPORT CONFIGURATIONS
-- ============================================

-- Report Types Configuration
CREATE TABLE IF NOT EXISTS report_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('academic', 'financial', 'attendance', 'hr', 'library', 'transport', 'custom')),
    description TEXT,
    
    -- Report Template
    template JSONB, -- Column definitions, filters, groupings
    
    -- Access Control
    allowed_roles TEXT[] DEFAULT ARRAY['school_admin'],
    
    -- Scheduling
    is_scheduled BOOLEAN DEFAULT false,
    schedule_frequency TEXT CHECK (schedule_frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    schedule_day INTEGER, -- Day of week (1-7) or day of month (1-31)
    schedule_time TIME,
    email_recipients TEXT[],
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, code)
);

-- Generated Reports History
CREATE TABLE IF NOT EXISTS generated_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    report_type_id UUID REFERENCES report_types(id) ON DELETE SET NULL,
    report_name TEXT NOT NULL,
    report_category TEXT NOT NULL,
    
    -- Parameters used
    parameters JSONB,
    filters JSONB,
    date_range_start DATE,
    date_range_end DATE,
    
    -- Generation Details
    generated_by UUID REFERENCES auth.users(id),
    generated_at TIMESTAMPTZ DEFAULT NOW(),
    generation_time_ms INTEGER, -- How long it took to generate
    
    -- Output
    file_url TEXT, -- If stored as file (PDF, Excel)
    file_format TEXT CHECK (file_format IN ('pdf', 'excel', 'csv', 'json')),
    row_count INTEGER,
    
    -- Summary Data (for quick display)
    summary_data JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 2: DASHBOARD WIDGETS
-- ============================================

CREATE TABLE IF NOT EXISTS dashboard_widgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    
    name TEXT NOT NULL,
    widget_type TEXT NOT NULL CHECK (widget_type IN ('stat_card', 'line_chart', 'bar_chart', 'pie_chart', 'table', 'calendar', 'list')),
    category TEXT NOT NULL CHECK (category IN ('academic', 'financial', 'attendance', 'hr', 'library', 'transport', 'general')),
    
    -- Widget Configuration
    config JSONB NOT NULL, -- Data source, aggregations, colors, etc.
    
    -- Display
    title TEXT NOT NULL,
    subtitle TEXT,
    icon TEXT,
    color TEXT,
    
    -- Positioning
    grid_x INTEGER DEFAULT 0,
    grid_y INTEGER DEFAULT 0,
    grid_width INTEGER DEFAULT 1,
    grid_height INTEGER DEFAULT 1,
    
    -- Access Control
    visible_to_roles TEXT[] DEFAULT ARRAY['school_admin'],
    
    -- Refresh
    refresh_interval_minutes INTEGER DEFAULT 60,
    last_refreshed_at TIMESTAMPTZ,
    
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Dashboard Preferences
CREATE TABLE IF NOT EXISTS user_dashboard_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    -- Widget Layout
    widget_layout JSONB, -- User's custom widget arrangement
    hidden_widgets UUID[], -- Widgets hidden by user
    
    -- Preferences
    default_date_range TEXT DEFAULT 'this_month',
    theme TEXT DEFAULT 'light',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, school_id)
);

-- ============================================
-- SECTION 3: ANALYTICS SNAPSHOTS
-- ============================================

-- Daily Analytics Snapshot (Pre-calculated metrics)
CREATE TABLE IF NOT EXISTS daily_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Student Metrics
    total_students INTEGER DEFAULT 0,
    present_students INTEGER DEFAULT 0,
    absent_students INTEGER DEFAULT 0,
    student_attendance_rate DECIMAL(5, 2) DEFAULT 0,
    
    -- Staff Metrics
    total_staff INTEGER DEFAULT 0,
    present_staff INTEGER DEFAULT 0,
    absent_staff INTEGER DEFAULT 0,
    staff_attendance_rate DECIMAL(5, 2) DEFAULT 0,
    
    -- Financial Metrics
    fees_collected DECIMAL(12, 2) DEFAULT 0,
    fees_pending DECIMAL(12, 2) DEFAULT 0,
    new_admissions INTEGER DEFAULT 0,
    
    -- Academic Metrics
    classes_conducted INTEGER DEFAULT 0,
    assignments_given INTEGER DEFAULT 0,
    exams_conducted INTEGER DEFAULT 0,
    
    -- Library Metrics
    books_issued INTEGER DEFAULT 0,
    books_returned INTEGER DEFAULT 0,
    active_borrowers INTEGER DEFAULT 0,
    
    -- Transport Metrics
    buses_operational INTEGER DEFAULT 0,
    transport_incidents INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, date)
);

-- Monthly Analytics Summary
CREATE TABLE IF NOT EXISTS monthly_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL CHECK (month >= 1 AND month <= 12),
    
    -- Student Metrics
    avg_student_attendance DECIMAL(5, 2) DEFAULT 0,
    total_student_days INTEGER DEFAULT 0,
    present_student_days INTEGER DEFAULT 0,
    new_admissions INTEGER DEFAULT 0,
    withdrawals INTEGER DEFAULT 0,
    
    -- Financial Metrics
    total_fees_expected DECIMAL(12, 2) DEFAULT 0,
    total_fees_collected DECIMAL(12, 2) DEFAULT 0,
    collection_rate DECIMAL(5, 2) DEFAULT 0,
    total_expenses DECIMAL(12, 2) DEFAULT 0,
    net_revenue DECIMAL(12, 2) DEFAULT 0,
    
    -- Salary/Payroll
    total_salary_paid DECIMAL(12, 2) DEFAULT 0,
    
    -- Academic Metrics
    exams_conducted INTEGER DEFAULT 0,
    avg_pass_rate DECIMAL(5, 2) DEFAULT 0,
    avg_score DECIMAL(5, 2) DEFAULT 0,
    
    -- Staff Metrics
    avg_staff_attendance DECIMAL(5, 2) DEFAULT 0,
    total_leave_days INTEGER DEFAULT 0,
    
    -- Library Metrics
    total_books_issued INTEGER DEFAULT 0,
    total_fines_collected DECIMAL(10, 2) DEFAULT 0,
    new_books_added INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, year, month)
);

-- Academic Year Analytics
CREATE TABLE IF NOT EXISTS yearly_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL, -- e.g., '2024-2025'
    
    -- Student Metrics
    starting_student_count INTEGER DEFAULT 0,
    ending_student_count INTEGER DEFAULT 0,
    total_admissions INTEGER DEFAULT 0,
    total_withdrawals INTEGER DEFAULT 0,
    avg_attendance_rate DECIMAL(5, 2) DEFAULT 0,
    
    -- Academic Performance
    overall_pass_rate DECIMAL(5, 2) DEFAULT 0,
    overall_avg_score DECIMAL(5, 2) DEFAULT 0,
    distinction_count INTEGER DEFAULT 0,
    fail_count INTEGER DEFAULT 0,
    
    -- Financial Summary
    total_revenue DECIMAL(14, 2) DEFAULT 0,
    total_expenses DECIMAL(14, 2) DEFAULT 0,
    total_fees_collected DECIMAL(14, 2) DEFAULT 0,
    total_salary_paid DECIMAL(14, 2) DEFAULT 0,
    
    -- Staff Metrics
    avg_staff_count INTEGER DEFAULT 0,
    staff_turnover_rate DECIMAL(5, 2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, academic_year)
);

-- ============================================
-- SECTION 4: ACADEMIC ANALYTICS
-- ============================================

-- Class Performance Summary
CREATE TABLE IF NOT EXISTS class_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL,
    section_id UUID,
    exam_id UUID,
    academic_year TEXT NOT NULL,
    
    -- Metrics
    total_students INTEGER DEFAULT 0,
    students_appeared INTEGER DEFAULT 0,
    students_passed INTEGER DEFAULT 0,
    students_failed INTEGER DEFAULT 0,
    
    highest_score DECIMAL(5, 2),
    lowest_score DECIMAL(5, 2),
    average_score DECIMAL(5, 2),
    median_score DECIMAL(5, 2),
    
    pass_percentage DECIMAL(5, 2),
    distinction_count INTEGER DEFAULT 0,
    first_division INTEGER DEFAULT 0,
    second_division INTEGER DEFAULT 0,
    third_division INTEGER DEFAULT 0,
    
    -- Subject-wise breakdown
    subject_performance JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student Performance Tracking
CREATE TABLE IF NOT EXISTS student_performance_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL,
    academic_year TEXT NOT NULL,
    term TEXT, -- 'term1', 'term2', 'final'
    
    -- Overall Performance
    overall_percentage DECIMAL(5, 2),
    grade TEXT,
    rank_in_class INTEGER,
    rank_in_section INTEGER,
    
    -- Subject Performance
    subject_scores JSONB, -- [{subject, score, grade, rank}]
    
    -- Attendance
    attendance_percentage DECIMAL(5, 2),
    days_present INTEGER,
    days_absent INTEGER,
    
    -- Behavior/Remarks
    teacher_remarks TEXT,
    principal_remarks TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(student_id, academic_year, term)
);

-- ============================================
-- SECTION 5: FINANCIAL ANALYTICS
-- ============================================

-- Fee Collection Summary
CREATE TABLE IF NOT EXISTS fee_collection_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    
    -- Daily Collection
    total_collected DECIMAL(12, 2) DEFAULT 0,
    cash_collected DECIMAL(12, 2) DEFAULT 0,
    online_collected DECIMAL(12, 2) DEFAULT 0,
    cheque_collected DECIMAL(12, 2) DEFAULT 0,
    
    -- Transaction Counts
    total_transactions INTEGER DEFAULT 0,
    students_paid INTEGER DEFAULT 0,
    
    -- By Fee Type
    tuition_fees DECIMAL(12, 2) DEFAULT 0,
    admission_fees DECIMAL(12, 2) DEFAULT 0,
    exam_fees DECIMAL(12, 2) DEFAULT 0,
    transport_fees DECIMAL(12, 2) DEFAULT 0,
    library_fees DECIMAL(12, 2) DEFAULT 0,
    other_fees DECIMAL(12, 2) DEFAULT 0,
    
    -- Discounts Given
    total_discounts DECIMAL(12, 2) DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, date)
);

-- Fee Defaulters Summary
CREATE TABLE IF NOT EXISTS fee_defaulters_snapshot (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    snapshot_date DATE NOT NULL,
    
    -- Counts by Duration
    defaulters_1_month INTEGER DEFAULT 0,
    defaulters_2_months INTEGER DEFAULT 0,
    defaulters_3_months INTEGER DEFAULT 0,
    defaulters_6_months_plus INTEGER DEFAULT 0,
    
    -- Amounts
    amount_1_month DECIMAL(12, 2) DEFAULT 0,
    amount_2_months DECIMAL(12, 2) DEFAULT 0,
    amount_3_months DECIMAL(12, 2) DEFAULT 0,
    amount_6_months_plus DECIMAL(12, 2) DEFAULT 0,
    total_pending DECIMAL(12, 2) DEFAULT 0,
    
    -- By Class
    class_wise_breakdown JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, snapshot_date)
);

-- Expense Summary
CREATE TABLE IF NOT EXISTS expense_summary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    
    -- By Category
    salary_expense DECIMAL(12, 2) DEFAULT 0,
    utilities_expense DECIMAL(12, 2) DEFAULT 0,
    maintenance_expense DECIMAL(12, 2) DEFAULT 0,
    supplies_expense DECIMAL(12, 2) DEFAULT 0,
    transport_expense DECIMAL(12, 2) DEFAULT 0,
    events_expense DECIMAL(12, 2) DEFAULT 0,
    other_expense DECIMAL(12, 2) DEFAULT 0,
    total_expense DECIMAL(12, 2) DEFAULT 0,
    
    -- Breakdown
    category_breakdown JSONB,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, year, month)
);

-- ============================================
-- SECTION 6: INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_daily_analytics_school_date ON daily_analytics(school_id, date);
CREATE INDEX IF NOT EXISTS idx_monthly_analytics_school ON monthly_analytics(school_id, year, month);
CREATE INDEX IF NOT EXISTS idx_generated_reports_school ON generated_reports(school_id);
CREATE INDEX IF NOT EXISTS idx_class_performance_school ON class_performance(school_id);
CREATE INDEX IF NOT EXISTS idx_student_performance_student ON student_performance_history(student_id);
CREATE INDEX IF NOT EXISTS idx_fee_collection_school_date ON fee_collection_summary(school_id, date);

-- ============================================
-- SECTION 7: RLS POLICIES
-- ============================================

ALTER TABLE report_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_dashboard_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monthly_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE yearly_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_performance_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_collection_summary ENABLE ROW LEVEL SECURITY;
ALTER TABLE fee_defaulters_snapshot ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_summary ENABLE ROW LEVEL SECURITY;

-- School admins can access all analytics for their school
CREATE POLICY "School admins can access report_types"
ON report_types FOR ALL TO authenticated
USING (
    school_id IS NULL OR -- System-wide report types
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = report_types.school_id))
    )
);

CREATE POLICY "School admins can access generated_reports"
ON generated_reports FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = generated_reports.school_id))
    )
);

CREATE POLICY "Users can access their dashboard preferences"
ON user_dashboard_preferences FOR ALL TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "School admins can access daily_analytics"
ON daily_analytics FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = daily_analytics.school_id))
    )
);

CREATE POLICY "School admins can access monthly_analytics"
ON monthly_analytics FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = monthly_analytics.school_id))
    )
);

CREATE POLICY "School admins can access yearly_analytics"
ON yearly_analytics FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = yearly_analytics.school_id))
    )
);

CREATE POLICY "School admins can access class_performance"
ON class_performance FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = class_performance.school_id))
    )
);

-- Teachers can view class performance they teach
CREATE POLICY "Teachers can view class performance"
ON class_performance FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'teacher'
        AND profiles.school_id = class_performance.school_id
    )
);

CREATE POLICY "School admins can access student_performance_history"
ON student_performance_history FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = student_performance_history.school_id))
    )
);

CREATE POLICY "School admins can access fee_collection_summary"
ON fee_collection_summary FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'accountant') AND profiles.school_id = fee_collection_summary.school_id))
    )
);

CREATE POLICY "School admins can access fee_defaulters_snapshot"
ON fee_defaulters_snapshot FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'accountant') AND profiles.school_id = fee_defaulters_snapshot.school_id))
    )
);

CREATE POLICY "School admins can access expense_summary"
ON expense_summary FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'accountant') AND profiles.school_id = expense_summary.school_id))
    )
);

CREATE POLICY "School admins can access dashboard_widgets"
ON dashboard_widgets FOR ALL TO authenticated
USING (
    school_id IS NULL OR -- System-wide widgets
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR (profiles.role = 'school_admin' AND profiles.school_id = dashboard_widgets.school_id))
    )
);

-- ============================================
-- SECTION 8: HELPER FUNCTIONS
-- ============================================

-- Function to generate daily analytics snapshot
CREATE OR REPLACE FUNCTION generate_daily_analytics(
    p_school_id UUID,
    p_date DATE DEFAULT CURRENT_DATE
)
RETURNS VOID AS $$
DECLARE
    v_total_students INTEGER;
    v_present_students INTEGER;
    v_total_staff INTEGER;
    v_present_staff INTEGER;
    v_fees_collected DECIMAL;
BEGIN
    -- Get student count and attendance
    SELECT 
        COUNT(DISTINCT s.id),
        COUNT(DISTINCT CASE WHEN sa.status = 'present' THEN s.id END)
    INTO v_total_students, v_present_students
    FROM students s
    LEFT JOIN student_attendance sa ON sa.student_id = s.id AND sa.date = p_date
    WHERE s.school_id = p_school_id AND s.is_active = true;
    
    -- Get staff count and attendance
    SELECT 
        COUNT(DISTINCT st.id),
        COUNT(DISTINCT CASE WHEN sta.status = 'present' THEN st.id END)
    INTO v_total_staff, v_present_staff
    FROM staff st
    LEFT JOIN staff_attendance sta ON sta.staff_id = st.id AND sta.date = p_date
    WHERE st.school_id = p_school_id AND st.is_active = true;
    
    -- Get fees collected
    SELECT COALESCE(SUM(amount), 0)
    INTO v_fees_collected
    FROM fee_payments
    WHERE school_id = p_school_id 
    AND payment_date = p_date;
    
    -- Insert or update daily analytics
    INSERT INTO daily_analytics (
        school_id, date,
        total_students, present_students, absent_students, student_attendance_rate,
        total_staff, present_staff, absent_staff, staff_attendance_rate,
        fees_collected
    )
    VALUES (
        p_school_id, p_date,
        v_total_students, v_present_students, v_total_students - v_present_students,
        CASE WHEN v_total_students > 0 THEN (v_present_students::DECIMAL / v_total_students * 100) ELSE 0 END,
        v_total_staff, v_present_staff, v_total_staff - v_present_staff,
        CASE WHEN v_total_staff > 0 THEN (v_present_staff::DECIMAL / v_total_staff * 100) ELSE 0 END,
        v_fees_collected
    )
    ON CONFLICT (school_id, date) DO UPDATE SET
        total_students = EXCLUDED.total_students,
        present_students = EXCLUDED.present_students,
        absent_students = EXCLUDED.absent_students,
        student_attendance_rate = EXCLUDED.student_attendance_rate,
        total_staff = EXCLUDED.total_staff,
        present_staff = EXCLUDED.present_staff,
        absent_staff = EXCLUDED.absent_staff,
        staff_attendance_rate = EXCLUDED.staff_attendance_rate,
        fees_collected = EXCLUDED.fees_collected;
END;
$$ LANGUAGE plpgsql;

-- Function to generate monthly analytics
CREATE OR REPLACE FUNCTION generate_monthly_analytics(
    p_school_id UUID,
    p_year INTEGER,
    p_month INTEGER
)
RETURNS VOID AS $$
DECLARE
    v_avg_student_att DECIMAL;
    v_avg_staff_att DECIMAL;
    v_total_fees DECIMAL;
    v_total_salary DECIMAL;
BEGIN
    -- Calculate averages from daily data
    SELECT 
        AVG(student_attendance_rate),
        AVG(staff_attendance_rate),
        SUM(fees_collected)
    INTO v_avg_student_att, v_avg_staff_att, v_total_fees
    FROM daily_analytics
    WHERE school_id = p_school_id
    AND EXTRACT(YEAR FROM date) = p_year
    AND EXTRACT(MONTH FROM date) = p_month;
    
    -- Get salary paid
    SELECT COALESCE(SUM(net_salary), 0)
    INTO v_total_salary
    FROM payroll
    WHERE school_id = p_school_id
    AND year = p_year
    AND month = p_month
    AND status = 'paid';
    
    -- Insert or update monthly analytics
    INSERT INTO monthly_analytics (
        school_id, year, month,
        avg_student_attendance, avg_staff_attendance,
        total_fees_collected, total_salary_paid
    )
    VALUES (
        p_school_id, p_year, p_month,
        COALESCE(v_avg_student_att, 0), COALESCE(v_avg_staff_att, 0),
        COALESCE(v_total_fees, 0), v_total_salary
    )
    ON CONFLICT (school_id, year, month) DO UPDATE SET
        avg_student_attendance = EXCLUDED.avg_student_attendance,
        avg_staff_attendance = EXCLUDED.avg_staff_attendance,
        total_fees_collected = EXCLUDED.total_fees_collected,
        total_salary_paid = EXCLUDED.total_salary_paid,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Function to get dashboard summary
CREATE OR REPLACE FUNCTION get_dashboard_summary(
    p_school_id UUID
)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'today', (SELECT row_to_json(d) FROM daily_analytics d WHERE school_id = p_school_id AND date = CURRENT_DATE),
        'this_month', (SELECT row_to_json(m) FROM monthly_analytics m WHERE school_id = p_school_id AND year = EXTRACT(YEAR FROM CURRENT_DATE) AND month = EXTRACT(MONTH FROM CURRENT_DATE)),
        'total_students', (SELECT COUNT(*) FROM students WHERE school_id = p_school_id AND is_active = true),
        'total_staff', (SELECT COUNT(*) FROM staff WHERE school_id = p_school_id AND is_active = true),
        'pending_fees', (SELECT COALESCE(SUM(balance), 0) FROM student_fees WHERE school_id = p_school_id AND status = 'pending'),
        'upcoming_events', (SELECT COUNT(*) FROM events WHERE school_id = p_school_id AND start_date > CURRENT_DATE AND start_date <= CURRENT_DATE + 7)
    ) INTO v_result;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SECTION 9: DEFAULT REPORT TYPES
-- ============================================

-- Insert system-wide report types
INSERT INTO report_types (school_id, name, code, category, description, allowed_roles) VALUES
(NULL, 'Student Attendance Report', 'STUDENT_ATTENDANCE', 'attendance', 'Daily/Monthly student attendance summary', ARRAY['school_admin', 'teacher']),
(NULL, 'Staff Attendance Report', 'STAFF_ATTENDANCE', 'attendance', 'Daily/Monthly staff attendance summary', ARRAY['school_admin']),
(NULL, 'Fee Collection Report', 'FEE_COLLECTION', 'financial', 'Daily/Monthly fee collection summary', ARRAY['school_admin', 'accountant']),
(NULL, 'Fee Defaulters Report', 'FEE_DEFAULTERS', 'financial', 'List of students with pending fees', ARRAY['school_admin', 'accountant']),
(NULL, 'Exam Results Report', 'EXAM_RESULTS', 'academic', 'Class-wise exam results and analysis', ARRAY['school_admin', 'teacher']),
(NULL, 'Student Performance Report', 'STUDENT_PERFORMANCE', 'academic', 'Individual student performance analysis', ARRAY['school_admin', 'teacher', 'parent']),
(NULL, 'Class Performance Report', 'CLASS_PERFORMANCE', 'academic', 'Overall class performance comparison', ARRAY['school_admin', 'teacher']),
(NULL, 'Payroll Report', 'PAYROLL', 'hr', 'Monthly payroll summary and breakdown', ARRAY['school_admin']),
(NULL, 'Leave Report', 'LEAVE_REPORT', 'hr', 'Staff leave summary', ARRAY['school_admin']),
(NULL, 'Library Usage Report', 'LIBRARY_USAGE', 'library', 'Book issues, returns, and fines summary', ARRAY['school_admin', 'librarian']),
(NULL, 'Transport Report', 'TRANSPORT', 'transport', 'Vehicle and route wise student count', ARRAY['school_admin', 'transport_manager']),
(NULL, 'Income & Expense Report', 'INCOME_EXPENSE', 'financial', 'Financial summary with income and expenses', ARRAY['school_admin', 'accountant'])
ON CONFLICT DO NOTHING;

-- ============================================
-- SECTION 10: DEFAULT DASHBOARD WIDGETS
-- ============================================

INSERT INTO dashboard_widgets (school_id, name, widget_type, category, config, title, subtitle, icon, color, grid_width, grid_height, visible_to_roles, sort_order) VALUES
(NULL, 'total_students', 'stat_card', 'general', '{"query": "SELECT COUNT(*) FROM students WHERE school_id = $1 AND is_active = true"}', 'Total Students', 'Active enrollments', 'Users', 'blue', 1, 1, ARRAY['school_admin'], 1),
(NULL, 'total_staff', 'stat_card', 'general', '{"query": "SELECT COUNT(*) FROM staff WHERE school_id = $1 AND is_active = true"}', 'Total Staff', 'Active employees', 'UserCheck', 'green', 1, 1, ARRAY['school_admin'], 2),
(NULL, 'today_attendance', 'stat_card', 'attendance', '{"query": "SELECT student_attendance_rate FROM daily_analytics WHERE school_id = $1 AND date = CURRENT_DATE"}', 'Today''s Attendance', 'Student attendance rate', 'ClipboardList', 'purple', 1, 1, ARRAY['school_admin'], 3),
(NULL, 'fees_collected_today', 'stat_card', 'financial', '{"query": "SELECT COALESCE(SUM(amount), 0) FROM fee_payments WHERE school_id = $1 AND payment_date = CURRENT_DATE"}', 'Fees Collected Today', 'PKR', 'DollarSign', 'emerald', 1, 1, ARRAY['school_admin', 'accountant'], 4),
(NULL, 'pending_fees', 'stat_card', 'financial', '{"query": "SELECT COALESCE(SUM(balance), 0) FROM student_fees WHERE school_id = $1 AND status = ''pending''"}', 'Pending Fees', 'Total outstanding', 'AlertCircle', 'red', 1, 1, ARRAY['school_admin', 'accountant'], 5),
(NULL, 'attendance_trend', 'line_chart', 'attendance', '{"query": "SELECT date, student_attendance_rate FROM daily_analytics WHERE school_id = $1 AND date >= CURRENT_DATE - 30 ORDER BY date"}', 'Attendance Trend', 'Last 30 days', 'TrendingUp', 'blue', 2, 1, ARRAY['school_admin'], 6),
(NULL, 'fee_collection_trend', 'bar_chart', 'financial', '{"query": "SELECT month, total_fees_collected FROM monthly_analytics WHERE school_id = $1 AND year = EXTRACT(YEAR FROM CURRENT_DATE) ORDER BY month"}', 'Fee Collection Trend', 'This year', 'BarChart', 'green', 2, 1, ARRAY['school_admin', 'accountant'], 7),
(NULL, 'class_distribution', 'pie_chart', 'academic', '{"query": "SELECT class_name, COUNT(*) FROM students WHERE school_id = $1 AND is_active = true GROUP BY class_name"}', 'Students by Class', 'Distribution', 'PieChart', 'purple', 1, 1, ARRAY['school_admin'], 8)
ON CONFLICT DO NOTHING;
