# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Security Features

This School ERP application implements the following security measures:

### 🔐 Authentication & Authorization
- **Supabase Auth** - Secure user authentication
- **Row Level Security (RLS)** - Database-level access control
- **Role-based Access Control** - Super Admin, School Admin, Teacher, Student, Parent roles
- **JWT Tokens** - Secure session management

### 🛡️ Data Protection
- **Multi-tenant Isolation** - Each school's data is completely isolated
- **RLS Policies** - Enforced at database level for all tables
- **Input Validation** - All user inputs are validated
- **XSS Protection** - React's built-in XSS protection

### 🔒 Infrastructure Security
- **HTTPS Only** - All traffic encrypted in transit
- **Environment Variables** - Secrets stored securely
- **No Hardcoded Credentials** - All sensitive data via env vars

### 📋 Implemented RLS Policies
All public tables have Row Level Security enabled:
- `subscription_plans` - Public read, admin write
- `school_invoices` - School-specific access
- `user_sessions` - User-only access
- `notifications` - Recipient-based access
- `todos` - Owner-based access
- `exam_results` - School-specific access
- `fee_payments` - School-specific access
- `announcements` - School-specific access
- `messages` - Sender/recipient access

## Reporting a Vulnerability

If you discover a security vulnerability, please:

1. **Do NOT** create a public GitHub issue
2. Email security concerns to: [your-email@domain.com]
3. Include detailed steps to reproduce
4. Allow 48 hours for initial response

## Security Best Practices for Deployment

1. **Never commit `.env` files** - Use environment variables
2. **Use strong passwords** - Minimum 12 characters
3. **Enable 2FA** - Where available
4. **Regular updates** - Keep dependencies updated
5. **Monitor logs** - Check for suspicious activity
