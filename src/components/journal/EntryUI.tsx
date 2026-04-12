import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import styles from './journal.module.css';
import { VERSION_LONG } from '@/lib/site-meta';

interface LogEntry {
    date: string;
    desc: string;
}

interface Specs {
    technology?: string;
    fps?: string;
    compute?: string;
    hardware?: string;
}

interface Download {
    filename: string;
    size: string;
    build: string;
    url: string;
}

export interface EntryData {
    titleLine1: string;
    titleLine2: string;
    ref: string;
    specs: Specs;
    download: Download;
    log: LogEntry[];
    body: string;
}

interface Props {
    entry: EntryData;
}

export default function EntryUI({ entry }: Props) {
    const { titleLine1, titleLine2, ref, specs, download, log, body } = entry;

    return (
        <div className={styles.wrapper}>
            {/* ─── Header ─── */}
            <header className={styles.header}>
                <div className={styles.headerLeft}>
                    <span>{VERSION_LONG}</span>
                    <span>{ref}</span>
                </div>
                <div className={styles.headerRight}>
                    <Link href="/">HOME</Link>
                    <Link href="/expertise">EXPERTISE</Link>
                    <Link href="/journal">JOURNAL</Link>
                    <Link href="/contact">CONTACT</Link>
                </div>
            </header>

            {/* ─── Main ─── */}
            <main className={styles.entryMain}>
                {/* Hero title — spans both columns */}
                <div className={styles.projectHero}>
                    <h1 className={styles.projectTitle}>
                        {titleLine1}
                        <br />
                        <em>{titleLine2}</em>
                    </h1>
                </div>

                {/* Left column: description + process log */}
                <div className={styles.contentBlock}>
                    <div className={styles.description}>
                        <Markdown>{body}</Markdown>
                    </div>

                    <div className={styles.processLog}>
                        <div className={styles.processLogHeader}>Process Log</div>
                        {log.map((entry, i) => (
                            <div key={i} className={styles.logEntry}>
                                <span className={styles.logTime}>{entry.date}</span>
                                <span className={styles.logDesc}>{entry.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right column: download + specs */}
                <aside className={styles.sidebar}>
                    <div className={styles.downloadZone}>
                        <span className={styles.downloadLabel}>Download File</span>
                        <span className={styles.downloadFilename}>{download.filename}</span>
                        <a
                            href={download.url}
                            className={styles.btnDownload}
                            download
                        >
                            Download ({download.size})
                        </a>
                        <span className={styles.downloadBuild}>Build {download.build}</span>
                    </div>

                    <div className={styles.specsGrid}>
                        {Object.entries(specs).map(([label, value]) => (
                            <div key={label} className={styles.specItem}>
                                <span className={styles.specLabel}>{label}</span>
                                <span>{value}</span>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>

            {/* ─── Footer ─── */}
            <footer className={styles.entryFooter}>
                <span>{ref}</span>
                <span>MINDLESS SCRIBBLES</span>
            </footer>
        </div>
    );
}
