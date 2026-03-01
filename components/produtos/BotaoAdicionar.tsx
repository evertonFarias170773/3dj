'use client'

import { ShoppingCart } from 'lucide-react'
import { ProdutoCompleto } from '@/lib/types/database'
import { useCarrinho } from '@/lib/hooks/useCarrinho'

interface Props {
    produto: ProdutoCompleto
}

export default function BotaoAdicionar({ produto }: Props) {
    const { adicionar } = useCarrinho()
    const qtyMin = produto.quantidade_minima ?? 1

    function handleAdicionar(e: React.MouseEvent) {
        e.preventDefault()
        e.stopPropagation()
        adicionar(produto, null, qtyMin)
    }

    return (
        <button
            onClick={handleAdicionar}
            style={{
                width: '100%',
                backgroundColor: '#16A34A',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'background-color 200ms ease'
            }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#15803D'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#16A34A'}
        >
            <ShoppingCart size={18} />
            Adicionar ao carrinho
        </button>
    )
}
