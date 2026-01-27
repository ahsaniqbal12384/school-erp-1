-- Migration: School Portal Settings
-- Allows school admins to customize their school's public landing page

-- Create school_portal_settings table
CREATE TABLE IF NOT EXISTS school_portal_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    -- Hero Section
    hero_title VARCHAR(200) DEFAULT 'Welcome to Our School',
    hero_subtitle TEXT DEFAULT 'Empowering minds, shaping futures',
    hero_image_url TEXT,
    hero_background_color VARCHAR(20) DEFAULT '#1e40af',
    
    -- Branding
    logo_url TEXT,
    primary_color VARCHAR(20) DEFAULT '#3b82f6',
    secondary_color VARCHAR(20) DEFAULT '#06b6d4',
    
    -- Contact Info (shown on landing page)
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_address TEXT,
    
    -- Social Links
    facebook_url TEXT,
    twitter_url TEXT,
    instagram_url TEXT,
    youtube_url TEXT,
    whatsapp_number VARCHAR(50),
    
    -- Features to show
    show_about_section BOOLEAN DEFAULT true,
    about_text TEXT,
    show_facilities_section BOOLEAN DEFAULT true,
    show_contact_section BOOLEAN DEFAULT true,
    
    -- Announcements (shown on portal)
    announcement_text TEXT,
    announcement_active BOOLEAN DEFAULT false,
    
    -- Login Page Settings
    login_background_image_url TEXT,
    show_student_login BOOLEAN DEFAULT true,
    show_parent_login BOOLEAN DEFAULT true,
    show_teacher_login BOOLEAN DEFAULT true,
    show_admin_login BOOLEAN DEFAULT true,
    
    -- SEO
    meta_title VARCHAR(200),
    meta_description TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure one settings per school
CREATE UNIQUE INDEX IF NOT EXISTS idx_school_portal_settings_school 
ON school_portal_settings(school_id);

-- Create school_facilities table for showcasing
CREATE TABLE IF NOT EXISTS school_facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50) DEFAULT 'building',
    image_url TEXT,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create school_gallery table
CREATE TABLE IF NOT EXISTS school_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    title VARCHAR(100),
    image_url TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general',
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE school_portal_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE school_gallery ENABLE ROW LEVEL SECURITY;

-- Everyone can read portal settings (public landing page)
CREATE POLICY "Public can read portal settings"
ON school_portal_settings FOR SELECT
TO anon, authenticated
USING (true);

-- Only school admins can update their school's settings
CREATE POLICY "School admins can update portal settings"
ON school_portal_settings FOR ALL
TO authenticated
USING (
    school_id IN (
        SELECT school_id FROM users 
        WHERE id = auth.uid() AND role = 'school_admin'
    )
);

-- Public can view facilities
CREATE POLICY "Public can read facilities"
ON school_facilities FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- School admins can manage facilities
CREATE POLICY "School admins can manage facilities"
ON school_facilities FOR ALL
TO authenticated
USING (
    school_id IN (
        SELECT school_id FROM users 
        WHERE id = auth.uid() AND role = 'school_admin'
    )
);

-- Public can view gallery
CREATE POLICY "Public can read gallery"
ON school_gallery FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- School admins can manage gallery
CREATE POLICY "School admins can manage gallery"
ON school_gallery FOR ALL
TO authenticated
USING (
    school_id IN (
        SELECT school_id FROM users 
        WHERE id = auth.uid() AND role = 'school_admin'
    )
);

-- Grant permissions
GRANT SELECT ON school_portal_settings TO anon;
GRANT ALL ON school_portal_settings TO authenticated;
GRANT SELECT ON school_facilities TO anon;
GRANT ALL ON school_facilities TO authenticated;
GRANT SELECT ON school_gallery TO anon;
GRANT ALL ON school_gallery TO authenticated;

-- Insert default settings for existing schools
INSERT INTO school_portal_settings (school_id, hero_title, about_text)
SELECT id, name || ' - Welcome', 'Welcome to ' || name || '. We are committed to providing quality education.'
FROM schools
ON CONFLICT DO NOTHING;
