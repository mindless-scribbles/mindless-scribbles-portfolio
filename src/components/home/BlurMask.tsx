import { useEffect, useRef } from 'react';
import styles from './home.module.css';

export default function BlurMask() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const onMove = (e: MouseEvent) => {
            el.style.setProperty('--x', `${e.clientX}px`);
            el.style.setProperty('--y', `${e.clientY}px`);
        };

        // Start centered until first mouse move
        el.style.setProperty('--x', `${window.innerWidth / 2}px`);
        el.style.setProperty('--y', `${window.innerHeight / 2}px`);

        document.addEventListener('mousemove', onMove);
        return () => document.removeEventListener('mousemove', onMove);
    }, []);

    return <div ref={ref} className={styles.blurMask} />;
}
