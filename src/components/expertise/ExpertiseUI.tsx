import Link from 'next/link';
import styles from './expertise.module.css';
import { VERSION_LONG, COPYRIGHT } from '@/lib/site-meta';

const SKILLS = [
    'MAYA', 'MOTIONBUILDER', 'HOUDINI', 'TOUCHDESIGNER', 'PYTHON', 'GLSL',
    'RIGGING', 'MOCAP', 'UNREAL ENGINE', 'VIRTUAL PRODUCTION',
    'PROCEDURAL ANIMATION', 'PIPELINE TOOLS', 'REACT', 'NEXT.JS', 'THREE.JS', 'WEBGL',
];

export default function ExpertiseUI() {
    return (
        <div className={styles.wrapper}>
            {/* ─── Header ─── */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <span>{VERSION_LONG}</span>
                    <span>ABOUT / INTEL</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/">HOME</Link>
                    <Link href="/journal">JOURNAL</Link>
                    <Link href="/contact">CONTACT</Link>
                </div>
            </header>

            {/* ─── Main ─── */}
            <main className={styles.main}>
                {/* Bio */}
                <section className={styles.bio}>
                    <em>Technical Animator and Motion Capture Supervisor</em> with over two decades shaping movement across <em>feature film, AAA games, commercials and virtual production</em>. From <em>rigging and motion capture</em> to <em>visual aesthetics</em>. This website is my playground of where <em>art meets engineering</em>. Now building a new practice in <em>creative code, real-time graphics, and generative systems</em>. This is a lifetime of practice of the principles of animation giving the <em>Illusion of Life</em> to making characters move and now to making <em>pixels breathe</em>.
                </section>

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
                <span>{COPYRIGHT}</span>
                <span>LATENCY: 14MS</span>
            </footer>
        </div>
    );
}
