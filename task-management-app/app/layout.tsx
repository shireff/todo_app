'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import AuthInitializer from '@/components/AuthInitializer';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <AuthInitializer />
          {children}
          </Providers>
      </body>
    </html>
  );
}