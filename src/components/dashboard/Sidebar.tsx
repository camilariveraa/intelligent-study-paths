import { useState } from "react";
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  Settings, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { AuthKitUserProfile } from "@/components/auth/AuthKitUserProfile";
import Logo from "@/components/Logo";
import { Route } from "@/pages/Dashboard";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  recentRoutes: Route[];
}

const Sidebar = ({ collapsed, onToggle, user, recentRoutes }: SidebarProps) => {
  const [activeItem, setActiveItem] = useState('inicio');
  const [recentRoutesOpen, setRecentRoutesOpen] = useState(true);

  const navigationItems = [
    { id: 'inicio', label: 'Home', icon: Home },
    { id: 'rutas', label: 'My Routes', icon: BookOpen, badge: recentRoutes.length },
    { id: 'progreso', label: 'Progress', icon: TrendingUp },
    { id: 'ajustes', label: 'Settings', icon: Settings },
  ];

  return (
    <div className={`bg-[#0a0a0a] border-r border-[#1a1a1a] transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-80'
    } flex flex-col h-full`}>
      {/* Header */}
      <div className="p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center justify-between">
          {!collapsed && <Logo className="text-white" />}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
        
        {!collapsed && (
          <Button className="w-full mt-4 bg-gradient-primary text-primary-foreground hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            New Route
          </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start h-12 px-3 ${
                isActive 
                  ? 'bg-gradient-to-r from-malva/20 to-cielo/20 border-l-2 border-gradient-primary text-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-[#1a1a1a]'
              }`}
              onClick={() => setActiveItem(item.id)}
            >
              <Icon className="w-5 h-5 mr-3" />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-2 bg-malva/20 text-malva">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Button>
          );
        })}
      </div>

      {/* Recent Routes */}
      {!collapsed && (
        <div className="p-4 border-t border-[#1a1a1a]">
          <Collapsible open={recentRoutesOpen} onOpenChange={setRecentRoutesOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between text-sm text-muted-foreground hover:text-foreground">
                <span>Recent Routes</span>
                {recentRoutesOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 mt-2">
              {recentRoutes.slice(0, 3).map((route) => (
                <div key={route.id} className="p-3 rounded-lg bg-[#1a1a1a] hover:bg-[#2a2a2a] transition-colors cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-foreground truncate">{route.title}</h4>
                    <span className="text-xs text-muted-foreground">{route.progress}%</span>
                  </div>
                  <Progress value={route.progress} className="h-1 mb-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{route.totalDuration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{route.modules.reduce((acc, module) => acc + module.videos.filter(v => v.completed).length, 0)}/{route.totalVideos}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {/* User Profile */}
      <div className="p-4 border-t border-[#1a1a1a]">
        {collapsed ? (
          <AuthKitUserProfile />
        ) : (
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-primary text-primary-foreground text-sm font-semibold">
                {user.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <AuthKitUserProfile />
          </div>
        )}
      </div>
    </div>
  );
};

export { Sidebar };
