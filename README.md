# 🎓 School ERP - Complete School Management System

A modern, multi-tenant School ERP (Enterprise Resource Planning) system built with Next.js 14, Supabase, and Tailwind CSS.

![School ERP Dashboard](https://via.placeholder.com/800x400?text=School+ERP+Dashboard)

## ✨ Features

### Multi-Tenant Architecture
- 🏫 **Multiple Schools** - Each school gets their own subdomain
- 🔐 **Data Isolation** - Complete data separation between schools
- 🎨 **Custom Branding** - Each school can customize logo, colors
- 🛡️ **Module Control** - Super Admin controls which modules each school can access

### Modules

| Module | Features |
|--------|----------|
| **👨‍🎓 Students** | Enrollment, profiles, attendance, class management |
| **👨‍🏫 Staff & HR** | Employee records, payroll, leaves, attendance |
| **💰 Fees & Finance** | Fee collection, challans, reports, expenses |
| **📝 Exams** | Exam scheduling, grading, report cards |
| **🚌 Transport** | Routes, vehicles, drivers, live tracking |
| **📚 Library** | Book catalog, issue/return, fines |
| **📣 Communications** | SMS, Email, announcements |
| **📥 Admissions** | Inquiries, applications, registrations |
| **📅 Timetable** | Class schedules, teacher assignments |
| **📖 Homework** | Assignments, submissions, diary |

### User Roles

- **Super Admin** - Manages all schools, subscriptions, billing
- **School Admin** - Full school management
- **Teacher** - Classes, attendance, gradebook
- **Parent/Student** - Portal access for fees, results, homework
- **Accountant** - Financial management
- **Librarian** - Library operations
- **Transport Manager** - Fleet management

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account (free tier available)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/school-erp.git
cd school-erp

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Add your Supabase credentials to .env.local

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the app.

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@erp.pk | admin123 |
| School Admin | admin@school.pk | password123 |
| Teacher | teacher@school.pk | password123 |
| Parent | parent@school.pk | password123 |

## 📁 Project Structure

```
school-erp/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── login/              # Authentication
│   │   ├── super-admin/        # Super Admin dashboard
│   │   ├── school/             # School modules
│   │   │   ├── admin/          # School Admin pages
│   │   │   ├── teacher/        # Teacher pages
│   │   │   ├── accountant/     # Accountant pages
│   │   │   ├── librarian/      # Librarian pages
│   │   │   └── transport/      # Transport pages
│   │   └── portal/             # Parent/Student portal
│   │
│   ├── components/             # React components
│   │   ├── ui/                 # UI primitives (shadcn/ui)
│   │   └── layout/             # Layout components
│   │
│   ├── lib/                    # Utilities
│   │   ├── supabase/           # Database client
│   │   ├── auth/               # Authentication
│   │   └── tenant/             # Multi-tenant context
│   │
│   └── types/                  # TypeScript types
│
├── supabase/
│   └── migrations/             # Database migrations
│
├── public/                     # Static files
├── DEPLOYMENT_GUIDE.md         # Deployment instructions
└── README.md
```

## 🗄️ Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Run the migration:
   - Go to SQL Editor in Supabase Dashboard
   - Copy `supabase/migrations/001_multi_tenant_schema.sql`
   - Execute the SQL

3. Add your credentials to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

## 🌐 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/school-erp)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Configure custom domain with wildcard (`*.yourapp.com`)

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_MAIN_DOMAIN` | Your domain (e.g., yourapp.com) | ✅ |

### Subdomain Routing

Each school gets a unique subdomain:
- `citygrammar.yourapp.com` → City Grammar School
- `beacon.yourapp.com` → Beacon Academy
- `yourapp.com` → Super Admin Dashboard

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://radix-ui.com/)
- **Icons**: [Lucide Icons](https://lucide.dev/)
- **Deployment**: [Vercel](https://vercel.com/)

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- [Multi-Tenant Architecture](./.agent/artifacts/MULTI_TENANT_IMPLEMENTATION.md)
- [API Documentation](./docs/api.md) _(coming soon)_

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 📞 Support

- 📧 Email: support@yourapp.com
- 💬 Discord: [Join our community](https://discord.gg/your-server)
- 📚 Docs: [docs.yourapp.com](https://docs.yourapp.com)

---

Made with ❤️ for Pakistani Schools
