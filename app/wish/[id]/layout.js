import { initDb } from '@/lib/db';

const BG_MAP = {
    'v1065-110': '/assets/v1065-110.webp',
    '18929278': '/assets/18929278_rm175-noon-03b.webp',
    '16398080': '/assets/16398080_v729-noon-4a.webp',
    '119781': '/assets/119781.webp',
    '16340746': '/assets/16340746_v802-tang-19.webp',
    '16351030': '/assets/16351030_v850-sasi-18.webp',
    '169295': '/assets/169295.webp',
    '18705968': '/assets/18705968_rm184-aum-05e.webp',
    '18930119': '/assets/18930119_rm428-0056.webp',
    '2150241036': '/assets/2150241036.webp',
    '393': '/assets/393.webp',
    '78': '/assets/78.webp',
    'bg': '/assets/bg.webp',
    '22921546': '/assets/22921546.webp',
};

export async function generateMetadata({ params }) {
    const { id } = await params;
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://wishthem.vercel.app');
    
    try {
        const supabase = await initDb();
        const { data } = await supabase
            .from('wishes')
            .select('receiver, sender, bg_image')
            .eq('id', id)
            .single();

        if (!data) return { title: 'Wish Them' };

        const title = data.receiver ? `A wish for ${data.receiver} 💌` : 'A wish for you 💌';
        const description = data.sender ? `Sent by ${data.sender} via Wish Them` : 'Open your wish on Wish Them...';
        
        let imageUrl = '/assets/bg.webp';
        if (data.bg_image && BG_MAP[data.bg_image]) {
            imageUrl = BG_MAP[data.bg_image];
        }

        return {
            metadataBase: new URL(baseUrl),
            title,
            description,
            openGraph: {
                title,
                description,
                images: [imageUrl],
                type: 'website',
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageUrl],
            }
        };
    } catch (e) {
        return { title: 'Wish Them' };
    }
}

export default function WishLayout({ children }) {
    return children;
}
