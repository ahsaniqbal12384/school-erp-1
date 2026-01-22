import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function SuperAdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const mockUser = {
        name: 'System Admin',
        email: 'admin@schoolerp.pk',
        avatar: undefined,
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar role="super_admin" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header role="super_admin" user={mockUser} />
                <main className="flex-1 overflow-y-auto p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
