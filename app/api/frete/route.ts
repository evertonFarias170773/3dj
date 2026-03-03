import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { cep_destino, peso_total_gramas, comprimento_mm, largura_mm, altura_mm } = body

        // O webhook requer cm (mínimo 20cm por dimensão) e peso em gramas (mínimo 300g)
        const comprimento = Math.max(20, Math.ceil((comprimento_mm || 200) / 10))
        const largura = Math.max(20, Math.ceil((largura_mm || 200) / 10))
        const altura = Math.max(20, Math.ceil((altura_mm || 200) / 10))
        const peso = Math.max(300, peso_total_gramas || 300)

        const payloadDestino = {
            cepDestino: cep_destino,
            psObjeto: peso,
            comprimento: comprimento.toString(),
            largura: largura.toString(),
            altura: altura.toString(),
            vlDeclarado: "0"
        }

        const res = await fetch('https://10074.hostoo.net.br/webhook/correios-j3d', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payloadDestino),
        })

        if (!res.ok) throw new Error('Erro na API de frete dos Correios')
        const data = await res.json()

        if (Array.isArray(data) && data.length > 0) {
            const modalidades = data.map(mod => ({
                nome: mod.servico,
                codigo: mod.servico.toLowerCase(),
                valor: mod.valor,
                prazo_dias: mod.prazo
            }))
            return NextResponse.json({ modalidades })
        } else if (data && data.servico) {
            return NextResponse.json({
                modalidades: [{
                    nome: data.servico,
                    codigo: data.servico.toLowerCase(),
                    valor: data.valor,
                    prazo_dias: data.prazo
                }]
            })
        }

        return NextResponse.json({ modalidades: [] })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
