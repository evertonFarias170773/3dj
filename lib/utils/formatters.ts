export function formatBRL(valor: number): string {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function formatarData(data: string): string {
    return new Date(data).toLocaleDateString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    })
}

export function formatarDataHora(data: string): string {
    return new Date(data).toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

export const STATUS_LABELS: Record<string, string> = {
    pendente: 'Pendente',
    pago: 'Pago',
    producao: 'Em Produção',
    enviado: 'Enviado',
    entregue: 'Entregue',
    cancelado: 'Cancelado',
}

export const STATUS_COLORS: Record<string, string> = {
    pendente: '#F97316',
    pago: '#22C55E',
    producao: '#3B82F6',
    enviado: '#8B5CF6',
    entregue: '#22C55E',
    cancelado: '#EF4444',
}
