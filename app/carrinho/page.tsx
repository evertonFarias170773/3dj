import type { Metadata } from 'next'
import CarrinhoClient from '@/components/carrinho/CarrinhoClient'

export const metadata: Metadata = {
    title: 'Meu Carrinho | J3D Store',
    description: 'Finalize sua compra de impressões 3D maravilhosas.',
}

export default function CarrinhoPage() {
    return (
        <main style={{ backgroundColor: '#F8F9FA', minHeight: 'calc(100vh - 130px)', padding: '40px 0' }}>
            <div className="container">
                <CarrinhoClient />
            </div>
        </main>
    )
}
