import Image from 'next/image'
import Link from 'next/link'
import { ProdutoCompleto, calcularPrecoUnitario } from '@/lib/types/database'
import { formatBRL } from '@/lib/utils/formatters'
import BotaoAdicionar from './BotaoAdicionar'
import styles from './ProdutoCard.module.css'

interface Props {
    produto: ProdutoCompleto
}

export default function ProdutoCard({ produto }: Props) {
    const imagemPrincipal = produto.produto_imagens?.find(i => i.principal) ?? produto.produto_imagens?.[0]
    const qtyMin = produto.quantidade_minima ?? 1
    const precoMin = calcularPrecoUnitario(produto.preco_base, produto.setup_valor, qtyMin)

    // Calcula desconto de 10% à vista
    const precoVista = precoMin * 0.9;

    return (
        <div className={styles.card}>
            {/* Link engloba apenas imagem e texto, botão é separado */}
            <Link href={`/produto/${produto.slug}`} className={styles.cardLink} aria-label={produto.nome}>
                <div className={styles.imageWrap}>
                    {imagemPrincipal ? (
                        <Image
                            src={imagemPrincipal.url}
                            alt={produto.nome}
                            fill
                            className={styles.image}
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                    ) : (
                        <div className={styles.noImage}>🖨️</div>
                    )}
                </div>

                <div className={styles.content}>
                    <h3 className={styles.nome}>{produto.nome}</h3>

                    <div className={styles.priceContainer}>
                        <span className={styles.precoOriginal}>{formatBRL(precoMin)}</span>
                        <div className={styles.precoVistaContainer}>
                            <span className={styles.iconePix}>❖</span>
                            <div className={styles.precoInfo}>
                                <span className={styles.precoVista}>{formatBRL(precoVista)}</span>
                                <span className={styles.notaDesconto}>com 10% desconto à vista</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Componente Client separado para ação do carrinho */}
            <div className={styles.actionContainer}>
                <BotaoAdicionar produto={produto} />
            </div>
        </div>
    )
}
