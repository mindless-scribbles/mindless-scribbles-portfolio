import { useEffect, useRef } from 'react';
import styles from './journal.module.css';

interface Props {
    mode: number;
}

const VS = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

const FS = `
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;
    uniform float u_mode;

    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod(i, 289.0);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m; m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
    }

    float fbm(vec2 x) {
        float v = 0.0;
        float a = 0.5;
        vec2 shift = vec2(100.0);
        mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
        for (int i = 0; i < 5; ++i) {
            v += a * snoise(x);
            x = rot * x * 2.0 + shift;
            a *= 0.5;
        }
        return v;
    }

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;
        st.x *= u_resolution.x / u_resolution.y;

        vec2 mouse = u_mouse / u_resolution;
        mouse.x *= u_resolution.x / u_resolution.y;

        vec2 q = vec2(0.);
        q.x = fbm(st + 0.00 * u_time);
        q.y = fbm(st + vec2(1.0));

        float speed = 0.15;
        float scale = 2.5;
        if (u_mode == 1.0)      { scale = 4.0; speed = 0.3; }
        else if (u_mode == 2.0) { scale = 0.8; speed = 0.05; }
        else if (u_mode == 3.0) { scale = 8.0; speed = 0.6; }
        else if (u_mode == 4.0) { scale = 1.8; speed = 0.8; }

        float dist = distance(st, mouse);
        float influence = smoothstep(0.6, 0.0, dist) * (u_mode > 0.0 ? 1.2 : 0.1);

        vec2 r = vec2(0.);
        r.x = fbm(st + scale * q + vec2(1.7, 9.2) + 0.1  * u_time * speed + influence);
        r.y = fbm(st + scale * q + vec2(8.3, 2.8) + 0.08 * u_time * speed - influence);

        float f = fbm(st + scale * r);

        vec3 colorBg = vec3(0.922, 0.902, 0.878); // #EBE6E0
        vec3 colorFg = vec3(0.121, 0.105, 0.094);

        float pattern = smoothstep(0.3, 0.7, f);
        if (u_mode > 0.0) {
            pattern = fract(f * 4.0);
            pattern = smoothstep(0.4, 0.5, pattern) - smoothstep(0.5, 0.6, pattern);
        }

        vec3 finalColor = mix(colorBg, colorFg, pattern * 0.15);
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

export default function ShaderBackground({ mode }: Props) {
    const canvasRef  = useRef<HTMLCanvasElement>(null);
    const modeRef    = useRef(mode);

    // Keep modeRef in sync without restarting the WebGL loop
    useEffect(() => { modeRef.current = mode; }, [mode]);

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
            mouse:      gl.getUniformLocation(program, 'u_mouse'),
            mode:       gl.getUniformLocation(program, 'u_mode'),
        };

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,-1, -1,-1, 1,1, -1,1]), gl.STATIC_DRAW);

        let mouseX = 0;
        let mouseY = 0;
        let currentMode = 0;
        let rafId: number;

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = window.innerHeight - e.clientY;
        };
        window.addEventListener('mousemove', onMouseMove);

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const render = (now: number) => {
            rafId = requestAnimationFrame(render);
            currentMode += (modeRef.current - currentMode) * 0.1;

            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, buf);
            gl.vertexAttribPointer(locs.position, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(locs.position);
            gl.uniform2f(locs.resolution, canvas.width, canvas.height);
            gl.uniform1f(locs.time, now * 0.001);
            gl.uniform2f(locs.mouse, mouseX, mouseY);
            gl.uniform1f(locs.mode, currentMode);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        };
        rafId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('resize', resize);
            gl.deleteProgram(program);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvas} />;
}
