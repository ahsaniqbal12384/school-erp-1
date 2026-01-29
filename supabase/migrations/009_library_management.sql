-- Migration: 009_library_management.sql
-- Description: Library Management - Book catalog, issue/return, fines, reservations
-- Complete library system for schools

-- ============================================
-- SECTION 1: LIBRARY CONFIGURATION
-- ============================================

-- Library Settings per School
CREATE TABLE IF NOT EXISTS library_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE UNIQUE,
    
    -- Issue Settings
    max_books_student INTEGER DEFAULT 2,
    max_books_teacher INTEGER DEFAULT 5,
    max_books_staff INTEGER DEFAULT 3,
    issue_duration_student INTEGER DEFAULT 14, -- days
    issue_duration_teacher INTEGER DEFAULT 30,
    issue_duration_staff INTEGER DEFAULT 21,
    
    -- Fine Settings
    fine_per_day DECIMAL(10, 2) DEFAULT 5.00,
    max_fine_per_book DECIMAL(10, 2) DEFAULT 500.00,
    fine_grace_days INTEGER DEFAULT 0,
    
    -- Reservation Settings
    allow_reservations BOOLEAN DEFAULT true,
    max_reservations INTEGER DEFAULT 2,
    reservation_hold_days INTEGER DEFAULT 3,
    
    -- Other Settings
    allow_renewal BOOLEAN DEFAULT true,
    max_renewals INTEGER DEFAULT 2,
    notify_before_due_days INTEGER DEFAULT 2,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 2: BOOK CATALOG
-- ============================================

-- Book Categories
CREATE TABLE IF NOT EXISTS book_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES book_categories(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

-- Book Locations (Shelves/Racks)
CREATE TABLE IF NOT EXISTS book_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    floor TEXT,
    section TEXT,
    rack_number TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

-- Publishers
CREATE TABLE IF NOT EXISTS publishers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(school_id, name)
);

-- Authors
CREATE TABLE IF NOT EXISTS authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    biography TEXT,
    nationality TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books (Master catalog)
CREATE TABLE IF NOT EXISTS books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    -- Basic Information
    title TEXT NOT NULL,
    subtitle TEXT,
    isbn TEXT,
    isbn13 TEXT,
    edition TEXT,
    publication_year INTEGER,
    
    -- Classification
    category_id UUID REFERENCES book_categories(id) ON DELETE SET NULL,
    publisher_id UUID REFERENCES publishers(id) ON DELETE SET NULL,
    location_id UUID REFERENCES book_locations(id) ON DELETE SET NULL,
    
    -- Details
    language TEXT DEFAULT 'English',
    pages INTEGER,
    description TEXT,
    cover_image_url TEXT,
    
    -- Pricing
    price DECIMAL(10, 2) DEFAULT 0,
    
    -- Inventory
    total_copies INTEGER DEFAULT 1,
    available_copies INTEGER DEFAULT 1,
    
    -- Additional Info
    tags TEXT[], -- For easy searching
    subject TEXT, -- Related school subject
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book Authors (Many-to-Many)
CREATE TABLE IF NOT EXISTS book_authors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(book_id, author_id)
);

-- Book Copies (Individual copies with accession numbers)
DO $$ BEGIN
    CREATE TYPE book_condition AS ENUM ('new', 'good', 'fair', 'poor', 'damaged', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE copy_status AS ENUM ('available', 'issued', 'reserved', 'maintenance', 'lost', 'damaged', 'discarded');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS book_copies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    
    accession_number TEXT NOT NULL, -- Unique identifier for each copy
    barcode TEXT, -- For barcode scanning
    
    condition book_condition DEFAULT 'good',
    status copy_status DEFAULT 'available',
    
    purchase_date DATE,
    purchase_price DECIMAL(10, 2),
    vendor TEXT,
    
    location_id UUID REFERENCES book_locations(id) ON DELETE SET NULL,
    remarks TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, accession_number)
);

-- ============================================
-- SECTION 3: MEMBER MANAGEMENT
-- ============================================

DO $$ BEGIN
    CREATE TYPE member_type AS ENUM ('student', 'teacher', 'staff', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE member_status AS ENUM ('active', 'suspended', 'expired', 'blocked');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Library Members
CREATE TABLE IF NOT EXISTS library_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    -- Link to existing users
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    student_id UUID, -- Reference to students table if applicable
    staff_id UUID REFERENCES staff(id) ON DELETE SET NULL,
    
    -- Member Details
    member_number TEXT NOT NULL,
    member_type member_type NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    
    -- Membership
    status member_status DEFAULT 'active',
    membership_start DATE DEFAULT CURRENT_DATE,
    membership_end DATE,
    
    -- Limits
    max_books INTEGER,
    max_days INTEGER,
    
    -- Stats
    total_books_issued INTEGER DEFAULT 0,
    current_books_count INTEGER DEFAULT 0,
    total_fines DECIMAL(10, 2) DEFAULT 0,
    pending_fines DECIMAL(10, 2) DEFAULT 0,
    
    photo_url TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(school_id, member_number)
);

-- ============================================
-- SECTION 4: BOOK TRANSACTIONS
-- ============================================

DO $$ BEGIN
    CREATE TYPE transaction_type AS ENUM ('issue', 'return', 'renew', 'reserve', 'cancel_reservation', 'lost', 'damaged');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE transaction_status AS ENUM ('active', 'completed', 'overdue', 'lost', 'damaged');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Book Issues/Returns
CREATE TABLE IF NOT EXISTS book_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    -- Book and Member
    book_copy_id UUID NOT NULL REFERENCES book_copies(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES library_members(id) ON DELETE CASCADE,
    
    -- Issue Details
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    return_date DATE,
    
    -- Renewal
    renewal_count INTEGER DEFAULT 0,
    last_renewed_on DATE,
    
    -- Status
    status transaction_status DEFAULT 'active',
    
    -- Fine
    fine_amount DECIMAL(10, 2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT false,
    fine_paid_on DATE,
    
    -- Staff
    issued_by UUID REFERENCES auth.users(id),
    returned_to UUID REFERENCES auth.users(id),
    
    remarks TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction History (Audit Log)
CREATE TABLE IF NOT EXISTS book_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    book_issue_id UUID REFERENCES book_issues(id) ON DELETE SET NULL,
    book_copy_id UUID NOT NULL REFERENCES book_copies(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES library_members(id) ON DELETE CASCADE,
    
    transaction_type transaction_type NOT NULL,
    transaction_date TIMESTAMPTZ DEFAULT NOW(),
    
    -- For renewals
    old_due_date DATE,
    new_due_date DATE,
    
    -- For fines
    fine_amount DECIMAL(10, 2),
    
    performed_by UUID REFERENCES auth.users(id),
    remarks TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Book Reservations
DO $$ BEGIN
    CREATE TYPE reservation_status AS ENUM ('pending', 'ready', 'fulfilled', 'cancelled', 'expired');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS book_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES library_members(id) ON DELETE CASCADE,
    
    reserved_on TIMESTAMPTZ DEFAULT NOW(),
    expires_on TIMESTAMPTZ,
    fulfilled_on TIMESTAMPTZ,
    
    status reservation_status DEFAULT 'pending',
    queue_position INTEGER,
    
    -- When book becomes available
    notified_on TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 5: FINES MANAGEMENT
-- ============================================

DO $$ BEGIN
    CREATE TYPE fine_type AS ENUM ('overdue', 'damage', 'lost', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE fine_status AS ENUM ('pending', 'paid', 'waived', 'partial');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS library_fines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    member_id UUID NOT NULL REFERENCES library_members(id) ON DELETE CASCADE,
    book_issue_id UUID REFERENCES book_issues(id) ON DELETE SET NULL,
    book_copy_id UUID REFERENCES book_copies(id) ON DELETE SET NULL,
    
    fine_type fine_type NOT NULL,
    fine_amount DECIMAL(10, 2) NOT NULL,
    paid_amount DECIMAL(10, 2) DEFAULT 0,
    waived_amount DECIMAL(10, 2) DEFAULT 0,
    
    status fine_status DEFAULT 'pending',
    
    reason TEXT,
    due_date DATE,
    
    -- Payment
    paid_on DATE,
    waived_on DATE,
    waived_by UUID REFERENCES auth.users(id),
    waiver_reason TEXT,
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fine Payments
CREATE TABLE IF NOT EXISTS fine_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    
    fine_id UUID NOT NULL REFERENCES library_fines(id) ON DELETE CASCADE,
    member_id UUID NOT NULL REFERENCES library_members(id) ON DELETE CASCADE,
    
    amount DECIMAL(10, 2) NOT NULL,
    payment_date DATE DEFAULT CURRENT_DATE,
    payment_method TEXT,
    receipt_number TEXT,
    
    received_by UUID REFERENCES auth.users(id),
    remarks TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SECTION 6: INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_books_school ON books(school_id);
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category_id);
CREATE INDEX IF NOT EXISTS idx_books_title ON books(title);
CREATE INDEX IF NOT EXISTS idx_books_isbn ON books(isbn);
CREATE INDEX IF NOT EXISTS idx_book_copies_school ON book_copies(school_id);
CREATE INDEX IF NOT EXISTS idx_book_copies_status ON book_copies(status);
CREATE INDEX IF NOT EXISTS idx_book_copies_accession ON book_copies(accession_number);
CREATE INDEX IF NOT EXISTS idx_library_members_school ON library_members(school_id);
CREATE INDEX IF NOT EXISTS idx_library_members_number ON library_members(member_number);
CREATE INDEX IF NOT EXISTS idx_book_issues_school ON book_issues(school_id);
CREATE INDEX IF NOT EXISTS idx_book_issues_status ON book_issues(status);
CREATE INDEX IF NOT EXISTS idx_book_issues_due_date ON book_issues(due_date);
CREATE INDEX IF NOT EXISTS idx_library_fines_member ON library_fines(member_id);
CREATE INDEX IF NOT EXISTS idx_library_fines_status ON library_fines(status);

-- ============================================
-- SECTION 7: RLS POLICIES
-- ============================================

ALTER TABLE library_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishers ENABLE ROW LEVEL SECURITY;
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_copies ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE book_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_fines ENABLE ROW LEVEL SECURITY;
ALTER TABLE fine_payments ENABLE ROW LEVEL SECURITY;

-- Generic policy for school-based access
CREATE POLICY "School admins and librarians can manage library_settings"
ON library_settings FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = library_settings.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage book_categories"
ON book_categories FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = book_categories.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage books"
ON books FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = books.school_id))
    )
);

-- Students and teachers can view books
CREATE POLICY "Members can view books"
ON books FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND profiles.school_id = books.school_id
    )
);

CREATE POLICY "School admins and librarians can manage book_copies"
ON book_copies FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = book_copies.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage library_members"
ON library_members FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = library_members.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage book_issues"
ON book_issues FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = book_issues.school_id))
    )
);

-- Members can view their own issues
CREATE POLICY "Members can view own issues"
ON book_issues FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM library_members
        WHERE library_members.id = book_issues.member_id
        AND library_members.user_id = auth.uid()
    )
);

CREATE POLICY "School admins and librarians can manage library_fines"
ON library_fines FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = library_fines.school_id))
    )
);

-- Members can view their own fines
CREATE POLICY "Members can view own fines"
ON library_fines FOR SELECT TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM library_members
        WHERE library_members.id = library_fines.member_id
        AND library_members.user_id = auth.uid()
    )
);

-- Additional policies for other tables
CREATE POLICY "School admins and librarians can manage book_locations"
ON book_locations FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = book_locations.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage publishers"
ON publishers FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = publishers.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage authors"
ON authors FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = authors.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage book_authors"
ON book_authors FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles p, books b
        WHERE p.user_id = auth.uid()
        AND b.id = book_authors.book_id
        AND (p.role = 'super_admin' OR 
             ((p.role = 'school_admin' OR p.role = 'librarian') AND p.school_id = b.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage book_transactions"
ON book_transactions FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = book_transactions.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage book_reservations"
ON book_reservations FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = book_reservations.school_id))
    )
);

CREATE POLICY "School admins and librarians can manage fine_payments"
ON fine_payments FOR ALL TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.user_id = auth.uid()
        AND (profiles.role = 'super_admin' OR 
             ((profiles.role = 'school_admin' OR profiles.role = 'librarian') AND profiles.school_id = fine_payments.school_id))
    )
);

-- ============================================
-- SECTION 8: HELPER FUNCTIONS
-- ============================================

-- Function to check if member can issue a book
CREATE OR REPLACE FUNCTION can_member_issue_book(
    p_member_id UUID
)
RETURNS TABLE (
    can_issue BOOLEAN,
    reason TEXT,
    current_books INTEGER,
    max_books INTEGER,
    pending_fines DECIMAL
) AS $$
DECLARE
    v_member library_members;
    v_settings library_settings;
    v_current_count INTEGER;
BEGIN
    -- Get member details
    SELECT * INTO v_member FROM library_members WHERE id = p_member_id;
    
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 'Member not found'::TEXT, 0, 0, 0::DECIMAL;
        RETURN;
    END IF;
    
    IF v_member.status != 'active' THEN
        RETURN QUERY SELECT false, 'Member is not active'::TEXT, v_member.current_books_count, COALESCE(v_member.max_books, 0), v_member.pending_fines;
        RETURN;
    END IF;
    
    -- Get library settings
    SELECT * INTO v_settings FROM library_settings WHERE school_id = v_member.school_id;
    
    -- Check pending fines
    IF v_member.pending_fines > 0 THEN
        RETURN QUERY SELECT false, 'Has pending fines'::TEXT, v_member.current_books_count, COALESCE(v_member.max_books, 0), v_member.pending_fines;
        RETURN;
    END IF;
    
    -- Get current issued count
    SELECT COUNT(*) INTO v_current_count 
    FROM book_issues 
    WHERE member_id = p_member_id AND status = 'active';
    
    -- Determine max books based on member type
    DECLARE v_max_books INTEGER;
    BEGIN
        v_max_books := COALESCE(v_member.max_books,
            CASE v_member.member_type
                WHEN 'student' THEN COALESCE(v_settings.max_books_student, 2)
                WHEN 'teacher' THEN COALESCE(v_settings.max_books_teacher, 5)
                WHEN 'staff' THEN COALESCE(v_settings.max_books_staff, 3)
                ELSE 2
            END
        );
        
        IF v_current_count >= v_max_books THEN
            RETURN QUERY SELECT false, 'Maximum books limit reached'::TEXT, v_current_count, v_max_books, v_member.pending_fines;
            RETURN;
        END IF;
        
        RETURN QUERY SELECT true, 'Can issue book'::TEXT, v_current_count, v_max_books, v_member.pending_fines;
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate overdue fines
CREATE OR REPLACE FUNCTION calculate_overdue_fines(
    p_school_id UUID
)
RETURNS INTEGER AS $$
DECLARE
    v_settings library_settings;
    v_count INTEGER := 0;
    r RECORD;
BEGIN
    SELECT * INTO v_settings FROM library_settings WHERE school_id = p_school_id;
    
    FOR r IN 
        SELECT bi.*, bc.book_id
        FROM book_issues bi
        JOIN book_copies bc ON bc.id = bi.book_copy_id
        WHERE bi.school_id = p_school_id
        AND bi.status = 'active'
        AND bi.due_date < CURRENT_DATE
    LOOP
        -- Calculate days overdue
        DECLARE 
            v_days_overdue INTEGER;
            v_fine DECIMAL;
        BEGIN
            v_days_overdue := CURRENT_DATE - r.due_date - COALESCE(v_settings.fine_grace_days, 0);
            
            IF v_days_overdue > 0 THEN
                v_fine := v_days_overdue * COALESCE(v_settings.fine_per_day, 5);
                v_fine := LEAST(v_fine, COALESCE(v_settings.max_fine_per_book, 500));
                
                -- Update book issue status
                UPDATE book_issues SET status = 'overdue', fine_amount = v_fine WHERE id = r.id;
                
                -- Create or update fine record
                INSERT INTO library_fines (school_id, member_id, book_issue_id, book_copy_id, fine_type, fine_amount, reason, due_date)
                VALUES (p_school_id, r.member_id, r.id, r.book_copy_id, 'overdue', v_fine, 'Overdue book return', r.due_date)
                ON CONFLICT DO NOTHING;
                
                v_count := v_count + 1;
            END IF;
        END;
    END LOOP;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql;

-- Function to issue a book
CREATE OR REPLACE FUNCTION issue_book(
    p_school_id UUID,
    p_book_copy_id UUID,
    p_member_id UUID,
    p_issued_by UUID,
    p_due_date DATE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_issue_id UUID;
    v_member library_members;
    v_settings library_settings;
    v_due DATE;
BEGIN
    -- Get member and settings
    SELECT * INTO v_member FROM library_members WHERE id = p_member_id;
    SELECT * INTO v_settings FROM library_settings WHERE school_id = p_school_id;
    
    -- Calculate due date
    v_due := COALESCE(p_due_date, CURRENT_DATE + 
        CASE v_member.member_type
            WHEN 'student' THEN COALESCE(v_settings.issue_duration_student, 14)
            WHEN 'teacher' THEN COALESCE(v_settings.issue_duration_teacher, 30)
            WHEN 'staff' THEN COALESCE(v_settings.issue_duration_staff, 21)
            ELSE 14
        END
    );
    
    -- Create issue record
    INSERT INTO book_issues (school_id, book_copy_id, member_id, issue_date, due_date, issued_by)
    VALUES (p_school_id, p_book_copy_id, p_member_id, CURRENT_DATE, v_due, p_issued_by)
    RETURNING id INTO v_issue_id;
    
    -- Update book copy status
    UPDATE book_copies SET status = 'issued' WHERE id = p_book_copy_id;
    
    -- Update book available copies
    UPDATE books SET available_copies = available_copies - 1 
    WHERE id = (SELECT book_id FROM book_copies WHERE id = p_book_copy_id);
    
    -- Update member stats
    UPDATE library_members 
    SET current_books_count = current_books_count + 1,
        total_books_issued = total_books_issued + 1
    WHERE id = p_member_id;
    
    -- Log transaction
    INSERT INTO book_transactions (school_id, book_issue_id, book_copy_id, member_id, transaction_type, performed_by)
    VALUES (p_school_id, v_issue_id, p_book_copy_id, p_member_id, 'issue', p_issued_by);
    
    RETURN v_issue_id;
END;
$$ LANGUAGE plpgsql;

-- Function to return a book
CREATE OR REPLACE FUNCTION return_book(
    p_issue_id UUID,
    p_returned_to UUID,
    p_condition book_condition DEFAULT 'good'
)
RETURNS BOOLEAN AS $$
DECLARE
    v_issue book_issues;
    v_settings library_settings;
    v_fine DECIMAL := 0;
BEGIN
    -- Get issue details
    SELECT * INTO v_issue FROM book_issues WHERE id = p_issue_id;
    
    IF NOT FOUND OR v_issue.status NOT IN ('active', 'overdue') THEN
        RETURN false;
    END IF;
    
    SELECT * INTO v_settings FROM library_settings WHERE school_id = v_issue.school_id;
    
    -- Calculate fine if overdue
    IF CURRENT_DATE > v_issue.due_date THEN
        DECLARE v_days_overdue INTEGER;
        BEGIN
            v_days_overdue := CURRENT_DATE - v_issue.due_date - COALESCE(v_settings.fine_grace_days, 0);
            IF v_days_overdue > 0 THEN
                v_fine := v_days_overdue * COALESCE(v_settings.fine_per_day, 5);
                v_fine := LEAST(v_fine, COALESCE(v_settings.max_fine_per_book, 500));
            END IF;
        END;
    END IF;
    
    -- Update issue record
    UPDATE book_issues 
    SET return_date = CURRENT_DATE, 
        status = 'completed', 
        returned_to = p_returned_to,
        fine_amount = v_fine
    WHERE id = p_issue_id;
    
    -- Update book copy status and condition
    UPDATE book_copies 
    SET status = 'available', 
        condition = p_condition 
    WHERE id = v_issue.book_copy_id;
    
    -- Update book available copies
    UPDATE books SET available_copies = available_copies + 1 
    WHERE id = (SELECT book_id FROM book_copies WHERE id = v_issue.book_copy_id);
    
    -- Update member stats
    UPDATE library_members 
    SET current_books_count = current_books_count - 1,
        pending_fines = pending_fines + v_fine
    WHERE id = v_issue.member_id;
    
    -- Log transaction
    INSERT INTO book_transactions (school_id, book_issue_id, book_copy_id, member_id, transaction_type, fine_amount, performed_by)
    VALUES (v_issue.school_id, p_issue_id, v_issue.book_copy_id, v_issue.member_id, 'return', v_fine, p_returned_to);
    
    -- Create fine record if applicable
    IF v_fine > 0 THEN
        INSERT INTO library_fines (school_id, member_id, book_issue_id, book_copy_id, fine_type, fine_amount, reason, due_date)
        VALUES (v_issue.school_id, v_issue.member_id, p_issue_id, v_issue.book_copy_id, 'overdue', v_fine, 'Late book return', v_issue.due_date);
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SECTION 9: DEFAULT DATA TRIGGER
-- ============================================

-- Create default library settings for new schools
CREATE OR REPLACE FUNCTION create_default_library_settings()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO library_settings (school_id)
    VALUES (NEW.id)
    ON CONFLICT DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_default_library_settings ON schools;
CREATE TRIGGER trigger_create_default_library_settings
    AFTER INSERT ON schools
    FOR EACH ROW
    EXECUTE FUNCTION create_default_library_settings();

-- Create default book categories for new schools
CREATE OR REPLACE FUNCTION create_default_book_categories()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO book_categories (school_id, name, description)
    VALUES 
        (NEW.id, 'Fiction', 'Novels, Stories, Literature'),
        (NEW.id, 'Non-Fiction', 'Factual books, Biographies'),
        (NEW.id, 'Science', 'Physics, Chemistry, Biology'),
        (NEW.id, 'Mathematics', 'Math textbooks and references'),
        (NEW.id, 'History', 'Historical books and references'),
        (NEW.id, 'Geography', 'Geography and maps'),
        (NEW.id, 'Computer Science', 'IT, Programming, Technology'),
        (NEW.id, 'Reference', 'Encyclopedias, Dictionaries'),
        (NEW.id, 'Textbooks', 'Course textbooks'),
        (NEW.id, 'Magazines', 'Periodicals and magazines');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_create_default_book_categories ON schools;
CREATE TRIGGER trigger_create_default_book_categories
    AFTER INSERT ON schools
    FOR EACH ROW
    EXECUTE FUNCTION create_default_book_categories();
