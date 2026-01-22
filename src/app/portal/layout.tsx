import { Sidebar } from '@/components/layout/sidebar'
import { Header } from '@/components/layout/header'

export default function ParentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const mockUser = {
        name: 'Mrs. Saima Ali',
        email: 'saima.ali@gmail.com',
        avatar: undefined,
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <Sidebar role="parent" />
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header role="parent" user={mockUser} />
                <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-20">
                    {children}
                </main>
            </div>
        </div>
    )
}
