import Link from 'next/link';
import styles from './contact.module.css';

export default function ContactUI() {
    return (
        <div className={styles.wrapper}>
            {/* ─── Header ─── */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <span>SYSTEM ARCHIVE V.04</span>
                    <span>TRANSMISSION / HANDSHAKE</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/">HOME</Link>
                    <Link href="/expertise">EXPERTISE</Link>
                    <Link href="/journal">JOURNAL</Link>
                    <Link href="/contact" className={styles.activeLink}>MAIL</Link>
                </div>
            </header>

            {/* ─── Main ─── */}
            <main className={styles.main}>
                <div className={styles.contactGrid}>
                    <form className={styles.contactForm} onSubmit={e => e.preventDefault()}>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>ID / Name</label>
                            <input type="text" placeholder="OPERATOR_01" className={styles.formInput} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Coordinates / Email</label>
                            <input type="email" placeholder="INPUT@SYSTEM.ARCHIVE" className={styles.formInput} />
                        </div>
                        <div className={styles.formGroup}>
                            <label className={styles.formLabel}>Query / Message</label>
                            <textarea rows={3} placeholder="INITIATING HANDSHAKE..." className={styles.formTextarea} />
                        </div>
                        <button type="submit" className={styles.submitBtn}>TRANSMIT_DATA</button>
                    </form>

                    <div className={styles.contactDetails}>
                        <div>CURRENT_LOC: LOS ANGELES, CA</div>
                        <div>STATUS: ONLINE / AVAILABLE FOR COLLABORATION</div>
                        <div>ARCHIVE_LAST_UPDATED: 10.04.26</div>
                        <br />
                        <div>SOCIALS:</div>
                        <a href="#">INSTAGRAM.EXE</a><br />
                        <a href="#">GITHUB.SH</a><br />
                        <a href="#">LINKEDIN.LOG</a>
                    </div>
                </div>
            </main>

            {/* ─── Footer ─── */}
            <footer className={styles.footer}>
                <span>&copy; 2016 MINDLESS SCRIBBLES INCORPORATED</span>
                <span>LATENCY: 14MS</span>
            </footer>
        </div>
    );
}
