import dynamic from 'next/dynamic';
import { Italianno, Playfair_Display, Space_Mono } from 'next/font/google';
import LumoUI from './LumoUI';
import styles from './lumo.module.css';

// Client-only components — Three.js and DOM APIs crash during SSR/build
const ThreeBackground = dynamic(() => import('./ThreeBackground'), { ssr: false, loading: () => null });
const BlurMask        = dynamic(() => import('./BlurMask'),        { ssr: false, loading: () => null });
const CustomCursor    = dynamic(() => import('./CustomCursor'),    { ssr: false, loading: () => null });

const playfair = Playfair_Display({
    subsets: ['latin'],
    weight: ['400', '600'],
    style: ['normal', 'italic'],
    variable: '--font-serif',
    display: 'swap',
});

const spaceMono = Space_Mono({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    variable: '--font-mono',
    display: 'swap',
});

const italianno = Italianno({
    subsets: ['latin'],
    weight: '400',
    variable: '--font-script',
    display: 'swap',
});

export default function LumoPage() {
    return (
        <div className={`${playfair.variable} ${spaceMono.variable} ${italianno.variable} ${styles.page}`}>
            {/* Layer 0 — Three.js particle cloud */}
            <ThreeBackground />

            {/* Layer 1 — Watermark */}
            <div className={styles.watermark} aria-hidden="true">Don De Castro</div>

            {/* Layer 2 — Blur mask with cursor hole */}
            <BlurMask />

            {/* Layer 3 — Film grain noise */}
            <div className={styles.noise} aria-hidden="true" />

            {/* Layer 4 — Viewport frame border */}
            <div className={styles.frame} aria-hidden="true" />

            {/* Layer 10 — UI (nav, hero, footer) */}
            <LumoUI />

            {/* Layer 50 — Custom cursor */}
            <CustomCursor />
        </div>
    );
}
