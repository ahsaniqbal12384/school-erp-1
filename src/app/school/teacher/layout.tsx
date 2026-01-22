import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const mockUser = {
        name: 'Ahmad Khan',
        email: 'ahmad.khan@school.pk',
        avatar: undefined,
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar role="teacher" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header role="teacher" user={mockUser} />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20">
                    {children}
                </main>
            </div>
        </div>
    )
}
