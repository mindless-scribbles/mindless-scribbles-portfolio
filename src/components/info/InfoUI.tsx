import Link from 'next/link';
import styles from './info.module.css';

const SKILLS = [
    'MAYA', 'MOTIONBUILDER', 'HOUDINI', 'TOUCHDESIGNER', 'PYTHON', 'GLSL',
    'RIGGING', 'MOCAP', 'UNREAL ENGINE', 'VIRTUAL PRODUCTION',
    'PROCEDURAL ANIMATION', 'PIPELINE TOOLS', 'REACT', 'NEXT.JS', 'THREE.JS', 'WEBGL',
];

export default function InfoUI() {
    return (
        <div className={styles.wrapper}>
            {/* ─── Header ─── */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <span>SYSTEM ARCHIVE V.04</span>
                    <span>ABOUT / INTEL</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/">HOME</Link>
                    <Link href="/info" className={styles.activeLink}>INFO</Link>
                    <Link href="/journal">JOURNAL</Link>
                    <a href="#contact">MAIL</a>
                </div>
            </header>

            {/* ─── Main ─── */}
            <main className={styles.main}>
                {/* Bio */}
                <section className={styles.bio}>
                    <em>Technical Animator and Motion Capture Supervisor</em> with over two decades shaping movement across <em>feature film, AAA games, commercials and virtual production</em>. From <em>rigging and motion capture</em> to <em>visual aesthetics</em>. This website is my playground of where <em>art meets engineering</em>. Now building a new practice in <em>creative code, real-time graphics, and generative systems</em>. This is a lifetime of practice of the principles of animation giving the <em>Illusion of Life</em> to making characters move and now to making <em>pixels breathe</em>.
                </section>

                {/* Contact */}
                <div id="contact" className={styles.contactGrid}>
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

                {/* Marquee */}
                <div className={styles.marquee}>
                    <div className={styles.marqueeTrack}>
                        {SKILLS.map(s => <span key={s}>{s}</span>)}
                        {SKILLS.map(s => <span key={`dup-${s}`}>{s}</span>)}
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
