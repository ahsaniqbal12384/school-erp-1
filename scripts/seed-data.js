const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://aczutdvzatjmsoybgmgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjenV0ZHZ6YXRqbXNveWJnbWdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODgwOTQ0OSwiZXhwIjoyMDg0Mzg1NDQ5fQ.K7hqryqcLRSsll0D24e2LFw6E7DIU6khVIyZp_0wOcM'
);

async function seedData() {
  const schoolId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // Al-Noor Public School
  const schoolId2 = 'e9e0bb4f-6e9c-4756-87f7-073d69d14abd'; // City Grammar School
  
  // Seed settings for both schools
  for (const sid of [schoolId, schoolId2]) {
    const { data: settings } = await supabase.from('school_settings').select('id').eq('school_id', sid).single();
    if (!settings) {
      console.log(`Creating school settings for ${sid}...`);
      await supabase.from('school_settings').insert({
        school_id: sid,
        primary_color: '#6366f1',
        secondary_color: '#8b5cf6',
        accent_color: '#10b981',
        school_motto: 'Excellence in Education',
        academic_year: '2025-2026',
        term_system: 'semester',
        currency: 'PKR',
        timezone: 'Asia/Karachi',
        sms_enabled: true,
        email_enabled: true,
        parent_portal_enabled: true,
        student_portal_enabled: true
      });
    }

    // Create school modules
    const { data: modules } = await supabase.from('school_modules').select('id').eq('school_id', sid).limit(1);
    if (!modules || modules.length === 0) {
      console.log(`Creating school modules for ${sid}...`);
      const moduleNames = ['students', 'staff', 'fees', 'attendance', 'exams', 'communications', 'admissions', 'homework', 'reports', 'transport', 'library'];
      for (const moduleName of moduleNames) {
        await supabase.from('school_modules').insert({ school_id: sid, module_name: moduleName, is_enabled: true });
      }
    }

    // Create classes
    const { data: classes } = await supabase.from('classes').select('id').eq('school_id', sid).limit(1);
    if (!classes || classes.length === 0) {
      console.log(`Creating classes for ${sid}...`);
      const classData = [
        { school_id: sid, name: 'Nursery', grade_level: 0, section: 'A', capacity: 30, monthly_fee: 3000 },
        { school_id: sid, name: 'KG', grade_level: 1, section: 'A', capacity: 30, monthly_fee: 3500 },
        { school_id: sid, name: 'Class 1', grade_level: 2, section: 'A', capacity: 35, monthly_fee: 4000 },
        { school_id: sid, name: 'Class 2', grade_level: 3, section: 'A', capacity: 35, monthly_fee: 4000 },
        { school_id: sid, name: 'Class 3', grade_level: 4, section: 'A', capacity: 35, monthly_fee: 4500 },
        { school_id: sid, name: 'Class 4', grade_level: 5, section: 'A', capacity: 35, monthly_fee: 4500 },
        { school_id: sid, name: 'Class 5', grade_level: 6, section: 'A', capacity: 40, monthly_fee: 5000 },
        { school_id: sid, name: 'Class 6', grade_level: 7, section: 'A', capacity: 40, monthly_fee: 5500 },
        { school_id: sid, name: 'Class 7', grade_level: 8, section: 'A', capacity: 40, monthly_fee: 5500 },
        { school_id: sid, name: 'Class 8', grade_level: 9, section: 'A', capacity: 40, monthly_fee: 6000 },
        { school_id: sid, name: 'Class 9', grade_level: 10, section: 'A', capacity: 45, monthly_fee: 7000 },
        { school_id: sid, name: 'Class 10', grade_level: 11, section: 'A', capacity: 45, monthly_fee: 7500 }
      ];
      const { error } = await supabase.from('classes').insert(classData);
      if (error) console.log('Classes error:', error.message);
      else console.log(`Created ${classData.length} classes for ${sid}`);
    }

    // Create subjects
    const { data: subjects } = await supabase.from('subjects').select('id').eq('school_id', sid).limit(1);
    if (!subjects || subjects.length === 0) {
      console.log(`Creating subjects for ${sid}...`);
      const subjectData = [
        { school_id: sid, name: 'English', code: 'ENG', description: 'English Language and Literature' },
        { school_id: sid, name: 'Mathematics', code: 'MATH', description: 'Mathematics' },
        { school_id: sid, name: 'Urdu', code: 'URD', description: 'Urdu Language' },
        { school_id: sid, name: 'Science', code: 'SCI', description: 'General Science' },
        { school_id: sid, name: 'Social Studies', code: 'SST', description: 'Social Studies / Pakistan Studies' },
        { school_id: sid, name: 'Islamiat', code: 'ISL', description: 'Islamic Studies' },
        { school_id: sid, name: 'Computer Science', code: 'CS', description: 'Computer Science & IT', is_elective: true },
        { school_id: sid, name: 'Physics', code: 'PHY', description: 'Physics', is_elective: true },
        { school_id: sid, name: 'Chemistry', code: 'CHEM', description: 'Chemistry', is_elective: true },
        { school_id: sid, name: 'Biology', code: 'BIO', description: 'Biology', is_elective: true }
      ];
      const { error } = await supabase.from('subjects').insert(subjectData);
      if (error) console.log('Subjects error:', error.message);
      else console.log(`Created ${subjectData.length} subjects for ${sid}`);
    }
  }

  // Create academic year
  const { data: academicYears } = await supabase.from('academic_years').select('id').eq('school_id', schoolId).limit(1);
  if (!academicYears || academicYears.length === 0) {
    console.log('Creating academic years...');
    await supabase.from('academic_years').insert([
      { school_id: schoolId, name: '2025-2026', start_date: '2025-04-01', end_date: '2026-03-31', is_current: true },
      { school_id: schoolId2, name: '2025-2026', start_date: '2025-04-01', end_date: '2026-03-31', is_current: true }
    ]);
  }

  console.log('Seeding complete!');
}

seedData().catch(console.error);
