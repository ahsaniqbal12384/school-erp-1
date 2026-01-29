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
            // Library Management Tables
            library_settings: {
                Row: LibrarySettings
                Insert: Omit<LibrarySettings, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<LibrarySettings, 'id' | 'created_at' | 'updated_at'>>
            }
            book_categories: {
                Row: BookCategory
                Insert: Omit<BookCategory, 'id' | 'created_at'>
                Update: Partial<Omit<BookCategory, 'id' | 'created_at'>>
            }
            book_locations: {
                Row: BookLocation
                Insert: Omit<BookLocation, 'id' | 'created_at'>
                Update: Partial<Omit<BookLocation, 'id' | 'created_at'>>
            }
            publishers: {
                Row: Publisher
                Insert: Omit<Publisher, 'id' | 'created_at'>
                Update: Partial<Omit<Publisher, 'id' | 'created_at'>>
            }
            authors: {
                Row: Author
                Insert: Omit<Author, 'id' | 'created_at'>
                Update: Partial<Omit<Author, 'id' | 'created_at'>>
            }
            books: {
                Row: Book
                Insert: Omit<Book, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Book, 'id' | 'created_at' | 'updated_at'>>
            }
            book_copies: {
                Row: BookCopy
                Insert: Omit<BookCopy, 'id' | 'created_at'>
                Update: Partial<Omit<BookCopy, 'id' | 'created_at'>>
            }
            library_members: {
                Row: LibraryMember
                Insert: Omit<LibraryMember, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<LibraryMember, 'id' | 'created_at' | 'updated_at'>>
            }
            book_issues: {
                Row: BookIssue
                Insert: Omit<BookIssue, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<BookIssue, 'id' | 'created_at' | 'updated_at'>>
            }
            book_reservations: {
                Row: BookReservation
                Insert: Omit<BookReservation, 'id' | 'created_at'>
                Update: Partial<Omit<BookReservation, 'id' | 'created_at'>>
            }
            library_fines: {
                Row: LibraryFine
                Insert: Omit<LibraryFine, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<LibraryFine, 'id' | 'created_at' | 'updated_at'>>
            }
            fine_payments: {
                Row: FinePayment
                Insert: Omit<FinePayment, 'id' | 'created_at'>
                Update: Partial<Omit<FinePayment, 'id' | 'created_at'>>
            }
            // Staff/HR Management Tables
            staff_departments: {
                Row: StaffDepartment
                Insert: Omit<StaffDepartment, 'id' | 'created_at'>
                Update: Partial<Omit<StaffDepartment, 'id' | 'created_at'>>
            }
            staff_designations: {
                Row: StaffDesignation
                Insert: Omit<StaffDesignation, 'id' | 'created_at'>
                Update: Partial<Omit<StaffDesignation, 'id' | 'created_at'>>
            }
            leave_types: {
                Row: LeaveTypeConfig
                Insert: Omit<LeaveTypeConfig, 'id' | 'created_at'>
                Update: Partial<Omit<LeaveTypeConfig, 'id' | 'created_at'>>
            }
            staff_leave_balance: {
                Row: StaffLeaveBalance
                Insert: Omit<StaffLeaveBalance, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<StaffLeaveBalance, 'id' | 'created_at' | 'updated_at'>>
            }
            leave_applications: {
                Row: LeaveApplication
                Insert: Omit<LeaveApplication, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<LeaveApplication, 'id' | 'created_at' | 'updated_at'>>
            }
            salary_components: {
                Row: SalaryComponent
                Insert: Omit<SalaryComponent, 'id' | 'created_at'>
                Update: Partial<Omit<SalaryComponent, 'id' | 'created_at'>>
            }
            staff_salary_structure: {
                Row: StaffSalaryStructure
                Insert: Omit<StaffSalaryStructure, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<StaffSalaryStructure, 'id' | 'created_at' | 'updated_at'>>
            }
            payroll: {
                Row: Payroll
                Insert: Omit<Payroll, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<Payroll, 'id' | 'created_at' | 'updated_at'>>
            }
            payroll_transactions: {
                Row: PayrollTransaction
                Insert: Omit<PayrollTransaction, 'id' | 'created_at'>
                Update: Partial<Omit<PayrollTransaction, 'id' | 'created_at'>>
            }
            // Reports & Analytics Tables
            report_types: {
                Row: ReportType
                Insert: Omit<ReportType, 'id' | 'created_at'>
                Update: Partial<Omit<ReportType, 'id' | 'created_at'>>
            }
            generated_reports: {
                Row: GeneratedReport
                Insert: Omit<GeneratedReport, 'id' | 'created_at'>
                Update: Partial<Omit<GeneratedReport, 'id' | 'created_at'>>
            }
            dashboard_widgets: {
                Row: DashboardWidget
                Insert: Omit<DashboardWidget, 'id' | 'created_at' | 'updated_at'>
                Update: Partial<Omit<DashboardWidget, 'id' | 'created_at' | 'updated_at'>>
            }
            daily_analytics: {
                Row: DailyAnalytics
                Insert: Omit<DailyAnalytics, 'id' | 'created_at'>
                Update: Partial<Omit<DailyAnalytics, 'id' | 'created_at'>>
            }
            monthly_analytics: {
                Row: MonthlyAnalytics
                Insert: Omit<MonthlyAnalytics, 'id' | 'created_at'>
                Update: Partial<Omit<MonthlyAnalytics, 'id' | 'created_at'>>
            }
            class_performance: {
                Row: ClassPerformance
                Insert: Omit<ClassPerformance, 'id' | 'created_at'>
                Update: Partial<Omit<ClassPerformance, 'id' | 'created_at'>>
            }
            fee_collection_summary: {
                Row: FeeCollectionSummary
                Insert: Omit<FeeCollectionSummary, 'id' | 'created_at'>
                Update: Partial<Omit<FeeCollectionSummary, 'id' | 'created_at'>>
            }
            fee_defaulters_snapshot: {
                Row: FeeDefaultersSnapshot
                Insert: Omit<FeeDefaultersSnapshot, 'id' | 'created_at'>
                Update: Partial<Omit<FeeDefaultersSnapshot, 'id' | 'created_at'>>
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

// SMS & Notifications types
export type SMSProvider = 'twilio' | 'zong' | 'jazz' | 'telenor' | 'custom'
export type SMSStatus = 'pending' | 'sent' | 'delivered' | 'failed'
export type SMSBroadcastStatus = 'draft' | 'scheduled' | 'sending' | 'sent' | 'failed'
export type SMSTargetType = 'all' | 'parents' | 'teachers' | 'staff' | 'class' | 'custom'
export type AlertType = 'absent' | 'late' | 'leave' | 'excused'

export interface SMSConfig {
    id: string
    school_id: string
    provider: SMSProvider
    api_key?: string
    api_secret?: string
    sender_id?: string
    base_url?: string
    username?: string
    password?: string
    is_active: boolean
    credits_balance: number
    monthly_limit?: number
    created_at: string
    updated_at: string
}

export interface SMSTemplate {
    id: string
    school_id: string
    name: string
    message: string
    category: string
    variables?: string[]
    is_active: boolean
    created_at: string
    updated_at: string
}

export interface SMSLog {
    id: string
    school_id: string
    message: string
    recipient_phone: string
    recipient_name?: string
    recipient_type?: string
    student_id?: string
    status: SMSStatus
    message_id?: string
    error_message?: string
    sent_by?: string
    sent_at: string
    delivered_at?: string
    created_at: string
}

export interface SMSBroadcast {
    id: string
    school_id: string
    title: string
    message: string
    target_type: SMSTargetType
    target_filters?: Record<string, unknown>
    total_recipients: number
    sent_count: number
    delivered_count: number
    failed_count: number
    scheduled_at?: string
    sent_at?: string
    completed_at?: string
    sent_by?: string
    status: SMSBroadcastStatus
    created_at: string
    updated_at: string
}

export interface AttendanceAlert {
    id: string
    school_id: string
    attendance_id: string
    student_id: string
    parent_phone: string
    alert_type: AlertType
    message: string
    status: SMSStatus
    sent_at?: string
    delivered_at?: string
    created_at: string
}

// School settings extension
export interface SchoolSettings {
    working_days?: string[]
    sms_enabled?: boolean
    attendance_sms_enabled?: boolean
    fee_sms_enabled?: boolean
    default_attendance?: 'present' | 'absent'
    academic_year_start?: string
}

// Platform SMS Configuration (Super Admin)
export type SMSProviderType = 'twilio' | 'zong' | 'jazz' | 'telenor' | 'custom' | 'none'

export interface PlatformSMSConfig {
    id: string
    provider: SMSProviderType
    is_enabled: boolean
    api_key: string
    api_secret: string
    sender_id: string
    base_url: string
    username: string
    password: string
    monthly_limit: number
    rate_per_sms: number
    balance: number
    created_at: string
    updated_at: string
}

// School SMS Settings
export interface SchoolSMSSettings {
    id: string
    school_id: string
    is_sms_enabled: boolean
    monthly_limit: number
    can_send_attendance: boolean
    can_send_fees: boolean
    can_send_exams: boolean
    can_send_general: boolean
    can_send_emergency: boolean
    created_at: string
    updated_at: string
}

// School SMS Permission (combined view)
export interface SchoolSMSPermission {
    id: string
    school_id: string
    school_name: string
    school_slug: string
    is_sms_enabled: boolean
    monthly_limit: number
    used_this_month: number
    can_send_attendance: boolean
    can_send_fees: boolean
    can_send_exams: boolean
    can_send_general: boolean
    can_send_emergency: boolean
    last_sms_sent?: string
}

// SMS Usage Stats
export interface SMSUsageStats {
    total_sent_today: number
    total_sent_this_month: number
    total_sent_all_time: number
    delivery_rate: number
    failed_this_month: number
    schools_using_sms: number
}

// Platform Email Configuration (Super Admin)
export type EmailProviderType = 'smtp' | 'sendgrid' | 'mailgun' | 'ses' | 'postmark' | 'resend' | 'none'

export interface PlatformEmailConfig {
    id: string
    provider: EmailProviderType
    is_enabled: boolean
    smtp_host: string
    smtp_port: number
    smtp_username: string
    smtp_password: string
    smtp_encryption: 'none' | 'ssl' | 'tls'
    api_key: string
    api_secret: string
    from_email: string
    from_name: string
    reply_to: string
    monthly_limit: number
    daily_limit: number
    rate_per_email: number
    created_at: string
    updated_at: string
}

// School Email Settings
export interface SchoolEmailSettings {
    id: string
    school_id: string
    is_email_enabled: boolean
    monthly_limit: number
    can_send_attendance: boolean
    can_send_fees: boolean
    can_send_exams: boolean
    can_send_general: boolean
    can_send_newsletters: boolean
    custom_from_email?: string
    custom_from_name?: string
    created_at: string
    updated_at: string
}

// School Email Permission (combined view)
export interface SchoolEmailPermission {
    id: string
    school_id: string
    school_name: string
    school_slug: string
    is_email_enabled: boolean
    monthly_limit: number
    used_this_month: number
    can_send_attendance: boolean
    can_send_fees: boolean
    can_send_exams: boolean
    can_send_general: boolean
    can_send_newsletters: boolean
    last_email_sent?: string
}

// Email Log
export type EmailStatus = 'pending' | 'sent' | 'delivered' | 'opened' | 'failed' | 'bounced'

export interface EmailLog {
    id: string
    school_id?: string
    recipient_email: string
    recipient_name?: string
    subject: string
    body?: string
    status: EmailStatus
    message_id?: string
    error_message?: string
    email_type: string
    template_id?: string
    opened_at?: string
    clicked_at?: string
    bounced_at?: string
    sent_by?: string
    created_at: string
    sent_at?: string
}

// Email Template
export type EmailTemplateCategory = 'attendance' | 'fees' | 'exams' | 'general' | 'newsletter'

export interface EmailTemplate {
    id: string
    school_id?: string
    name: string
    subject: string
    body: string
    category: EmailTemplateCategory
    variables: string[]
    is_active: boolean
    usage_count: number
    created_by?: string
    created_at: string
    updated_at: string
}

// Email Usage Stats
export interface EmailUsageStats {
    total_sent_today: number
    total_sent_this_month: number
    total_sent_all_time: number
    delivery_rate: number
    bounce_rate: number
    open_rate: number
    failed_this_month: number
    schools_using_email: number
}

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

// ============================================
// LIBRARY MANAGEMENT TYPES
// ============================================

export type BookStatus = 'available' | 'issued' | 'reserved' | 'lost' | 'damaged' | 'under_repair' | 'discarded'
export type BookCondition = 'new' | 'good' | 'fair' | 'poor' | 'damaged'
export type MemberType = 'student' | 'staff'
export type MemberStatus = 'active' | 'suspended' | 'expired'
export type IssueStatus = 'issued' | 'returned' | 'overdue' | 'lost'
export type ReservationStatus = 'pending' | 'fulfilled' | 'cancelled' | 'expired'
export type FineType = 'overdue' | 'lost' | 'damage'
export type FineStatus = 'pending' | 'partial' | 'paid' | 'waived'

export interface LibrarySettings {
    id: string
    school_id: string
    fine_per_day: number
    max_fine_amount: number
    student_max_books: number
    staff_max_books: number
    student_borrow_days: number
    staff_borrow_days: number
    allow_renewals: boolean
    max_renewals: number
    reservation_expiry_days: number
    send_due_reminders: boolean
    reminder_days_before: number
    created_at: string
    updated_at: string
}

export interface BookCategory {
    id: string
    school_id: string
    name: string
    description: string | null
    parent_id: string | null
    is_active: boolean
    created_at: string
}

export interface BookLocation {
    id: string
    school_id: string
    name: string
    description: string | null
    floor: string | null
    section: string | null
    shelf_number: string | null
    created_at: string
}

export interface Publisher {
    id: string
    school_id: string
    name: string
    address: string | null
    contact_person: string | null
    phone: string | null
    email: string | null
    website: string | null
    created_at: string
}

export interface Author {
    id: string
    school_id: string
    name: string
    biography: string | null
    nationality: string | null
    created_at: string
}

export interface Book {
    id: string
    school_id: string
    isbn: string | null
    title: string
    subtitle: string | null
    edition: string | null
    category_id: string | null
    publisher_id: string | null
    location_id: string | null
    publication_year: number | null
    pages: number | null
    language: string
    description: string | null
    cover_image_url: string | null
    total_copies: number
    available_copies: number
    price: number | null
    status: BookStatus
    created_at: string
    updated_at: string
}

export interface BookCopy {
    id: string
    school_id: string
    book_id: string
    accession_number: string
    status: BookStatus
    condition: BookCondition
    acquisition_date: string | null
    acquisition_source: string | null
    price_at_acquisition: number | null
    notes: string | null
    created_at: string
}

export interface LibraryMember {
    id: string
    school_id: string
    membership_number: string
    member_type: MemberType
    student_id: string | null
    staff_id: string | null
    status: MemberStatus
    joined_date: string
    expiry_date: string | null
    max_books_allowed: number
    current_books_count: number
    total_fines_paid: number
    created_at: string
    updated_at: string
}

export interface BookIssue {
    id: string
    school_id: string
    book_copy_id: string
    member_id: string
    issue_date: string
    due_date: string
    return_date: string | null
    issued_by: string
    returned_by: string | null
    condition_on_issue: BookCondition
    condition_on_return: BookCondition | null
    renewals_count: number
    fine_amount: number
    remarks: string | null
    status: IssueStatus
    created_at: string
    updated_at: string
}

export interface BookReservation {
    id: string
    school_id: string
    book_id: string
    member_id: string
    reservation_date: string
    expiry_date: string
    status: ReservationStatus
    notified_at: string | null
    created_at: string
}

export interface LibraryFine {
    id: string
    school_id: string
    member_id: string
    issue_id: string | null
    fine_type: FineType
    amount: number
    paid_amount: number
    status: FineStatus
    overdue_days: number | null
    paid_date: string | null
    waived_by: string | null
    waiver_reason: string | null
    created_at: string
    updated_at: string
}

export interface FinePayment {
    id: string
    school_id: string
    fine_id: string
    amount: number
    payment_method: PaymentMethod
    payment_date: string
    collected_by: string
    receipt_number: string | null
    remarks: string | null
    created_at: string
}

// ============================================
// STAFF/HR MANAGEMENT TYPES
// ============================================

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled'
export type SalaryComponentType = 'earning' | 'deduction'
export type PayrollStatus = 'draft' | 'processed' | 'paid' | 'cancelled'

export interface StaffDepartment {
    id: string
    school_id: string
    name: string
    description: string | null
    head_id: string | null
    is_active: boolean
    created_at: string
}

export interface StaffDesignation {
    id: string
    school_id: string
    name: string
    description: string | null
    level: number | null
    is_teaching: boolean
    created_at: string
}

export interface LeaveTypeConfig {
    id: string
    school_id: string
    name: string
    code: string
    max_days_per_year: number
    is_paid: boolean
    carry_forward: boolean
    max_carry_forward_days: number
    description: string | null
    is_active: boolean
    created_at: string
}

export interface StaffLeaveBalance {
    id: string
    school_id: string
    staff_id: string
    leave_type_id: string
    academic_year_id: string
    allocated_days: number
    used_days: number
    carried_forward: number
    remaining_days: number
    created_at: string
    updated_at: string
}

export interface LeaveApplication {
    id: string
    school_id: string
    staff_id: string
    leave_type_id: string
    start_date: string
    end_date: string
    days_count: number
    reason: string | null
    status: LeaveStatus
    approved_by: string | null
    approved_at: string | null
    rejection_reason: string | null
    documents: string[] | null
    created_at: string
    updated_at: string
}

export interface SalaryComponent {
    id: string
    school_id: string
    name: string
    code: string
    type: SalaryComponentType
    is_taxable: boolean
    is_fixed: boolean
    calculation_formula: string | null
    description: string | null
    is_active: boolean
    created_at: string
}

export interface StaffSalaryStructure {
    id: string
    school_id: string
    staff_id: string
    component_id: string
    amount: number
    effective_from: string
    effective_to: string | null
    created_at: string
    updated_at: string
}

export interface Payroll {
    id: string
    school_id: string
    payroll_month: string
    payroll_year: number
    status: PayrollStatus
    total_gross: number
    total_deductions: number
    total_net: number
    staff_count: number
    processed_by: string | null
    processed_at: string | null
    paid_at: string | null
    remarks: string | null
    created_at: string
    updated_at: string
}

export interface PayrollTransaction {
    id: string
    school_id: string
    payroll_id: string
    staff_id: string
    basic_salary: number
    gross_salary: number
    total_deductions: number
    net_salary: number
    earnings_breakdown: Record<string, number>
    deductions_breakdown: Record<string, number>
    working_days: number
    present_days: number
    leave_days: number
    payment_method: PaymentMethod | null
    payment_reference: string | null
    paid_at: string | null
    created_at: string
}

// ============================================
// REPORTS & ANALYTICS TYPES
// ============================================

export type ReportCategory = 'academic' | 'financial' | 'attendance' | 'staff' | 'library' | 'transport' | 'custom'
export type ReportFormat = 'pdf' | 'excel' | 'csv'
export type ReportStatus = 'pending' | 'generating' | 'completed' | 'failed'

export interface ReportType {
    id: string
    name: string
    code: string
    category: ReportCategory
    description: string | null
    template: Record<string, unknown> | null
    default_filters: Record<string, unknown> | null
    is_system: boolean
    is_active: boolean
    created_at: string
}

export interface GeneratedReport {
    id: string
    school_id: string
    report_type_id: string
    name: string
    filters: Record<string, unknown> | null
    format: ReportFormat
    file_url: string | null
    file_size: number | null
    status: ReportStatus
    error_message: string | null
    generated_by: string
    generated_at: string | null
    expires_at: string | null
    created_at: string
}

export interface DashboardWidget {
    id: string
    school_id: string
    user_id: string | null
    name: string
    widget_type: string
    config: Record<string, unknown>
    position: number
    is_visible: boolean
    created_at: string
    updated_at: string
}

export interface DailyAnalytics {
    id: string
    school_id: string
    date: string
    total_students: number
    present_students: number
    absent_students: number
    late_students: number
    total_staff: number
    present_staff: number
    fee_collected: number
    fee_pending: number
    new_inquiries: number
    new_admissions: number
    library_issues: number
    library_returns: number
    created_at: string
}

export interface MonthlyAnalytics {
    id: string
    school_id: string
    month: number
    year: number
    avg_student_attendance: number
    avg_staff_attendance: number
    total_fee_collected: number
    total_fee_pending: number
    total_expenses: number
    new_admissions: number
    withdrawals: number
    total_inquiries: number
    conversion_rate: number
    created_at: string
}

export interface ClassPerformance {
    id: string
    school_id: string
    class_id: string
    exam_id: string
    total_students: number
    appeared_students: number
    passed_students: number
    failed_students: number
    highest_marks: number
    lowest_marks: number
    average_marks: number
    pass_percentage: number
    grade_distribution: Record<string, number>
    subject_wise_avg: Record<string, number>
    created_at: string
}

export interface FeeCollectionSummary {
    id: string
    school_id: string
    month: number
    year: number
    total_expected: number
    total_collected: number
    total_pending: number
    total_discount: number
    total_fine_collected: number
    collection_by_type: Record<string, number>
    collection_by_class: Record<string, number>
    payment_method_breakdown: Record<string, number>
    created_at: string
}

export interface FeeDefaultersSnapshot {
    id: string
    school_id: string
    snapshot_date: string
    total_defaulters: number
    total_amount_due: number
    defaulters_by_class: Record<string, number>
    amount_by_class: Record<string, number>
    age_wise_breakdown: Record<string, unknown>
    created_at: string
}
