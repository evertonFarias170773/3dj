import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Mail, MessageCircle } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
    const ano = new Date().getFullYear()

    return (
        <footer className={styles.footer}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.brand}>
                    <div className={styles.logo}>
                        <Image src="/logo.png" alt="J3D Store" width={240} height={76} style={{ objectFit: 'contain' }} />
                    </div>
                    <p className={styles.tagline}>
                        Objetos únicos, impressos com precisão.<br />Design que você pode tocar.
                    </p>
                    <div className={styles.socials}>
                        <a href="https://instagram.com/j3d.impressao" aria-label="Instagram" className={styles.social} target="_blank" rel="noopener noreferrer"><Instagram size={18} /></a>
                        <a href="https://wa.me/5551985018848" aria-label="WhatsApp" className={styles.social} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /></a>
                        <a href="mailto:contato@j3dstore.com.br" aria-label="Email" className={styles.social}><Mail size={18} /></a>
                    </div>
                </div>

                <div className={styles.links}>
                    <div className={styles.col}>
                        <h4>Loja</h4>
                        <Link href="/">Todos os Produtos</Link>
                        <Link href="/?categoria=porta-copos">Porta Copos</Link>
                        <Link href="/?categoria=decoracao">Decoração</Link>
                        <Link href="/?categoria=brinquedos">Brinquedos</Link>
                        <Link href="/?categoria=utilidades">Utilidades</Link>
                    </div>
                    <div className={styles.col}>
                        <h4>Informações</h4>
                        <Link href="/sobre">Sobre Nós</Link>
                        <Link href="/como-funciona">Como Funciona</Link>
                        <Link href="/frete-prazo">Frete e Prazo</Link>
                        <Link href="/politica-privacidade">Privacidade</Link>
                    </div>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>© {ano} J3D Store. Todos os direitos reservados.</p>
                <p>Feito com 🖨️ e muita tecnologia</p>
            </div>
        </footer>
    )
}
