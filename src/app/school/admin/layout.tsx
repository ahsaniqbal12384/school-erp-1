import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function SchoolAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // In production, this would come from the authenticated user session
    const mockUser = {
        name: 'Ahmad Khan',
        email: 'admin@alnoorschool.pk',
        avatar: undefined,
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar role="school_admin" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    role="school_admin"
                    user={mockUser}
                    schoolName="Al-Noor Public School"
                />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
