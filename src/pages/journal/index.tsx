import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import matter from 'front-matter';
import type { GetStaticProps } from 'next';
import JournalPage from '@/components/journal/JournalPage';
import type { JournalEntry } from '@/components/journal/JournalUI';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages', 'journal');

// Entries that exist only in the list (no detail page yet)
const PLACEHOLDER_ENTRIES: JournalEntry[] = [
    { label: 'Kinect Point Cloud Integration', tag: 'CHOP/TOP', shader: 2, italic: true,  slug: null },
    { label: 'Realtime Audio Analysis',         tag: 'FFT',      shader: 3, italic: false, slug: null },
    { label: 'Non-linear Feedback Topologies',  tag: 'COMP',     shader: 4, italic: true,  slug: null },
    { label: 'Instanced Geometry Clusters',     tag: 'SOP',      shader: 1, italic: false, slug: null },
    { label: 'Volumetric Raymarching',           tag: 'MAT',      shader: 2, italic: true,  slug: null },
    { label: 'Fluid Dynamics Solver',            tag: 'GLSL',     shader: 3, italic: false, slug: null },
    { label: 'Generative Typography',            tag: 'DAT',      shader: 4, italic: true,  slug: null },
    { label: 'Lidar Scanning Visualization',     tag: 'EXR',      shader: 1, italic: false, slug: null },
];

// Shader numbers by tag, used for entries loaded from markdown
const TAG_SHADER: Record<string, number> = {
    'GLSL': 1, 'CHOP/TOP': 2, 'FFT': 3, 'COMP': 4,
    'SOP': 1, 'MAT': 2, 'DAT': 4, 'EXR': 1, 'TOPs': 1,
};

interface Props {
    entries: JournalEntry[];
}

export default function Journal({ entries }: Props) {
    return (
        <>
            <Head>
                <title>Journal — mindless scribbles</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <JournalPage entries={entries} />
        </>
    );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));

    // Build entries for every markdown file found
    const mdEntries: JournalEntry[] = files.map(file => {
        const slug = file.replace(/\.md$/, '');
        const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
        const { attributes } = matter(raw) as { attributes: Record<string, unknown> };
        const title = (attributes.title as string) ?? slug;
        const specs = (attributes.specs as Record<string, string>) ?? {};
        // Derive a short tag from the technology spec
        const tech = specs.technology ?? '';
        const tag  = tech.split('/')[0].trim() || 'GLSL';
        const shader = TAG_SHADER[tag] ?? 1;
        return { label: title, tag, shader, italic: false, slug };
    });

    // Markdown entries first, then placeholders for the rest of the list
    const entries = [...mdEntries, ...PLACEHOLDER_ENTRIES];

    return { props: { entries } };
};
