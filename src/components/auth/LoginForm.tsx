import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { Mail, Github, Chrome, Loader2 } from 'lucide-react';
import Logo from '@/components/Logo';

export const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        alert('Check your email for the magic link!');
      } else {
        alert('Failed to send magic link. Please try again.');
      }
    } catch (error) {
      console.error('Error sending magic link:', error);
      alert('Failed to send magic link. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* SSO Providers */}
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => login('GoogleOAuth')}
              >
                <Chrome className="w-4 h-4 mr-2" />
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => login('GitHubOAuth')}
              >
                <Github className="w-4 h-4 mr-2" />
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with email
                </span>
              </div>
            </div>

            {/* Magic Link Form */}
            <form onSubmit={handleMagicLinkLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-primary text-primary-foreground"
                disabled={isLoading || !email}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Magic Link...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Magic Link
                  </>
                )}
              </Button>
            </form>

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
  const { isAuthenticated, isLoading } = useAuth();

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
    return <LoginForm />;
  }

  return <>{children}</>;
};
