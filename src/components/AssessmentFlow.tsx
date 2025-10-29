import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { api, Question } from "@/lib/api";

interface AssessmentFlowProps {
  sessionId: string;
  goal: string;
  onComplete: () => void;
}

const AssessmentFlow = ({ sessionId, goal, onComplete }: AssessmentFlowProps) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [answer, setAnswer] = useState("");
  const [progress, setProgress] = useState({ current: 0, total: 3, percentage: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadNextQuestion();
  }, []);

  const loadNextQuestion = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.getNextQuestion(sessionId);

      if (response.completed) {
        // Assessment completed
        onComplete();
      } else if (response.question) {
        setCurrentQuestion(response.question);
        setProgress(response.progress);
      }
    } catch (err) {
      console.error('Failed to load question:', err);
      setError('Error al cargar la pregunta. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim() || !currentQuestion) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.submitAnswer(sessionId, currentQuestion.id, answer);

      // Clear answer for next question
      setAnswer("");

      if (response.completed) {
        // Assessment completed
        onComplete();
      } else {
        // Load next question
        await loadNextQuestion();
      }
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError('Error al enviar la respuesta. Por favor intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Evaluación de Conocimientos</span>
        </div>
        <h2 className="text-2xl font-bold">
          {goal}
        </h2>
        <p className="text-muted-foreground">
          Responde estas preguntas para crear tu ruta personalizada
        </p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Pregunta {progress.current} de {progress.total}
          </span>
          <span className="font-medium">{progress.percentage}%</span>
        </div>
        <Progress value={progress.percentage} className="h-2" />
      </div>

      {/* Question Card */}
      {currentQuestion && (
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-primary opacity-10 blur-xl rounded-2xl" />
          <div className="relative bg-card border border-border rounded-2xl p-6 space-y-6">
            <div className="space-y-2">
              <div className="inline-block px-3 py-1 bg-secondary rounded-full text-xs font-medium">
                {currentQuestion.topicArea}
              </div>
              <h3 className="text-lg font-semibold leading-relaxed">
                {currentQuestion.question}
              </h3>
            </div>

            <div className="space-y-3">
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Describe tu experiencia y conocimientos sobre este tema..."
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />
              <p className="text-xs text-muted-foreground">
                Tip: Sé específico sobre tu nivel de experiencia, proyectos realizados, y conceptos que conoces.
              </p>
            </div>

            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <div className="flex justify-between items-center">
              <Button
                variant="ghost"
                onClick={() => setAnswer("")}
                disabled={isLoading || !answer.trim()}
              >
                Limpiar
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading || !answer.trim()}
                className="bg-gradient-primary text-primary-foreground font-semibold px-6"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && !currentQuestion && (
        <div className="flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Cargando pregunta...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentFlow;
