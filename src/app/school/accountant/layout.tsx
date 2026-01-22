import { Sidebar } from '@/components/layout/sidebar'

export default function AccountantLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen">
            <Sidebar role="accountant" />
            <main className="flex-1 p-6 lg:p-8 ml-64">
                {children}
            </main>
        </div>
    )
}
