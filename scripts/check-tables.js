const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://aczutdvzatjmsoybgmgk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjenV0ZHZ6YXRqbXNveWJnbWdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODgwOTQ0OSwiZXhwIjoyMDg0Mzg1NDQ5fQ.K7hqryqcLRSsll0D24e2LFw6E7DIU6khVIyZp_0wOcM'
);

async function createTables() {
    console.log('Creating todos table...');
    
    // Check if todos table exists by trying to select from it
    const { error: checkError } = await supabase.from('todos').select('id').limit(1);
    
    if (checkError && checkError.message.includes('does not exist')) {
        // Table doesn't exist, we need to create it via SQL
        console.log('Todos table does not exist, please run the migration SQL manually in Supabase dashboard');
        console.log('Go to: https://supabase.com/dashboard/project/aczutdvzatjmsoybgmgk/sql/new');
        console.log('And run the SQL from: supabase/migrations/006_todos_and_notifications.sql');
    } else if (checkError) {
        console.log('Error checking todos table:', checkError.message);
    } else {
        console.log('Todos table already exists');
    }

    // Check notifications table
    const { error: notifError } = await supabase.from('notifications').select('id').limit(1);
    
    if (notifError && notifError.message.includes('does not exist')) {
        console.log('Notifications table does not exist');
    } else if (notifError) {
        console.log('Error checking notifications table:', notifError.message);
    } else {
        console.log('Notifications table already exists');
    }
}

createTables();
