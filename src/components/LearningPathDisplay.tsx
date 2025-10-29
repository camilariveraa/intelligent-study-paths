import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  PlayCircle,
  Clock,
  BookOpen,
  Youtube,
  ExternalLink,
  Award,
  RefreshCw,
} from "lucide-react";
import { LearningPath } from "@/lib/api";

interface LearningPathDisplayProps {
  learningPath: LearningPath;
  onReset: () => void;
}

const LearningPathDisplay = ({
  learningPath,
  onReset,
}: LearningPathDisplayProps) => {
  const [completedVideos, setCompletedVideos] = useState<Set<string>>(new Set());

  const toggleVideoCompleted = (videoId: string) => {
    setCompletedVideos((prev) => {
      const next = new Set(prev);
      if (next.has(videoId)) {
        next.delete(videoId);
      } else {
        next.add(videoId);
      }
      return next;
    });
  };

  const progressPercentage = Math.round(
    (completedVideos.size / learningPath.totalVideos) * 100
  );

  const getLevelBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
      case "principiante":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "intermediate":
      case "intermedio":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "advanced":
      case "avanzado":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Ruta de Aprendizaje Creada</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold">
          {learningPath.goal}
        </h1>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge
            variant="outline"
            className={getLevelBadgeColor(learningPath.knowledgeLevel)}
          >
            <Award className="w-3 h-3 mr-1" />
            Nivel: {learningPath.knowledgeLevel}
          </Badge>
          <Badge variant="outline">
            <BookOpen className="w-3 h-3 mr-1" />
            {learningPath.modules.length} Módulos
          </Badge>
          <Badge variant="outline">
            <PlayCircle className="w-3 h-3 mr-1" />
            {learningPath.totalVideos} Videos
          </Badge>
        </div>

        {/* Progress Bar */}
        {completedVideos.size > 0 && (
          <div className="max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tu Progreso</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Modules */}
      <div className="space-y-6">
        {learningPath.modules.map((module, index) => (
          <Card
            key={module.id}
            className="overflow-hidden border-border hover:border-primary/50 transition-colors"
          >
            {/* Module Header */}
            <div className="bg-gradient-primary/5 p-6 border-b border-border">
              <div className="flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold shrink-0">
                  {module.order}
                </div>
                <div className="flex-1 space-y-2">
                  <h2 className="text-xl font-bold capitalize">
                    {module.topic.replace(/-/g, " ")}
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {module.explanation}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <PlayCircle className="w-4 h-4" />
                    <span>{module.videos.length} videos en este módulo</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Videos */}
            <div className="divide-y divide-border">
              {module.videos.map((video) => {
                const isCompleted = completedVideos.has(video.id);

                return (
                  <div
                    key={video.id}
                    className={`p-4 hover:bg-secondary/50 transition-colors ${
                      isCompleted ? "bg-secondary/30" : ""
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="relative shrink-0 group cursor-pointer">
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          className="w-32 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src =
                              "https://via.placeholder.com/320x180?text=Video";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Youtube className="w-8 h-8 text-white" />
                        </div>
                        {isCompleted && (
                          <div className="absolute top-1 right-1 bg-green-500 rounded-full p-1">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Video Info */}
                      <div className="flex-1 space-y-2">
                        <h3
                          className={`font-semibold leading-snug ${
                            isCompleted
                              ? "line-through text-muted-foreground"
                              : ""
                          }`}
                        >
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Youtube className="w-4 h-4" />
                            {video.channel}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {video.duration}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {video.topics.slice(0, 3).map((topic) => (
                            <Badge
                              key={topic}
                              variant="secondary"
                              className="text-xs"
                            >
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant={isCompleted ? "secondary" : "default"}
                          onClick={() => toggleVideoCompleted(video.id)}
                          className="w-full"
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              Visto
                            </>
                          ) : (
                            "Marcar"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          asChild
                        >
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            Ver
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-center gap-4 pt-8 border-t border-border">
        <Button
          variant="outline"
          onClick={onReset}
          className="px-6"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Crear Nueva Ruta
        </Button>
      </div>

      {/* Completion Message */}
      {completedVideos.size === learningPath.totalVideos && (
        <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg animate-fade-in flex items-center gap-3">
          <Award className="w-6 h-6" />
          <div>
            <p className="font-semibold">¡Felicitaciones!</p>
            <p className="text-sm opacity-90">Has completado toda la ruta</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningPathDisplay;
