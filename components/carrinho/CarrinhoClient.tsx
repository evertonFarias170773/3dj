'use client'

import { useCarrinho } from '@/lib/hooks/useCarrinho'
import { formatBRL } from '@/lib/utils/formatters'
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import styles from './CarrinhoClient.module.css'

export default function CarrinhoClient() {
    const { itens, remover, atualizarQty, limpar, subtotal, totalItens } = useCarrinho()

    if (totalItens === 0) {
        return (
            <div className={styles.empty}>
                <ShoppingBag size={64} className={styles.emptyIcon} strokeWidth={1} />
                <div className={styles.emptyText}>
                    <h2>Seu carrinho está vazio</h2>
                    <p>Você ainda não adicionou nenhum produto incrível ao carrinho.</p>
                </div>
                <Link href="/" className="btn btn-primary btn-lg" style={{ marginTop: '16px' }}>
                    Continuar Comprando
                </Link>
            </div>
        )
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Meu Carrinho</h1>

            <div className={styles.content}>
                <div className={styles.lista}>
                    {itens.map((item) => {
                        const chaveId = `${item.produto.id}-${item.cor?.id || 'default'}`
                        const imagem = item.produto.produto_imagens?.find(
                            i => i.cor_id === item.cor?.id
                        ) || item.produto.produto_imagens?.find(i => i.principal) || item.produto.produto_imagens?.[0]

                        return (
                            <div key={chaveId} className={styles.item}>
                                <div className={styles.itemImgWrap}>
                                    {imagem ? (
                                        <Image src={imagem.url} alt={item.produto.nome} fill className={styles.itemImg} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#eee' }}>🖨️</div>
                                    )}
                                </div>
                                <div className={styles.itemInfo}>
                                    <Link href={`/produto/${item.produto.slug}`} className={styles.nome}>
                                        {item.produto.nome}
                                    </Link>

                                    {item.cor && (
                                        <span className={styles.cor}>
                                            Cor: <div className={styles.corBola} style={{ backgroundColor: item.cor.hex }} /> {item.cor.nome}
                                        </span>
                                    )}
                                    <span className={styles.precoUni}>{formatBRL(item.preco_unitario)} cada</span>

                                    <div className={styles.controles} style={{ marginTop: 'auto' }}>
                                        <div className={styles.qtyBox}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => atualizarQty(item.produto.id, item.cor?.id ?? null, item.quantidade - 1)}
                                                disabled={item.quantidade <= 1}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className={styles.qtyVal}>{item.quantidade}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => atualizarQty(item.produto.id, item.cor?.id ?? null, item.quantidade + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => remover(item.produto.id, item.cor?.id ?? null)}
                                            title="Remover item"
                                        >
                                            <Trash2 size={18} />
                                        </button>

                                        <span className={styles.itemTotal}>
                                            {formatBRL(item.preco_unitario * item.quantidade)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                <div className={styles.resumo}>
                    <h3>Resumo do Pedido</h3>
                    <div className={styles.resumoRow}>
                        <span>Subtotal ({totalItens} itens)</span>
                        <span>{formatBRL(subtotal)}</span>
                    </div>
                    <div className={styles.resumoRow}>
                        <span>Frete</span>
                        <span style={{ fontSize: '12px', color: 'var(--color-primary)' }}>Calcular no checkout</span>
                    </div>

                    <div className={styles.resumoTotal}>
                        <span>Total Estipulado</span>
                        <span>{formatBRL(subtotal)}</span>
                    </div>

                    <button className={`btn btn-accent btn-full btn-lg ${styles.checkoutBtn}`}>
                        Ir para o Checkout <ArrowRight size={20} />
                    </button>
                    <Link href="/" className="btn btn-ghost btn-full" style={{ marginTop: '8px' }}>
                        Continuar Comprando
                    </Link>
                </div>
            </div>
        </div>
    )
}
