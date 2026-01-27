import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import HomePageWrapper from '@/components/home-page-wrapper'
import {
  GraduationCap,
  Users,
  DollarSign,
  ClipboardList,
  Bus,
  BookOpen,
  Shield,
  Smartphone,
  Globe,
  CheckCircle2,
  ArrowRight,
  Star,
  Zap,
  Clock,
  BarChart3,
  Bell,
  Lock,
  Sparkles,
  Play,
} from 'lucide-react'

export default function HomePage() {
  return (
    <HomePageWrapper>
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Hero Section */}
      <header className="relative min-h-screen flex flex-col">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" />
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-50" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 shadow-lg shadow-purple-500/30">
              <GraduationCap className="h-7 w-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">SchoolERP.pk</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-white/70 hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="text-white/70 hover:text-white transition-colors">Pricing</a>
            <a href="#about" className="text-white/70 hover:text-white transition-colors">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/login">
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0 hover:opacity-90 shadow-lg shadow-purple-500/30">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center">
          <div className="mx-auto max-w-7xl px-6 lg:px-12 py-20">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur border border-white/10">
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                  <span>Pakistan&apos;s #1 School Management Platform</span>
                </div>

                <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
                  <span className="block">Smart School</span>
                  <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    Management
                  </span>
                </h1>

                <p className="max-w-lg text-xl text-white/70 leading-relaxed">
                  Streamline admissions, automate fees, track attendance, manage exams —
                  all in one powerful platform designed for Pakistani schools.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link href="/login">
                    <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-500 to-cyan-500 text-white border-0 hover:opacity-90 text-lg font-semibold shadow-xl shadow-purple-500/30">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/10 text-lg">
                    <Play className="mr-2 h-5 w-5" />
                    Watch Demo
                  </Button>
                </div>

                <div className="flex flex-wrap items-center gap-6 pt-4">
                  <div className="flex items-center gap-2 text-white/60">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Free 14-day trial</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>No credit card required</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    <span>Cancel anytime</span>
                  </div>
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="relative hidden lg:block">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 blur-2xl" />
                <div className="relative rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-3 shadow-2xl">
                  <div className="rounded-xl bg-slate-900/90 backdrop-blur overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
                      <div className="h-3 w-3 rounded-full bg-red-500" />
                      <div className="h-3 w-3 rounded-full bg-amber-500" />
                      <div className="h-3 w-3 rounded-full bg-emerald-500" />
                      <span className="ml-2 text-xs text-white/50">dashboard.schoolerp.pk</span>
                    </div>
                    <div className="p-4 space-y-4">
                      {/* Stats Row */}
                      <div className="grid grid-cols-4 gap-3">
                        <div className="rounded-lg bg-purple-500/20 p-3 text-center">
                          <div className="text-2xl font-bold text-white">1,234</div>
                          <div className="text-xs text-purple-300">Students</div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/20 p-3 text-center">
                          <div className="text-2xl font-bold text-white">98%</div>
                          <div className="text-xs text-emerald-300">Attendance</div>
                        </div>
                        <div className="rounded-lg bg-cyan-500/20 p-3 text-center">
                          <div className="text-2xl font-bold text-white">85</div>
                          <div className="text-xs text-cyan-300">Staff</div>
                        </div>
                        <div className="rounded-lg bg-amber-500/20 p-3 text-center">
                          <div className="text-2xl font-bold text-white">₨5.2M</div>
                          <div className="text-xs text-amber-300">Collected</div>
                        </div>
                      </div>
                      {/* Chart Placeholder */}
                      <div className="rounded-lg bg-white/5 p-4 h-32 flex items-end gap-1">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                          <div key={i} className="flex-1 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                      {/* Recent Activity */}
                      <div className="space-y-2">
                        <div className="text-xs text-white/50 uppercase tracking-wider">Recent Activity</div>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                          <div className="h-8 w-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                          </div>
                          <div className="flex-1">
                            <div className="text-sm text-white">Fee payment received</div>
                            <div className="text-xs text-white/50">Ahmad Khan - Class 8A</div>
                          </div>
                          <div className="text-xs text-emerald-400">Rs. 12,000</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trusted By */}
        <div className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur">
          <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12">
            <div className="flex flex-wrap items-center justify-center gap-8 text-white/40">
              <span className="text-sm font-medium">Trusted by 500+ Pakistani Schools</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}
                <span className="ml-2 text-sm">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 dark:bg-purple-900/30 px-4 py-2 text-sm text-purple-600 dark:text-purple-400 mb-4">
              <Zap className="h-4 w-4" />
              <span>Powerful Features</span>
            </div>
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Everything Your School Needs
            </h2>
            <p className="mt-4 text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive modules designed specifically for Pakistani schools
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-800"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${feature.bgColor} blur-3xl opacity-30 group-hover:opacity-50 transition-opacity`} />
                <CardHeader className="relative">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} shadow-lg group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="relative">
                  <ul className="space-y-3">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 bg-gradient-to-br from-purple-900 via-slate-900 to-cyan-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIvPjwvZz48L3N2Zz4=')] opacity-50" />

        <div className="relative mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Built for Pakistani Schools
            </h2>
            <p className="mt-4 text-xl text-white/70 max-w-2xl mx-auto">
              Unlike generic solutions, our ERP is tailored specifically for the Pakistani education system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Globe, title: 'Urdu Support', desc: 'Full Urdu language for reports & communications', color: 'from-purple-400 to-purple-600' },
              { icon: DollarSign, title: 'PKR & EOBI', desc: 'Pakistani Rupee with EOBI & tax compliance', color: 'from-emerald-400 to-emerald-600' },
              { icon: ClipboardList, title: 'Matric & Cambridge', desc: 'Both grading systems fully supported', color: 'from-cyan-400 to-cyan-600' },
              { icon: Smartphone, title: 'JazzCash & EasyPaisa', desc: 'Integrated Pakistani payment methods', color: 'from-amber-400 to-amber-600' },
            ].map((item) => (
              <div key={item.title} className="group p-6 rounded-2xl bg-white/5 backdrop-blur border border-white/10 hover:bg-white/10 transition-all">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <item.icon className="h-7 w-7 text-white" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Schools', icon: GraduationCap },
              { value: '50,000+', label: 'Students', icon: Users },
              { value: '99.9%', label: 'Uptime', icon: Zap },
              { value: '24/7', label: 'Support', icon: Clock },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 dark:from-purple-900/30 dark:to-cyan-900/30 mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 relative">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative mx-auto max-w-4xl px-6 lg:px-12 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Ready to Transform Your School?
          </h2>
          <p className="mt-4 text-xl text-white/80">
            Join hundreds of Pakistani schools already using our platform
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="h-14 px-8 bg-white text-purple-600 hover:bg-white/90 text-lg font-semibold shadow-xl">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="h-14 px-8 border-white text-white hover:bg-white/10 text-lg">
              Schedule a Demo
            </Button>
          </div>
          <p className="mt-6 text-white/60 text-sm">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <span className="text-xl font-bold">SchoolERP.pk</span>
              </div>
              <p className="text-white/60">
                Pakistan&apos;s most advanced school management platform.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-white/60">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © 2025 SchoolERP.pk. Made with ❤️ for Pakistani Schools
            </p>
            <div className="flex items-center gap-4 text-white/60">
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </HomePageWrapper>
  )
}

const features = [
  {
    title: 'Admissions CRM',
    description: 'Track inquiries, registrations, and convert leads to students',
    icon: Users,
    iconColor: 'text-white',
    bgColor: 'bg-gradient-to-br from-purple-500 to-purple-600',
    items: ['Lead tracking from Facebook, Google', 'Registration management', 'Admission test scheduling'],
  },
  {
    title: 'Fee Management',
    description: 'Complete fee collection and invoicing system',
    icon: DollarSign,
    iconColor: 'text-white',
    bgColor: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    items: ['Bulk invoice generation', 'JazzCash & EasyPaisa integration', 'Defaults & overdue tracking'],
  },
  {
    title: 'Attendance System',
    description: 'Digital attendance with real-time parent notifications',
    icon: ClipboardList,
    iconColor: 'text-white',
    bgColor: 'bg-gradient-to-br from-blue-500 to-blue-600',
    items: ['Class-wise marking', 'Absence alerts to parents', 'Monthly attendance reports'],
  },
  {
    title: 'HR & Payroll',
    description: 'Staff management with EOBI-compliant payroll',
    icon: Shield,
    iconColor: 'text-white',
    bgColor: 'bg-gradient-to-br from-violet-500 to-violet-600',
    items: ['Salary slip generation', 'EOBI & tax deductions', 'Leave management'],
  },
  {
    title: 'Transport Management',
    description: 'Vehicle and route management for school transport',
    icon: Bus,
    iconColor: 'text-white',
    bgColor: 'bg-gradient-to-br from-amber-500 to-amber-600',
    items: ['Route planning', 'Student assignment', 'Transport fee tracking'],
  },
  {
    title: 'Library System',
    description: 'Complete library management with fine calculation',
    icon: BookOpen,
    iconColor: 'text-white',
    bgColor: 'bg-gradient-to-br from-rose-500 to-rose-600',
    items: ['Book catalog', 'Issue/return tracking', 'Automatic fine calculation'],
  },
]
