'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Eye, EyeOff, Star, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Categoria, Tag } from '@/lib/types/database'
import { formatBRL } from '@/lib/utils/formatters'
import FormProduto from './FormProduto'
import styles from './AdminProdutosClient.module.css'

interface Props {
    produtosIniciais: any[]
    categorias: Categoria[]
    tags: Tag[]
}

export default function AdminProdutosClient({ produtosIniciais, categorias, tags }: Props) {
    const [produtos, setProdutos] = useState(produtosIniciais)
    const [busca, setBusca] = useState('')
    const [formAberto, setFormAberto] = useState(false)
    const [produtoEditando, setProdutoEditando] = useState<any | null>(null)
    const supabase = createClient()

    const produtosFiltrados = produtos.filter(p =>
        p.nome.toLowerCase().includes(busca.toLowerCase())
    )

    async function toggleAtivo(produto: any) {
        const { data } = await supabase
            .from('produtos')
            .update({ ativo: !produto.ativo })
            .eq('id', produto.id)
            .select()
            .single()
        if (data) setProdutos(ps => ps.map(p => p.id === produto.id ? { ...p, ativo: data.ativo } : p))
    }

    async function toggleDestaque(produto: any) {
        const { data } = await supabase
            .from('produtos')
            .update({ destaque: !produto.destaque })
            .eq('id', produto.id)
            .select()
            .single()
        if (data) setProdutos(ps => ps.map(p => p.id === produto.id ? { ...p, destaque: data.destaque } : p))
    }

    function editarProduto(produto: any) {
        setProdutoEditando(produto)
        setFormAberto(true)
    }

    function novoProduto() {
        setProdutoEditando(null)
        setFormAberto(true)
    }

    function onSucesso(produto: any) {
        if (produtoEditando) {
            setProdutos(ps => ps.map(p => p.id === produto.id ? produto : p))
        } else {
            setProdutos(ps => [produto, ...ps])
        }
        setFormAberto(false)
    }

    return (
        <div className={styles.page}>
            {/* Header */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Produtos</h1>
                    <p className={styles.sub}>{produtos.length} produto{produtos.length !== 1 ? 's' : ''} cadastrado{produtos.length !== 1 ? 's' : ''}</p>
                </div>
                <button className="btn btn-primary" onClick={novoProduto} id="btn-novo-produto">
                    <Plus size={18} /> Novo Produto
                </button>
            </div>

            {/* Busca */}
            <div className={styles.buscaWrap}>
                <Search size={16} className={styles.buscaIcon} />
                <input
                    type="search"
                    className="input"
                    placeholder="Buscar produtos..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    id="admin-busca-produtos"
                />
            </div>

            {/* Tabela */}
            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Produto</th>
                            <th>Categoria</th>
                            <th>Preço Base</th>
                            <th>Setup</th>
                            <th>Cores</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosFiltrados.length === 0 && (
                            <tr><td colSpan={7} className={styles.empty}>Nenhum produto encontrado.</td></tr>
                        )}
                        {produtosFiltrados.map(produto => {
                            const img = produto.produto_imagens?.find((i: any) => i.principal) ?? produto.produto_imagens?.[0]
                            return (
                                <tr key={produto.id} className={styles.row}>
                                    <td>
                                        <div className={styles.prodInfo}>
                                            <div className={styles.thumb}>
                                                {img
                                                    ? <img src={img.url} alt={produto.nome} width={44} height={44} style={{ borderRadius: 6, objectFit: 'cover' }} />
                                                    : <span>🖨️</span>
                                                }
                                            </div>
                                            <div>
                                                <div className={styles.prodNome}>{produto.nome}</div>
                                                <div className={styles.prodSlug}>{produto.slug}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={styles.td}>{produto.categorias?.nome ?? '—'}</td>
                                    <td className={styles.td}>{formatBRL(produto.preco_base)}</td>
                                    <td className={styles.td}>{produto.setup_valor > 0 ? formatBRL(produto.setup_valor) : '—'}</td>
                                    <td className={styles.td}>
                                        <div className={styles.coresMini}>
                                            {produto.produto_cores?.slice(0, 4).map((c: any) => (
                                                <span key={c.id} style={{ width: 12, height: 12, borderRadius: '50%', background: c.hex, display: 'inline-block', border: '1px solid rgba(255,255,255,0.2)' }} />
                                            ))}
                                            {(produto.produto_cores?.length ?? 0) > 4 && <span style={{ fontSize: 10, color: 'var(--color-text-secondary)' }}>+{produto.produto_cores.length - 4}</span>}
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.statusBtns}>
                                            <button
                                                onClick={() => toggleAtivo(produto)}
                                                className={`badge ${produto.ativo ? 'badge-primary' : ''}`}
                                                style={!produto.ativo ? { background: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.3)' } : {}}
                                                title={produto.ativo ? 'Ativo — clique para desativar' : 'Inativo — clique para ativar'}
                                            >
                                                {produto.ativo ? <Eye size={12} /> : <EyeOff size={12} />}
                                                {produto.ativo ? 'Ativo' : 'Inativo'}
                                            </button>
                                            <button
                                                onClick={() => toggleDestaque(produto)}
                                                className={`badge ${produto.destaque ? 'badge-accent' : ''}`}
                                                style={!produto.destaque ? { background: 'var(--color-surface-alt)', color: 'var(--color-text-disabled)', border: '1px solid var(--color-border)' } : {}}
                                                title="Destaque"
                                            >
                                                <Star size={12} /> Destaque
                                            </button>
                                        </div>
                                    </td>
                                    <td className={styles.td}>
                                        <button onClick={() => editarProduto(produto)} className="btn btn-ghost btn-sm" id={`btn-editar-${produto.id}`}>
                                            <Edit2 size={14} /> Editar
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal de formulário */}
            {formAberto && (
                <FormProduto
                    produto={produtoEditando}
                    categorias={categorias}
                    tags={tags}
                    onFechar={() => setFormAberto(false)}
                    onSucesso={onSucesso}
                />
            )}
        </div>
    )
}
