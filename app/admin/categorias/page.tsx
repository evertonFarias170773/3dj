import { createClient } from '@/lib/supabase/server'
import AdminCategoriasClient from '@/components/admin/AdminCategoriasClient'

export default async function AdminCategoriasPage() {
    const supabase = await createClient()
    const { data: categorias } = await supabase
        .from('categorias')
        .select('*')
        .order('nome', { ascending: true })

    return (
        <AdminCategoriasClient
            categoriasIniciais={categorias ?? []}
        />
    )
}
