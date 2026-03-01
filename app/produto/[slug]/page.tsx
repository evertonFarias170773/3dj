import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProdutoBySlug, getProdutosRelacionados } from '@/lib/supabase/queries/produtos'
import ProdutoDetalheClient from '@/components/produtos/ProdutoDetalheClient'
import ProdutoCard from '@/components/produtos/ProdutoCard'
import styles from './page.module.css'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const produto = await getProdutoBySlug(slug)
    if (!produto) return { title: 'Produto não encontrado' }
    return {
        title: produto.nome,
        description: produto.descricao_curta ?? produto.descricao ?? undefined,
    }
}

export default async function ProdutoPage({ params }: Props) {
    const { slug } = await params
    const produto = await getProdutoBySlug(slug)
    if (!produto) notFound()

    const relacionados = await getProdutosRelacionados(produto.id, produto.categoria_id)

    return (
        <div className={styles.wrap}>
            {/* Breadcrumb */}
            <nav className={`container ${styles.breadcrumb}`} aria-label="Navegação estrutural">
                <a href="/">Home</a>
                <span>›</span>
                {produto.categorias && <a href={`/?categoria=${produto.categorias.slug}`}>{produto.categorias.nome}</a>}
                {produto.categorias && <span>›</span>}
                <span>{produto.nome}</span>
            </nav>

            {/* Detalhe principal */}
            <div className="container">
                <ProdutoDetalheClient produto={produto} />
            </div>

            {/* Relacionados */}
            {relacionados.length > 0 && (
                <section className={`container ${styles.relacionados}`}>
                    <h2 className={styles.relTitle}>Você também pode gostar</h2>
                    <div className="grid-produtos">
                        {relacionados.map(p => <ProdutoCard key={p.id} produto={p} />)}
                    </div>
                </section>
            )}
        </div>
    )
}
