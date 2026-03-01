export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
    public: {
        Tables: {
            categorias: {
                Row: {
                    id: string
                    nome: string
                    slug: string
                    descricao: string | null
                    icone: string | null
                    ativo: boolean
                    criado_em: string
                }
                Insert: Omit<Database['public']['Tables']['categorias']['Row'], 'id' | 'criado_em'> & { id?: string; criado_em?: string }
                Update: Partial<Database['public']['Tables']['categorias']['Insert']>
            }
            produtos: {
                Row: {
                    id: string
                    categoria_id: string | null
                    nome: string
                    slug: string
                    descricao_curta: string | null
                    descricao: string | null
                    material: string | null
                    peso_gramas: number | null
                    comprimento_mm: number | null
                    largura_mm: number | null
                    altura_mm: number | null
                    preco_base: number
                    setup_valor: number
                    quantidade_minima: number
                    ativo: boolean
                    destaque: boolean
                    criado_em: string
                    atualizado_em: string
                }
                Insert: Omit<Database['public']['Tables']['produtos']['Row'], 'id' | 'criado_em' | 'atualizado_em'> & { id?: string }
                Update: Partial<Database['public']['Tables']['produtos']['Insert']>
            }
            produto_cores: {
                Row: {
                    id: string
                    produto_id: string
                    nome: string
                    hex: string
                    ativo: boolean
                    criado_em: string
                }
                Insert: Omit<Database['public']['Tables']['produto_cores']['Row'], 'id' | 'criado_em'> & { id?: string }
                Update: Partial<Database['public']['Tables']['produto_cores']['Insert']>
            }
            produto_imagens: {
                Row: {
                    id: string
                    produto_id: string
                    cor_id: string | null
                    url: string
                    ordem: number
                    principal: boolean
                    criado_em: string
                }
                Insert: Omit<Database['public']['Tables']['produto_imagens']['Row'], 'id' | 'criado_em'> & { id?: string }
                Update: Partial<Database['public']['Tables']['produto_imagens']['Insert']>
            }
            tags: {
                Row: { id: string; nome: string; slug: string }
                Insert: Omit<Database['public']['Tables']['tags']['Row'], 'id'> & { id?: string }
                Update: Partial<Database['public']['Tables']['tags']['Insert']>
            }
            produto_tags: {
                Row: { produto_id: string; tag_id: string }
                Insert: Database['public']['Tables']['produto_tags']['Row']
                Update: Partial<Database['public']['Tables']['produto_tags']['Insert']>
            }
            pedidos: {
                Row: {
                    id: string
                    numero: number
                    status: 'pendente' | 'pago' | 'producao' | 'enviado' | 'entregue' | 'cancelado'
                    cliente_nome: string
                    cliente_email: string
                    cliente_cpf_cnpj: string | null
                    cliente_telefone: string | null
                    endereco_cep: string
                    endereco_logradouro: string
                    endereco_numero: string | null
                    endereco_complemento: string | null
                    endereco_bairro: string | null
                    endereco_cidade: string
                    endereco_uf: string
                    subtotal: number
                    frete_valor: number
                    desconto: number
                    total: number
                    forma_pagamento: 'pix' | 'cartao' | null
                    pagamento_status: string
                    pagamento_id: string | null
                    observacoes: string | null
                    criado_em: string
                    atualizado_em: string
                }
                Insert: Omit<Database['public']['Tables']['pedidos']['Row'], 'id' | 'numero' | 'criado_em' | 'atualizado_em'>
                Update: Partial<Database['public']['Tables']['pedidos']['Insert']>
            }
            pedido_itens: {
                Row: {
                    id: string
                    pedido_id: string
                    produto_id: string
                    cor_id: string | null
                    quantidade: number
                    preco_unitario: number
                    setup_valor: number
                    subtotal: number
                }
                Insert: Omit<Database['public']['Tables']['pedido_itens']['Row'], 'id'>
                Update: Partial<Database['public']['Tables']['pedido_itens']['Insert']>
            }
        }
    }
}

// =========================================
// TIPOS DERIVADOS — uso no app
// =========================================
export type Categoria = Database['public']['Tables']['categorias']['Row']
export type Produto = Database['public']['Tables']['produtos']['Row']
export type ProdutoCor = Database['public']['Tables']['produto_cores']['Row']
export type ProdutoImagem = Database['public']['Tables']['produto_imagens']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Pedido = Database['public']['Tables']['pedidos']['Row']
export type PedidoItem = Database['public']['Tables']['pedido_itens']['Row']

// Produto com joins
export interface ProdutoCompleto extends Produto {
    categorias: Categoria | null
    produto_cores: ProdutoCor[]
    produto_imagens: ProdutoImagem[]
    tags: Tag[]
}

// Carrinho (localStorage)
export interface ItemCarrinho {
    produto: ProdutoCompleto
    cor: ProdutoCor | null
    quantidade: number
    preco_unitario: number  // já com setup diluído
}

// Cálculo de preço
export function calcularPrecoUnitario(preco_base: number, setup_valor: number, quantidade: number): number {
    return preco_base + (setup_valor / Math.max(quantidade, 1))
}

export function calcularTotal(preco_base: number, setup_valor: number, quantidade: number): number {
    const unitario = calcularPrecoUnitario(preco_base, setup_valor, quantidade)
    return unitario * quantidade
}
