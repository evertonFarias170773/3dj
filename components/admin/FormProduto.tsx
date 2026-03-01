'use client'

import { useState, useRef } from 'react'
import { X, Plus, Upload, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Categoria, Tag } from '@/lib/types/database'
import { gerarSlug } from '@/lib/utils/validators'
import styles from './FormProduto.module.css'

interface Props {
    produto: any | null
    categorias: Categoria[]
    tags: Tag[]
    onFechar: () => void
    onSucesso: (produto: any) => void
}

interface Cor { id?: string; nome: string; hex: string; ativo: boolean }

export default function FormProduto({ produto, categorias, tags, onFechar, onSucesso }: Props) {
    const supabase = createClient()
    const isEdicao = !!produto

    const [form, setForm] = useState({
        nome: produto?.nome ?? '',
        slug: produto?.slug ?? '',
        descricao_curta: produto?.descricao_curta ?? '',
        descricao: produto?.descricao ?? '',
        material: produto?.material ?? '',
        peso_gramas: produto?.peso_gramas ?? '',
        comprimento_mm: produto?.comprimento_mm ?? '',
        largura_mm: produto?.largura_mm ?? '',
        altura_mm: produto?.altura_mm ?? '',
        preco_base: produto?.preco_base ?? '',
        setup_valor: produto?.setup_valor ?? 0,
        quantidade_minima: produto?.quantidade_minima ?? 1,
        ativo: produto?.ativo ?? true,
        destaque: produto?.destaque ?? false,
        categoria_id: produto?.categoria_id ?? '',
    })
    const [cores, setCores] = useState<Cor[]>(produto?.produto_cores ?? [])
    const [novaCor, setNovaCor] = useState({ nome: '', hex: '#22C55E' })
    const [tagsSelecionadas, setTagsSelecionadas] = useState<string[]>(
        produto?.tags?.map((t: any) => t.id) ?? []
    )
    const [imagens, setImagens] = useState<any[]>(produto?.produto_imagens ?? [])
    const [uploading, setUploading] = useState(false)
    const [salvando, setSalvando] = useState(false)
    const [erro, setErro] = useState('')
    const fileRef = useRef<HTMLInputElement>(null)

    function handleChange(key: string, value: any) {
        setForm(f => ({ ...f, [key]: value }))
        if (key === 'nome' && !isEdicao) {
            setForm(f => ({ ...f, nome: value, slug: gerarSlug(value) }))
        }
    }

    function adicionarCor() {
        if (!novaCor.nome.trim()) return
        setCores(cs => [...cs, { nome: novaCor.nome, hex: novaCor.hex, ativo: true }])
        setNovaCor({ nome: '', hex: '#22C55E' })
    }

    function removerCor(idx: number) {
        setCores(cs => cs.filter((_, i) => i !== idx))
    }

    function toggleTag(id: string) {
        setTagsSelecionadas(ts => ts.includes(id) ? ts.filter(t => t !== id) : [...ts, id])
    }

    async function uploadImagem(file: File) {
        const ext = file.name.split('.').pop()
        const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data, error } = await supabase.storage.from('produtos').upload(path, file, { upsert: false })
        if (error) throw error
        const { data: pub } = supabase.storage.from('produtos').getPublicUrl(data.path)
        return pub.publicUrl
    }

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? [])
        if (!files.length) return
        setUploading(true)
        try {
            const urls = await Promise.all(files.map(uploadImagem))
            setImagens(imgs => [
                ...imgs,
                ...urls.map((url, i) => ({ url, ordem: imgs.length + i, principal: imgs.length === 0 && i === 0 }))
            ])
        } catch { setErro('Erro ao fazer upload das imagens.') }
        finally { setUploading(false) }
    }

    function setPrincipal(idx: number) {
        setImagens(imgs => imgs.map((img, i) => ({ ...img, principal: i === idx })))
    }

    function removerImagem(idx: number) {
        setImagens(imgs => imgs.filter((_, i) => i !== idx))
    }

    async function salvar() {
        if (!form.nome || !form.preco_base) { setErro('Nome e preço base são obrigatórios.'); return }
        setSalvando(true)
        setErro('')
        try {
            const payload = {
                ...form,
                slug: form.slug || gerarSlug(form.nome),
                preco_base: Number(form.preco_base),
                setup_valor: Number(form.setup_valor),
                peso_gramas: form.peso_gramas ? Number(form.peso_gramas) : null,
                comprimento_mm: form.comprimento_mm ? Number(form.comprimento_mm) : null,
                largura_mm: form.largura_mm ? Number(form.largura_mm) : null,
                altura_mm: form.altura_mm ? Number(form.altura_mm) : null,
                quantidade_minima: Number(form.quantidade_minima),
                categoria_id: form.categoria_id || null,
                atualizado_em: new Date().toISOString(),
            }

            let prodId = produto?.id
            if (isEdicao) {
                await supabase.from('produtos').update(payload).eq('id', prodId)
            } else {
                const { data } = await supabase.from('produtos').insert(payload).select().single()
                prodId = data?.id
            }

            // Cores
            if (prodId) {
                if (isEdicao) await supabase.from('produto_cores').delete().eq('produto_id', prodId)
                if (cores.length) {
                    await supabase.from('produto_cores').insert(cores.map(c => ({ ...c, produto_id: prodId })))
                }
                // Tags
                if (isEdicao) await supabase.from('produto_tags').delete().eq('produto_id', prodId)
                if (tagsSelecionadas.length) {
                    await supabase.from('produto_tags').insert(tagsSelecionadas.map(tid => ({ produto_id: prodId, tag_id: tid })))
                }
                // Imagens
                if (isEdicao) await supabase.from('produto_imagens').delete().eq('produto_id', prodId)
                if (imagens.length) {
                    await supabase.from('produto_imagens').insert(imagens.map((img, i) => ({ ...img, produto_id: prodId, ordem: i })))
                }
            }

            // Buscar produto completo
            const { data: pCompleto } = await supabase
                .from('produtos')
                .select('*, categorias(*), produto_cores(*), produto_imagens(*)')
                .eq('id', prodId!)
                .single()

            onSucesso(pCompleto)
        } catch (err: any) {
            setErro(err.message ?? 'Erro ao salvar produto.')
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onFechar()}>
            <div className={styles.modal}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>{isEdicao ? 'Editar Produto' : 'Novo Produto'}</h2>
                    <button onClick={onFechar} className={styles.closeBtn} aria-label="Fechar"><X size={20} /></button>
                </div>

                <div className={styles.modalBody}>
                    {erro && <div className={styles.erro}>{erro}</div>}

                    {/* Dados Básicos */}
                    <fieldset className={styles.section}>
                        <legend className={styles.sectionTitle}>Dados Básicos</legend>
                        <div className={styles.grid2}>
                            <div>
                                <label className="input-label">Nome*</label>
                                <input className="input" value={form.nome} onChange={e => handleChange('nome', e.target.value)} placeholder="Ex: Porta Copo Hexagonal" />
                            </div>
                            <div>
                                <label className="input-label">Slug (URL)</label>
                                <input className="input" value={form.slug} onChange={e => handleChange('slug', e.target.value)} placeholder="porta-copo-hexagonal" />
                            </div>
                        </div>
                        <div>
                            <label className="input-label">Descrição Curta</label>
                            <input className="input" value={form.descricao_curta} onChange={e => handleChange('descricao_curta', e.target.value)} placeholder="Descrição exibida nos cards" />
                        </div>
                        <div>
                            <label className="input-label">Descrição Completa</label>
                            <textarea className={`input ${styles.textarea}`} value={form.descricao} onChange={e => handleChange('descricao', e.target.value)} rows={4} placeholder="Detalhes, diferenciais, informações técnicas..." />
                        </div>
                        <div className={styles.grid2}>
                            <div>
                                <label className="input-label">Categoria</label>
                                <select className="input" value={form.categoria_id} onChange={e => handleChange('categoria_id', e.target.value)}>
                                    <option value="">Sem categoria</option>
                                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Material</label>
                                <input className="input" value={form.material} onChange={e => handleChange('material', e.target.value)} placeholder="PLA, PETG, ABS..." />
                            </div>
                        </div>
                    </fieldset>

                    {/* Preço */}
                    <fieldset className={styles.section}>
                        <legend className={styles.sectionTitle}>Preço e Quantidade</legend>
                        <div className={styles.grid3}>
                            <div>
                                <label className="input-label">Preço Base (R$)*</label>
                                <input className="input" type="number" step="0.01" value={form.preco_base} onChange={e => handleChange('preco_base', e.target.value)} placeholder="0,00" />
                            </div>
                            <div>
                                <label className="input-label">Valor de Setup (R$)</label>
                                <input className="input" type="number" step="0.01" value={form.setup_valor} onChange={e => handleChange('setup_valor', e.target.value)} placeholder="0,00" />
                            </div>
                            <div>
                                <label className="input-label">Quantidade Mínima</label>
                                <input className="input" type="number" min="1" value={form.quantidade_minima} onChange={e => handleChange('quantidade_minima', e.target.value)} />
                            </div>
                        </div>
                    </fieldset>

                    {/* Peso e dimensões */}
                    <fieldset className={styles.section}>
                        <legend className={styles.sectionTitle}>Peso e Dimensões (para frete)</legend>
                        <div className={styles.grid4}>
                            <div>
                                <label className="input-label">Peso (g)</label>
                                <input className="input" type="number" value={form.peso_gramas} onChange={e => handleChange('peso_gramas', e.target.value)} placeholder="100" />
                            </div>
                            <div>
                                <label className="input-label">Comprimento (mm)</label>
                                <input className="input" type="number" value={form.comprimento_mm} onChange={e => handleChange('comprimento_mm', e.target.value)} />
                            </div>
                            <div>
                                <label className="input-label">Largura (mm)</label>
                                <input className="input" type="number" value={form.largura_mm} onChange={e => handleChange('largura_mm', e.target.value)} />
                            </div>
                            <div>
                                <label className="input-label">Altura (mm)</label>
                                <input className="input" type="number" value={form.altura_mm} onChange={e => handleChange('altura_mm', e.target.value)} />
                            </div>
                        </div>
                    </fieldset>

                    {/* Cores */}
                    <fieldset className={styles.section}>
                        <legend className={styles.sectionTitle}>Cores Disponíveis</legend>
                        <div className={styles.coresLista}>
                            {cores.map((cor, i) => (
                                <div key={i} className={styles.corItem}>
                                    <span style={{ width: 20, height: 20, borderRadius: '50%', background: cor.hex, border: '2px solid rgba(255,255,255,0.2)', display: 'inline-block' }} />
                                    <span className={styles.corNome}>{cor.nome}</span>
                                    <span className={styles.corHex}>{cor.hex}</span>
                                    <button onClick={() => removerCor(i)} className={styles.removerBtn}><Trash2 size={12} /></button>
                                </div>
                            ))}
                        </div>
                        <div className={styles.addCor}>
                            <input type="color" value={novaCor.hex} onChange={e => setNovaCor(c => ({ ...c, hex: e.target.value }))} className={styles.colorPicker} />
                            <input className="input" placeholder="Nome da cor" value={novaCor.nome} onChange={e => setNovaCor(c => ({ ...c, nome: e.target.value }))} onKeyDown={e => e.key === 'Enter' && adicionarCor()} />
                            <button onClick={adicionarCor} className="btn btn-ghost btn-sm" id="btn-add-cor"><Plus size={14} /> Adicionar</button>
                        </div>
                    </fieldset>

                    {/* Tags */}
                    <fieldset className={styles.section}>
                        <legend className={styles.sectionTitle}>Tags de Pesquisa</legend>
                        <div className={styles.tagsGrid}>
                            {tags.map(tag => (
                                <label key={tag.id} className={`${styles.tagCheck} ${tagsSelecionadas.includes(tag.id) ? styles.tagAtiva : ''}`}>
                                    <input type="checkbox" hidden checked={tagsSelecionadas.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
                                    {tag.nome}
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {/* Imagens */}
                    <fieldset className={styles.section}>
                        <legend className={styles.sectionTitle}>Imagens do Produto</legend>
                        <div className={styles.imagens}>
                            {imagens.map((img, i) => (
                                <div key={i} className={`${styles.imgItem} ${img.principal ? styles.imgPrincipal : ''}`}>
                                    <img src={img.url} alt="" width={80} height={80} style={{ objectFit: 'cover', borderRadius: 6 }} />
                                    <div className={styles.imgActions}>
                                        <button onClick={() => setPrincipal(i)} className={`${styles.imgBtn} ${img.principal ? styles.imgBtnAtivo : ''}`}>Principal</button>
                                        <button onClick={() => removerImagem(i)} className={styles.imgBtnDanger}><Trash2 size={12} /></button>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => fileRef.current?.click()} className={styles.uploadBtn} disabled={uploading} id="btn-upload-img">
                                <Upload size={20} />
                                {uploading ? 'Enviando...' : 'Upload'}
                            </button>
                            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleUpload} />
                        </div>
                    </fieldset>

                    {/* Status */}
                    <fieldset className={styles.section}>
                        <legend className={styles.sectionTitle}>Status</legend>
                        <div className={styles.checkGroup}>
                            <label className={styles.checkLabel}>
                                <input type="checkbox" checked={form.ativo} onChange={e => handleChange('ativo', e.target.checked)} />
                                Produto Ativo (visível na loja)
                            </label>
                            <label className={styles.checkLabel}>
                                <input type="checkbox" checked={form.destaque} onChange={e => handleChange('destaque', e.target.checked)} />
                                Produto em Destaque
                            </label>
                        </div>
                    </fieldset>
                </div>

                <div className={styles.modalFooter}>
                    <button onClick={onFechar} className="btn btn-ghost">Cancelar</button>
                    <button onClick={salvar} className="btn btn-primary" disabled={salvando} id="btn-salvar-produto">
                        {salvando ? 'Salvando...' : isEdicao ? 'Salvar Alterações' : 'Criar Produto'}
                    </button>
                </div>
            </div>
        </div>
    )
}
