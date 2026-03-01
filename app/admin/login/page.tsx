'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Lock, Mail } from 'lucide-react'
import styles from './page.module.css'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [erro, setErro] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setErro('')
        setLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
            if (error) throw error
            router.push('/admin')
            router.refresh()
        } catch (err: any) {
            setErro(err.message === 'Invalid login credentials'
                ? 'E-mail ou senha inválidos.'
                : 'Erro ao fazer login. Tente novamente.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.logo}>
                    <Image src="/logo.png" alt="J3D Admin" width={140} height={45} style={{ objectFit: 'contain' }} />
                </div>
                <h1 className={styles.title}>Entrar no Painel</h1>
                <p className={styles.sub}>Área restrita — somente administradores</p>

                {erro && <div className={styles.erro}>{erro}</div>}

                <form onSubmit={handleLogin} className={styles.form}>
                    <div>
                        <label className="input-label" htmlFor="login-email">
                            <Mail size={14} /> E-mail
                        </label>
                        <input
                            id="login-email"
                            type="email"
                            className="input"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="seu@email.com"
                        />
                    </div>
                    <div>
                        <label className="input-label" htmlFor="login-senha">
                            <Lock size={14} /> Senha
                        </label>
                        <input
                            id="login-senha"
                            type="password"
                            className="input"
                            value={senha}
                            onChange={e => setSenha(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary btn-full btn-lg"
                        disabled={loading}
                        id="btn-login"
                    >
                        {loading ? 'Entrando...' : 'Entrar'}
                    </button>
                </form>
            </div>
        </div>
    )
}
