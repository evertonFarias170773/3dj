'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Categoria } from '@/lib/types/database'
import { gerarSlug } from '@/lib/utils/validators'
import styles from './FormProduto.module.css'

interface Props {
    categoria: Categoria | null
    onFechar: () => void
    onSucesso: (c: Categoria) => void
}

export default function FormCategoria({ categoria, onFechar, onSucesso }: Props) {
    const supabase = createClient()
    const isEdicao = !!categoria

    const [form, setForm] = useState({
        nome: categoria?.nome ?? '',
        slug: categoria?.slug ?? '',
        ativo: categoria?.ativo ?? true,
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
                const { data, error } = await supabase.from('categorias').update(payload).eq('id', categoria.id).select().single()
                if (error) throw error
                onSucesso(data as Categoria)
            } else {
                const { data, error } = await supabase.from('categorias').insert(payload as any).select().single()
                if (error) throw error
                onSucesso(data as Categoria)
            }
        } catch (err: any) {
            setErro(err.message ?? 'Erro ao salvar categoria.')
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onFechar()}>
            <div className={styles.modal} style={{ maxWidth: 500 }}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{isEdicao ? 'Editar Categoria' : 'Nova Categoria'}</h2>
                    <button onClick={onFechar} className={styles.closeBtn} aria-label="Fechar"><X size={20} /></button>
                </div>

                <div className={styles.modalBody}>
                    {erro && <div className={styles.erro}>{erro}</div>}

                    <div className={styles.section}>
                        <div>
                            <label className="input-label">Nome*</label>
                            <input className="input" value={form.nome} onChange={e => handleChange('nome', e.target.value)} placeholder="Ex: Utilidades" />
                        </div>
                        <div>
                            <label className="input-label">Slug (URL)</label>
                            <input className="input" value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="utilidades" />
                        </div>
                        <label className={styles.checkLabel}>
                            <input type="checkbox" checked={form.ativo} onChange={e => handleChange('ativo', e.target.checked)} />
                            Categoria Ativa
                        </label>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button onClick={onFechar} className="btn btn-ghost">Cancelar</button>
                    <button onClick={salvar} className="btn btn-primary" disabled={salvando}>
                        {salvando ? 'Salvando...' : isEdicao ? 'Salvar Alterações' : 'Criar Categoria'}
                    </button>
                </div>
            </div>
        </div>
    )
}
