import { createClient } from '@/lib/supabase/server'
import AdminProdutosClient from '@/components/admin/AdminProdutosClient'

export default async function AdminProdutosPage() {
    const supabase = await createClient()
    const { data: produtos } = await supabase
        .from('produtos')
        .select('*, categorias(*), produto_cores(*), produto_imagens(*)')
        .order('criado_em', { ascending: false })

    const { data: categorias } = await supabase
        .from('categorias')
        .select('*')
        .eq('ativo', true)

    const { data: tags } = await supabase.from('tags').select('*').order('nome')

    return (
        <AdminProdutosClient
            produtosIniciais={produtos ?? []}
            categorias={categorias ?? []}
            tags={tags ?? []}
        />
    )
}
