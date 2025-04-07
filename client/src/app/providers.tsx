'use client';

import { Authenticator } from '@aws-amplify/ui-react';

import StoreProvider from '@/state/redux';
import Auth from '@/app/(auth)/authProvider';

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <Authenticator.Provider>
        <Auth>{children}</Auth>
      </Authenticator.Provider>
    </StoreProvider>
  );
};

export default Providers;
