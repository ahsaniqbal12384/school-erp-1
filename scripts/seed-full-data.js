const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://aczutdvzatjmsoybgmgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjenV0ZHZ6YXRqbXNveWJnbWdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODgwOTQ0OSwiZXhwIjoyMDg0Mzg1NDQ5fQ.K7hqryqcLRSsll0D24e2LFw6E7DIU6khVIyZp_0wOcM'
);

const schoolId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // Al-Noor Public School

async function seedAlNoorData() {
  console.log('Seeding data for Al-Noor Public School...');

  // Create classes for Al-Noor
  const { data: existingClasses } = await supabase.from('classes').select('id').eq('school_id', schoolId).limit(1);
  if (!existingClasses || existingClasses.length === 0) {
    console.log('Creating classes for Al-Noor...');
    const classData = [
      { school_id: schoolId, name: 'Nursery', grade_level: 0, section: 'A', capacity: 30, monthly_fee: 3000 },
      { school_id: schoolId, name: 'KG', grade_level: 1, section: 'A', capacity: 30, monthly_fee: 3500 },
      { school_id: schoolId, name: 'Class 1', grade_level: 2, section: 'A', capacity: 35, monthly_fee: 4000 },
      { school_id: schoolId, name: 'Class 2', grade_level: 3, section: 'A', capacity: 35, monthly_fee: 4000 },
      { school_id: schoolId, name: 'Class 3', grade_level: 4, section: 'A', capacity: 35, monthly_fee: 4500 },
      { school_id: schoolId, name: 'Class 4', grade_level: 5, section: 'A', capacity: 35, monthly_fee: 4500 },
      { school_id: schoolId, name: 'Class 5', grade_level: 6, section: 'A', capacity: 40, monthly_fee: 5000 },
      { school_id: schoolId, name: 'Class 6', grade_level: 7, section: 'A', capacity: 40, monthly_fee: 5500 },
      { school_id: schoolId, name: 'Class 7', grade_level: 8, section: 'A', capacity: 40, monthly_fee: 5500 },
      { school_id: schoolId, name: 'Class 8', grade_level: 9, section: 'A', capacity: 40, monthly_fee: 6000 },
      { school_id: schoolId, name: 'Class 9', grade_level: 10, section: 'A', capacity: 45, monthly_fee: 7000 },
      { school_id: schoolId, name: 'Class 10', grade_level: 11, section: 'A', capacity: 45, monthly_fee: 7500 }
    ];
    const { error } = await supabase.from('classes').insert(classData);
    if (error) console.log('Classes error:', error.message);
    else console.log('Created 12 classes');
  }

  // Create subjects for Al-Noor
  const { data: existingSubjects } = await supabase.from('subjects').select('id').eq('school_id', schoolId).limit(1);
  if (!existingSubjects || existingSubjects.length === 0) {
    console.log('Creating subjects for Al-Noor...');
    const subjectData = [
      { school_id: schoolId, name: 'English', code: 'ENG', description: 'English Language and Literature' },
      { school_id: schoolId, name: 'Mathematics', code: 'MATH', description: 'Mathematics' },
      { school_id: schoolId, name: 'Urdu', code: 'URD', description: 'Urdu Language' },
      { school_id: schoolId, name: 'Science', code: 'SCI', description: 'General Science' },
      { school_id: schoolId, name: 'Social Studies', code: 'SST', description: 'Social Studies / Pakistan Studies' },
      { school_id: schoolId, name: 'Islamiat', code: 'ISL', description: 'Islamic Studies' },
      { school_id: schoolId, name: 'Computer Science', code: 'CS', description: 'Computer Science & IT', is_elective: true },
      { school_id: schoolId, name: 'Physics', code: 'PHY', description: 'Physics', is_elective: true },
      { school_id: schoolId, name: 'Chemistry', code: 'CHEM', description: 'Chemistry', is_elective: true },
      { school_id: schoolId, name: 'Biology', code: 'BIO', description: 'Biology', is_elective: true }
    ];
    const { error } = await supabase.from('subjects').insert(subjectData);
    if (error) console.log('Subjects error:', error.message);
    else console.log('Created 10 subjects');
  }

  // Fetch classes to assign students
  const { data: classes } = await supabase.from('classes').select('id, name').eq('school_id', schoolId);
  if (!classes || classes.length === 0) {
    console.log('No classes found, skipping student creation');
    return;
  }

  // Create some students
  const { data: existingStudents } = await supabase.from('students').select('id').eq('school_id', schoolId).limit(1);
  if (!existingStudents || existingStudents.length === 0) {
    console.log('Creating students...');
    const studentNames = [
      { first: 'Ahmed', last: 'Khan' },
      { first: 'Fatima', last: 'Ali' },
      { first: 'Muhammad', last: 'Rashid' },
      { first: 'Ayesha', last: 'Malik' },
      { first: 'Hassan', last: 'Mehmood' },
      { first: 'Zainab', last: 'Hussain' },
      { first: 'Omar', last: 'Sheikh' },
      { first: 'Sana', last: 'Ahmad' },
      { first: 'Ibrahim', last: 'Qureshi' },
      { first: 'Maryam', last: 'Siddiqui' },
      { first: 'Bilal', last: 'Abbas' },
      { first: 'Hira', last: 'Javed' },
      { first: 'Usman', last: 'Iqbal' },
      { first: 'Amna', last: 'Farooq' },
      { first: 'Hamza', last: 'Tariq' },
      { first: 'Khadija', last: 'Nawaz' },
      { first: 'Saad', last: 'Aziz' },
      { first: 'Noor', last: 'Zafar' },
      { first: 'Ali', last: 'Raza' },
      { first: 'Hafsa', last: 'Saleem' }
    ];

    const students = [];
    const startYear = 2020;
    for (let i = 0; i < studentNames.length; i++) {
      const classIndex = Math.floor(i / 2) % classes.length;
      const rollNo = `${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`;
      students.push({
        school_id: schoolId,
        class_id: classes[classIndex].id,
        admission_number: `AN-${startYear + (i % 5)}-${String(i + 1).padStart(3, '0')}`,
        roll_number: rollNo,
        first_name: studentNames[i].first,
        last_name: studentNames[i].last,
        gender: i % 2 === 0 ? 'male' : 'female',
        date_of_birth: `${2010 + (i % 8)}-${String((i % 12) + 1).padStart(2, '0')}-15`,
        status: 'active',
        admission_date: `${startYear + (i % 5)}-04-01`
      });
    }

    const { error } = await supabase.from('students').insert(students);
    if (error) console.log('Students error:', error.message);
    else console.log(`Created ${students.length} students`);
  }

  // Create some staff members
  const { data: existingStaff } = await supabase.from('staff').select('id').eq('school_id', schoolId).limit(1);
  if (!existingStaff || existingStaff.length === 0) {
    console.log('Creating staff...');
    const staffMembers = [
      { first_name: 'Imran', last_name: 'Ahmed', role: 'teacher', department: 'Science', qualification: 'M.Sc Physics', joining_date: '2018-04-01' },
      { first_name: 'Sara', last_name: 'Bibi', role: 'teacher', department: 'Mathematics', qualification: 'M.Sc Mathematics', joining_date: '2019-04-01' },
      { first_name: 'Kamran', last_name: 'Shah', role: 'teacher', department: 'English', qualification: 'M.A English', joining_date: '2020-04-01' },
      { first_name: 'Aliya', last_name: 'Naz', role: 'teacher', department: 'Urdu', qualification: 'M.A Urdu', joining_date: '2017-04-01' },
      { first_name: 'Farhan', last_name: 'Mirza', role: 'teacher', department: 'Computer Science', qualification: 'BS Computer Science', joining_date: '2021-04-01' },
      { first_name: 'Nadia', last_name: 'Akbar', role: 'accountant', department: 'Finance', qualification: 'MBA Finance', joining_date: '2019-04-01' },
      { first_name: 'Waseem', last_name: 'Haider', role: 'librarian', department: 'Library', qualification: 'MLIS', joining_date: '2020-04-01' },
      { first_name: 'Bushra', last_name: 'Parveen', role: 'staff', department: 'Admin', qualification: 'Bachelor', joining_date: '2018-04-01' }
    ];

    const staff = staffMembers.map((s, i) => ({
      school_id: schoolId,
      employee_id: `EMP-${String(i + 1).padStart(4, '0')}`,
      first_name: s.first_name,
      last_name: s.last_name,
      role: s.role,
      department: s.department,
      qualification: s.qualification,
      joining_date: s.joining_date,
      status: 'active',
      phone: `0300-${String(1234567 + i).slice(0, 7)}`,
      email: `${s.first_name.toLowerCase()}.${s.last_name.toLowerCase()}@alnoor.edu.pk`
    }));

    const { error } = await supabase.from('staff').insert(staff);
    if (error) console.log('Staff error:', error.message);
    else console.log(`Created ${staff.length} staff members`);
  }

  // Create fee structure
  const { data: existingFees } = await supabase.from('fee_structure').select('id').eq('school_id', schoolId).limit(1);
  if (!existingFees || existingFees.length === 0) {
    console.log('Creating fee structure...');
    const feeTypes = [
      { name: 'Monthly Tuition', fee_type: 'monthly', amount: 5000, description: 'Regular monthly tuition fee' },
      { name: 'Admission Fee', fee_type: 'one_time', amount: 15000, description: 'One-time admission processing fee' },
      { name: 'Annual Fund', fee_type: 'annual', amount: 10000, description: 'Annual development fund' },
      { name: 'Exam Fee', fee_type: 'term', amount: 2000, description: 'Term examination fee' },
      { name: 'Lab Fee', fee_type: 'annual', amount: 3000, description: 'Science laboratory fee' },
      { name: 'Computer Fee', fee_type: 'monthly', amount: 500, description: 'Computer lab usage fee' },
      { name: 'Transport Fee', fee_type: 'monthly', amount: 3500, description: 'School bus service fee' }
    ];

    const feeStructure = feeTypes.map(f => ({
      school_id: schoolId,
      name: f.name,
      fee_type: f.fee_type,
      amount: f.amount,
      description: f.description,
      is_active: true
    }));

    const { error } = await supabase.from('fee_structure').insert(feeStructure);
    if (error) console.log('Fee structure error:', error.message);
    else console.log(`Created ${feeStructure.length} fee types`);
  }

  console.log('Al-Noor seeding complete!');
}

seedAlNoorData().catch(console.error);
