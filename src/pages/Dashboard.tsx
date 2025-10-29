import { useState, useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { MainContent } from "@/components/dashboard/MainContent";
import { RightPanel } from "@/components/dashboard/RightPanel";
import { ProtectedRoute } from "@/components/auth/SimpleLogin";
import { mockRouteData, mockUserData } from "@/lib/mockData";

export type Video = {
  id: string;
  title: string;
  channel: string;
  duration: string;
  youtubeId: string;
  thumbnail: string;
  completed: boolean;
  inProgress: boolean;
  needsReview: boolean;
  concepts: string[];
  summary: string[];
  timestamps: { time: string; description: string }[];
};

export type Module = {
  id: string;
  title: string;
  videos: Video[];
  completed: boolean;
  inProgress: boolean;
};

export type Route = {
  id: string;
  title: string;
  description: string;
  modules: Module[];
  totalVideos: number;
  totalDuration: string;
  level: "Principiante" | "Intermedio" | "Avanzado";
  createdAt: string;
  progress: number;
};

export type UserProgress = {
  completedVideos: number;
  totalVideos: number;
  studyTime: string;
  accuracy: number;
  streak: number;
  strengths: string[];
  weaknesses: string[];
};

export type EvaluationQuestion = {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  concept: string;
};

export type Evaluation = {
  id: string;
  videoId: string;
  questions: EvaluationQuestion[];
  completed: boolean;
  score: number;
};

const Dashboard = () => {
  const [currentRoute, setCurrentRoute] = useState<Route>(mockRouteData);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress>(mockUserData.progress);
  const [activeTab, setActiveTab] = useState<'summary' | 'evaluation' | 'chat' | 'notes'>('summary');
  const [view, setView] = useState<'overview' | 'video' | 'loading'>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);

  // Use mock user data
  const authKitUserData = mockUserData;

  // Simular carga inicial
  useEffect(() => {
    if (view === 'loading') {
      const timer = setTimeout(() => {
        setView('overview');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleStartRoute = () => {
    const firstVideo = currentRoute.modules[0]?.videos[0];
    if (firstVideo) {
      setCurrentVideo(firstVideo);
      setView('video');
    }
  };

  const handleVideoComplete = (videoId: string) => {
    setCurrentRoute(prev => ({
      ...prev,
      modules: prev.modules.map(module => ({
        ...module,
        videos: module.videos.map(video => 
          video.id === videoId 
            ? { ...video, completed: true, inProgress: false }
            : video
        )
      }))
    }));

    setUserProgress(prev => ({
      ...prev,
      completedVideos: prev.completedVideos + 1
    }));

    // Simular confetti
    setTimeout(() => {
      setActiveTab('evaluation');
    }, 1000);
  };

  const handleNextVideo = () => {
    const currentModuleIndex = currentRoute.modules.findIndex(module => 
      module.videos.some(video => video.id === currentVideo?.id)
    );
    
    if (currentModuleIndex !== -1) {
      const currentVideoIndex = currentRoute.modules[currentModuleIndex].videos.findIndex(
        video => video.id === currentVideo?.id
      );
      
      const nextVideoIndex = currentVideoIndex + 1;
      
      if (nextVideoIndex < currentRoute.modules[currentModuleIndex].videos.length) {
        setCurrentVideo(currentRoute.modules[currentModuleIndex].videos[nextVideoIndex]);
      } else if (currentModuleIndex + 1 < currentRoute.modules.length) {
        setCurrentVideo(currentRoute.modules[currentModuleIndex + 1].videos[0]);
      }
    }
  };

  const handlePreviousVideo = () => {
    const currentModuleIndex = currentRoute.modules.findIndex(module => 
      module.videos.some(video => video.id === currentVideo?.id)
    );
    
    if (currentModuleIndex !== -1) {
      const currentVideoIndex = currentRoute.modules[currentModuleIndex].videos.findIndex(
        video => video.id === currentVideo?.id
      );
      
      const prevVideoIndex = currentVideoIndex - 1;
      
      if (prevVideoIndex >= 0) {
        setCurrentVideo(currentRoute.modules[currentModuleIndex].videos[prevVideoIndex]);
      } else if (currentModuleIndex > 0) {
        const prevModule = currentRoute.modules[currentModuleIndex - 1];
        setCurrentVideo(prevModule.videos[prevModule.videos.length - 1]);
      }
    }
  };

  return (
    <ProtectedRoute>
      <div className="h-screen bg-background text-foreground flex overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        user={authKitUserData}
        recentRoutes={[currentRoute]}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <MainContent
          view={view}
          currentRoute={currentRoute}
          currentVideo={currentVideo}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onStartRoute={handleStartRoute}
          onVideoComplete={handleVideoComplete}
          onNextVideo={handleNextVideo}
          onPreviousVideo={handlePreviousVideo}
          onViewChange={setView}
        />
      </div>

      {/* Right Panel */}
      <RightPanel
        open={rightPanelOpen}
        onToggle={() => setRightPanelOpen(!rightPanelOpen)}
        currentRoute={currentRoute}
        userProgress={userProgress}
        currentVideo={currentVideo}
        onVideoSelect={setCurrentVideo}
      />
      </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
