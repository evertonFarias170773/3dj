import type { Metadata } from 'next'
import { getProdutos, getCategorias } from '@/lib/supabase/queries/produtos'
import ProdutoCard from '@/components/produtos/ProdutoCard'
import FiltrosCategorias from '@/components/busca/FiltrosCategorias'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: '3D Print Store — Destaques da Semana',
  description: 'Descubra porta copos, brinquedos, decorações e utilidades fabricados com impressão 3D de qualidade premium.',
}

interface Props {
  searchParams: Promise<{ busca?: string; categoria?: string; tag?: string }>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams
  const [produtos, categorias] = await Promise.all([
    getProdutos({
      busca: params.busca,
      categoriaSlug: params.categoria,
      tagSlug: params.tag,
    }),
    getCategorias(),
  ])

  const titulo = params.busca
    ? `Resultados para "${params.busca}"`
    : params.categoria
      ? categorias.find(c => c.slug === params.categoria)?.nome ?? 'Categoria'
      : 'Destaques da Semana'

  return (
    <main className={styles.mainArea}>
      <section className={`container ${styles.loja}`}>

        {/* Título Centralizado */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{titulo}</h2>
        </div>

        {/* Grid */}
        {produtos.length > 0 ? (
          <div className="grid-produtos animate-fadeIn">
            {produtos.map(produto => (
              <ProdutoCard key={produto.id} produto={produto} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <span>🔍</span>
            <p>Nenhum produto encontrado.</p>
            <a href="/" className="btn btn-ghost">Limpar Filtros</a>
          </div>
        )}
      </section>
    </main>
  )
}
