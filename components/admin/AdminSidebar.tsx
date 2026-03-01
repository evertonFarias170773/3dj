'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Package, LogOut, Printer, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import styles from './AdminSidebar.module.css'

interface Props { userEmail: string }

export default function AdminSidebar({ userEmail }: Props) {
    const pathname = usePathname()
    const router = useRouter()

    const links = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/produtos', label: 'Produtos', icon: Package },
    ]

    async function logout() {
        const supabase = createClient()
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <Printer size={22} strokeWidth={2} />
                <div>
                    <div className={styles.logoTitle}>3D Print</div>
                    <div className={styles.logoSub}>Painel Admin</div>
                </div>
            </div>

            <nav className={styles.nav}>
                {links.map(({ href, label, icon: Icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`${styles.navLink} ${pathname === href ? styles.ativo : ''}`}
                    >
                        <Icon size={18} />
                        {label}
                    </Link>
                ))}
            </nav>

            <div className={styles.bottom}>
                <a href="/" target="_blank" className={styles.viewSite}>
                    <ExternalLink size={14} /> Ver loja
                </a>
                <div className={styles.user}>
                    <span className={styles.userEmail}>{userEmail}</span>
                    <button onClick={logout} className={styles.logoutBtn} aria-label="Sair">
                        <LogOut size={16} /> Sair
                    </button>
                </div>
            </div>
        </aside>
    )
}
