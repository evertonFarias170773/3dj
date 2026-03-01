'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Truck, Plus, Minus, Info } from 'lucide-react'
import { ProdutoCompleto, ProdutoCor, calcularPrecoUnitario, calcularTotal } from '@/lib/types/database'
import { formatBRL } from '@/lib/utils/formatters'
import { useCarrinho } from '@/lib/hooks/useCarrinho'
import styles from './ProdutoDetalheClient.module.css'

interface Props { produto: ProdutoCompleto }

export default function ProdutoDetalheClient({ produto }: Props) {
    const { adicionar } = useCarrinho()
    const [imagemAtiva, setImagemAtiva] = useState(
        produto.produto_imagens?.find(i => i.principal) ?? produto.produto_imagens?.[0] ?? null
    )
    const [corSelecionada, setCorSelecionada] = useState<ProdutoCor | null>(
        produto.produto_cores?.filter(c => c.ativo)?.[0] ?? null
    )
    const [quantidade, setQuantidade] = useState(produto.quantidade_minima ?? 1)
    const [cep, setCep] = useState('')
    const [freteInfo, setFreteInfo] = useState<string | null>(null)
    const [calculando, setCalculando] = useState(false)
    const [adicionado, setAdicionado] = useState(false)

    const precoUnitario = calcularPrecoUnitario(produto.preco_base, produto.setup_valor, quantidade)
    const total = calcularTotal(produto.preco_base, produto.setup_valor, quantidade)
    const qtyMin = produto.quantidade_minima ?? 1

    function selecionarCor(cor: ProdutoCor) {
        setCorSelecionada(cor)
        const imgCor = produto.produto_imagens?.find(i => i.cor_id === cor.id)
        if (imgCor) setImagemAtiva(imgCor)
    }

    function ajustarQty(delta: number) {
        setQuantidade(q => Math.max(qtyMin, q + delta))
    }

    async function calcularFrete() {
        if (!cep || cep.replace(/\D/g, '').length !== 8) return
        setCalculando(true)
        try {
            const res = await fetch('/api/frete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    cep_destino: cep.replace(/\D/g, ''),
                    peso_total_gramas: (produto.peso_gramas ?? 100) * quantidade,
                    produto_id: produto.id,
                    quantidade,
                }),
            })
            const data = await res.json()
            setFreteInfo(data.modalidades?.[0]
                ? `${data.modalidades[0].nome}: ${formatBRL(data.modalidades[0].valor)} (${data.modalidades[0].prazo_dias} dias úteis)`
                : 'Frete indisponível para o CEP')
        } catch {
            setFreteInfo('Erro ao calcular frete. Tente novamente.')
        } finally {
            setCalculando(false)
        }
    }

    function handleAdicionar() {
        adicionar(produto, corSelecionada, quantidade)
        setAdicionado(true)
        setTimeout(() => setAdicionado(false), 2000)
    }

    return (
        <div className={styles.detalhe}>
            {/* Galeria */}
            <div className={styles.galeria}>
                <div className={styles.imagemPrincipal}>
                    {imagemAtiva ? (
                        <Image
                            src={imagemAtiva.url}
                            alt={produto.nome}
                            fill
                            className={styles.img}
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    ) : (
                        <div className={styles.noImg}>🖨️</div>
                    )}
                </div>
                {produto.produto_imagens?.length > 1 && (
                    <div className={styles.thumbs}>
                        {produto.produto_imagens.map(img => (
                            <button
                                key={img.id}
                                onClick={() => setImagemAtiva(img)}
                                className={`${styles.thumb} ${imagemAtiva?.id === img.id ? styles.thumbAtivo : ''}`}
                                aria-label="Ver imagem"
                            >
                                <Image src={img.url} alt="" fill className={styles.thumbImg} sizes="80px" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Info */}
            <div className={styles.info}>
                <h1 className={styles.nome}>{produto.nome}</h1>

                {/* Tags */}
                {produto.tags?.length > 0 && (
                    <div className={styles.tags}>
                        {produto.tags.map(tag => (
                            <a key={tag.id} href={`/?tag=${tag.slug}`} className="tag">{tag.nome}</a>
                        ))}
                    </div>
                )}

                {/* Seletor de cor */}
                {produto.produto_cores?.filter(c => c.ativo).length > 0 && (
                    <div className={styles.coresWrap}>
                        <p className={styles.label}>
                            Cor: <strong>{corSelecionada?.nome ?? 'Selecione'}</strong>
                        </p>
                        <div className={styles.cores}>
                            {produto.produto_cores.filter(c => c.ativo).map(cor => (
                                <button
                                    key={cor.id}
                                    onClick={() => selecionarCor(cor)}
                                    className={`${styles.corBtn} ${corSelecionada?.id === cor.id ? styles.corAtiva : ''}`}
                                    style={{ backgroundColor: cor.hex }}
                                    title={cor.nome}
                                    aria-label={`Selecionar cor ${cor.nome}`}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {/* Quantidade */}
                <div className={styles.qtyWrap}>
                    <p className={styles.label}>Quantidade:</p>
                    <div className={styles.qty}>
                        <button onClick={() => ajustarQty(-1)} className={styles.qtyBtn} aria-label="Diminuir">
                            <Minus size={16} />
                        </button>
                        <span className={styles.qtyVal}>{quantidade}</span>
                        <button onClick={() => ajustarQty(1)} className={styles.qtyBtn} aria-label="Aumentar">
                            <Plus size={16} />
                        </button>
                    </div>
                    {qtyMin > 1 && (
                        <p className={styles.qtyMin}><Info size={12} /> Mínimo: {qtyMin} unidades</p>
                    )}
                </div>

                {/* Box de preço */}
                <div className={styles.precoBox}>
                    <div className={styles.precoRow}>
                        <span className={styles.precoLabel}>Preço unitário</span>
                        <span className={styles.precoValor}>{formatBRL(precoUnitario)}</span>
                    </div>
                    {produto.setup_valor > 0 && (
                        <div className={styles.precoRow}>
                            <span className={styles.setupLabel}>Setup diluído ({quantidade}×)</span>
                            <span className={styles.setupValor}>{formatBRL(produto.setup_valor / quantidade)}/un</span>
                        </div>
                    )}
                    <hr className="divider" />
                    <div className={styles.precoRow}>
                        <span className={styles.totalLabel}>Total</span>
                        <span className={styles.totalValor}>{formatBRL(total)}</span>
                    </div>
                </div>

                {/* Cálculo de frete */}
                <div className={styles.freteWrap}>
                    <p className={styles.label}><Truck size={14} /> Calcular frete:</p>
                    <div className={styles.freteInput}>
                        <input
                            type="text"
                            className="input"
                            placeholder="Digite seu CEP"
                            value={cep}
                            onChange={e => setCep(e.target.value)}
                            maxLength={9}
                            id="cep-input"
                        />
                        <button
                            onClick={calcularFrete}
                            className="btn btn-ghost"
                            disabled={calculando}
                        >
                            {calculando ? '...' : 'Calcular'}
                        </button>
                    </div>
                    {freteInfo && <p className={styles.freteResult}>{freteInfo}</p>}
                </div>

                {/* Botões */}
                <div className={styles.btns}>
                    <button
                        className={`btn btn-primary btn-full btn-lg`}
                        onClick={handleAdicionar}
                        id="btn-adicionar-carrinho"
                    >
                        <ShoppingCart size={20} />
                        {adicionado ? '✓ Adicionado!' : 'Adicionar ao Carrinho'}
                    </button>
                    <a href="/checkout" className="btn btn-accent btn-full btn-lg">
                        Comprar Agora
                    </a>
                </div>

                {/* Descrição */}
                {produto.descricao && (
                    <div className={styles.descricao}>
                        <h3>Sobre o produto</h3>
                        <p>{produto.descricao}</p>
                    </div>
                )}

                {/* Specs */}
                <div className={styles.specs}>
                    {produto.material && <div className={styles.spec}><span>Material</span><strong>{produto.material}</strong></div>}
                    {produto.peso_gramas && <div className={styles.spec}><span>Peso</span><strong>{produto.peso_gramas}g</strong></div>}
                    {(produto.comprimento_mm || produto.largura_mm || produto.altura_mm) && (
                        <div className={styles.spec}>
                            <span>Dimensões</span>
                            <strong>{produto.comprimento_mm}×{produto.largura_mm}×{produto.altura_mm}mm</strong>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
