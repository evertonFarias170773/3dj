import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
    console.log('Faltam variáveis de ambiente (SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY).')
    console.log('Você pode rodar passando as envs, ex:')
    console.log('set NEXT_PUBLIC_SUPABASE_URL=... && set SUPABASE_SERVICE_ROLE_KEY=... && node scripts/criar-admin.mjs <seuemail> <senha>')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const args = process.argv.slice(2)
if (args.length < 2) {
    console.log('Uso incorreto. Siga este formato:')
    console.log('node scripts/criar-admin.mjs admin@teste.com minhasenha123')
    process.exit(1)
}

const email = args[0]
const password = args[1]

async function criarAdmin() {
    console.log(`Criando usuário: ${email}...`)

    const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true // Já confirma o email automaticamente
    })

    if (error) {
        if (error.message.includes('already exists')) {
            console.log('✅ Este usuário já existe! Pode fazer login com a senha que você definiu.')
        } else {
            console.error('❌ Erro ao criar usuário:', error.message)
        }
        process.exit(1)
    }

    console.log('✅ Usuário Admin criado com sucesso!')
    console.log(`\nAgora você pode acessar http://localhost:3000/admin/login e usar:`)
    console.log(`Email: ${email}`)
    console.log(`Senha: ${password}`)
}

criarAdmin()
