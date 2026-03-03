import { createClient } from '@/lib/supabase/server'
import AdminTagsClient from '@/components/admin/AdminTagsClient'

export default async function AdminTagsPage() {
    const supabase = await createClient()
    const { data: tags } = await supabase
        .from('tags')
        .select('*')
        .order('nome', { ascending: true })

    return (
        <AdminTagsClient
            tagsIniciais={tags ?? []}
        />
    )
}
