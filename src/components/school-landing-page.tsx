'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    GraduationCap,
    Users,
    BookOpen,
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    ArrowRight,
    CheckCircle2,
    School,
    Award,
    Clock,
    Calendar,
    Loader2,
} from 'lucide-react'

interface SchoolPortalSettings {
    hero_title: string
    hero_subtitle: string
    hero_image_url?: string
    hero_background_color: string
    logo_url?: string
    primary_color: string
    secondary_color: string
    contact_email?: string
    contact_phone?: string
    contact_address?: string
    facebook_url?: string
    instagram_url?: string
    youtube_url?: string
    whatsapp_number?: string
    show_about_section: boolean
    about_text?: string
    show_facilities_section: boolean
    show_contact_section: boolean
    announcement_text?: string
    announcement_active: boolean
}

interface School {
    id: string
    name: string
    slug: string
    logo_url?: string
    phone?: string
    email?: string
    address?: string
    city?: string
}

interface Facility {
    id: string
    title: string
    description?: string
    icon: string
    image_url?: string
}

interface SchoolLandingPageProps {
    schoolSlug: string
}

const iconMap: { [key: string]: React.ComponentType<{ className?: string; style?: React.CSSProperties }> } = {
    'graduation-cap': GraduationCap,
    'users': Users,
    'book-open': BookOpen,
    'school': School,
    'award': Award,
    'clock': Clock,
    'calendar': Calendar,
    'default': School,
}

export default function SchoolLandingPage({ schoolSlug }: SchoolLandingPageProps) {
    const [loading, setLoading] = useState(true)
    const [school, setSchool] = useState<School | null>(null)
    const [settings, setSettings] = useState<SchoolPortalSettings | null>(null)
    const [facilities, setFacilities] = useState<Facility[]>([])
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/schools/portal-settings?slug=${schoolSlug}`)
                if (!response.ok) {
                    if (response.status === 404) {
                        setError('School not found')
                    } else {
                        throw new Error('Failed to fetch')
                    }
                    return
                }
                const data = await response.json()
                setSchool(data.school)
                setSettings(data.settings)
                setFacilities(data.facilities || [])
            } catch (err) {
                console.error('Error loading school data:', err)
                setError('Unable to load school information')
            } finally {
                setLoading(false)
            }
        }

        if (schoolSlug) {
            fetchData()
        }
    }, [schoolSlug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Loading school portal...</p>
                </div>
            </div>
        )
    }

    if (error || !school) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
                <div className="text-center">
                    <School className="h-16 w-16 text-red-400 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">School Not Found</h1>
                    <p className="text-gray-600 mb-4">{error || 'The school you are looking for does not exist.'}</p>
                    <Link href="/">
                        <Button>Go to Main Site</Button>
                    </Link>
                </div>
            </div>
        )
    }

    const primaryColor = settings?.primary_color || '#3b82f6'
    const secondaryColor = settings?.secondary_color || '#06b6d4'

    return (
        <div className="min-h-screen bg-white">
            {/* Announcement Banner */}
            {settings?.announcement_active && settings?.announcement_text && (
                <div 
                    className="py-2 px-4 text-center text-white text-sm"
                    style={{ backgroundColor: primaryColor }}
                >
                    {settings.announcement_text}
                </div>
            )}

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            {settings?.logo_url || school.logo_url ? (
                                <Image
                                    src={settings?.logo_url || school.logo_url || ''}
                                    alt={school.name}
                                    width={48}
                                    height={48}
                                    className="rounded-lg"
                                />
                            ) : (
                                <div 
                                    className="h-12 w-12 rounded-lg flex items-center justify-center"
                                    style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                                >
                                    <GraduationCap className="h-7 w-7 text-white" />
                                </div>
                            )}
                            <span className="text-xl font-bold text-gray-900">{school.name}</span>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
                            <a href="#facilities" className="text-gray-600 hover:text-gray-900">Facilities</a>
                            <a href="#contact" className="text-gray-600 hover:text-gray-900">Contact</a>
                        </div>
                        <Link href={`/login?school=${schoolSlug}`}>
                            <Button 
                                style={{ background: `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})` }}
                                className="text-white border-0"
                            >
                                Login Portal
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section 
                className="relative min-h-[70vh] flex items-center"
                style={{ 
                    background: settings?.hero_image_url 
                        ? `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${settings.hero_image_url})` 
                        : `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
                }}
            >
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMXYxaC0xeiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9nPjwvc3ZnPg==')] opacity-30" />
                
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
                        {settings?.hero_title || `Welcome to ${school.name}`}
                    </h1>
                    <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto mb-8">
                        {settings?.hero_subtitle || 'Empowering minds, shaping futures'}
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <Link href={`/login?school=${schoolSlug}`}>
                            <Button size="lg" className="h-14 px-8 bg-white text-gray-900 hover:bg-gray-100">
                                Student Login
                                <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                        <Link href={`/login?school=${schoolSlug}`}>
                            <Button size="lg" variant="outline" className="h-14 px-8 border-white text-white hover:bg-white/10">
                                Parent Portal
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Quick Stats */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { icon: Users, label: 'Students', value: '500+' },
                            { icon: BookOpen, label: 'Classes', value: '25+' },
                            { icon: Award, label: 'Teachers', value: '30+' },
                            { icon: Calendar, label: 'Years', value: '10+' },
                        ].map((stat, index) => (
                            <Card key={index} className="text-center p-6">
                                <stat.icon 
                                    className="h-10 w-10 mx-auto mb-3"
                                    style={{ color: primaryColor }}
                                />
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                <p className="text-gray-500">{stat.label}</p>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            {settings?.show_about_section && (
                <section id="about" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">About Our School</h2>
                            <div className="w-20 h-1 mx-auto rounded" style={{ backgroundColor: primaryColor }} />
                        </div>
                        <div className="max-w-4xl mx-auto">
                            <p className="text-lg text-gray-600 leading-relaxed text-center">
                                {settings?.about_text || `${school.name} is committed to providing quality education and nurturing young minds. Our dedicated faculty and modern facilities ensure that every student receives the best learning experience.`}
                            </p>
                        </div>
                        <div className="mt-12 grid md:grid-cols-3 gap-8">
                            {[
                                { title: 'Quality Education', desc: 'Modern curriculum aligned with national standards' },
                                { title: 'Experienced Faculty', desc: 'Dedicated teachers with years of experience' },
                                { title: 'Modern Facilities', desc: 'Well-equipped labs, library and sports facilities' },
                            ].map((item, index) => (
                                <div key={index} className="flex items-start gap-4">
                                    <CheckCircle2 className="h-6 w-6 flex-shrink-0 mt-1" style={{ color: primaryColor }} />
                                    <div>
                                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                                        <p className="text-gray-600">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Facilities Section */}
            {settings?.show_facilities_section && facilities.length > 0 && (
                <section id="facilities" className="py-20 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Facilities</h2>
                            <div className="w-20 h-1 mx-auto rounded" style={{ backgroundColor: primaryColor }} />
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {facilities.map((facility) => {
                                const IconComponent = iconMap[facility.icon] || iconMap['default']
                                return (
                                    <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                        {facility.image_url && (
                                            <div className="h-48 bg-gray-200">
                                                <Image
                                                    src={facility.image_url}
                                                    alt={facility.title}
                                                    width={400}
                                                    height={200}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        )}
                                        <CardContent className="p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <div 
                                                    className="p-2 rounded-lg"
                                                    style={{ backgroundColor: `${primaryColor}15` }}
                                                >
                                                    <IconComponent className="h-6 w-6" style={{ color: primaryColor }} />
                                                </div>
                                                <h3 className="font-semibold text-gray-900">{facility.title}</h3>
                                            </div>
                                            {facility.description && (
                                                <p className="text-gray-600 text-sm">{facility.description}</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* Contact Section */}
            {settings?.show_contact_section && (
                <section id="contact" className="py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Contact Us</h2>
                            <div className="w-20 h-1 mx-auto rounded" style={{ backgroundColor: primaryColor }} />
                        </div>
                        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                            <Card className="p-6 text-center">
                                <Phone className="h-10 w-10 mx-auto mb-4" style={{ color: primaryColor }} />
                                <h3 className="font-semibold text-gray-900 mb-2">Phone</h3>
                                <p className="text-gray-600">{settings?.contact_phone || school.phone || 'Not available'}</p>
                            </Card>
                            <Card className="p-6 text-center">
                                <Mail className="h-10 w-10 mx-auto mb-4" style={{ color: primaryColor }} />
                                <h3 className="font-semibold text-gray-900 mb-2">Email</h3>
                                <p className="text-gray-600">{settings?.contact_email || school.email || 'Not available'}</p>
                            </Card>
                            <Card className="p-6 text-center">
                                <MapPin className="h-10 w-10 mx-auto mb-4" style={{ color: primaryColor }} />
                                <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                                <p className="text-gray-600">{settings?.contact_address || school.address || school.city || 'Not available'}</p>
                            </Card>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-12 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <GraduationCap className="h-8 w-8" />
                            <span className="text-xl font-bold">{school.name}</span>
                        </div>
                        <div className="flex gap-4">
                            {settings?.facebook_url && (
                                <a href={settings.facebook_url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
                                    <Facebook className="h-6 w-6" />
                                </a>
                            )}
                            {settings?.instagram_url && (
                                <a href={settings.instagram_url} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400">
                                    <Instagram className="h-6 w-6" />
                                </a>
                            )}
                            {settings?.youtube_url && (
                                <a href={settings.youtube_url} target="_blank" rel="noopener noreferrer" className="hover:text-red-400">
                                    <Youtube className="h-6 w-6" />
                                </a>
                            )}
                        </div>
                        <p className="text-gray-400 text-sm">
                            © {new Date().getFullYear()} {school.name}. Powered by SchoolERP.pk
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
