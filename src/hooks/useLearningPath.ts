import { useState, useCallback } from 'react';
import { api, Question, LearningPath } from '@/lib/api';

type FlowPhase = 'init' | 'assessment' | 'generating' | 'completed' | 'error';

interface UseLearningPathReturn {
  // State
  phase: FlowPhase;
  sessionId: string | null;
  currentQuestion: Question | null;
  questionProgress: { current: number; total: number; percentage: number } | null;
  learningPath: LearningPath | null;
  error: string | null;
  isLoading: boolean;

  // Actions
  startSession: (goal: string) => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;
  generatePath: () => Promise<void>;
  reset: () => void;
}

export function useLearningPath(): UseLearningPathReturn {
  const [phase, setPhase] = useState<FlowPhase>('init');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionProgress, setQuestionProgress] = useState<{
    current: number;
    total: number;
    percentage: number;
  } | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startSession = useCallback(async (goal: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Create session
      const sessionData = await api.createSession(goal);
      setSessionId(sessionData.sessionId);

      // Get first question
      const questionData = await api.getNextQuestion(sessionData.sessionId);

      if (questionData.completed) {
        setPhase('generating');
      } else {
        setCurrentQuestion(questionData.question || null);
        setQuestionProgress(questionData.progress);
        setPhase('assessment');
      }
    } catch (err) {
      console.error('Failed to start session:', err);
      setError(err instanceof Error ? err.message : 'Failed to start session');
      setPhase('error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!sessionId || !currentQuestion) return;

      setIsLoading(true);
      setError(null);

      try {
        // Submit answer
        const answerData = await api.submitAnswer(
          sessionId,
          currentQuestion.id,
          answer
        );

        if (answerData.completed) {
          // Assessment completed, ready to generate path
          setPhase('generating');
          setCurrentQuestion(null);
        } else {
          // Get next question
          const questionData = await api.getNextQuestion(sessionId);

          if (questionData.completed) {
            setPhase('generating');
            setCurrentQuestion(null);
          } else {
            setCurrentQuestion(questionData.question || null);
            setQuestionProgress(questionData.progress);
          }
        }
      } catch (err) {
        console.error('Failed to submit answer:', err);
        setError(err instanceof Error ? err.message : 'Failed to submit answer');
        setPhase('error');
      } finally {
        setIsLoading(false);
      }
    },
    [sessionId, currentQuestion]
  );

  const generatePath = useCallback(async () => {
    if (!sessionId) return;

    setIsLoading(true);
    setError(null);

    try {
      // Generate learning path
      await api.generatePath(sessionId);

      // Retrieve the generated path
      const pathData = await api.getLearningPath(sessionId);
      setLearningPath(pathData.learningPath);
      setPhase('completed');
    } catch (err) {
      console.error('Failed to generate path:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to generate learning path'
      );
      setPhase('error');
    } finally {
      setIsLoading(false);
    }
  }, [sessionId]);

  const reset = useCallback(() => {
    setPhase('init');
    setSessionId(null);
    setCurrentQuestion(null);
    setQuestionProgress(null);
    setLearningPath(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    phase,
    sessionId,
    currentQuestion,
    questionProgress,
    learningPath,
    error,
    isLoading,
    startSession,
    submitAnswer,
    generatePath,
    reset,
  };
}
