'use client'

import { useState } from 'react'
import { Plus, Search, Edit2, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Tag } from '@/lib/types/database'
import FormTag from './FormTag'
import styles from './AdminProdutosClient.module.css'

interface Props {
    tagsIniciais: Tag[]
}

export default function AdminTagsClient({ tagsIniciais }: Props) {
    const [tags, setTags] = useState(tagsIniciais)
    const [busca, setBusca] = useState('')
    const [formAberto, setFormAberto] = useState(false)
    const [tagEditando, setTagEditando] = useState<Tag | null>(null)
    const supabase = createClient()

    const tagsFiltradas = tags.filter(t =>
        t.nome.toLowerCase().includes(busca.toLowerCase())
    )

    async function excluirTag(id: string) {
        if (!confirm('Tem certeza que deseja excluir esta tag? Os produtos perderão esta marcação.')) return

        await supabase.from('produto_tags').delete().eq('tag_id', id)
        await supabase.from('tags').delete().eq('id', id)

        setTags(ts => ts.filter(t => t.id !== id))
    }

    function editarTag(tag: Tag) {
        setTagEditando(tag)
        setFormAberto(true)
    }

    function novaTag() {
        setTagEditando(null)
        setFormAberto(true)
    }

    function onSucesso(tag: Tag) {
        if (tagEditando) {
            setTags(ts => ts.map(t => t.id === tag.id ? tag : t))
        } else {
            setTags(ts => [tag, ...ts])
        }
        setFormAberto(false)
    }

    return (
        <div className={styles.page}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Tags</h1>
                    <p className={styles.sub}>{tags.length} tag{tags.length !== 1 ? 's' : ''} cadastrada{tags.length !== 1 ? 's' : ''}</p>
                </div>
                <button className="btn btn-primary" onClick={novaTag}>
                    <Plus size={18} /> Nova Tag
                </button>
            </div>

            <div className={styles.buscaWrap}>
                <Search size={16} className={styles.buscaIcon} />
                <input
                    type="search"
                    className="input"
                    placeholder="Buscar tags..."
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
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tagsFiltradas.length === 0 && (
                            <tr><td colSpan={3} className={styles.empty}>Nenhuma tag encontrada.</td></tr>
                        )}
                        {tagsFiltradas.map(tag => (
                            <tr key={tag.id} className={styles.row}>
                                <td className={styles.td}>
                                    <span className="tag" style={{ cursor: 'default' }}>{tag.nome}</span>
                                </td>
                                <td className={styles.td}>{tag.slug}</td>
                                <td className={styles.td}>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => editarTag(tag)} className="btn btn-ghost btn-sm">
                                            <Edit2 size={14} /> Editar
                                        </button>
                                        <button onClick={() => excluirTag(tag.id!)} className="btn btn-danger btn-sm">
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
                <FormTag
                    tag={tagEditando}
                    onFechar={() => setFormAberto(false)}
                    onSucesso={onSucesso}
                />
            )}
        </div>
    )
}
