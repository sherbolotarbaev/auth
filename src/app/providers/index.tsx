'use client';

import ReduxProvider from './redux';

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <ReduxProvider>{children}</ReduxProvider>;
};
export default Providers;
