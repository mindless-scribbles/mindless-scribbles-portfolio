import Link from 'next/link';
import styles from './journal.module.css';
import { VERSION_LONG } from '@/lib/site-meta';

export interface JournalEntry {
    label: string;
    tag: string;
    shader: number;
    italic: boolean;
    slug: string | null;
}

const indexItems = [
    {
        title: 'REACTION DIFFUSION.TOX',
        meta: '2023 / GLSL TOP / 60FPS',
        desc: 'Custom GLSL material simulating gray-scott reaction diffusion. Driven by optical flow from live camera input.',
    },
    {
        title: 'KINECT_CLOUD.TOX',
        meta: '2023 / CHOP → SOP / 30FPS',
        desc: 'Azure Kinect depth map converted to point cloud. Positions driven by multi-layered simplex noise and audio reactivity.',
    },
    {
        title: 'FEEDBACK_LOOP.TOX',
        meta: '2022 / TOP / 120FPS',
        desc: 'Recursive displacement network using Slope and Displace TOPs. Generates infinite organic fractal structures.',
    },
    {
        title: 'AUDIO_FFT_RIG.TOX',
        meta: '2022 / AUDIO DEV OUT / —',
        desc: 'Modular audio analysis rig. Splits frequency bands into normalized channels to drive arbitrary parameters globally.',
    },
];

interface Props {
    entries: JournalEntry[];
    activeShader: number;
    onEnter: (shader: number) => void;
    onLeave: () => void;
    isHovering: boolean;
}

export default function JournalUI({ entries, activeShader, onEnter, onLeave, isHovering }: Props) {
    return (
        <div className={styles.wrapper}>
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <span>{VERSION_LONG}</span>
                    <span>BASED IN [GLSL/TD]</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/">HOME</Link>
                    <Link href="/expertise">EXPERTISE</Link>
                    <Link href="/contact">CONTACT</Link>
                </div>
            </header>

            <main className={styles.main}>
                <div className={`${styles.monumentalList} ${isHovering ? styles.isHovering : ''}`}>
                    {entries.map((entry, i) => {
                        const inner = (
                            <span
                                className={`${styles.projectItem} ${activeShader === entry.shader && isHovering ? styles.active : ''}`}
                                onMouseEnter={() => onEnter(entry.shader)}
                                onMouseLeave={onLeave}
                            >
                                {entry.italic ? <i>{entry.label}</i> : entry.label}
                                <sup className={styles.superscript}>({entry.tag})</sup>
                            </span>
                        );

                        return (
                            <span key={i}>
                                {entry.slug
                                    ? <Link href={`/journal/${entry.slug}`} className={styles.entryLink}>{inner}</Link>
                                    : inner
                                }
                                {i < entries.length - 1 && (
                                    <span className={styles.separator}>/</span>
                                )}
                            </span>
                        );
                    })}
                </div>
            </main>

            <footer className={styles.footer}>
                <div className={styles.indexHeader}>SYSTEM SPECIFICATIONS / REPOSITORY LOG</div>
                <div className={styles.indexGrid}>
                    {indexItems.map((item, i) => (
                        <div key={i} className={styles.indexItem}>
                            <span className={styles.indexTitle}>{item.title}</span>
                            <span className={styles.indexMeta}>{item.meta}</span>
                            <span className={styles.indexDesc}>{item.desc}</span>
                        </div>
                    ))}
                </div>
            </footer>
        </div>
    );
}
