import { useRef, useState } from 'react';
import Link from 'next/link';
import styles from './home.module.css';
import { VERSION_SHORT, EST_ROMAN, LOCATION, EMAIL } from '@/lib/site-meta';

// Hover-glitch: the Playfair word eases into a distorted (SVG-displaced)
// end-state with a decelerating chromatic burst. Fires once; refresh resets.
type GlitchState = 'idle' | 'on';

export default function HomeUI() {
    const [copied, setCopied] = useState(false);

    // 'Mindless' glitch: idle → on. Same font throughout — 'on' applies an SVG
    // displacement filter (eased in via SMIL) so the glyphs settle into a
    // shredded glitch look. Fires once; a page refresh resets it.
    const [glitch, setGlitch] = useState<GlitchState>('idle');
    const lockRef = useRef(false);

    const triggerGlitch = () => {
        if (lockRef.current) return;
        lockRef.current = true;
        setGlitch('on');
        // Ease the displacement scale up and freeze it. SMIL can't be driven by
        // CSS, so trigger the <animate> imperatively.
        const distort = document.getElementById('mindlessDistortAnim');
        (distort as unknown as SVGAnimateElement | null)?.beginElement();
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
            {/* Distortion filter for the 'held' glitch end-state — turbulence
                displacement shreds the Playfair glyphs into horizontal slices. */}
            <svg className={styles.glitchDefs} aria-hidden="true" focusable="false">
                <filter id="mindlessGlitchDistort" x="-25%" y="-5%" width="150%" height="110%" colorInterpolationFilters="sRGB">
                    <feTurbulence type="fractalNoise" baseFrequency="0.01 0.3" numOctaves={1} seed={11} result="noise" />
                    {/* Quantize horizontal displacement into hard-edged chunk
                        offsets; flatten the vertical channel to 0.5 so the word
                        displaces only sideways and never drifts up/down. */}
                    <feComponentTransfer in="noise" result="map">
                        <feFuncR type="discrete" tableValues="0 0.16 0.33 0.5 0.66 0.83 1" />
                        <feFuncG type="discrete" tableValues="0.5" />
                    </feComponentTransfer>
                    <feDisplacementMap in="SourceGraphic" in2="map" scale={0} xChannelSelector="R" yChannelSelector="G">
                        {/* Ease the shred in and freeze it (decelerating end). */}
                        <animate id="mindlessDistortAnim" attributeName="scale" begin="indefinite"
                            dur="0.8s" values="0;24" keyTimes="0;1"
                            calcMode="spline" keySplines="0.16 1 0.3 1" fill="freeze" />
                    </feDisplacementMap>
                </filter>
            </svg>

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
                    <span className={styles.wordGlitch} data-text="Mindless">Mindless</span>
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
