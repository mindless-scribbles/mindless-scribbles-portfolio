import Head from 'next/head';
import LumoPage from '@/components/lumo/LumoPage';

export default function HomePage() {
    return (
        <>
            <Head>
                <title>mindless scribbles</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <LumoPage />
        </>
    );
}
