-- ============================================
-- SMS & Notifications Schema
-- ============================================

-- SMS Configuration per school
CREATE TABLE IF NOT EXISTS sms_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'custom' CHECK (provider IN ('twilio', 'zong', 'jazz', 'telenor', 'custom')),
    api_key TEXT,
    api_secret TEXT,
    sender_id VARCHAR(20),
    base_url TEXT,
    username TEXT,
    password TEXT,
    is_active BOOLEAN DEFAULT true,
    credits_balance INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id)
);

-- SMS Templates
CREATE TABLE IF NOT EXISTS sms_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    category VARCHAR(50) CHECK (category IN ('attendance', 'fees', 'exams', 'general', 'emergency')),
    variables TEXT[], -- Array of variable placeholders like {student_name}, {date}
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS Log/History
CREATE TABLE IF NOT EXISTS sms_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    recipient_phone VARCHAR(20) NOT NULL,
    recipient_name VARCHAR(255),
    recipient_type VARCHAR(20) CHECK (recipient_type IN ('parent', 'teacher', 'staff', 'student')),
    student_id UUID REFERENCES students(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'failed')),
    message_id VARCHAR(100), -- Provider's message ID
    error_message TEXT,
    sent_by UUID REFERENCES profiles(id),
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    delivered_at TIMESTAMPTZ,
    cost_credits INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SMS Broadcasts (bulk messages)
CREATE TABLE IF NOT EXISTS sms_broadcasts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    target_type VARCHAR(50) NOT NULL, -- 'all_parents', 'all_teachers', 'class_10_A', 'custom'
    target_filters JSONB, -- Filters used (class, section, etc.)
    total_recipients INTEGER DEFAULT 0,
    sent_count INTEGER DEFAULT 0,
    delivered_count INTEGER DEFAULT 0,
    failed_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'failed')),
    scheduled_at TIMESTAMPTZ,
    sent_by UUID REFERENCES profiles(id),
    sent_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Attendance SMS Alerts (auto-triggered)
CREATE TABLE IF NOT EXISTS attendance_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    attendance_id UUID NOT NULL REFERENCES attendance(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id),
    parent_phone VARCHAR(20) NOT NULL,
    alert_type VARCHAR(20) NOT NULL CHECK (alert_type IN ('absent', 'late', 'leave')),
    message TEXT NOT NULL,
    sms_log_id UUID REFERENCES sms_logs(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- School Working Days Configuration
ALTER TABLE schools ADD COLUMN IF NOT EXISTS working_days TEXT[] DEFAULT ARRAY['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_sms_logs_school_id ON sms_logs(school_id);
CREATE INDEX IF NOT EXISTS idx_sms_logs_sent_at ON sms_logs(sent_at);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_recipient_phone ON sms_logs(recipient_phone);
CREATE INDEX IF NOT EXISTS idx_sms_broadcasts_school_id ON sms_broadcasts(school_id);
CREATE INDEX IF NOT EXISTS idx_sms_broadcasts_status ON sms_broadcasts(status);
CREATE INDEX IF NOT EXISTS idx_attendance_alerts_school_id ON attendance_alerts(school_id);
CREATE INDEX IF NOT EXISTS idx_attendance_alerts_attendance_id ON attendance_alerts(attendance_id);

-- Insert default templates for new schools
CREATE OR REPLACE FUNCTION create_default_sms_templates()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO sms_templates (school_id, name, message, category, variables) VALUES
    (NEW.id, 'Absence Alert', 'Dear Parent, Your child {student_name} was marked ABSENT on {date}. Please contact school if this is incorrect.', 'attendance', ARRAY['{student_name}', '{date}']),
    (NEW.id, 'Late Arrival', 'Dear Parent, Your child {student_name} arrived LATE at {time} on {date}.', 'attendance', ARRAY['{student_name}', '{time}', '{date}']),
    (NEW.id, 'Fee Reminder', 'Fee Reminder: {student_name}''s fee of Rs.{amount} is due on {due_date}. Please pay to avoid late charges.', 'fees', ARRAY['{student_name}', '{amount}', '{due_date}']),
    (NEW.id, 'Fee Received', 'Payment Received: Rs.{amount} received for {student_name}. Thank you!', 'fees', ARRAY['{amount}', '{student_name}']),
    (NEW.id, 'Exam Schedule', '{exam_name} exams will begin from {start_date}. Please ensure your child is prepared.', 'exams', ARRAY['{exam_name}', '{start_date}']),
    (NEW.id, 'Result Announced', 'Results for {exam_name} have been announced. Check portal for details.', 'exams', ARRAY['{exam_name}']),
    (NEW.id, 'Holiday Notice', 'School Holiday: {reason}. School will remain closed from {from_date} to {to_date}.', 'general', ARRAY['{reason}', '{from_date}', '{to_date}']),
    (NEW.id, 'PTM Notice', 'Parent Teacher Meeting scheduled for {date} at {time}. Your presence is requested.', 'general', ARRAY['{date}', '{time}']),
    (NEW.id, 'Emergency Alert', 'URGENT from {school_name}: {message}. Please contact school immediately.', 'emergency', ARRAY['{school_name}', '{message}']);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create default templates when a new school is created
DROP TRIGGER IF EXISTS trigger_create_default_sms_templates ON schools;
CREATE TRIGGER trigger_create_default_sms_templates
    AFTER INSERT ON schools
    FOR EACH ROW
    EXECUTE FUNCTION create_default_sms_templates();

-- Row Level Security for SMS tables
ALTER TABLE sms_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sms_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their school's SMS config" ON sms_config
    FOR SELECT USING (school_id IN (SELECT school_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage SMS config" ON sms_config
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('school_admin', 'super_admin')
        )
    );

CREATE POLICY "Users can view their school's SMS templates" ON sms_templates
    FOR SELECT USING (school_id IN (SELECT school_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage SMS templates" ON sms_templates
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('school_admin', 'super_admin')
        )
    );

CREATE POLICY "Users can view their school's SMS logs" ON sms_logs
    FOR SELECT USING (school_id IN (SELECT school_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Staff can create SMS logs" ON sms_logs
    FOR INSERT WITH CHECK (
        school_id IN (
            SELECT school_id FROM profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('school_admin', 'teacher', 'staff', 'super_admin')
        )
    );

CREATE POLICY "Users can view their school's broadcasts" ON sms_broadcasts
    FOR SELECT USING (school_id IN (SELECT school_id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can manage broadcasts" ON sms_broadcasts
    FOR ALL USING (
        school_id IN (
            SELECT school_id FROM profiles 
            WHERE user_id = auth.uid() 
            AND role IN ('school_admin', 'super_admin')
        )
    );

CREATE POLICY "Users can view attendance alerts" ON attendance_alerts
    FOR SELECT USING (school_id IN (SELECT school_id FROM profiles WHERE user_id = auth.uid()));
