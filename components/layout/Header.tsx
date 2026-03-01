'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, Search, User } from 'lucide-react'
import { useState, useRef } from 'react'
import { useCarrinho } from '@/lib/hooks/useCarrinho'
import styles from './Header.module.css'
import { useRouter } from 'next/navigation'

export default function Header() {
    const { totalItens } = useCarrinho()
    const [menuOpen, setMenuOpen] = useState(false)
    const [busca, setBusca] = useState('')
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)

    function handleBusca(e: React.FormEvent) {
        e.preventDefault()
        if (busca.trim()) router.push(`/?busca=${encodeURIComponent(busca.trim())}`)
    }

    return (
        <header className={styles.header}>
            <div className={styles.topBar}>
                <div className={`container ${styles.inner}`}>

                    {/* Botão Menu Mobile */}
                    <button className={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo J3D */}
                    <Link href="/" className={styles.logo}>
                        <Image src="/logo.png" alt="J3D Store Logo" width={165} height={52} priority style={{ objectFit: 'contain' }} />
                    </Link>

                    {/* Busca Desk */}
                    <form className={styles.searchForm} onSubmit={handleBusca}>
                        <input
                            ref={inputRef}
                            type="search"
                            placeholder="O que você está buscando?"
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                            className={styles.searchInput}
                        />
                        <button type="submit" className={styles.searchBtn}>
                            <Search size={20} />
                        </button>
                    </form>

                    {/* Ações */}
                    <div className={styles.actions}>
                        <Link href="/admin/login" className={styles.loginArea}>
                            <User size={24} className={styles.loginIcon} />
                            <div className={styles.loginText}>
                                <span className={styles.loginBold}>Olá! Faça login</span>
                                <span className={styles.loginSmall}>Ou cadastre-se</span>
                            </div>
                        </Link>

                        <Link href="/carrinho" className={styles.cartBtn} aria-label="Carrinho">
                            <div className={styles.cartIconWrapper}>
                                <ShoppingCart size={24} />
                                {totalItens > 0 && <span className={styles.cartBadge}>{totalItens}</span>}
                            </div>
                            <span className={styles.cartText}>Meu carrinho</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Barra de Navegação Desk */}
            <nav className={styles.navBar}>
                <Link href="/?categoria=porta-copos" className={styles.navLink}>Porta Copos</Link>
                <Link href="/?categoria=brinquedos" className={styles.navLink}>Brinquedos</Link>
                <Link href="/?categoria=decoracao" className={styles.navLink}>Decoração</Link>
                <Link href="/?categoria=utilidades" className={styles.navLink}>Utilidades</Link>
            </nav>

            {/* Mobile Menu Dropdown */}
            {menuOpen && (
                <div style={{ padding: '16px', borderTop: '1px solid #E5E7EB', background: '#fff' }}>
                    <form onSubmit={handleBusca} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                        <input
                            type="search"
                            placeholder="Buscar..."
                            value={busca}
                            onChange={e => setBusca(e.target.value)}
                            style={{ flex: 1, padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                        />
                        <button type="submit" style={{ padding: '8px', background: '#FBC02D', border: 'none', borderRadius: '4px' }}>
                            <Search size={20} />
                        </button>
                    </form>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link href="/?categoria=porta-copos" onClick={() => setMenuOpen(false)}>Porta Copos</Link>
                        <Link href="/?categoria=brinquedos" onClick={() => setMenuOpen(false)}>Brinquedos</Link>
                        <Link href="/?categoria=decoracao" onClick={() => setMenuOpen(false)}>Decoração</Link>
                        <Link href="/?categoria=utilidades" onClick={() => setMenuOpen(false)}>Utilidades</Link>
                        <hr style={{ borderColor: '#eee' }} />
                        <Link href="/admin/login" onClick={() => setMenuOpen(false)}>Fazer Login / Painel</Link>
                    </div>
                </div>
            )}
        </header>
    )
}
