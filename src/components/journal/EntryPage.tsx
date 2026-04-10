import dynamic from 'next/dynamic';
import { Cormorant_Garamond, Space_Mono } from 'next/font/google';
import EntryUI, { type EntryData } from './EntryUI';
import styles from './journal.module.css';

const EntryShaderBackground = dynamic(() => import('./EntryShaderBackground'), { ssr: false, loading: () => null });

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['400', '600'],
    style: ['normal', 'italic'],
    variable: '--font-display',
    display: 'swap',
});

const spaceMono = Space_Mono({
    subsets: ['latin'],
    weight: ['400', '700'],
    style: ['normal', 'italic'],
    variable: '--font-mono',
    display: 'swap',
});

interface Props {
    entry: EntryData;
}

export default function EntryPage({ entry }: Props) {
    return (
        <div className={`${cormorant.variable} ${spaceMono.variable} ${styles.page}`}>
            <EntryShaderBackground />
            <EntryUI entry={entry} />
        </div>
    );
}
