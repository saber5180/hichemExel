import './globals.css';
import type { Metadata } from 'next';
import Sidebar from '@/components/Sidebar';
import Topbar from '@/components/Topbar';
import MobileNav from '@/components/MobileNav';

export const metadata: Metadata = {
  title: 'Recouvrement — Gestion des factures',
  description: 'Système de gestion et de recouvrement de factures',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">
        <Sidebar />

        <div className="lg:pl-[17rem]">
          <Topbar />
          <MobileNav />
          <main className="mx-auto w-full max-w-[1400px] px-5 py-7 lg:px-8 lg:py-9">
            <div className="animate-fade-in-up">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
