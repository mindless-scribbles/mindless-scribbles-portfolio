import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Cormorant_Garamond, Space_Mono } from 'next/font/google';
import JournalUI, { type JournalEntry } from './JournalUI';
import styles from './journal.module.css';

const ShaderBackground = dynamic(() => import('./ShaderBackground'), { ssr: false, loading: () => null });

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
    entries: JournalEntry[];
}

export default function JournalPage({ entries }: Props) {
    const [activeShader, setActiveShader] = useState(0);
    const [isHovering, setIsHovering]     = useState(false);

    const handleEnter = (shader: number) => {
        setActiveShader(shader);
        setIsHovering(true);
    };

    const handleLeave = () => {
        setActiveShader(0);
        setIsHovering(false);
    };

    return (
        <div className={`${cormorant.variable} ${spaceMono.variable} ${styles.page}`}>
            <ShaderBackground mode={activeShader} />
            <JournalUI
                entries={entries}
                activeShader={activeShader}
                onEnter={handleEnter}
                onLeave={handleLeave}
                isHovering={isHovering}
            />
        </div>
    );
}
