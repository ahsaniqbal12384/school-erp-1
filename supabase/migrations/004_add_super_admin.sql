-- =============================================
-- ADD NEW SUPER ADMIN USER
-- Email: ahsanibal79@gmail.com
-- Password: abc@123
-- =============================================

INSERT INTO users (id, school_id, email, password_hash, role, first_name, last_name, is_active, email_verified)
VALUES (
    uuid_generate_v4(),
    NULL,
    'ahsanibal79@gmail.com',
    '$2b$10$COOkIKngOBBJI4CfDFrcd.jj5zeUXRunX1mXxcUEgybcypDl9CH3K', -- abc@123
    'super_admin',
    'Ahsan',
    'Iqbal',
    true,
    true
) ON CONFLICT (email) DO NOTHING;
