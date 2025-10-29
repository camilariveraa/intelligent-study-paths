import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthContext } from '@/hooks/useAuthKit';
import { Loader2, LogIn } from 'lucide-react';
import Logo from '@/components/Logo';

export const AuthKitLoginForm = () => {
  const { login, isLoading } = useAuthContext();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Logo className="text-4xl" />
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Welcome to Next
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to continue your learning journey
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sign In with AuthKit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                AuthKit provides a secure, hosted authentication experience
              </p>
              
              <Button
                onClick={login}
                disabled={isLoading}
                className="w-full bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In with AuthKit
                  </>
                )}
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                By signing in, you agree to our{' '}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthKitLoginForm />;
  }

  return <>{children}</>;
};
