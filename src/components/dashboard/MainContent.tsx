import { useState } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  CheckCircle2, 
  Clock,
  ChevronRight,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Route, Video } from "@/pages/Dashboard";

interface MainContentProps {
  view: 'overview' | 'video' | 'loading';
  currentRoute: Route;
  currentVideo: Video | null;
  activeTab: 'summary' | 'evaluation' | 'chat' | 'notes';
  onTabChange: (tab: 'summary' | 'evaluation' | 'chat' | 'notes') => void;
  onStartRoute: () => void;
  onVideoComplete: (videoId: string) => void;
  onNextVideo: () => void;
  onPreviousVideo: () => void;
  onViewChange: (view: 'overview' | 'video' | 'loading') => void;
}

const MainContent = ({
  view,
  currentRoute,
  currentVideo,
  activeTab,
  onTabChange,
  onStartRoute,
  onVideoComplete,
  onNextVideo,
  onPreviousVideo,
  onViewChange
}: MainContentProps) => {
  const [videoTime, setVideoTime] = useState("12:34");
  const [isPlaying, setIsPlaying] = useState(false);
  const [evaluationAnswers, setEvaluationAnswers] = useState<{ [key: string]: number }>({});
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      type: 'ai' as const,
      message: "Hello! I'm your AI assistant. I can help you better understand the concepts you're learning. How can I help you?",
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [notes, setNotes] = useState("");

  const mockEvaluationQuestions = [
    {
      id: "q1",
      question: "What is the 50/30/20 rule in personal finance?",
      options: [
        "50% savings, 30% expenses, 20% investment",
        "50% needs, 30% wants, 20% savings",
        "50% income, 30% expenses, 20% debts"
      ],
      correctAnswer: 1,
      explanation: "The 50/30/20 rule divides your income into: 50% for basic needs, 30% for personal wants, and 20% for savings and investments.",
      concept: "Budgeting"
    },
    {
      id: "q2", 
      question: "What is compound interest?",
      options: [
        "Interest you pay on a loan",
        "Interest you earn on interest already earned",
        "Fixed interest on an investment"
      ],
      correctAnswer: 1,
      explanation: "Compound interest is when earned interest is reinvested and generates more interest, creating an exponential growth effect.",
      concept: "Compound Interest"
    }
  ];

  const handleEvaluationAnswer = (questionId: string, answerIndex: number) => {
    setEvaluationAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSendChatMessage = () => {
    if (!chatInput.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      type: 'user' as const,
      message: chatInput,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, newMessage]);
    setChatInput("");
    
    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = {
        id: chatMessages.length + 2,
        type: 'ai' as const,
        message: "I understand your question. Based on the video content, I can explain that...",
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  if (view === 'loading') {
    return (
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center space-y-8 max-w-md">
          <div className="relative">
            <div className="w-24 h-24 mx-auto bg-gradient-primary rounded-full flex items-center justify-center animate-pulse">
              <Sparkles className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-primary rounded-full opacity-20 animate-ping" />
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gradient">Preparing your personalized route...</h2>
            <p className="text-muted-foreground">Our AI is analyzing the best content for you</p>
          </div>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>Analysis completed</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span>47 videos found</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Loader2 className="w-4 h-4 text-primary animate-spin" />
              <span>Creating optimal sequence...</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Generating evaluations...</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Ready to start</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'overview') {
    return (
      <div className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-4xl mx-auto p-8">
          {/* Hero Section */}
          <div className="text-center space-y-6 mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 backdrop-blur-sm border border-border">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Personalized route ready</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gradient">
              {currentRoute.title}
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {currentRoute.description}
            </p>

            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4" />
                <span>{currentRoute.totalVideos} videos</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{currentRoute.totalDuration}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span>{currentRoute.level}</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button 
                size="lg"
                className="bg-gradient-primary text-primary-foreground font-bold px-8 py-6 text-lg hover:opacity-90"
                onClick={onStartRoute}
              >
                Start Route
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg"
              >
                View Complete Route
              </Button>
            </div>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  What will you learn?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Crear y mantener un presupuesto personal</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Estrategias efectivas de ahorro</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Conceptos básicos de inversión</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span>Planificación financiera a largo plazo</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-primary" />
                  Skills you'll develop
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="bg-malva/20 text-malva">Budgeting</Badge>
                  <Badge variant="secondary" className="bg-lavanda/20 text-lavanda">Saving</Badge>
                  <Badge variant="secondary" className="bg-cielo/20 text-cielo">Investment</Badge>
                  <Badge variant="secondary" className="bg-fucsia/20 text-fucsia">Planning</Badge>
                  <Badge variant="secondary" className="bg-cobalto/20 text-cobalto">Analysis</Badge>
                  <Badge variant="secondary" className="bg-turquesa/20 text-turquesa">Discipline</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modules Overview */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Route Modules</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {currentRoute.modules.map((module, index) => (
                  <div key={module.id} className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{module.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {module.videos.length} videos • {module.videos.reduce((acc, video) => acc + parseInt(video.duration.split(':')[0]) * 60 + parseInt(video.duration.split(':')[1]), 0) / 60} min
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(module.videos.filter(v => v.completed).length / module.videos.length) * 100} 
                        className="w-20 h-2" 
                      />
                      <span className="text-sm text-muted-foreground">
                        {module.videos.filter(v => v.completed).length}/{module.videos.length}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (view === 'video' && currentVideo) {
    return (
      <div className="flex-1 flex flex-col bg-background">
        {/* Video Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{currentRoute.title}</span>
                <ChevronRight className="w-4 h-4" />
                <span>Current module</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Time in this video: {videoTime}</span>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Pause route
            </Button>
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* YouTube Embed */}
            <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${currentVideo.youtubeId}?autoplay=0&controls=1&modestbranding=1&rel=0`}
                title={currentVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              {/* Custom Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{currentVideo.title}</h3>
                    <p className="text-white/80 text-sm">{currentVideo.channel}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white/80 text-sm">{currentVideo.duration}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Controls */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button variant="outline" onClick={onPreviousVideo}>
                  <SkipBack className="w-4 h-4 mr-2" />
                  Anterior
                </Button>
                <Button 
                  className="bg-gradient-primary text-primary-foreground"
                  onClick={() => onVideoComplete(currentVideo.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Mark as completed
                </Button>
                <Button variant="outline" onClick={onNextVideo}>
                  Next
                  <SkipForward className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>

            {/* Evaluation Tabs */}
            <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                <TabsTrigger value="chat">Chat with AI</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Key Points of the Video</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {currentVideo.summary.map((point, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <p className="text-sm">{point}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Important Timestamps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {currentVideo.timestamps.map((timestamp, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-secondary cursor-pointer">
                        <Badge variant="outline">{timestamp.time}</Badge>
                        <span className="text-sm">{timestamp.description}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="evaluation" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Comprehension Evaluation</span>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                          {Object.keys(evaluationAnswers).length}/{mockEvaluationQuestions.length}
                        </div>
                        <span className="text-sm text-muted-foreground">80% accuracy</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {mockEvaluationQuestions.map((question, index) => (
                      <div key={question.id} className="space-y-4">
                        <h4 className="font-semibold">{index + 1}. {question.question}</h4>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label key={optionIndex} className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-secondary/50">
                              <input
                                type="radio"
                                name={question.id}
                                value={optionIndex}
                                checked={evaluationAnswers[question.id] === optionIndex}
                                onChange={() => handleEvaluationAnswer(question.id, optionIndex)}
                                className="text-primary"
                              />
                              <span className="text-sm">{option}</span>
                            </label>
                          ))}
                        </div>
                        {evaluationAnswers[question.id] !== undefined && (
                          <div className={`p-3 rounded-lg ${
                            evaluationAnswers[question.id] === question.correctAnswer 
                              ? 'bg-green-500/10 border border-green-500/20' 
                              : 'bg-red-500/10 border border-red-500/20'
                          }`}>
                            <p className={`text-sm font-medium ${
                              evaluationAnswers[question.id] === question.correctAnswer 
                                ? 'text-green-500' 
                                : 'text-red-500'
                            }`}>
                              {evaluationAnswers[question.id] === question.correctAnswer ? '✓ Correct' : '✗ Incorrect'}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">{question.explanation}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="chat" className="space-y-4">
                <Card className="h-96 flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                        <span className="text-xs text-primary-foreground font-bold">AI</span>
                      </div>
                      Chat with AI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
                      {chatMessages.map((message) => (
                        <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-lg ${
                            message.type === 'user' 
                              ? 'bg-gradient-primary text-primary-foreground' 
                              : 'bg-secondary'
                          }`}>
                            <p className="text-sm">{message.message}</p>
                            <p className="text-xs opacity-70 mt-1">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask me about what you learned..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendChatMessage()}
                      />
                      <Button onClick={handleSendChatMessage} disabled={!chatInput.trim()}>
                        Send
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>My Notes</span>
                      <Button size="sm" variant="outline">
                        Add note at {videoTime}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Write your notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="min-h-[200px]"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export { MainContent };
