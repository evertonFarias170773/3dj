import { formatBRL } from './formatters'

// Gera slug a partir do nome
export function gerarSlug(texto: string): string {
    return texto
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
}

// Formata CEP
export function formatarCEP(cep: string): string {
    const nums = cep.replace(/\D/g, '').slice(0, 8)
    return nums.length > 5 ? `${nums.slice(0, 5)}-${nums.slice(5)}` : nums
}

// Formata CPF ou CNPJ
export function formatarCPFCNPJ(valor: string): string {
    const nums = valor.replace(/\D/g, '')
    if (nums.length <= 11) {
        return nums
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    }
    return nums
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
}

// Formata telefone
export function formatarTelefone(tel: string): string {
    const nums = tel.replace(/\D/g, '').slice(0, 11)
    if (nums.length === 11) return `(${nums.slice(0, 2)}) ${nums.slice(2, 7)}-${nums.slice(7)}`
    if (nums.length === 10) return `(${nums.slice(0, 2)}) ${nums.slice(2, 6)}-${nums.slice(6)}`
    return nums
}

// Busca endereço pelo CEP (ViaCEP)
export async function buscarEnderecoPorCEP(cep: string) {
    const nums = cep.replace(/\D/g, '')
    if (nums.length !== 8) return null
    try {
        const res = await fetch(`https://viacep.com.br/ws/${nums}/json/`)
        const data = await res.json()
        if (data.erro) return null
        return {
            logradouro: data.logradouro,
            bairro: data.bairro,
            cidade: data.localidade,
            uf: data.uf,
        }
    } catch {
        return null
    }
}

export { formatBRL }
