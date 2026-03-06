import { DM_Sans, Playfair_Display, Dancing_Script, Sacramento } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: '--font-dm-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"], style: ["normal", "italic"], variable: '--font-playfair' });
const dancing = Dancing_Script({ subsets: ["latin"], weight: ["600"], variable: '--font-dancing' });
const sacramento = Sacramento({ subsets: ["latin"], weight: ["400"], variable: '--font-sacramento' });

export const metadata = {
  title: "WishIt — Send Heartfelt Wishes",
  description: "Create beautifully personalised wishes for the people you love",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${dancing.variable} ${sacramento.variable}`}>
      <body className={dmSans.className}>{children}</body>
    </html>
  );
}
