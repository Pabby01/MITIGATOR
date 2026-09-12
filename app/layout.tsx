import './globals.css';
import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SolanaWalletProvider } from '@/lib/services/solana-wallet';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'MITIGATOR — Know the risk. Before you trade.',
  description:
    'Solana-native tokenized-stock intelligence, risk analysis, portfolio and execution platform for Stocklana 2026.',
  icons: {
    icon: '/brand/miti.jpeg',
    apple: '/brand/miti.jpeg',
  },
  openGraph: {
    title: 'MITIGATOR — Know the risk. Before you trade.',
    description:
      'AI-powered intelligence, risk analysis and execution for tokenized stocks on Solana.',
    images: ['/brand/miti.jpeg'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MITIGATOR — Know the risk. Before you trade.',
    description: 'AI-powered intelligence, risk analysis and execution for tokenized stocks on Solana.',
    images: ['/brand/miti.jpeg'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SolanaWalletProvider>
            {children}
          </SolanaWalletProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
