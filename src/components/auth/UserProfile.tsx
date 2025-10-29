import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings, HelpCircle } from 'lucide-react';

export const UserProfile = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.profilePictureUrl} alt={user.email} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user.firstName && user.lastName && (
              <p className="font-medium">{user.firstName} {user.lastName}</p>
            )}
            <p className="w-[200px] truncate text-sm text-muted-foreground">
              {user.email}
            </p>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <HelpCircle className="mr-2 h-4 w-4" />
          <span>Help</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserProfileCard = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getInitials = (firstName?: string, lastName?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    }
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.profilePictureUrl} alt={user.email} />
            <AvatarFallback className="bg-gradient-primary text-primary-foreground text-lg font-semibold">
              {getInitials(user.firstName, user.lastName)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">
              {user.firstName && user.lastName 
                ? `${user.firstName} ${user.lastName}` 
                : user.email
              }
            </h3>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Member since</span>
          <span className="text-sm font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Status</span>
          <Badge variant="secondary" className="bg-green-500/20 text-green-500">
            Active
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Last updated</span>
          <span className="text-sm font-medium">
            {new Date(user.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
