import { AuthKitProvider } from '@workos-inc/authkit-react';
import { ReactNode } from 'react';

interface AuthKitWrapperProps {
  children: ReactNode;
}

export const AuthKitWrapper = ({ children }: AuthKitWrapperProps) => {
  return (
    <AuthKitProvider
      clientId={import.meta.env.VITE_WORKOS_CLIENT_ID || 'client_01K8PSHHT1FXF5AMYXJ0C15695'}
      redirectUri={import.meta.env.VITE_WORKOS_REDIRECT_URI || 'http://localhost:8087/auth/callback'}
      devMode={true}
    >
      {children}
    </AuthKitProvider>
  );
};
