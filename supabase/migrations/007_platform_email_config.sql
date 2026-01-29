-- Migration: 007_platform_email_config.sql
-- Description: Add platform-level email configuration and school email permissions
-- This allows super admin to configure email service and control which schools can use email

-- Platform Email Configuration (Super Admin level)
CREATE TABLE IF NOT EXISTS platform_email_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'none' CHECK (provider IN ('smtp', 'sendgrid', 'mailgun', 'ses', 'postmark', 'resend', 'none')),
    is_enabled BOOLEAN DEFAULT false,
    -- SMTP settings
    smtp_host TEXT DEFAULT '',
    smtp_port INTEGER DEFAULT 587,
    smtp_username TEXT DEFAULT '',
    smtp_password TEXT DEFAULT '',
    smtp_encryption TEXT DEFAULT 'tls' CHECK (smtp_encryption IN ('none', 'ssl', 'tls')),
    -- API-based providers
    api_key TEXT DEFAULT '',
    api_secret TEXT DEFAULT '',
    -- Common settings
    from_email TEXT DEFAULT '',
    from_name TEXT DEFAULT 'School ERP',
    reply_to TEXT DEFAULT '',
    -- Limits
    monthly_limit INTEGER DEFAULT 50000,
    daily_limit INTEGER DEFAULT 2000,
    rate_per_email DECIMAL(10, 4) DEFAULT 0.001,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- School Email Settings (Per-school permissions)
CREATE TABLE IF NOT EXISTS school_email_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    is_email_enabled BOOLEAN DEFAULT false,
    monthly_limit INTEGER DEFAULT 5000,
    can_send_attendance BOOLEAN DEFAULT true,
    can_send_fees BOOLEAN DEFAULT true,
    can_send_exams BOOLEAN DEFAULT true,
    can_send_general BOOLEAN DEFAULT true,
    can_send_newsletters BOOLEAN DEFAULT true,
    -- Custom from settings (optional, uses platform defaults if empty)
    custom_from_email TEXT DEFAULT '',
    custom_from_name TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id)
);

-- Email Logs
CREATE TABLE IF NOT EXISTS email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    recipient_name TEXT,
    subject TEXT NOT NULL,
    body TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'delivered', 'opened', 'failed', 'bounced')),
    message_id TEXT,
    error_message TEXT,
    email_type TEXT DEFAULT 'general',
    template_id TEXT,
    -- Tracking
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ,
    bounced_at TIMESTAMPTZ,
    -- Meta
    sent_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    sent_at TIMESTAMPTZ
);

-- Email Templates (School-level)
CREATE TABLE IF NOT EXISTS email_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    category TEXT DEFAULT 'general' CHECK (category IN ('attendance', 'fees', 'exams', 'general', 'newsletter')),
    variables TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_school_email_settings_school_id ON school_email_settings(school_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_school_created ON email_logs(school_id, created_at);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_templates_school_id ON email_templates(school_id);
CREATE INDEX IF NOT EXISTS idx_email_templates_category ON email_templates(category);

-- RLS Policies for platform_email_config
ALTER TABLE platform_email_config ENABLE ROW LEVEL SECURITY;

-- Only super admins can view platform email config
CREATE POLICY "Super admins can view platform email config"
ON platform_email_config FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- Only super admins can manage platform email config
CREATE POLICY "Super admins can manage platform email config"
ON platform_email_config FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- RLS Policies for school_email_settings
ALTER TABLE school_email_settings ENABLE ROW LEVEL SECURITY;

-- Super admins can view all school email settings
CREATE POLICY "Super admins can view all school email settings"
ON school_email_settings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- Super admins can manage all school email settings
CREATE POLICY "Super admins can manage school email settings"
ON school_email_settings FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- School admins can view their own school's email settings
CREATE POLICY "School admins can view own email settings"
ON school_email_settings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'school_admin'
        AND profiles.school_id = school_email_settings.school_id
    )
);

-- RLS Policies for email_logs
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;

-- Super admins can view all email logs
CREATE POLICY "Super admins can view all email logs"
ON email_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- School admins can view their own school's email logs
CREATE POLICY "School admins can view own email logs"
ON email_logs FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'school_admin'
        AND profiles.school_id = email_logs.school_id
    )
);

-- School admins can insert email logs for their school
CREATE POLICY "School admins can insert email logs"
ON email_logs FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'school_admin'
        AND profiles.school_id = email_logs.school_id
    )
);

-- RLS Policies for email_templates
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Super admins can manage all templates
CREATE POLICY "Super admins can manage all email templates"
ON email_templates FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- School admins can view and manage their school's templates
CREATE POLICY "School admins can manage own email templates"
ON email_templates FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'school_admin'
        AND profiles.school_id = email_templates.school_id
    )
);

-- Insert default platform email config if not exists
INSERT INTO platform_email_config (provider, is_enabled, monthly_limit, daily_limit)
SELECT 'none', false, 50000, 2000
WHERE NOT EXISTS (SELECT 1 FROM platform_email_config);

-- Function to check if school can send email of a specific type
CREATE OR REPLACE FUNCTION can_school_send_email(
    p_school_id UUID,
    p_email_type TEXT DEFAULT 'general'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_platform_enabled BOOLEAN;
    v_school_enabled BOOLEAN;
    v_can_send BOOLEAN;
    v_monthly_limit INTEGER;
    v_used_count INTEGER;
BEGIN
    -- Check platform level
    SELECT is_enabled INTO v_platform_enabled
    FROM platform_email_config
    LIMIT 1;
    
    IF NOT v_platform_enabled THEN
        RETURN FALSE;
    END IF;
    
    -- Check school level
    SELECT 
        is_email_enabled,
        monthly_limit,
        CASE p_email_type
            WHEN 'attendance' THEN can_send_attendance
            WHEN 'fees' THEN can_send_fees
            WHEN 'exams' THEN can_send_exams
            WHEN 'newsletter' THEN can_send_newsletters
            ELSE can_send_general
        END
    INTO v_school_enabled, v_monthly_limit, v_can_send
    FROM school_email_settings
    WHERE school_id = p_school_id;
    
    IF NOT FOUND OR NOT v_school_enabled OR NOT v_can_send THEN
        RETURN FALSE;
    END IF;
    
    -- Check monthly limit
    SELECT COUNT(*) INTO v_used_count
    FROM email_logs
    WHERE school_id = p_school_id
    AND created_at >= date_trunc('month', CURRENT_DATE)
    AND status IN ('sent', 'delivered', 'opened');
    
    IF v_used_count >= v_monthly_limit THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get email sending configuration for a school
CREATE OR REPLACE FUNCTION get_school_email_config(p_school_id UUID)
RETURNS TABLE (
    provider TEXT,
    from_email TEXT,
    from_name TEXT,
    is_enabled BOOLEAN,
    remaining_quota INTEGER
) AS $$
DECLARE
    v_platform_config RECORD;
    v_school_settings RECORD;
    v_used_count INTEGER;
BEGIN
    -- Get platform config
    SELECT * INTO v_platform_config FROM platform_email_config LIMIT 1;
    
    -- Get school settings
    SELECT * INTO v_school_settings FROM school_email_settings WHERE school_id = p_school_id;
    
    -- Get used count for this month
    SELECT COUNT(*) INTO v_used_count
    FROM email_logs
    WHERE school_id = p_school_id
    AND created_at >= date_trunc('month', CURRENT_DATE)
    AND status IN ('sent', 'delivered', 'opened');
    
    RETURN QUERY SELECT
        v_platform_config.provider,
        COALESCE(NULLIF(v_school_settings.custom_from_email, ''), v_platform_config.from_email) as from_email,
        COALESCE(NULLIF(v_school_settings.custom_from_name, ''), v_platform_config.from_name) as from_name,
        v_platform_config.is_enabled AND COALESCE(v_school_settings.is_email_enabled, false) as is_enabled,
        GREATEST(0, COALESCE(v_school_settings.monthly_limit, 5000) - v_used_count) as remaining_quota;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION can_school_send_email(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION get_school_email_config(UUID) TO authenticated;

COMMENT ON TABLE platform_email_config IS 'Platform-level email service configuration managed by super admin';
COMMENT ON TABLE school_email_settings IS 'Per-school email permissions and limits';
COMMENT ON TABLE email_logs IS 'Log of all emails sent through the platform';
COMMENT ON TABLE email_templates IS 'Reusable email templates for schools';
COMMENT ON FUNCTION can_school_send_email IS 'Check if a school can send email of a specific type based on platform and school settings';
COMMENT ON FUNCTION get_school_email_config IS 'Get the email configuration for a specific school';
