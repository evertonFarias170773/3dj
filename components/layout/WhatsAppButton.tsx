'use client'

import { Phone } from 'lucide-react'

export default function WhatsAppButton() {
    return (
        <a
            href="https://wa.me/5551985018848"
            target="_blank"
            rel="noopener noreferrer"
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '60px',
                height: '60px',
                backgroundColor: '#25D366',
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999,
                transition: 'transform 200ms ease'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            aria-label="Fale conosco no WhatsApp"
        >
            <Phone size={32} fill="white" strokeWidth={0} />
        </a>
    )
}
