import { useEffect, useRef } from 'react';
import styles from './journal.module.css';

const VS = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

// Cellular / Voronoi-style organic pattern — static, autonomous animation
const FS = `
    precision highp float;
    uniform vec2  u_resolution;
    uniform float u_time;

    vec2 hash2(vec2 p) {
        p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
        return fract(sin(p) * 43758.5453123);
    }

    // Cellular noise: returns distance to nearest feature point
    float cellular(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float minDist = 8.0;
        for (int y = -1; y <= 1; y++) {
            for (int x = -1; x <= 1; x++) {
                vec2 neighbor = vec2(float(x), float(y));
                vec2 point = hash2(i + neighbor);
                // Animate each point in a slow Lissajous orbit
                point = 0.5 + 0.5 * sin(u_time * 0.18 + 6.2831 * point);
                float dist = length(neighbor + point - f);
                minDist = min(minDist, dist);
            }
        }
        return minDist;
    }

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        // Two octaves of cellular noise at different scales / speeds
        float c1 = cellular(st * 3.2 + vec2(0.0,          u_time * 0.05));
        float c2 = cellular(st * 6.5 + vec2(u_time * 0.03, 1.7));

        // Soft cell-wall lines
        float walls = smoothstep(0.04, 0.12, c1) * smoothstep(0.04, 0.12, c2);

        // Slow large-scale gradient pulse
        float pulse = 0.5 + 0.5 * sin(u_time * 0.07 + st.x * 1.5 + st.y * 0.8);

        float pattern = walls * (0.85 + 0.15 * pulse);

        vec3 colorBg = vec3(0.922, 0.902, 0.878); // #EBE6E0
        vec3 colorFg = vec3(0.121, 0.105, 0.094); // #1A1817

        // Very subtle: cell walls appear as faint dark lines
        vec3 finalColor = mix(colorFg, colorBg, pattern * 0.97 + 0.03);
        gl_FragColor = vec4(finalColor, 1.0);
    }
`;

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compile error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

export default function EntryShaderBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl');
        if (!gl) return;

        const vs = loadShader(gl, gl.VERTEX_SHADER, VS);
        const fs = loadShader(gl, gl.FRAGMENT_SHADER, FS);
        if (!vs || !fs) return;

        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);

        const locs = {
            position:   gl.getAttribLocation(program,  'aVertexPosition'),
            resolution: gl.getUniformLocation(program, 'u_resolution'),
            time:       gl.getUniformLocation(program, 'u_time'),
        };

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,-1, -1,-1, 1,1, -1,1]), gl.STATIC_DRAW);

        let rafId: number;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const render = (now: number) => {
            rafId = requestAnimationFrame(render);
            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.vertexAttribPointer(locs.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(locs.position);
            gl.uniform2f(locs.resolution, canvas.width, canvas.height);
            gl.uniform1f(locs.time, now * 0.001);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('resize', resize);
            gl.deleteProgram(program);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} style={{ opacity: 0.8 }} />;
}
