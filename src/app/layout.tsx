import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    template: '%s | Ilja Vorstermans',
    default: "How's your relationship with Big Tech?",
  },
  description: "Find out if you're in denial or close to finding new love in under two minutes. No account required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Preload fonts — Inter and Space Grotesk are loaded via next/font above */}
        <style>{`
          :root {
            --font-body: ${inter.style.fontFamily}, system-ui, sans-serif;
            --font-heading: ${spaceGrotesk.style.fontFamily}, system-ui, sans-serif;
          }
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  );
}
