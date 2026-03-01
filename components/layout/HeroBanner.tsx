import Link from 'next/link'
import { ArrowRight, Printer, Palette, Package } from 'lucide-react'
import styles from './HeroBanner.module.css'

export default function HeroBanner() {
    return (
        <section className={styles.hero}>
            <div className={`container ${styles.inner}`}>
                <div className={styles.content}>
                    <div className="badge badge-accent" style={{ marginBottom: '1rem' }}>
                        🖨️ Impressão 3D Premium
                    </div>
                    <h1 className={styles.title}>
                        Objetos únicos,<br />
                        <span className={styles.accent}>impressos</span> com{' '}
                        <span className={styles.primary}>precisão</span>
                    </h1>
                    <p className={styles.subtitle}>
                        Porta copos, brinquedos, decorações e utilidades fabricados com tecnologia de impressão 3D.
                        Design exclusivo que você pode tocar.
                    </p>
                    <div className={styles.actions}>
                        <Link href="#produtos" className="btn btn-primary btn-lg">
                            Ver Produtos <ArrowRight size={20} />
                        </Link>
                    </div>

                    {/* Features */}
                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <Printer size={20} className={styles.featureIcon} />
                            <span>Impressão 3D de alta qualidade</span>
                        </div>
                        <div className={styles.feature}>
                            <Palette size={20} className={styles.featureIcon} />
                            <span>Diversas cores disponíveis</span>
                        </div>
                        <div className={styles.feature}>
                            <Package size={20} className={styles.featureIcon} />
                            <span>Frete para todo o Brasil</span>
                        </div>
                    </div>
                </div>

                {/* Decoração visual */}
                <div className={styles.visual} aria-hidden="true">
                    <div className={styles.orbit1} />
                    <div className={styles.orbit2} />
                    <div className={styles.centerIcon}>🖨️</div>
                </div>
            </div>
        </section>
    )
}
