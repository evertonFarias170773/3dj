'use client'
import Link from 'next/link'
import { Categoria } from '@/lib/types/database'
import styles from './FiltrosCategorias.module.css'

interface Props {
    categorias: Categoria[]
    ativa?: string
}

export default function FiltrosCategorias({ categorias, ativa }: Props) {
    if (!categorias.length) return null
    return (
        <nav className={styles.filtros} aria-label="Filtros por categoria">
            <Link href="/" className={`${styles.chip} ${!ativa ? styles.ativo : ''}`}>
                Todos
            </Link>
            {categorias.map(cat => (
                <Link
                    key={cat.id}
                    href={`/?categoria=${cat.slug}`}
                    className={`${styles.chip} ${ativa === cat.slug ? styles.ativo : ''}`}
                >
                    {cat.icone && <span>{cat.icone}</span>}
                    {cat.nome}
                </Link>
            ))}
        </nav>
    )
}
