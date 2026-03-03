'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Categoria } from '@/lib/types/database'
import FormCategoria from './FormCategoria'
import styles from './AdminProdutosClient.module.css'

interface Props {
    categoriasIniciais: Categoria[]
}

export default function AdminCategoriasClient({ categoriasIniciais }: Props) {
    const [categorias, setCategorias] = useState(categoriasIniciais)
    const [busca, setBusca] = useState('')
    const [formAberto, setFormAberto] = useState(false)
    const [categoriaEditando, setCategoriaEditando] = useState<Categoria | null>(null)
    const supabase = createClient()

    const categoriasFiltradas = categorias.filter(c =>
        c.nome.toLowerCase().includes(busca.toLowerCase())
    )

    async function toggleAtivo(categoria: Categoria) {
        const { data } = await supabase
            .from('categorias')
            .update({ ativo: !categoria.ativo })
            .eq('id', categoria.id)
            .select()
            .single()
        if (data) setCategorias(cs => cs.map(c => c.id === categoria.id ? data : c))
    }

    async function excluirCategoria(id: string) {
        if (!confirm('Tem certeza que deseja excluir esta categoria? Os produtos associados ficarão sem categoria.')) return

        await supabase.from('produtos').update({ categoria_id: null }).eq('categoria_id', id)
        await supabase.from('categorias').delete().eq('id', id)

        setCategorias(cs => cs.filter(c => c.id !== id))
    }

    function editarCategoria(categoria: Categoria) {
        setCategoriaEditando(categoria)
        setFormAberto(true)
    }

    function novaCategoria() {
        setCategoriaEditando(null)
        setFormAberto(true)
    }

    function onSucesso(categoria: Categoria) {
        if (categoriaEditando) {
            setCategorias(cs => cs.map(c => c.id === categoria.id ? categoria : c))
        } else {
            setCategorias(cs => [categoria, ...cs])
        }
        setFormAberto(false)
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Categorias</h1>
                    <p className={styles.sub}>{categorias.length} categoria{categorias.length !== 1 ? 's' : ''} cadastrada{categorias.length !== 1 ? 's' : ''}</p>
                </div>
                <button className="btn btn-primary" onClick={novaCategoria}>
                    <Plus size={18} /> Nova Categoria
                </button>
            </div>

            <div className={styles.buscaWrap}>
                <Search size={16} className={styles.buscaIcon} />
                <input
                    type="search"
                    className="input"
                    placeholder="Buscar categorias..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                />
            </div>

            <div className={styles.tableWrap}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Slug</th>
                            <th>Status</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriasFiltradas.length === 0 && (
                            <tr><td colSpan={4} className={styles.empty}>Nenhuma categoria encontrada.</td></tr>
                        )}
                        {categoriasFiltradas.map(categoria => (
                            <tr key={categoria.id} className={styles.row}>
                                <td className={styles.td}><strong>{categoria.nome}</strong></td>
                                <td className={styles.td}>{categoria.slug}</td>
                                <td className={styles.td}>
                                    <button
                                        onClick={() => toggleAtivo(categoria)}
                                        className={`badge ${categoria.ativo ? 'badge-primary' : ''}`}
                                        style={!categoria.ativo ? { background: 'rgba(239,68,68,0.1)', color: 'var(--color-error)', border: '1px solid rgba(239,68,68,0.3)' } : {}}
                                    >
                                        {categoria.ativo ? 'Ativo' : 'Inativo'}
                                    </button>
                                </td>
                                <td className={styles.td}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => editarCategoria(categoria)} className="btn btn-ghost btn-sm">
                                            <Edit2 size={14} /> Editar
                                        </button>
                                        <button onClick={() => excluirCategoria(categoria.id!)} className="btn btn-danger btn-sm">
                                            <Trash2 size={14} /> Excluir
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {formAberto && (
                <FormCategoria
                    categoria={categoriaEditando}
                    onFechar={() => setFormAberto(false)}
                    onSucesso={onSucesso}
                />
            )}
        </div>
    )
}
