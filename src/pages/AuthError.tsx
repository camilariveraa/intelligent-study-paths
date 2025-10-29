import { useSearchParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';
import Logo from '@/components/Logo';

const AuthError = () => {
  const [searchParams] = useSearchParams();
  const message = searchParams.get('message') || 'An authentication error occurred';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Logo className="text-4xl" />
        </div>

        <Card className="border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-500">
              <AlertCircle className="w-5 h-5" />
              Authentication Error
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {message}
            </p>
            
            <div className="flex gap-2">
              <Button asChild className="flex-1">
                <Link to="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </Link>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthError;
