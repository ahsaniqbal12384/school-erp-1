-- Migration: 011_enable_rls_security.sql
-- Description: Enable Row Level Security (RLS) on all public tables and create comprehensive policies
-- This migration addresses Supabase security advisor warnings

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

-- Core tables
ALTER TABLE IF EXISTS subscription_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS school_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS exam_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS fee_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages ENABLE ROW LEVEL SECURITY;

-- Additional core tables if they exist
ALTER TABLE IF EXISTS students ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS results ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS book_management ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS transport_management ENABLE ROW LEVEL SECURITY;

-- Analytics and reporting
ALTER TABLE IF EXISTS report_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS generated_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS dashboard_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS user_dashboard_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS daily_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS monthly_analytics ENABLE ROW LEVEL SECURITY;

-- SMS and notifications
ALTER TABLE IF EXISTS sms_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sms_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sms_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS sms_broadcasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS attendance_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS email_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS email_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTION: Get current user's school_id
-- ============================================
CREATE OR REPLACE FUNCTION get_auth_school_id()
RETURNS UUID AS $$
BEGIN
    -- First try to get school_id from auth metadata
    IF auth.jwt() ->> 'school_id' IS NOT NULL THEN
        RETURN (auth.jwt() ->> 'school_id')::UUID;
    END IF;
    
    -- Fall back to looking up from users table
    RETURN (
        SELECT school_id FROM users WHERE id = auth.uid() LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Check if user is super admin
-- ============================================
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'super_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- HELPER FUNCTION: Check if user is school admin
-- ============================================
CREATE OR REPLACE FUNCTION is_school_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id = auth.uid() 
        AND role = 'school_admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ============================================
-- POLICIES: subscription_plans (Public read, admin only write)
-- ============================================
DROP POLICY IF EXISTS "Public can view active subscription plans" ON subscription_plans;
CREATE POLICY "Public can view active subscription plans" ON subscription_plans
    FOR SELECT USING (is_active = true);

DROP POLICY IF EXISTS "Super admin can manage subscription plans" ON subscription_plans;
CREATE POLICY "Super admin can manage subscription plans" ON subscription_plans
    FOR ALL USING (is_super_admin());

-- ============================================
-- POLICIES: school_invoices (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "School admin can view own invoices" ON school_invoices;
CREATE POLICY "School admin can view own invoices" ON school_invoices
    FOR SELECT USING (
        school_id = get_auth_school_id() 
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "School admin can manage own invoices" ON school_invoices;
CREATE POLICY "School admin can manage own invoices" ON school_invoices
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: user_sessions (User-specific access, no public access)
-- ============================================
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
CREATE POLICY "Users can view own sessions" ON user_sessions
    FOR SELECT USING (
        user_id = auth.uid()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Users can manage own sessions" ON user_sessions;
CREATE POLICY "Users can manage own sessions" ON user_sessions
    FOR ALL USING (
        (user_id = auth.uid() AND school_id = get_auth_school_id())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: notifications (User and school-specific)
-- ============================================
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (
        recipient_id = auth.uid()
        OR school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Users can manage own notifications" ON notifications;
CREATE POLICY "Users can manage own notifications" ON notifications
    FOR ALL USING (
        (recipient_id = auth.uid() AND school_id = get_auth_school_id())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: todos (User-specific)
-- ============================================
DROP POLICY IF EXISTS "Users can view own todos" ON todos;
CREATE POLICY "Users can view own todos" ON todos
    FOR SELECT USING (
        owner_id = auth.uid()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Users can manage own todos" ON todos;
CREATE POLICY "Users can manage own todos" ON todos
    FOR ALL USING (
        (owner_id = auth.uid() AND school_id = get_auth_school_id())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: exam_results (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school exam results" ON exam_results;
CREATE POLICY "Users can view school exam results" ON exam_results
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage exam results" ON exam_results;
CREATE POLICY "Admins can manage exam results" ON exam_results
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: fee_payments (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school fee payments" ON fee_payments;
CREATE POLICY "Users can view school fee payments" ON fee_payments
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage fee payments" ON fee_payments;
CREATE POLICY "Admins can manage fee payments" ON fee_payments
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: announcements (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school announcements" ON announcements;
CREATE POLICY "Users can view school announcements" ON announcements
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
        OR (is_public = true)
    );

DROP POLICY IF EXISTS "Admins can manage announcements" ON announcements;
CREATE POLICY "Admins can manage announcements" ON announcements
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: messages (Sender/recipient access)
-- ============================================
DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages" ON messages
    FOR SELECT USING (
        sender_id = auth.uid()
        OR recipient_id = auth.uid()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Users can create messages in their school" ON messages;
CREATE POLICY "Users can create messages in their school" ON messages
    FOR INSERT WITH CHECK (
        (sender_id = auth.uid() AND school_id = get_auth_school_id())
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Users can update own messages" ON messages;
CREATE POLICY "Users can update own messages" ON messages
    FOR UPDATE USING (
        (sender_id = auth.uid() AND school_id = get_auth_school_id())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: students (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school students" ON students;
CREATE POLICY "Users can view school students" ON students
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage students" ON students;
CREATE POLICY "Admins can manage students" ON students
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: teachers (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school teachers" ON teachers;
CREATE POLICY "Users can view school teachers" ON teachers
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage teachers" ON teachers;
CREATE POLICY "Admins can manage teachers" ON teachers
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: classes (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school classes" ON classes;
CREATE POLICY "Users can view school classes" ON classes
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage classes" ON classes;
CREATE POLICY "Admins can manage classes" ON classes
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: attendance (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school attendance" ON attendance;
CREATE POLICY "Users can view school attendance" ON attendance
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage attendance" ON attendance;
CREATE POLICY "Admins can manage attendance" ON attendance
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: assignments (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school assignments" ON assignments;
CREATE POLICY "Users can view school assignments" ON assignments
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Teachers can manage assignments" ON assignments;
CREATE POLICY "Teachers can manage assignments" ON assignments
    FOR ALL USING (
        (school_id = get_auth_school_id() AND created_by = auth.uid())
        OR (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: results (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school results" ON results;
CREATE POLICY "Users can view school results" ON results
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage results" ON results;
CREATE POLICY "Admins can manage results" ON results
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: report_types (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school report types" ON report_types;
CREATE POLICY "Users can view school report types" ON report_types
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage report types" ON report_types;
CREATE POLICY "Admins can manage report types" ON report_types
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: generated_reports (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school reports" ON generated_reports;
CREATE POLICY "Users can view school reports" ON generated_reports
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage reports" ON generated_reports;
CREATE POLICY "Admins can manage reports" ON generated_reports
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: dashboard_widgets (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school widgets" ON dashboard_widgets;
CREATE POLICY "Users can view school widgets" ON dashboard_widgets
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage widgets" ON dashboard_widgets;
CREATE POLICY "Admins can manage widgets" ON dashboard_widgets
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: user_dashboard_preferences (User-specific)
-- ============================================
DROP POLICY IF EXISTS "Users can view own preferences" ON user_dashboard_preferences;
CREATE POLICY "Users can view own preferences" ON user_dashboard_preferences
    FOR SELECT USING (
        user_id = auth.uid()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Users can manage own preferences" ON user_dashboard_preferences;
CREATE POLICY "Users can manage own preferences" ON user_dashboard_preferences
    FOR ALL USING (
        (user_id = auth.uid() AND school_id = get_auth_school_id())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: daily_analytics (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school analytics" ON daily_analytics;
CREATE POLICY "Users can view school analytics" ON daily_analytics
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: monthly_analytics (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view school monthly analytics" ON monthly_analytics;
CREATE POLICY "Users can view school monthly analytics" ON monthly_analytics
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: sms_config (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Admins can manage SMS config" ON sms_config;
CREATE POLICY "Admins can manage SMS config" ON sms_config
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: sms_templates (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view SMS templates" ON sms_templates;
CREATE POLICY "Users can view SMS templates" ON sms_templates
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage SMS templates" ON sms_templates;
CREATE POLICY "Admins can manage SMS templates" ON sms_templates
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: sms_logs (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view SMS logs" ON sms_logs;
CREATE POLICY "Users can view SMS logs" ON sms_logs
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: sms_broadcasts (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view SMS broadcasts" ON sms_broadcasts;
CREATE POLICY "Users can view SMS broadcasts" ON sms_broadcasts
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage SMS broadcasts" ON sms_broadcasts;
CREATE POLICY "Admins can manage SMS broadcasts" ON sms_broadcasts
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: attendance_alerts (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view attendance alerts" ON attendance_alerts;
CREATE POLICY "Users can view attendance alerts" ON attendance_alerts
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: email_config (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Admins can manage email config" ON email_config;
CREATE POLICY "Admins can manage email config" ON email_config
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: email_logs (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view email logs" ON email_logs;
CREATE POLICY "Users can view email logs" ON email_logs
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: book_management (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view library books" ON book_management;
CREATE POLICY "Users can view library books" ON book_management
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage library" ON book_management;
CREATE POLICY "Admins can manage library" ON book_management
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- POLICIES: transport_management (School-specific access)
-- ============================================
DROP POLICY IF EXISTS "Users can view transport" ON transport_management;
CREATE POLICY "Users can view transport" ON transport_management
    FOR SELECT USING (
        school_id = get_auth_school_id()
        OR is_super_admin()
    );

DROP POLICY IF EXISTS "Admins can manage transport" ON transport_management;
CREATE POLICY "Admins can manage transport" ON transport_management
    FOR ALL USING (
        (school_id = get_auth_school_id() AND is_school_admin())
        OR is_super_admin()
    );

-- ============================================
-- COMPLETION
-- ============================================
-- Migration complete! All tables now have RLS enabled with appropriate policies.
-- The Supabase Security Advisor warnings should now be resolved.
