import { createClient } from '@/lib/supabase/server'
import AdminSidebar from '@/components/admin/AdminSidebar'
import styles from './layout.module.css'
import { headers } from 'next/headers'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const headersList = await headers()
    const pathname = headersList.get('x-invoke-path') ?? ''

    // Página de login não usa sidebar
    const isLoginPage = pathname === '/admin/login' || pathname === ''

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Se é a página de login, renderiza clean
    if (!user) {
        return <>{children}</>
    }

    return (
        <div className={styles.wrap}>
            <AdminSidebar userEmail={user?.email ?? ''} />
            <main className={styles.main}>{children}</main>
        </div>
    )
}
