'use client';

import LanguageProvider from './language';
import ReduxProvider from './redux';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <>
      <LanguageProvider>
        <ReduxProvider>{children}</ReduxProvider>
      </LanguageProvider>
    </>
  );
};
export default Providers;
