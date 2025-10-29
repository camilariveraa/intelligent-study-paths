import { useState } from "react";
import { 
  ChevronDown, 
  ChevronRight, 
  Play, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Target,
  Zap,
  BookOpen,
  ChevronLeft,
  ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Route, Video, UserProgress } from "@/pages/Dashboard";

interface RightPanelProps {
  open: boolean;
  onToggle: () => void;
  currentRoute: Route;
  userProgress: UserProgress;
  currentVideo: Video | null;
  onVideoSelect: (video: Video) => void;
}

const RightPanel = ({ 
  open, 
  onToggle, 
  currentRoute, 
  userProgress, 
  currentVideo, 
  onVideoSelect 
}: RightPanelProps) => {
  const [expandedModules, setExpandedModules] = useState<string[]>(["module-1"]);
  const [strengthsOpen, setStrengthsOpen] = useState(true);

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const getVideoStatusIcon = (video: Video) => {
    if (video.completed) return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    if (video.inProgress) return <Play className="w-4 h-4 text-blue-500" />;
    if (video.needsReview) return <AlertCircle className="w-4 h-4 text-red-500" />;
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  const getVideoStatusColor = (video: Video) => {
    if (video.completed) return "text-green-500";
    if (video.inProgress) return "text-blue-500";
    if (video.needsReview) return "text-red-500";
    return "text-muted-foreground";
  };

  if (!open) {
    return (
      <div className="w-12 bg-[#0a0a0a] border-l border-[#1a1a1a] flex flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-80 bg-[#0a0a0a] border-l border-[#1a1a1a] flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-[#1a1a1a]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">{currentRoute.title}</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        <Select defaultValue={currentRoute.id}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={currentRoute.id}>{currentRoute.title}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Progress Overview */}
      <div className="p-4 border-b border-[#1a1a1a]">
        <div className="text-center space-y-4">
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="hsl(var(--border))"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - currentRoute.progress / 100)}`}
                className="transition-all duration-500"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--malva))" />
                  <stop offset="50%" stopColor="hsl(var(--lavanda))" />
                  <stop offset="100%" stopColor="hsl(var(--cielo))" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-foreground">{currentRoute.progress}%</span>
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Videos completed</span>
              <span className="font-semibold">{userProgress.completedVideos}/{userProgress.totalVideos}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Study time</span>
              <span className="font-semibold">{userProgress.studyTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="font-semibold">{userProgress.accuracy}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Streak</span>
              <span className="font-semibold">{userProgress.streak} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Path */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold text-foreground mb-4">Learning Path</h3>
        
        <div className="space-y-4">
          {currentRoute.modules.map((module, moduleIndex) => (
            <Card key={module.id} className="border-[#1a1a1a]">
              <Collapsible 
                open={expandedModules.includes(module.id)} 
                onOpenChange={() => toggleModule(module.id)}
              >
                <CollapsibleTrigger asChild>
                  <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                          {moduleIndex + 1}
                        </div>
                        <div>
                          <CardTitle className="text-sm">{module.title}</CardTitle>
                          <p className="text-xs text-muted-foreground">
                            {module.videos.length} videos
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={(module.videos.filter(v => v.completed).length / module.videos.length) * 100} 
                          className="w-16 h-1" 
                        />
                        {expandedModules.includes(module.id) ? 
                          <ChevronUp className="w-4 h-4 text-muted-foreground" /> : 
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        }
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {module.videos.map((video) => (
                        <div 
                          key={video.id}
                          className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                            currentVideo?.id === video.id 
                              ? 'bg-gradient-to-r from-malva/20 to-cielo/20 border border-primary/30' 
                              : 'hover:bg-secondary/50'
                          }`}
                          onClick={() => onVideoSelect(video)}
                        >
                          <img 
                            src={video.thumbnail} 
                            alt={video.title}
                            className="w-12 h-8 rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${getVideoStatusColor(video)}`}>
                              {video.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{video.duration}</span>
                              <span>•</span>
                              <span>{video.channel}</span>
                            </div>
                          </div>
                          {getVideoStatusIcon(video)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Recommended Resources */}
        {userProgress.weaknesses.length > 0 && (
          <Card className="mt-6 border-red-500/20">
            <CardHeader>
              <CardTitle className="text-sm text-red-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                You need to reinforce
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {userProgress.weaknesses.map((weakness, index) => (
                <div key={index} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-500">{weakness}</span>
                    <Badge variant="destructive" className="text-xs">Refuerzo</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Play className="w-3 h-3" />
                      <span>Video: "{weakness} explicado en 5 min"</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>5:32 min</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full text-xs">
                      Ver ahora
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Strengths and Weaknesses */}
        <Card className="mt-6">
          <Collapsible open={strengthsOpen} onOpenChange={setStrengthsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-secondary/50 transition-colors">
                <CardTitle className="text-sm flex items-center justify-between">
                  <span>Strengths and Weaknesses</span>
                  {strengthsOpen ? 
                    <ChevronUp className="w-4 h-4 text-muted-foreground" /> : 
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  }
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-green-500 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Strengths
                  </h4>
                  <div className="space-y-2">
                    {userProgress.strengths.map((strength, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-green-500/10">
                        <span className="text-xs text-green-500">{strength}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1 bg-green-500/20 rounded-full">
                            <div className="w-12 h-1 bg-green-500 rounded-full" />
                          </div>
                          <span className="text-xs text-green-500">85%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-red-500 mb-2 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Weaknesses
                  </h4>
                  <div className="space-y-2">
                    {userProgress.weaknesses.map((weakness, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded bg-red-500/10">
                        <span className="text-xs text-red-500">{weakness}</span>
                        <div className="flex items-center gap-1">
                          <div className="w-16 h-1 bg-red-500/20 rounded-full">
                            <div className="w-6 h-1 bg-red-500 rounded-full" />
                          </div>
                          <span className="text-xs text-red-500">45%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </div>
  );
};

export { RightPanel };
