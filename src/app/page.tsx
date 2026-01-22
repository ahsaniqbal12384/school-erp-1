import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  GraduationCap,
  Users,
  DollarSign,
  ClipboardList,
  Bus,
  BookOpen,
  Shield,
  Smartphone,
  BarChart3,
  Globe,
  CheckCircle2,
  ArrowRight,
  Star,
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        {/* Navigation */}
        <nav className="relative z-10 flex items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">SchoolERP.pk</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-white hover:bg-white/10">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-white text-primary hover:bg-white/90">
                Get Started Free
              </Button>
            </Link>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-7xl px-6 py-24 lg:px-12 lg:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span>Trusted by 500+ Pakistani Schools</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Complete School Management
                <span className="block text-white/80">Made Simple</span>
              </h1>
              <p className="max-w-lg text-lg text-white/70">
                A powerful, all-in-one ERP designed specifically for Pakistani schools.
                Manage admissions, fees, attendance, exams, transport, library - everything in one place.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <div className="absolute -inset-4 rounded-2xl bg-white/10 backdrop-blur" />
              <div className="relative rounded-xl bg-white/5 p-2 shadow-2xl">
                <div className="rounded-lg bg-background p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-amber-500" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500" />
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 rounded bg-muted animate-pulse" />
                    <div className="grid grid-cols-4 gap-2">
                      <div className="h-20 rounded bg-primary/10 animate-pulse" />
                      <div className="h-20 rounded bg-emerald-500/10 animate-pulse" />
                      <div className="h-20 rounded bg-amber-500/10 animate-pulse" />
                      <div className="h-20 rounded bg-blue-500/10 animate-pulse" />
                    </div>
                    <div className="h-40 rounded bg-muted animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything You Need to Run Your School
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive modules designed for Pakistani schools
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="stat-card border-0 shadow-md">
                <CardHeader>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${feature.bgColor}`}>
                    <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle className="mt-4">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {feature.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
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

      {/* Pakistani Localization Section */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Built for Pakistani Schools
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Unlike generic solutions, our ERP is tailored specifically for the Pakistani education system.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Globe className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Urdu Support</h3>
                    <p className="text-muted-foreground">Full Urdu language support for reports and communications</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">PKR Currency & EOBI</h3>
                    <p className="text-muted-foreground">Pakistani Rupee with EOBI and tax calculations for payroll</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <ClipboardList className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Matric & Cambridge Grading</h3>
                    <p className="text-muted-foreground">Support for both Matric (A+, A, B...) and Cambridge (A*, A, B...) grading systems</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">JazzCash & EasyPaisa</h3>
                    <p className="text-muted-foreground">Integrated payment support for Pakistani payment methods</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 p-8">
                <div className="h-full w-full rounded-xl bg-white dark:bg-gray-900 shadow-xl p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Fee Invoice</span>
                      <span className="text-xs text-muted-foreground">Jan 2025</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Tuition Fee</span>
                        <span className="font-medium">Rs. 8,500</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Transport Fee</span>
                        <span className="font-medium">Rs. 3,000</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Lab Fee</span>
                        <span className="font-medium">Rs. 500</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-primary">Rs. 12,000</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1 rounded-lg bg-emerald-500/10 p-2 text-center text-xs text-emerald-600">
                        JazzCash
                      </div>
                      <div className="flex-1 rounded-lg bg-blue-500/10 p-2 text-center text-xs text-blue-600">
                        EasyPaisa
                      </div>
                      <div className="flex-1 rounded-lg bg-purple-500/10 p-2 text-center text-xs text-purple-600">
                        Bank
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Choose the plan that fits your school's size
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">Rs. {plan.price.toLocaleString()}</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? 'default' : 'outline'}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to Transform Your School?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join hundreds of Pakistani schools already using our platform
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="btn-premium text-white">
                Start Free 14-Day Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">SchoolERP.pk</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 SchoolERP.pk. Made with ❤️ for Pakistani Schools
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    title: 'Admissions CRM',
    description: 'Track inquiries, registrations, and convert leads to students',
    icon: Users,
    iconColor: 'text-primary',
    bgColor: 'bg-primary/10',
    items: ['Lead tracking from Facebook, Google, etc.', 'Registration management', 'Admission test scheduling'],
  },
  {
    title: 'Fee Management',
    description: 'Complete fee collection and invoicing system',
    icon: DollarSign,
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-500/10',
    items: ['Bulk invoice generation', 'JazzCash & EasyPaisa integration', 'Defaults & overdue tracking'],
  },
  {
    title: 'Student Attendance',
    description: 'Digital attendance with real-time parent notifications',
    icon: ClipboardList,
    iconColor: 'text-blue-600',
    bgColor: 'bg-blue-500/10',
    items: ['Class-wise marking', 'Absence alerts to parents', 'Monthly attendance reports'],
  },
  {
    title: 'HR & Payroll',
    description: 'Staff management with EOBI-compliant payroll',
    icon: Users,
    iconColor: 'text-purple-600',
    bgColor: 'bg-purple-500/10',
    items: ['Salary slip generation', 'EOBI & tax deductions', 'Leave management'],
  },
  {
    title: 'Transport',
    description: 'Vehicle and route management for school transport',
    icon: Bus,
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-500/10',
    items: ['Route planning', 'Student assignment', 'Transport fee tracking'],
  },
  {
    title: 'Library',
    description: 'Complete library management with fine calculation',
    icon: BookOpen,
    iconColor: 'text-red-600',
    bgColor: 'bg-red-500/10',
    items: ['Book catalog', 'Issue/return tracking', 'Automatic fine calculation'],
  },
]

const plans = [
  {
    name: 'Basic',
    description: 'For small schools up to 200 students',
    price: 5000,
    popular: false,
    features: [
      'Up to 200 students',
      'Basic modules',
      'Email support',
      'Mobile access',
    ],
  },
  {
    name: 'Standard',
    description: 'For medium schools up to 500 students',
    price: 10000,
    popular: true,
    features: [
      'Up to 500 students',
      'All modules included',
      'WhatsApp integration',
      'Priority support',
      'Custom reports',
    ],
  },
  {
    name: 'Premium',
    description: 'For large schools with unlimited students',
    price: 20000,
    popular: false,
    features: [
      'Unlimited students',
      'All modules + customization',
      'Dedicated support',
      'API access',
      'White-label options',
    ],
  },
]
