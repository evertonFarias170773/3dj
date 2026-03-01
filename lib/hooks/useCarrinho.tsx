'use client'

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { ItemCarrinho, ProdutoCompleto, ProdutoCor, calcularPrecoUnitario } from '../types/database'

interface CarrinhoState {
    itens: ItemCarrinho[]
}

type CarrinhoAction =
    | { type: 'ADICIONAR'; payload: { produto: ProdutoCompleto; cor: ProdutoCor | null; quantidade: number } }
    | { type: 'REMOVER'; payload: { produtoId: string; corId: string | null } }
    | { type: 'ATUALIZAR_QTY'; payload: { produtoId: string; corId: string | null; quantidade: number } }
    | { type: 'LIMPAR' }
    | { type: 'CARREGAR'; payload: ItemCarrinho[] }

function carrinhoReducer(state: CarrinhoState, action: CarrinhoAction): CarrinhoState {
    switch (action.type) {
        case 'CARREGAR':
            return { itens: action.payload }

        case 'ADICIONAR': {
            const { produto, cor, quantidade } = action.payload
            const idx = state.itens.findIndex(
                i => i.produto.id === produto.id && (i.cor?.id ?? null) === (cor?.id ?? null)
            )
            const novaQty = idx >= 0 ? state.itens[idx].quantidade + quantidade : quantidade
            const preco_unitario = calcularPrecoUnitario(produto.preco_base, produto.setup_valor, novaQty)

            if (idx >= 0) {
                const novos = [...state.itens]
                novos[idx] = { ...novos[idx], quantidade: novaQty, preco_unitario }
                return { itens: novos }
            }
            return { itens: [...state.itens, { produto, cor, quantidade, preco_unitario }] }
        }

        case 'REMOVER':
            return {
                itens: state.itens.filter(
                    i => !(i.produto.id === action.payload.produtoId && (i.cor?.id ?? null) === action.payload.corId)
                )
            }

        case 'ATUALIZAR_QTY': {
            if (action.payload.quantidade <= 0) {
                return {
                    itens: state.itens.filter(
                        i => !(i.produto.id === action.payload.produtoId && (i.cor?.id ?? null) === action.payload.corId)
                    )
                }
            }
            return {
                itens: state.itens.map(i => {
                    if (i.produto.id === action.payload.produtoId && (i.cor?.id ?? null) === action.payload.corId) {
                        const preco_unitario = calcularPrecoUnitario(i.produto.preco_base, i.produto.setup_valor, action.payload.quantidade)
                        return { ...i, quantidade: action.payload.quantidade, preco_unitario }
                    }
                    return i
                })
            }
        }

        case 'LIMPAR':
            return { itens: [] }

        default:
            return state
    }
}

interface CarrinhoContextType extends CarrinhoState {
    adicionar: (produto: ProdutoCompleto, cor: ProdutoCor | null, quantidade: number) => void
    remover: (produtoId: string, corId: string | null) => void
    atualizarQty: (produtoId: string, corId: string | null, quantidade: number) => void
    limpar: () => void
    totalItens: number
    subtotal: number
}

const CarrinhoContext = createContext<CarrinhoContextType | null>(null)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(carrinhoReducer, { itens: [] })

    useEffect(() => {
        try {
            const saved = localStorage.getItem('carrinho_3d')
            if (saved) dispatch({ type: 'CARREGAR', payload: JSON.parse(saved) })
        } catch { }
    }, [])

    useEffect(() => {
        localStorage.setItem('carrinho_3d', JSON.stringify(state.itens))
    }, [state.itens])

    const totalItens = state.itens.reduce((acc, i) => acc + i.quantidade, 0)
    const subtotal = state.itens.reduce((acc, i) => acc + i.preco_unitario * i.quantidade, 0)

    return (
        <CarrinhoContext.Provider value={{
            ...state,
            adicionar: (produto, cor, quantidade) => dispatch({ type: 'ADICIONAR', payload: { produto, cor, quantidade } }),
            remover: (produtoId, corId) => dispatch({ type: 'REMOVER', payload: { produtoId, corId } }),
            atualizarQty: (produtoId, corId, quantidade) => dispatch({ type: 'ATUALIZAR_QTY', payload: { produtoId, corId, quantidade } }),
            limpar: () => dispatch({ type: 'LIMPAR' }),
            totalItens,
            subtotal,
        }}>
            {children}
        </CarrinhoContext.Provider>
    )
}

export function useCarrinho() {
    const ctx = useContext(CarrinhoContext)
    if (!ctx) throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider')
    return ctx
}
