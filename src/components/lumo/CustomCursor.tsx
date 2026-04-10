import { useEffect, useRef } from 'react';
import styles from './lumo.module.css';

export default function CustomCursor() {
    const dotRef  = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const dot  = dotRef.current;
        const ring = ringRef.current;
        if (!dot || !ring) return;

        // Hide default cursor on the document
        document.documentElement.style.cursor = 'none';

        let mx = window.innerWidth / 2;
        let my = window.innerHeight / 2;
        let rx = mx;
        let ry = my;
        let rafId: number;

        const onMove = (e: MouseEvent) => {
            mx = e.clientX;
            my = e.clientY;
            dot.style.left = `${mx}px`;
            dot.style.top  = `${my}px`;
        };

        const loop = () => {
            rx += (mx - rx) * 0.15;
            ry += (my - ry) * 0.15;
            ring.style.left = `${rx}px`;
            ring.style.top  = `${ry}px`;
            rafId = requestAnimationFrame(loop);
        };

        const onEnter = () => {
            ring.style.width           = '48px';
            ring.style.height          = '48px';
            ring.style.backgroundColor = 'rgba(211, 65, 16, 0.05)';
            ring.style.borderColor     = '#D34110';
        };

        const onLeave = () => {
            ring.style.width           = '32px';
            ring.style.height          = '32px';
            ring.style.backgroundColor = 'transparent';
            ring.style.borderColor     = 'rgba(211, 65, 16, 0.4)';
        };

        document.addEventListener('mousemove', onMove);
        rafId = requestAnimationFrame(loop);

        // Attach hover handlers to all interactive elements
        const attachHover = () => {
            document.querySelectorAll<HTMLElement>('[data-interactive]').forEach((el) => {
                el.addEventListener('mouseenter', onEnter);
                el.addEventListener('mouseleave', onLeave);
            });
        };
        attachHover();

        return () => {
            document.documentElement.style.cursor = '';
            document.removeEventListener('mousemove', onMove);
            cancelAnimationFrame(rafId);
            document.querySelectorAll<HTMLElement>('[data-interactive]').forEach((el) => {
                el.removeEventListener('mouseenter', onEnter);
                el.removeEventListener('mouseleave', onLeave);
            });
        };
    }, []);

    return (
        <>
            <div ref={dotRef}  className={styles.cursorDot} />
            <div ref={ringRef} className={styles.cursorRing} />
        </>
    );
}
