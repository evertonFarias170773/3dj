import { createClient } from '../../supabase/server'
import { ProdutoCompleto } from '../../types/database'

export async function getProdutos(params?: {
    categoriaSlug?: string
    busca?: string
    tagSlug?: string
    destaque?: boolean
    limit?: number
    offset?: number
}): Promise<ProdutoCompleto[]> {
    const supabase = await createClient()

    let query = supabase
        .from('produtos')
        .select(`
      *,
      categorias(*),
      produto_cores(*),
      produto_imagens(*),
      tags:produto_tags(tags(*))
    `)
        .eq('ativo', true)
        .order('criado_em', { ascending: false })

    if (params?.categoriaSlug) {
        const { data: cat } = await supabase.from('categorias').select('id').eq('slug', params.categoriaSlug).single()
        if (cat) query = query.eq('categoria_id', cat.id)
    }

    if (params?.destaque) query = query.eq('destaque', true)
    if (params?.busca) query = query.ilike('nome', `%${params.busca}%`)
    if (params?.limit) query = query.limit(params.limit)
    if (params?.offset) query = query.range(params.offset, (params.offset + (params?.limit ?? 20)) - 1)

    const { data, error } = await query

    if (error) {
        console.error('Erro ao buscar produtos:', error)
        return []
    }

    // Normaliza tags (join table)
    let produtos = (data ?? []).map((p: any) => ({
        ...p,
        tags: p.tags?.map((t: any) => t.tags).filter(Boolean) ?? [],
    })) as ProdutoCompleto[]

    if (params?.tagSlug) {
        produtos = produtos.filter(p => p.tags.some(t => t.slug === params.tagSlug))
    }

    return produtos
}

export async function getProdutoBySlug(slug: string): Promise<ProdutoCompleto | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('produtos')
        .select(`
      *,
      categorias(*),
      produto_cores(*),
      produto_imagens(*),
      tags:produto_tags(tags(*))
    `)
        .eq('slug', slug)
        .eq('ativo', true)
        .single()

    if (error || !data) return null

    return {
        ...data,
        tags: (data as any).tags?.map((t: any) => t.tags).filter(Boolean) ?? [],
    } as ProdutoCompleto
}

export async function getCategorias() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('categorias')
        .select('*')
        .eq('ativo', true)
        .order('nome')
    return data ?? []
}

export async function getTags() {
    const supabase = await createClient()
    const { data } = await supabase
        .from('tags')
        .select('*')
        .order('nome')
    return data ?? []
}

export async function getProdutosRelacionados(produtoId: string, categoriaId: string | null, limit = 4): Promise<ProdutoCompleto[]> {
    const supabase = await createClient()

    let query = supabase
        .from('produtos')
        .select(`*, categorias(*), produto_cores(*), produto_imagens(*), tags:produto_tags(tags(*))`)
        .eq('ativo', true)
        .neq('id', produtoId)
        .limit(limit)

    if (categoriaId) query = query.eq('categoria_id', categoriaId)

    const { data } = await query
    return (data ?? []).map((p: any) => ({
        ...p,
        tags: p.tags?.map((t: any) => t.tags).filter(Boolean) ?? [],
    })) as ProdutoCompleto[]
}
