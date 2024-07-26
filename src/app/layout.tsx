import type { Metadata, Viewport } from 'next';
import { Suspense } from 'react';
import { siteConfig } from '~/config/site';

import RootLayoutClient from './layout.uc';

import { geistSans } from './shared/lib/fonts';
import './styles/index.scss';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.name,
  description: siteConfig.description,
};

export const viewport: Viewport = {
  initialScale: 1,
  width: 'device-width',
  maximumScale: 1,
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: Readonly<RootLayoutProps>) {
  return (
    <>
      <html lang="en">
        <body style={geistSans.style}>
          <Suspense>
            <RootLayoutClient>{children}</RootLayoutClient>
          </Suspense>
        </body>
      </html>
    </>
  );
}
