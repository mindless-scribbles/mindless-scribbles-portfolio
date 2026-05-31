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
                    <em>Technical Animator and Motion Capture Supervisor</em>, two decades shaping movement across <em>feature film, AAA games, commercials, and virtual production</em>. <em>Rigging, motion, aesthetics</em>. This site is my playground where <em>art meets engineering</em>, now in <em>creative code, real-time graphics, and generative systems</em>. Every part of it traces back to the <em>Illusion of Life</em>. Once in characters, now in <em>pixels that breathe</em>.
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
