import Head from 'next/head';
import InfoPage from '@/components/info/InfoPage';

export default function Info() {
    return (
        <>
            <Head>
                <title>Info — mindless scribbles</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <InfoPage />
        </>
    );
}
