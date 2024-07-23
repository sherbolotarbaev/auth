'use client';

import ReduxProvider from './redux';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: Readonly<ProvidersProps>) {
  return (
    <>
      <ReduxProvider>{children}</ReduxProvider>
    </>
  );
}
