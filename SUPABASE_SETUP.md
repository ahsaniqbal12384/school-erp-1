# Supabase Setup Instructions

To get your School ERP running with real data, follow these exact steps:

## 1. Environment Variables
Ensure your `.env.local` file has the correct keys from your Supabase Dashboard (`Settings > API`):
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJh...
```

## 2. Authentication Setup
The system uses Supabase Auth. You cannot log in with the demo buttons anymore. You must create a real user.

1. Go to **Supabase Dashboard** > **Authentication** > **Users**.
2. Click **Add User**.
3. **Email:** `admin@school.pk`
4. **Password:** `password123`
5. **Important:** Check "Auto Confirm User" before clicking Create.

## 3. Link User to Profile
After creating the user, you must link them to the School Admin profile so they have the correct permissions.

1. Copy the **User UID** of the user you just created (e.g., `d8e4...`).
2. Go to the **SQL Editor** in Supabase.
3. Run this command (paste your UID):
   ```sql
   INSERT INTO profiles (id, email, first_name, last_name, role, school_id)
   VALUES (
       'PASTE_YOUR_UID_HERE', -- <--- PASTE HERE
       'admin@school.pk',
       'Mr.',
       'Principal',
       'school_admin',
       'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' -- Matches the seed school ID
   );
   ```

## 4. Test It!
1. Restart your local server if needed.
2. Go to `http://localhost:3000/login`.
3. Sign in with `admin@school.pk` / `password123`.
4. You should be redirected to the Admin Dashboard!

## Troubleshooting
- **"Login Failed":** Check your Console (F12) for errors. Usually means keys are wrong or user doesn't exist.
- **"Profile not found":** Means you forgot Step 3 (SQL Insert).
