import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js';

export default function ThreeBackground() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mount = mountRef.current;
        if (!mount) return;

        // ── Renderer ──────────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        mount.appendChild(renderer.domElement);

        // ── Scene & fog ───────────────────────────────────────────
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xEBE6E0);
        scene.fog = new THREE.FogExp2(0xEBE6E0, 0.05);

        // ── Camera ────────────────────────────────────────────────
        const camera = new THREE.PerspectiveCamera(
            35,
            window.innerWidth / window.innerHeight,
            0.01,
            40
        );
        camera.position.set(-0.8, -0.2, 1.5);
        scene.add(camera);

        // ── Controls ──────────────────────────────────────────────
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableZoom = false;
        controls.enablePan  = false;
        controls.enableDamping   = true;
        controls.dampingFactor   = 0.05;
        controls.autoRotate      = true;
        controls.autoRotateSpeed = 0.5;
        controls.target.set(0, -0.15, 0); // pivot below center of bust

        // ── Fallback geometry (torus knot particles) ──────────────
        const createFallback = () => {
            const count = 15000;
            const positions = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                const u  = Math.random() * Math.PI * 2;
                const v  = Math.random() * Math.PI * 2;
                const r  = 0.5 + 0.1 * Math.cos(v);
                positions[i3]     = r * Math.cos(u);
                positions[i3 + 1] = r * Math.sin(u);
                positions[i3 + 2] = 0.1 * Math.sin(v) + (Math.random() - 0.5) * 0.2;
            }
            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            const mat = new THREE.PointsMaterial({
                size: 0.004,
                color: 0xA89F98,
                transparent: true,
                opacity: 0.45,
            });
            const pts = new THREE.Points(geo, mat);
            scene.add(pts);
            return pts;
        };

        // ── PCD loader with fallback ──────────────────────────────
        let fallbackPoints: THREE.Points | null = null;
        const loader = new PCDLoader();
        loader.load(
            'https://threejs.org/examples/models/pcd/binary/Zaghetto.pcd',
            (points) => {
                points.geometry.center();
                points.geometry.rotateX(Math.PI);
                (points.material as THREE.PointsMaterial).size    = 0.005;
                (points.material as THREE.PointsMaterial).color.setHex(0xA89F98);
                (points.material as THREE.PointsMaterial).transparent = true;
                (points.material as THREE.PointsMaterial).opacity  = 0.45;
                scene.add(points);
            },
            undefined,
            () => { fallbackPoints = createFallback(); }
        );

        scene.add(new THREE.AmbientLight(0xffffff, 1));

        // ── Mouse influence ───────────────────────────────────────
        let mouseX = 0;
        let mouseY = 0;
        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX - window.innerWidth  / 2;
            mouseY = e.clientY - window.innerHeight / 2;
        };
        window.addEventListener('mousemove', onMouseMove);

        // ── Resize ────────────────────────────────────────────────
        const onResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onResize);

        // ── Render loop ───────────────────────────────────────────
        let rafId: number;
        const render = () => {
            rafId = requestAnimationFrame(render);

            const targetX = mouseX * 0.0005;
            const targetY = mouseY * 0.0005;
            scene.rotation.y += 0.05 * (targetX - scene.rotation.y);
            scene.rotation.x += 0.05 * (targetY - scene.rotation.x);

            if (fallbackPoints) {
                fallbackPoints.rotation.y += 0.002;
                fallbackPoints.rotation.x += 0.001;
            }

            controls.update();
            renderer.render(scene, camera);
        };
        render();

        // ── Cleanup ───────────────────────────────────────────────
        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', onResize);
            controls.dispose();
            renderer.dispose();
            if (mount.contains(renderer.domElement)) {
                mount.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={mountRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 0,
            }}
        />
    );
}
