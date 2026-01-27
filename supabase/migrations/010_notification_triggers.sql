-- =============================================
-- AUTOMATIC NOTIFICATION TRIGGERS
-- These triggers create notifications automatically
-- =============================================

-- 1. Trigger: Notify parent when student is marked absent
CREATE OR REPLACE FUNCTION notify_on_absence()
RETURNS TRIGGER AS $$
DECLARE
    parent_record RECORD;
    student_record RECORD;
BEGIN
    -- Only trigger on absence
    IF NEW.status = 'absent' THEN
        -- Get student info
        SELECT first_name, last_name, id INTO student_record
        FROM students WHERE id = NEW.student_id;
        
        -- Get parent users linked to this student (using correct column name)
        FOR parent_record IN 
            SELECT u.id, u.email 
            FROM users u
            JOIN parent_students ps ON ps.parent_profile_id = u.id
            WHERE ps.student_id = NEW.student_id
        LOOP
            INSERT INTO notifications (user_id, school_id, title, message, type, category)
            VALUES (
                parent_record.id,
                NEW.school_id,
                'Attendance Alert',
                student_record.first_name || ' ' || student_record.last_name || ' was marked absent today.',
                'warning',
                'attendance'
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_on_absence ON attendance;
CREATE TRIGGER trigger_notify_on_absence
    AFTER INSERT ON attendance
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_absence();

-- 2. Trigger: Notify students/parents when homework is assigned
CREATE OR REPLACE FUNCTION notify_on_homework()
RETURNS TRIGGER AS $$
DECLARE
    class_record RECORD;
    student_record RECORD;
    parent_record RECORD;
BEGIN
    -- Get class info
    SELECT name INTO class_record FROM classes WHERE id = NEW.class_id;
    
    -- Notify all students in the class
    FOR student_record IN 
        SELECT s.id as student_id, u.id as user_id
        FROM students s
        LEFT JOIN users u ON u.id = s.user_id
        WHERE s.class_id = NEW.class_id AND u.id IS NOT NULL
    LOOP
        INSERT INTO notifications (user_id, school_id, title, message, type, category, link)
        VALUES (
            student_record.user_id,
            NEW.school_id,
            'New Homework Assigned',
            'New homework for ' || COALESCE(NEW.subject, 'class') || ': ' || NEW.title,
            'info',
            'academic',
            '/portal/homework'
        );
    END LOOP;
    
    -- Notify parents of students in this class
    FOR parent_record IN 
        SELECT DISTINCT u.id
        FROM users u
        JOIN parent_students ps ON ps.parent_profile_id = u.id
        JOIN students s ON s.id = ps.student_id
        WHERE s.class_id = NEW.class_id
    LOOP
        INSERT INTO notifications (user_id, school_id, title, message, type, category, link)
        VALUES (
            parent_record.id,
            NEW.school_id,
            'Homework Assigned',
            'New homework assigned in ' || COALESCE(class_record.name, 'class') || ': ' || NEW.title,
            'info',
            'academic',
            '/portal/homework'
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_on_homework ON homework;
CREATE TRIGGER trigger_notify_on_homework
    AFTER INSERT ON homework
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_homework();

-- 3. Trigger: Notify when exam results are published
CREATE OR REPLACE FUNCTION notify_on_results()
RETURNS TRIGGER AS $$
DECLARE
    student_user_id UUID;
    parent_record RECORD;
    student_name TEXT;
BEGIN
    -- Get student's user_id and name
    SELECT u.id, s.first_name || ' ' || s.last_name 
    INTO student_user_id, student_name
    FROM students s
    LEFT JOIN users u ON u.id = s.user_id
    WHERE s.id = NEW.student_id;
    
    -- Notify student if they have a user account
    IF student_user_id IS NOT NULL THEN
        INSERT INTO notifications (user_id, school_id, title, message, type, category, link)
        VALUES (
            student_user_id,
            NEW.school_id,
            'Exam Results Published',
            'Your results for ' || NEW.exam_name || ' are now available.',
            'success',
            'academic',
            '/portal/results'
        );
    END IF;
    
    -- Notify parents
    FOR parent_record IN 
        SELECT u.id
        FROM users u
        JOIN parent_students ps ON ps.parent_profile_id = u.id
        WHERE ps.student_id = NEW.student_id
    LOOP
        INSERT INTO notifications (user_id, school_id, title, message, type, category, link)
        VALUES (
            parent_record.id,
            NEW.school_id,
            'Exam Results Available',
            COALESCE(student_name, 'Your child') || '''s results for ' || NEW.exam_name || ' are now available.',
            'success',
            'academic',
            '/portal/results'
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_on_results ON exam_results;
CREATE TRIGGER trigger_notify_on_results
    AFTER INSERT ON exam_results
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_results();

-- 4. Trigger: Notify on fee payment received
CREATE OR REPLACE FUNCTION notify_on_fee_payment()
RETURNS TRIGGER AS $$
DECLARE
    student_record RECORD;
    parent_record RECORD;
BEGIN
    -- Get student info
    SELECT s.first_name, s.last_name, s.id as student_id
    INTO student_record
    FROM students s WHERE s.id = NEW.student_id;
    
    -- Notify parents about payment confirmation
    FOR parent_record IN 
        SELECT u.id
        FROM users u
        JOIN parent_students ps ON ps.parent_profile_id = u.id
        WHERE ps.student_id = NEW.student_id
    LOOP
        INSERT INTO notifications (user_id, school_id, title, message, type, category, link)
        VALUES (
            parent_record.id,
            NEW.school_id,
            'Payment Received',
            'Payment of Rs. ' || NEW.amount || ' received for ' || COALESCE(student_record.first_name, 'student') || '. Receipt: ' || COALESCE(NEW.receipt_number, 'N/A'),
            'success',
            'fees',
            '/portal/fees'
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_on_fee_payment ON fee_payments;
CREATE TRIGGER trigger_notify_on_fee_payment
    AFTER INSERT ON fee_payments
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_fee_payment();

-- 5. Trigger: Notify on new announcement
CREATE OR REPLACE FUNCTION notify_on_announcement()
RETURNS TRIGGER AS $$
DECLARE
    user_record RECORD;
BEGIN
    -- Notify all active users in the school
    FOR user_record IN 
        SELECT id FROM users 
        WHERE school_id = NEW.school_id 
        AND is_active = TRUE
    LOOP
        INSERT INTO notifications (user_id, school_id, title, message, type, category)
        VALUES (
            user_record.id,
            NEW.school_id,
            '📢 ' || NEW.title,
            LEFT(NEW.content, 150) || CASE WHEN LENGTH(NEW.content) > 150 THEN '...' ELSE '' END,
            CASE WHEN NEW.type = 'urgent' THEN 'warning' ELSE 'announcement' END,
            'announcement'
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_on_announcement ON announcements;
CREATE TRIGGER trigger_notify_on_announcement
    AFTER INSERT ON announcements
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_announcement();

-- 6. Trigger: Notify on new message
CREATE OR REPLACE FUNCTION notify_on_message()
RETURNS TRIGGER AS $$
DECLARE
    sender_name TEXT;
BEGIN
    -- Get sender name
    SELECT first_name || ' ' || last_name INTO sender_name
    FROM users WHERE id = NEW.sender_id;
    
    INSERT INTO notifications (user_id, school_id, title, message, type, category, link)
    VALUES (
        NEW.receiver_id,
        NEW.school_id,
        'New Message',
        'You have a new message from ' || COALESCE(sender_name, 'Unknown'),
        'info',
        'message',
        '/portal/messages'
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_on_message ON messages;
CREATE TRIGGER trigger_notify_on_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION notify_on_message();
