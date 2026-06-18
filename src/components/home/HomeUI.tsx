import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styles from './home.module.css';
import { VERSION_SHORT, EST_ROMAN, LOCATION, EMAIL } from '@/lib/site-meta';

// Hover-glitch timing: fast burst, then hold on the glitch font.
const GLITCH_IN_MS = 650;

type GlitchState = 'idle' | 'in' | 'held';

export default function HomeUI() {
    const [copied, setCopied] = useState(false);

    // 'Mindless' font glitch: idle → in (burst) → held (stays on Rubik Glitch).
    // Fires once, then locked; a page refresh resets it to idle (Playfair).
    const [glitch, setGlitch] = useState<GlitchState>('idle');
    const lockRef = useRef(false);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    useEffect(() => {
        const timers = timersRef.current;
        return () => timers.forEach(clearTimeout);
    }, []);

    const triggerGlitch = () => {
        if (lockRef.current) return;
        lockRef.current = true;
        setGlitch('in');
        timersRef.current.push(
            setTimeout(() => setGlitch('held'), GLITCH_IN_MS),
        );
    };

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(EMAIL);
            setCopied(true);
            setTimeout(() => setCopied(false), 1800);
        } catch {
            // clipboard unavailable — fail silently
        }
    };

    return (
        <div className={styles.ui}>
            <header className={styles.header}>
                <a href="#" className={styles.brand}>
                    <span className={styles.brandLetters}>
                        <span className={styles.brandM}>M</span>
                        <span className={styles.brandS}>S</span>
                    </span>
                    <span className={styles.brandSub}>Creative Agency</span>
                </a>
                <nav className={styles.nav}>
                    <Link href="/expertise" className={styles.navLink} data-interactive="true">Expertise</Link>
                    <Link href="/journal" className={styles.navLink} data-interactive="true">Journal</Link>
                    <Link href="/contact" className={styles.navLink} data-interactive="true">Contact</Link>
                </nav>
            </header>

            <main className={styles.heroArea}>
                <h1
                    className={styles.wordSolid}
                    data-glitch={glitch}
                    onMouseEnter={triggerGlitch}
                >
                    <span className={styles.wordLayerSerif}>Mindless</span>
                    <span className={styles.wordLayerGlitch} data-text="Mindless" aria-hidden="true">
                        Mindless
                    </span>
                </h1>
                <h1 className={styles.wordOutline}>Scribbles</h1>
            </main>

            <footer className={styles.footer}>
                <p className={styles.mission}>
                    <strong className={styles.missionStrong}>CREATIVE TECHNOLOGIST</strong> specializing in
                    digital experiences and visual experiments that embody an ethos of contrasting simplicity combined with chaotic harmony.
                </p>

                <div className={styles.actions}>
                    <a href="#" className={`${styles.btn} ${styles.btnOutline}`} data-interactive="true">
                        Current<br />Experiment
                    </a>
                </div>

                <div className={styles.metadata}>
                    <span className={styles.metadataSpan}>{VERSION_SHORT}</span>
                    {EST_ROMAN}<br />
                    {LOCATION}<br />
                    <button
                        type="button"
                        className={styles.emailBtn}
                        onClick={copyEmail}
                        data-interactive="true"
                    >
                        {EMAIL}
                        <span
                            className={`${styles.copiedTip} ${copied ? styles.copiedTipVisible : ''}`}
                            aria-hidden={!copied}
                        >
                            Email copied
                        </span>
                    </button>
                </div>
            </footer>
        </div>
    );
}
