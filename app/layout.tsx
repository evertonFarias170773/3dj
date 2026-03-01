import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import { CarrinhoProvider } from '@/lib/hooks/useCarrinho'

export const metadata: Metadata = {
  title: {
    default: '3D Print Store — Objetos Únicos Impressos em 3D',
    template: '%s | 3D Print Store',
  },
  description: 'Porta copos, brinquedos, decorações e utilidades fabricados em impressora 3D. Design exclusivo, qualidade premium.',
  keywords: ['impressão 3D', 'porta copos 3D', 'decoração 3D', 'brinquedos 3D', 'objetos impressos'],
  openGraph: {
    siteName: '3D Print Store',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <CarrinhoProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <WhatsAppButton />
        </CarrinhoProvider>
      </body>
    </html>
  )
}
