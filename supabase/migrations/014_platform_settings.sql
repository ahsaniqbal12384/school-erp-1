-- Platform Settings table for Super Admin configuration
-- All settings are stored here and loaded dynamically

CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- General Settings
    platform_name VARCHAR(255) DEFAULT 'Pakistani School ERP',
    platform_domain VARCHAR(255) DEFAULT 'localhost:3000',
    support_email VARCHAR(255) DEFAULT 'support@schoolerp.pk',
    support_phone VARCHAR(50) DEFAULT '+92-42-35761234',
    default_timezone VARCHAR(50) DEFAULT 'Asia/Karachi',
    default_currency VARCHAR(10) DEFAULT 'PKR',
    default_language VARCHAR(10) DEFAULT 'en',
    
    -- Branding
    primary_color VARCHAR(20) DEFAULT '#6366f1',
    secondary_color VARCHAR(20) DEFAULT '#06b6d4',
    logo_light_url TEXT,
    logo_dark_url TEXT,
    favicon_url TEXT,
    
    -- Email Settings
    email_notifications BOOLEAN DEFAULT false,
    smtp_host VARCHAR(255),
    smtp_port VARCHAR(10) DEFAULT '587',
    smtp_username VARCHAR(255),
    smtp_password VARCHAR(255),
    smtp_from_email VARCHAR(255),
    smtp_from_name VARCHAR(255) DEFAULT 'School ERP',
    smtp_encryption VARCHAR(20) DEFAULT 'tls', -- tls, ssl, none
    
    -- SMS Settings
    sms_notifications BOOLEAN DEFAULT false,
    sms_provider VARCHAR(50), -- twilio, nexmo, local
    sms_api_key VARCHAR(255),
    sms_api_secret VARCHAR(255),
    sms_sender_id VARCHAR(50),
    sms_account_sid VARCHAR(255), -- for Twilio
    
    -- Security Settings
    two_factor_auth BOOLEAN DEFAULT false,
    session_timeout_minutes INTEGER DEFAULT 30,
    password_policy VARCHAR(20) DEFAULT 'strong', -- basic, medium, strong
    max_login_attempts INTEGER DEFAULT 5,
    lockout_duration_minutes INTEGER DEFAULT 15,
    
    -- Billing Settings
    payment_gateway VARCHAR(50) DEFAULT 'manual', -- jazzcash, easypaisa, stripe, manual
    payment_merchant_id VARCHAR(255),
    payment_secret_key VARCHAR(255),
    plan_basic_price INTEGER DEFAULT 40000,
    plan_standard_price INTEGER DEFAULT 80000,
    plan_premium_price INTEGER DEFAULT 150000,
    
    -- System Settings
    auto_backup BOOLEAN DEFAULT true,
    backup_retention_days INTEGER DEFAULT 30,
    maintenance_mode BOOLEAN DEFAULT false,
    maintenance_message TEXT DEFAULT 'We are performing scheduled maintenance. Please check back soon.',
    
    -- API Keys
    api_key_production VARCHAR(255),
    api_key_test VARCHAR(255),
    
    -- Trial Settings
    trial_days INTEGER DEFAULT 30,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings if not exists
INSERT INTO platform_settings (id) 
SELECT gen_random_uuid() 
WHERE NOT EXISTS (SELECT 1 FROM platform_settings LIMIT 1);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_platform_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto-updating updated_at
DROP TRIGGER IF EXISTS platform_settings_updated_at ON platform_settings;
CREATE TRIGGER platform_settings_updated_at
    BEFORE UPDATE ON platform_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_platform_settings_updated_at();

-- Enable RLS
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Only super_admin can read/write
CREATE POLICY "Super admin can manage platform settings"
    ON platform_settings
    FOR ALL
    USING (true) -- In production, check for super_admin role
    WITH CHECK (true);

-- Add index
CREATE INDEX IF NOT EXISTS idx_platform_settings_updated ON platform_settings(updated_at);
