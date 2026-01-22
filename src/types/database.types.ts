// Types for Pakistani School ERP Database
// Auto-generated type definitions matching our Supabase schema

export type UserRole =
    | 'super_admin'
    | 'school_admin'
    | 'teacher'
    | 'student'
    | 'parent'
    | 'accountant'
    | 'librarian'
    | 'transport_manager'
    | 'staff'

export type SchoolPlan = 'basic' | 'standard' | 'premium' | 'enterprise'
export type SchoolStatus = 'active' | 'suspended' | 'trial' | 'cancelled'
export type GradingSystem = 'matric' | 'cambridge' | 'custom'
export type InquiryStatus = 'new' | 'contacted' | 'visited' | 'registered' | 'admitted' | 'rejected' | 'lost'
export type InquirySource = 'facebook' | 'google' | 'billboard' | 'referral' | 'walk_in' | 'newspaper' | 'school_event' | 'other'
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'visiting'
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused' | 'half_day' | 'on_leave'
export type LeaveType = 'casual' | 'sick' | 'annual' | 'maternity' | 'paternity' | 'unpaid' | 'other'
export type ExamType = 'monthly' | 'mid_term' | 'final' | 'quiz' | 'assignment' | 'practical'
export type FeeType = 'tuition' | 'admission' | 'registration' | 'transport' | 'library' | 'lab' | 'exam' | 'sports' | 'uniform' | 'other'
export type PaymentMethod = 'cash' | 'jazzcash' | 'easypaisa' | 'bank_transfer' | 'cheque' | 'online'
export type InvoiceStatus = 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled' | 'waived'
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
export type TicketPriority = 'low' | 'medium' | 'high' | 'urgent'
export type BroadcastStatus = 'draft' | 'scheduled' | 'sent' | 'failed'
export type RecipientType = 'all' | 'students' | 'parents' | 'staff' | 'teachers' | 'class'

export interface Database {
    public: {
        Tables: {
            schools: {
                Row: {
                    id: string
                    name: string
                    slug: string
                    address: string | null
                    city: string | null
                    phone: string | null
                    email: string | null
                    logo_url: string | null
                    plan: SchoolPlan
                    status: SchoolStatus
                    trial_ends_at: string | null
                    subscription_ends_at: string | null
                    settings: Record<string, unknown>
                    grading_system: GradingSystem
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['schools']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['schools']['Insert']>
            }
            profiles: {
                Row: {
                    id: string
                    user_id: string
                    school_id: string | null
                    role: UserRole
                    first_name: string
                    last_name: string
                    cnic: string | null
                    phone: string | null
                    email: string | null
                    avatar_url: string | null
                    address: string | null
                    city: string | null
                    date_of_birth: string | null
                    gender: 'male' | 'female' | 'other' | null
                    emergency_contact: string | null
                    blood_group: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['profiles']['Insert']>
            }
            academic_years: {
                Row: {
                    id: string
                    school_id: string
                    name: string
                    start_date: string
                    end_date: string
                    is_current: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['academic_years']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['academic_years']['Insert']>
            }
            classes: {
                Row: {
                    id: string
                    school_id: string
                    name: string
                    grade_level: number | null
                    section: string | null
                    capacity: number
                    class_teacher_id: string | null
                    academic_year_id: string | null
                    monthly_fee: number
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['classes']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['classes']['Insert']>
            }
            subjects: {
                Row: {
                    id: string
                    school_id: string
                    name: string
                    code: string | null
                    description: string | null
                    is_elective: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['subjects']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['subjects']['Insert']>
            }
            students: {
                Row: {
                    id: string
                    school_id: string
                    profile_id: string | null
                    admission_no: string
                    roll_no: string | null
                    class_id: string | null
                    admission_date: string
                    status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'expelled'
                    father_name: string | null
                    father_phone: string | null
                    father_cnic: string | null
                    father_occupation: string | null
                    mother_name: string | null
                    mother_phone: string | null
                    mother_cnic: string | null
                    guardian_name: string | null
                    guardian_phone: string | null
                    guardian_relation: string | null
                    previous_school: string | null
                    medical_conditions: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['students']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['students']['Insert']>
            }
            inquiries: {
                Row: {
                    id: string
                    school_id: string
                    student_name: string
                    parent_name: string
                    phone: string
                    email: string | null
                    source: InquirySource
                    status: InquiryStatus
                    class_interested: string | null
                    notes: string | null
                    follow_up_date: string | null
                    assigned_to: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    school_id: string
                    student_name: string
                    parent_name: string
                    phone: string
                    source: InquirySource
                    status: InquiryStatus
                    email?: string | null
                    class_interested?: string | null
                    notes?: string | null
                    follow_up_date?: string | null
                    assigned_to?: string | null
                }
                Update: Partial<Database['public']['Tables']['inquiries']['Insert']>
            }
            registrations: {
                Row: {
                    id: string
                    school_id: string
                    inquiry_id: string | null
                    student_name: string
                    parent_name: string
                    phone: string
                    email: string | null
                    class_applied: string | null
                    registration_fee: number
                    registration_fee_paid: boolean
                    admission_test_date: string | null
                    admission_test_score: number | null
                    documents_submitted: unknown[]
                    status: 'pending' | 'test_scheduled' | 'passed' | 'admitted' | 'rejected'
                    converted_to_student_id: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['registrations']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['registrations']['Insert']>
            }
            staff: {
                Row: {
                    id: string
                    school_id: string
                    profile_id: string
                    employee_id: string
                    department: string | null
                    designation: string | null
                    joining_date: string
                    employment_type: EmploymentType
                    qualification: string | null
                    experience_years: number
                    bank_name: string | null
                    bank_account_no: string | null
                    basic_salary: number
                    status: 'active' | 'on_leave' | 'resigned' | 'terminated'
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['staff']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['staff']['Insert']>
            }
            staff_salaries: {
                Row: {
                    id: string
                    school_id: string
                    staff_id: string
                    month: string
                    basic_salary: number
                    house_allowance: number
                    transport_allowance: number
                    medical_allowance: number
                    other_allowances: number
                    overtime_amount: number
                    eobi_deduction: number
                    tax_deduction: number
                    loan_deduction: number
                    other_deductions: number
                    gross_salary: number
                    total_deductions: number
                    net_salary: number
                    status: 'pending' | 'processed' | 'paid'
                    paid_date: string | null
                    payment_method: string | null
                    remarks: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['staff_salaries']['Row'], 'id' | 'created_at' | 'updated_at' | 'gross_salary' | 'total_deductions' | 'net_salary'>
                Update: Partial<Database['public']['Tables']['staff_salaries']['Insert']>
            }
            attendance: {
                Row: {
                    id: string
                    school_id: string
                    student_id: string
                    class_id: string
                    date: string
                    status: AttendanceStatus
                    remarks: string | null
                    marked_by: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['attendance']['Insert']>
            }
            fee_invoices: {
                Row: {
                    id: string
                    school_id: string
                    student_id: string
                    invoice_no: string
                    month: string
                    due_date: string
                    total_amount: number
                    discount_amount: number
                    paid_amount: number
                    balance: number
                    status: InvoiceStatus
                    late_fee: number
                    remarks: string | null
                    generated_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['fee_invoices']['Row'], 'id' | 'created_at' | 'updated_at' | 'balance'>
                Update: Partial<Database['public']['Tables']['fee_invoices']['Insert']>
            }
            fee_transactions: {
                Row: {
                    id: string
                    school_id: string
                    invoice_id: string
                    student_id: string
                    receipt_no: string
                    amount: number
                    payment_method: PaymentMethod
                    payment_date: string
                    transaction_ref: string | null
                    bank_name: string | null
                    cheque_no: string | null
                    remarks: string | null
                    received_by: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['fee_transactions']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['fee_transactions']['Insert']>
            }
            transport_vehicles: {
                Row: {
                    id: string
                    school_id: string
                    vehicle_no: string
                    vehicle_type: 'bus' | 'van' | 'coaster' | 'hiace'
                    capacity: number
                    driver_name: string | null
                    driver_phone: string | null
                    driver_cnic: string | null
                    conductor_name: string | null
                    conductor_phone: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['transport_vehicles']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['transport_vehicles']['Insert']>
            }
            transport_routes: {
                Row: {
                    id: string
                    school_id: string
                    name: string
                    description: string | null
                    vehicle_id: string | null
                    monthly_fee: number
                    is_active: boolean
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['transport_routes']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['transport_routes']['Insert']>
            }
            library_books: {
                Row: {
                    id: string
                    school_id: string
                    isbn: string | null
                    title: string
                    author: string | null
                    publisher: string | null
                    edition: string | null
                    category: string | null
                    shelf_location: string | null
                    total_copies: number
                    available_copies: number
                    price: number | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['library_books']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['library_books']['Insert']>
            }
            library_issues: {
                Row: {
                    id: string
                    school_id: string
                    book_id: string
                    student_id: string | null
                    staff_id: string | null
                    issue_date: string
                    due_date: string
                    return_date: string | null
                    fine_amount: number
                    fine_paid: boolean
                    status: 'issued' | 'returned' | 'lost' | 'damaged'
                    issued_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['library_issues']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['library_issues']['Insert']>
            }
            exams: {
                Row: {
                    id: string
                    school_id: string
                    name: string
                    exam_type: ExamType
                    academic_year_id: string | null
                    start_date: string | null
                    end_date: string | null
                    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled'
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['exams']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['exams']['Insert']>
            }
            grades: {
                Row: {
                    id: string
                    school_id: string
                    student_id: string
                    exam_id: string
                    subject_id: string
                    marks_obtained: number | null
                    total_marks: number | null
                    percentage: number | null
                    grade: string | null
                    remarks: string | null
                    entered_by: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['grades']['Row'], 'id' | 'created_at' | 'updated_at' | 'percentage'>
                Update: Partial<Database['public']['Tables']['grades']['Insert']>
            }
            homework: {
                Row: {
                    id: string
                    school_id: string
                    class_id: string
                    subject_id: string | null
                    title: string
                    description: string | null
                    attachment_url: string | null
                    assigned_date: string
                    due_date: string
                    assigned_by: string | null
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['homework']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['homework']['Insert']>
            }
            student_transport: {
                Row: {
                    id: string
                    school_id: string
                    student_id: string
                    route_id: string
                    pickup_time: string | null
                    dropoff_time: string | null
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['student_transport']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['student_transport']['Insert']>
            }
            broadcasts: {
                Row: {
                    id: string
                    school_id: string
                    title: string
                    message: string
                    recipient_type: RecipientType
                    target_class_id: string | null
                    channel: 'whatsapp' | 'sms' | 'email' | 'app'
                    status: BroadcastStatus
                    scheduled_at: string | null
                    sent_at: string | null
                    sent_count: number
                    failed_count: number
                    created_by: string
                    created_at: string
                }
                Insert: Omit<Database['public']['Tables']['broadcasts']['Row'], 'id' | 'created_at'>
                Update: Partial<Database['public']['Tables']['broadcasts']['Insert']>
            }
            support_tickets: {
                Row: {
                    id: string
                    school_id: string
                    ticket_no: string
                    subject: string
                    description: string
                    category: string | null
                    status: TicketStatus
                    priority: TicketPriority
                    created_by: string
                    assigned_to: string | null
                    resolved_at: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: Omit<Database['public']['Tables']['support_tickets']['Row'], 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Database['public']['Tables']['support_tickets']['Insert']>
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            get_user_school_id: {
                Args: Record<PropertyKey, never>
                Returns: string
            }
            is_super_admin: {
                Args: Record<PropertyKey, never>
                Returns: boolean
            }
            get_user_role: {
                Args: Record<PropertyKey, never>
                Returns: UserRole
            }
            create_default_grade_scales: {
                Args: {
                    p_school_id: string
                    p_grading_system: string
                }
                Returns: void
            }
        }
        Enums: {
            user_role: UserRole
            inquiry_status: InquiryStatus
            inquiry_source: InquirySource
            exam_type: ExamType
            fee_type: FeeType
            payment_method: PaymentMethod
            invoice_status: InvoiceStatus
            ticket_status: TicketStatus
            ticket_priority: TicketPriority
            broadcast_status: BroadcastStatus
            recipient_type: RecipientType
        }
    }
}

// Helper types for cleaner usage
export type School = Database['public']['Tables']['schools']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Student = Database['public']['Tables']['students']['Row']
export type Staff = Database['public']['Tables']['staff']['Row']
export type StaffSalary = Database['public']['Tables']['staff_salaries']['Row']
export type Class = Database['public']['Tables']['classes']['Row']
export type Subject = Database['public']['Tables']['subjects']['Row']
export type Inquiry = Database['public']['Tables']['inquiries']['Row']
export type Registration = Database['public']['Tables']['registrations']['Row']
export type Attendance = Database['public']['Tables']['attendance']['Row']
export type FeeInvoice = Database['public']['Tables']['fee_invoices']['Row']
export type FeeTransaction = Database['public']['Tables']['fee_transactions']['Row']
export type TransportVehicle = Database['public']['Tables']['transport_vehicles']['Row']
export type TransportRoute = Database['public']['Tables']['transport_routes']['Row']
export type LibraryBook = Database['public']['Tables']['library_books']['Row']
export type LibraryIssue = Database['public']['Tables']['library_issues']['Row']
export type Exam = Database['public']['Tables']['exams']['Row']
export type Grade = Database['public']['Tables']['grades']['Row']
export type Homework = Database['public']['Tables']['homework']['Row']
export type Broadcast = Database['public']['Tables']['broadcasts']['Row']
export type SupportTicket = Database['public']['Tables']['support_tickets']['Row']

// Extended types with relations
export interface StudentWithProfile extends Student {
    profile?: Profile
    class?: Class
}

export interface StaffWithProfile extends Staff {
    profile: Profile
}

export interface InquiryWithClass extends Inquiry {
    class_interested_data?: Class
}

export interface FeeInvoiceWithStudent extends FeeInvoice {
    student: StudentWithProfile
}

// Dashboard stats types
export interface DashboardStats {
    totalStudents: number
    totalTeachers: number
    totalClasses: number
    totalRevenue: number
    pendingFees: number
    attendanceRate: number
    newInquiries: number
}

export interface SuperAdminStats {
    totalSchools: number
    activeSchools: number
    totalStudents: number
    monthlyRevenue: number
    mrr: number
    trialSchools: number
}
