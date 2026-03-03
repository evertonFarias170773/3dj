'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Tag } from '@/lib/types/database'
import { gerarSlug } from '@/lib/utils/validators'
import styles from './FormProduto.module.css'

interface Props {
    tag: Tag | null
    onFechar: () => void
    onSucesso: (t: Tag) => void
}

export default function FormTag({ tag, onFechar, onSucesso }: Props) {
    const supabase = createClient()
    const isEdicao = !!tag

    const [form, setForm] = useState({
        nome: tag?.nome ?? '',
        slug: tag?.slug ?? '',
    })
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState('')

    function handleChange(key: string, value: any) {
        setForm(f => ({ ...f, [key]: value }))
        if (key === 'nome' && !isEdicao) {
            setForm(f => ({ ...f, nome: value, slug: gerarSlug(value) }))
        }
    }

    async function salvar() {
        if (!form.nome) { setErro('Nome é obrigatório.'); return }
        setSalvando(true)
        setErro('')
        try {
            const payload = {
                ...form,
                slug: form.slug || gerarSlug(form.nome),
            }

            if (isEdicao) {
                const { data, error } = await supabase.from('tags').update(payload).eq('id', tag.id).select().single()
                if (error) throw error
                onSucesso(data as Tag)
            } else {
                const { data, error } = await supabase.from('tags').insert(payload as any).select().single()
                if (error) throw error
                onSucesso(data as Tag)
            }
        } catch (err: any) {
            setErro(err.message ?? 'Erro ao salvar tag.')
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onFechar()}>
            <div className={styles.modal} style={{ maxWidth: 500 }}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{isEdicao ? 'Editar Tag' : 'Nova Tag'}</h2>
                    <button onClick={onFechar} className={styles.closeBtn} aria-label="Fechar"><X size={20} /></button>
                </div>

                <div className={styles.modalBody}>
                    {erro && <div className={styles.erro}>{erro}</div>}

                    <div className={styles.section}>
                        <div>
                            <label className="input-label">Nome*</label>
                            <input className="input" value={form.nome} onChange={e => handleChange('nome', e.target.value)} placeholder="Ex: Escritório" />
                        </div>
                        <div>
                            <label className="input-label">Slug (URL)</label>
                            <input className="input" value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="escritorio" />
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button onClick={onFechar} className="btn btn-ghost">Cancelar</button>
                    <button onClick={salvar} className="btn btn-primary" disabled={salvando}>
                        {salvando ? 'Salvando...' : isEdicao ? 'Salvar Alterações' : 'Criar Tag'}
                    </button>
                </div>
            </div>
        </div>
    )
}
