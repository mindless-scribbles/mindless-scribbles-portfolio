import dynamic from 'next/dynamic';
import { Cormorant_Garamond, Space_Mono } from 'next/font/google';
import ContactUI from './ContactUI';
import styles from './contact.module.css';

const ShaderBackground = dynamic(() => import('../journal/ShaderBackground'), { ssr: false, loading: () => null });

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

export default function ContactPage() {
    return (
        <div className={`${cormorant.variable} ${spaceMono.variable} ${styles.page}`}>
            <ShaderBackground mode={0} />
            <ContactUI />
        </div>
    );
}
