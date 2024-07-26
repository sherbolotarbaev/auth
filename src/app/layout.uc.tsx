'use client';

import { Toaster } from 'sonner';
import Providers from './providers';

interface RootLayoutClientProps {
  children: React.ReactNode;
}

export default function RootLayoutClient({ children }: Readonly<RootLayoutClientProps>) {
  return (
    <>
      <Providers>{children}</Providers>
      <Toaster />
    </>
  );
}
