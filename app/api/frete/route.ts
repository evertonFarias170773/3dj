import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const apiUrl = process.env.N8N_FRETE_URL

        if (!apiUrl) {
            // Retorno simulado quando API não está configurada
            return NextResponse.json({
                modalidades: [
                    { nome: 'PAC', codigo: 'pac', valor: 18.50, prazo_dias: 7 },
                    { nome: 'SEDEX', codigo: 'sedex', valor: 32.00, prazo_dias: 2 },
                ]
            })
        }

        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        })

        if (!res.ok) throw new Error('Erro na API de frete')
        const data = await res.json()
        return NextResponse.json(data)
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
