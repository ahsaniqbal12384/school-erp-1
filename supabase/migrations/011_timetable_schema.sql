-- =============================================
-- TIMETABLE / CLASS SCHEDULE SYSTEM
-- =============================================

-- Periods definition (e.g., Period 1: 8:00-8:45)
CREATE TABLE IF NOT EXISTS periods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    period_order INTEGER NOT NULL,
    is_break BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, period_order)
);

-- Class timetable entries
CREATE TABLE IF NOT EXISTS timetable (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    subject_id UUID REFERENCES subjects(id) ON DELETE SET NULL,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    period_id UUID NOT NULL REFERENCES periods(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
    room VARCHAR(50),
    academic_year_id UUID REFERENCES academic_years(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class_id, period_id, day_of_week, academic_year_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_timetable_school ON timetable(school_id);
CREATE INDEX IF NOT EXISTS idx_timetable_class ON timetable(class_id);
CREATE INDEX IF NOT EXISTS idx_timetable_teacher ON timetable(teacher_id);
CREATE INDEX IF NOT EXISTS idx_timetable_day ON timetable(day_of_week);
CREATE INDEX IF NOT EXISTS idx_periods_school ON periods(school_id);

-- Enable RLS
ALTER TABLE periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetable ENABLE ROW LEVEL SECURITY;

-- RLS Policies for periods
CREATE POLICY "Users can view periods of their school" ON periods
    FOR SELECT USING (
        school_id IN (SELECT school_id FROM users WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
    );

CREATE POLICY "School admins can manage periods" ON periods
    FOR ALL USING (
        school_id IN (SELECT school_id FROM users WHERE id = auth.uid() AND role IN ('school_admin', 'super_admin'))
    );

-- RLS Policies for timetable
CREATE POLICY "Users can view timetable of their school" ON timetable
    FOR SELECT USING (
        school_id IN (SELECT school_id FROM users WHERE id = auth.uid())
        OR EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin')
    );

CREATE POLICY "School admins can manage timetable" ON timetable
    FOR ALL USING (
        school_id IN (SELECT school_id FROM users WHERE id = auth.uid() AND role IN ('school_admin', 'super_admin'))
    );

-- Grant permissions
GRANT ALL ON periods TO authenticated;
GRANT ALL ON timetable TO authenticated;
GRANT ALL ON periods TO anon;
GRANT ALL ON timetable TO anon;
