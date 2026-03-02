import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl

    // Criar client Supabase
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() { return request.cookies.getAll() },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Atualiza sessão
    const { data: { user } } = await supabase.auth.getUser()

    // Protege /admin (exceto /admin/login)
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // Se já logado, redireciona de /admin/login para /admin
    if (pathname === '/admin/login' && user) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }

    return supabaseResponse
}

export const config = {
    matcher: ['/admin/:path*'],
}
