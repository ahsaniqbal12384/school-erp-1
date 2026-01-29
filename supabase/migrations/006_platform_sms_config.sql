-- Migration: 006_platform_sms_config.sql
-- Description: Add platform-level SMS configuration and school SMS permissions
-- This allows super admin to configure SMS gateway and control which schools can use SMS

-- Platform SMS Configuration (Super Admin level)
CREATE TABLE IF NOT EXISTS platform_sms_config (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider TEXT NOT NULL DEFAULT 'none' CHECK (provider IN ('twilio', 'zong', 'jazz', 'telenor', 'custom', 'none')),
    is_enabled BOOLEAN DEFAULT false,
    api_key TEXT DEFAULT '',
    api_secret TEXT DEFAULT '',
    sender_id TEXT DEFAULT '',
    base_url TEXT DEFAULT '',
    username TEXT DEFAULT '',
    password TEXT DEFAULT '',
    monthly_limit INTEGER DEFAULT 10000,
    rate_per_sms DECIMAL(10, 2) DEFAULT 0.50,
    balance DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- School SMS Settings (Per-school permissions)
CREATE TABLE IF NOT EXISTS school_sms_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    is_sms_enabled BOOLEAN DEFAULT false,
    monthly_limit INTEGER DEFAULT 1000,
    can_send_attendance BOOLEAN DEFAULT true,
    can_send_fees BOOLEAN DEFAULT true,
    can_send_exams BOOLEAN DEFAULT true,
    can_send_general BOOLEAN DEFAULT true,
    can_send_emergency BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id)
);

-- Add sms_type column to sms_logs if table and column don't exist
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'sms_logs'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sms_logs' AND column_name = 'sms_type'
    ) THEN
        ALTER TABLE sms_logs ADD COLUMN sms_type TEXT DEFAULT 'general';
    END IF;
END $$;

-- Update sms_logs to make school_id nullable for system-level messages
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'sms_logs' AND column_name = 'school_id' AND is_nullable = 'NO'
    ) THEN
        ALTER TABLE sms_logs ALTER COLUMN school_id DROP NOT NULL;
    END IF;
END $$;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_school_sms_settings_school_id ON school_sms_settings(school_id);

-- Only create sms_logs indexes if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sms_logs') THEN
        CREATE INDEX IF NOT EXISTS idx_sms_logs_school_created ON sms_logs(school_id, created_at);
        CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);
    END IF;
END $$;

-- RLS Policies for platform_sms_config
ALTER TABLE platform_sms_config ENABLE ROW LEVEL SECURITY;

-- Only super admins can view platform SMS config
CREATE POLICY "Super admins can view platform SMS config"
ON platform_sms_config FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- Only super admins can manage platform SMS config
CREATE POLICY "Super admins can manage platform SMS config"
ON platform_sms_config FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- RLS Policies for school_sms_settings
ALTER TABLE school_sms_settings ENABLE ROW LEVEL SECURITY;

-- Super admins can view all school SMS settings
CREATE POLICY "Super admins can view all school SMS settings"
ON school_sms_settings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- Super admins can manage all school SMS settings
CREATE POLICY "Super admins can manage school SMS settings"
ON school_sms_settings FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- School admins can view their own school's SMS settings
CREATE POLICY "School admins can view own SMS settings"
ON school_sms_settings FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.role = 'school_admin'
        AND profiles.school_id = school_sms_settings.school_id
    )
);

-- Insert default platform SMS config if not exists
INSERT INTO platform_sms_config (provider, is_enabled, monthly_limit, rate_per_sms)
SELECT 'none', false, 10000, 0.50
WHERE NOT EXISTS (SELECT 1 FROM platform_sms_config);

-- Function to check if school can send SMS of a specific type
CREATE OR REPLACE FUNCTION can_school_send_sms(
    p_school_id UUID,
    p_sms_type TEXT DEFAULT 'general'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_platform_enabled BOOLEAN;
    v_school_enabled BOOLEAN;
    v_can_send BOOLEAN;
    v_monthly_limit INTEGER;
    v_used_count INTEGER;
    v_sms_logs_exists BOOLEAN;
BEGIN
    -- Check platform level
    SELECT is_enabled INTO v_platform_enabled
    FROM platform_sms_config
    LIMIT 1;
    
    IF NOT v_platform_enabled THEN
        RETURN FALSE;
    END IF;
    
    -- Check school level
    SELECT 
        is_sms_enabled,
        monthly_limit,
        CASE p_sms_type
            WHEN 'attendance' THEN can_send_attendance
            WHEN 'fees' THEN can_send_fees
            WHEN 'exams' THEN can_send_exams
            WHEN 'emergency' THEN can_send_emergency
            ELSE can_send_general
        END
    INTO v_school_enabled, v_monthly_limit, v_can_send
    FROM school_sms_settings
    WHERE school_id = p_school_id;
    
    IF NOT FOUND OR NOT v_school_enabled OR NOT v_can_send THEN
        RETURN FALSE;
    END IF;
    
    -- Check if sms_logs table exists
    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'sms_logs'
    ) INTO v_sms_logs_exists;
    
    -- Check monthly limit only if sms_logs exists
    IF v_sms_logs_exists THEN
        EXECUTE 'SELECT COUNT(*) FROM sms_logs WHERE school_id = $1 AND created_at >= date_trunc(''month'', CURRENT_DATE) AND status IN (''sent'', ''delivered'')' 
        INTO v_used_count 
        USING p_school_id;
        
        IF v_used_count >= v_monthly_limit THEN
            RETURN FALSE;
        END IF;
    END IF;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION can_school_send_sms(UUID, TEXT) TO authenticated;

COMMENT ON TABLE platform_sms_config IS 'Platform-level SMS gateway configuration managed by super admin';
COMMENT ON TABLE school_sms_settings IS 'Per-school SMS permissions and limits';
COMMENT ON FUNCTION can_school_send_sms IS 'Check if a school can send SMS of a specific type based on platform and school settings';
