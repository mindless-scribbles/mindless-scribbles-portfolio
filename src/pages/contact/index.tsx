import Head from 'next/head';
import ContactPage from '@/components/contact/ContactPage';

export default function Contact() {
    return (
        <>
            <Head>
                <title>Contact — mindless scribbles</title>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </Head>
            <ContactPage />
        </>
    );
}
