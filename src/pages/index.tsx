import Head from 'next/head';
import HomePage from '@/components/home/HomePage';

export default function Home() {
    return (
        <>
            <Head>
                <title>mindless scribbles</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <HomePage />
        </>
    );
}
