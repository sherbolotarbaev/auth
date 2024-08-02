'use client';

import { Toaster } from 'sonner';
import Providers from './providers';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: Readonly<RootLayoutClientProps>) {
  return (
    <>
      <Providers>
        <main>{children}</main>
        <Toaster />
      </Providers>
    </>
  );
}
