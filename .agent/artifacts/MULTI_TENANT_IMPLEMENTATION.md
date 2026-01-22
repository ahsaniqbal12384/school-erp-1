# Multi-Tenant School ERP Implementation Plan

## Overview

This document outlines the architecture for implementing a multi-tenant School ERP system where:
- **Super Admin** manages all schools, subscriptions, and module permissions
- **Each School** gets their own subdomain (e.g., `school-name.yourapp.com`)
- **Schools** can only access their own data and enabled modules
- **School Admins** can customize their school's branding and settings

---

## 1. Database Schema (Supabase)

### Core Tables

```sql
-- Schools table (managed by Super Admin)
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- Used for subdomain: slug.yourapp.com
    logo_url TEXT,
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    subscription_plan VARCHAR(50) DEFAULT 'basic', -- basic, standard, premium
    subscription_status VARCHAR(50) DEFAULT 'active', -- active, suspended, expired
    subscription_expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT true,
    settings JSONB DEFAULT '{}', -- Custom school settings
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Module Permissions (which modules each school can access)
CREATE TABLE school_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    module_name VARCHAR(100) NOT NULL,
    is_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(school_id, module_name)
);

-- Available modules list
-- Module names: students, staff, fees, exams, transport, library, 
--               communications, admissions, reports, timetable, homework

-- Users table (all users belong to a school, except super admins)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(50) NOT NULL, -- super_admin, school_admin, teacher, parent, student, accountant, librarian, transport
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- School Settings (branding, preferences)
CREATE TABLE school_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID UNIQUE REFERENCES schools(id) ON DELETE CASCADE,
    primary_color VARCHAR(20) DEFAULT '#3b82f6',
    secondary_color VARCHAR(20) DEFAULT '#8b5cf6',
    logo_url TEXT,
    favicon_url TEXT,
    banner_url TEXT,
    school_motto TEXT,
    academic_year VARCHAR(20),
    currency VARCHAR(10) DEFAULT 'PKR',
    timezone VARCHAR(50) DEFAULT 'Asia/Karachi',
    date_format VARCHAR(20) DEFAULT 'DD/MM/YYYY',
    sms_enabled BOOLEAN DEFAULT false,
    email_enabled BOOLEAN DEFAULT true,
    parent_portal_enabled BOOLEAN DEFAULT true,
    online_payment_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 2. Project Structure Updates

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   │       └── page.tsx          # Universal login page
│   │
│   ├── (super-admin)/            # Super Admin routes (main domain only)
│   │   └── super-admin/
│   │       ├── schools/          # Manage schools
│   │       │   ├── page.tsx      # List all schools
│   │       │   ├── new/          # Create new school
│   │       │   └── [id]/         # Edit school, manage modules
│   │       └── ...
│   │
│   └── (school)/                 # School-specific routes (subdomain)
│       ├── school/
│       │   ├── admin/            # School Admin pages
│       │   ├── teacher/          # Teacher pages
│       │   ├── accountant/       # Accountant pages
│       │   └── ...
│       └── portal/               # Parent/Student portal
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Supabase client
│   │   └── server.ts             # Server-side Supabase
│   ├── auth/
│   │   ├── provider.tsx          # Auth context provider
│   │   └── hooks.ts              # useAuth, useSchool hooks
│   └── tenant/
│       ├── context.tsx           # School/Tenant context
│       ├── middleware.ts         # Subdomain routing middleware
│       └── modules.ts            # Module permission checks
│
├── middleware.ts                 # Next.js middleware for subdomain routing
│
└── components/
    └── providers/
        ├── auth-provider.tsx
        └── tenant-provider.tsx
```

---

## 3. Subdomain Routing

### Option A: Subdomain-based (Recommended for Production)

Each school gets their own subdomain:
- `cityschool.yourapp.com` → City School
- `beacon-academy.yourapp.com` → Beacon Academy
- `admin.yourapp.com` → Super Admin Dashboard

### Option B: Path-based (Easier for Development)

- `yourapp.com/s/cityschool` → City School
- `yourapp.com/s/beacon-academy` → Beacon Academy
- `yourapp.com/super-admin` → Super Admin Dashboard

### Middleware Implementation (middleware.ts)

```typescript
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const url = request.nextUrl.clone()
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0]
  const mainDomain = process.env.MAIN_DOMAIN || 'localhost:3000'
  
  // Check if it's the main domain (super admin)
  if (hostname === mainDomain || subdomain === 'admin') {
    // Allow access to super-admin routes
    return NextResponse.next()
  }
  
  // School subdomain detected
  if (subdomain && subdomain !== 'www') {
    const response = NextResponse.next()
    
    // Set school slug in headers for server components
    response.headers.set('x-school-slug', subdomain)
    
    // Validate school exists and is active
    // (This would be done via Supabase)
    
    return response
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
```

---

## 4. Authentication Flow

### Login Process

1. User visits `cityschool.yourapp.com/login`
2. System detects subdomain → identifies school
3. User enters credentials
4. System validates:
   - User exists
   - User belongs to this school
   - School is active
   - User role has access to this school
5. Set session with school context

### Auth Provider

```typescript
// lib/auth/provider.tsx
'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface User {
  id: string
  email: string
  role: string
  schoolId: string | null
  school: School | null
}

interface School {
  id: string
  name: string
  slug: string
  logo_url: string
  settings: SchoolSettings
  modules: string[]
}

interface AuthContextType {
  user: User | null
  school: School | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  hasModule: (moduleName: string) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClientComponentClient()

  // Check if school has access to a module
  const hasModule = (moduleName: string) => {
    if (!school) return false
    return school.modules.includes(moduleName)
  }

  // ... auth methods

  return (
    <AuthContext.Provider value={{ user, school, isLoading, signIn, signOut, hasModule }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
```

---

## 5. Module Permission System

### Super Admin: Enable/Disable Modules

```typescript
// In Super Admin school edit page
const availableModules = [
  { name: 'students', label: 'Students Management', description: 'Student records, attendance' },
  { name: 'staff', label: 'Staff & HR', description: 'Staff records, payroll, leaves' },
  { name: 'fees', label: 'Fees & Finance', description: 'Fee collection, challans, reports' },
  { name: 'exams', label: 'Exams & Grades', description: 'Exams, gradebook, report cards' },
  { name: 'transport', label: 'Transport', description: 'Routes, vehicles, tracking' },
  { name: 'library', label: 'Library', description: 'Book catalog, issue/return' },
  { name: 'communications', label: 'Communications', description: 'SMS, Email, Broadcasts' },
  { name: 'admissions', label: 'Admissions', description: 'Inquiries, registrations' },
  { name: 'timetable', label: 'Timetable', description: 'Class schedules' },
  { name: 'homework', label: 'Homework & Diary', description: 'Assignments, daily diary' },
]
```

### Using Module Permissions in UI

```typescript
// In sidebar or any component
import { useAuth } from '@/lib/auth/hooks'

function Sidebar() {
  const { hasModule } = useAuth()

  return (
    <nav>
      <NavItem href="/dashboard" icon={Home}>Dashboard</NavItem>
      
      {hasModule('students') && (
        <NavItem href="/students" icon={Users}>Students</NavItem>
      )}
      
      {hasModule('fees') && (
        <NavItem href="/fees" icon={DollarSign}>Fees</NavItem>
      )}
      
      {hasModule('transport') && (
        <NavItem href="/transport" icon={Bus}>Transport</NavItem>
      )}
    </nav>
  )
}
```

---

## 6. School Branding & Settings

### School Settings Page (School Admin Only)

```typescript
// settings/page.tsx - School Admin
// Allows customization of:
// - School Logo
// - Primary/Secondary Colors
// - School Information
// - Academic Year
// - Timezone
// - Enable/Disable Features (within allowed modules)
```

### Dynamic Theming

```typescript
// Get school colors and apply to theme
function SchoolThemeProvider({ children, school }) {
  useEffect(() => {
    if (school?.settings) {
      document.documentElement.style.setProperty('--primary', school.settings.primary_color)
      document.documentElement.style.setProperty('--secondary', school.settings.secondary_color)
    }
  }, [school])

  return children
}
```

---

## 7. Deployment Options

### Option 1: Vercel (Recommended)
- Supports wildcard subdomains
- Easy to set up: `*.yourapp.com`
- Configure in Vercel Dashboard → Domains

### Option 2: Custom Server (VPS)
- Use Nginx as reverse proxy
- Configure wildcard SSL certificate
- Route all subdomains to Next.js app

### Domain Setup

```
DNS Records:
A     @              → Your Server IP
A     *.yourapp.com  → Your Server IP (wildcard)
CNAME www            → yourapp.com
```

---

## 8. Implementation Steps

### Phase 1: Database Setup
1. [ ] Create Supabase project
2. [ ] Run migrations for schools, users, modules tables
3. [ ] Set up Row Level Security (RLS) policies
4. [ ] Create initial super admin user

### Phase 2: Authentication
1. [ ] Implement login with school context
2. [ ] Create auth middleware
3. [ ] Set up session management
4. [ ] Implement role-based access control

### Phase 3: Multi-Tenancy
1. [ ] Implement subdomain detection middleware
2. [ ] Create tenant context provider
3. [ ] Update all API calls to include school_id
4. [ ] Implement data isolation

### Phase 4: Super Admin Features
1. [ ] Create school CRUD operations
2. [ ] Module permission management UI
3. [ ] Subscription management
4. [ ] School activation/suspension

### Phase 5: School Customization
1. [ ] School settings page for admins
2. [ ] Logo upload functionality
3. [ ] Theme customization
4. [ ] Branding across all pages

### Phase 6: Testing & Deployment
1. [ ] Test multi-tenant isolation
2. [ ] Set up production domain
3. [ ] Configure wildcard subdomain
4. [ ] Deploy to Vercel/VPS

---

## 9. Security Considerations

### Row Level Security (RLS) in Supabase

```sql
-- Users can only see data from their school
CREATE POLICY "Users can view own school data" ON students
    FOR SELECT
    USING (school_id = (SELECT school_id FROM users WHERE id = auth.uid()));

-- Only super admins can view all schools
CREATE POLICY "Super admins can view all schools" ON schools
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE id = auth.uid() 
            AND role = 'super_admin'
        )
    );
```

### API Security
- Always validate school_id in API routes
- Check module permissions before serving data
- Log access attempts for auditing

---

## Quick Start Commands

```bash
# 1. Install required packages
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 2. Set environment variables
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
MAIN_DOMAIN=yourapp.com

# 3. Run migrations (in Supabase SQL editor)
# Copy the SQL from Section 1

# 4. Start development
npm run dev
```

---

## Summary

This architecture allows you to:
✅ Create unlimited schools from Super Admin
✅ Give each school a unique subdomain
✅ Control which modules each school can access
✅ Isolate data between schools
✅ Let schools customize their branding
✅ Scale efficiently with a single codebase

Would you like me to start implementing any specific part of this plan?
