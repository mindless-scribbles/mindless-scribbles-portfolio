import fs from 'fs';
import path from 'path';
import Head from 'next/head';
import matter from 'front-matter';
import type { GetStaticPaths, GetStaticProps } from 'next';
import EntryPage from '@/components/journal/EntryPage';
import type { EntryData } from '@/components/journal/EntryUI';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'pages', 'journal');

interface Props {
    entry: EntryData & { title: string };
}

export default function JournalEntry({ entry }: Props) {
    return (
        <>
            <Head>
                <title>{entry.title} — mindless scribbles</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <EntryPage entry={entry} />
        </>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md') && !f.startsWith('_'));
    const paths = files.map(file => ({
        params: { slug: file.replace(/\.md$/, '') },
    }));
    return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
    const slug = params!.slug as string;
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    const raw = fs.readFileSync(filePath, 'utf-8');

    // front-matter types the attributes as unknown, so we cast
    const { attributes, body } = matter(raw) as {
        attributes: Record<string, unknown>;
        body: string;
    };

    const entry: EntryData & { title: string } = {
        title:      (attributes.title      as string) ?? slug,
        titleLine1: (attributes.titleLine1 as string) ?? '',
        titleLine2: (attributes.titleLine2 as string) ?? '',
        ref:        (attributes.ref        as string) ?? '',
        specs:      (attributes.specs      as EntryData['specs'])    ?? {},
        download:   (attributes.download   as EntryData['download']) ?? { filename: '', size: '', build: '', url: '#' },
        log:        (attributes.log        as EntryData['log'])      ?? [],
        body:       body.trim(),
    };

    return { props: { entry } };
};
