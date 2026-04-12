import Link from 'next/link';
import styles from './lumo.module.css';

export default function LumoUI() {
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
                <h1 className={styles.wordSolid}>Mindless</h1>
                <h1 className={styles.wordOutline}>Scribbles</h1>
            </main>

            <footer className={styles.footer}>
                <p className={styles.mission}>
                    Specializing in <strong className={styles.missionStrong}>spatial design</strong> and
                    digital experiences that define the visual edge of tomorrow.
                </p>

                <div className={styles.actions}>
                    <a href="#" className={`${styles.btn} ${styles.btnOutline}`} data-interactive="true">
                        View Reel
                    </a>
                    <a href="#" className={`${styles.btn} ${styles.btnFill}`} data-interactive="true">
                        Start Project
                    </a>
                </div>

                <div className={styles.metadata}>
                    <span className={styles.metadataSpan}>SYS.V.2.0</span>
                    EST. MMXXIV<br />
                    PARIS / LA
                </div>
            </footer>
        </div>
    );
}
