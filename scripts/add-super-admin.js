// Script to add super admin user
// Run with: node scripts/add-super-admin.js

const bcrypt = require('bcryptjs')

async function addSuperAdmin() {
    // Import supabase client
    const { createClient } = require('@supabase/supabase-js')
    
    // Get environment variables
    require('dotenv').config({ path: '.env.local' })
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('Missing Supabase environment variables')
        console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing')
        console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'Set' : 'Missing')
        process.exit(1)
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // User details
    const email = 'ahsanibal79@gmail.com'
    const password = 'abc@123'
    const passwordHash = bcrypt.hashSync(password, 10)
    
    console.log('Adding super admin user...')
    console.log('Email:', email)
    
    // Check if user already exists
    const { data: existingUser } = await supabase
        .from('users')
        .select('id, email')
        .eq('email', email)
        .single()
    
    if (existingUser) {
        console.log('User already exists. Updating password...')
        const { error: updateError } = await supabase
            .from('users')
            .update({ 
                password_hash: passwordHash,
                is_active: true,
                email_verified: true
            })
            .eq('email', email)
        
        if (updateError) {
            console.error('Error updating user:', updateError)
            process.exit(1)
        }
        console.log('Password updated successfully!')
    } else {
        // Insert new user
        const { data, error } = await supabase
            .from('users')
            .insert({
                email: email,
                password_hash: passwordHash,
                role: 'super_admin',
                first_name: 'Ahsan',
                last_name: 'Iqbal',
                is_active: true,
                email_verified: true,
                school_id: null
            })
            .select()
        
        if (error) {
            console.error('Error creating user:', error)
            process.exit(1)
        }
        
        console.log('Super admin created successfully!')
        console.log('User ID:', data[0]?.id)
    }
    
    console.log('\n✅ Done!')
    console.log('You can now login with:')
    console.log('Email: ahsanibal79@gmail.com')
    console.log('Password: abc@123')
}

addSuperAdmin().catch(console.error)
