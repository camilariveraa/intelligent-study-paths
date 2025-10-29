import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // AuthKit will handle the callback automatically
    // After successful authentication, redirect to dashboard
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
        <h2 className="text-xl font-semibold">Processing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we complete your sign-in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;
