import {
  Env,
  SessionData,
  LearningGoal,
  AssessmentAnswer,
} from '../../types';
import {
  generateAssessmentQuestions,
  evaluateAnswer,
  determineOverallLevel,
  identifyKnowledgeGaps,
} from '../../utils/assessment';
import { generateLearningPath } from '../../utils/path-generator';

export default class APIService {
  constructor(private env: Env) {}

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Enable CORS for development
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Health check
      if (path === '/health') {
        return new Response(
          JSON.stringify({ status: 'ok', service: 'learning-path-agent' }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Create new session
      if (path === '/api/sessions' && request.method === 'POST') {
        return await this.createSession(request, corsHeaders);
      }

      // Get session state
      if (path.match(/^\/api\/sessions\/[^/]+$/) && request.method === 'GET') {
        const sessionId = path.split('/').pop()!;
        return await this.getSession(sessionId, corsHeaders);
      }

      // Get next assessment question
      if (path.match(/^\/api\/sessions\/[^/]+\/assessment\/next$/)) {
        const sessionId = path.split('/')[3];
        return await this.getNextQuestion(sessionId, corsHeaders);
      }

      // Submit assessment answer
      if (path.match(/^\/api\/sessions\/[^/]+\/assessment\/answer$/)) {
        const sessionId = path.split('/')[3];
        return await this.submitAnswer(sessionId, request, corsHeaders);
      }

      // Generate learning path
      if (path.match(/^\/api\/sessions\/[^/]+\/path\/generate$/)) {
        const sessionId = path.split('/')[3];
        return await this.generatePath(sessionId, corsHeaders);
      }

      // Get learning path
      if (path.match(/^\/api\/sessions\/[^/]+\/path$/)) {
        const sessionId = path.split('/')[3];
        return await this.getPath(sessionId, corsHeaders);
      }

      return new Response(JSON.stringify({ error: 'Not Found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('API Error:', error);
      return new Response(
        JSON.stringify({
          error: 'Internal Server Error',
          message: error instanceof Error ? error.message : 'Unknown error',
        }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
  }

  // Create a new learning session
  private async createSession(
    request: Request,
    corsHeaders: Record<string, string>
  ): Promise<Response> {
    const body = await request.json();
    const { goal } = body;

    if (!goal) {
      return new Response(
        JSON.stringify({ error: 'Goal is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Start working memory session
    const { sessionId, workingMemory } =
      await this.env.MEMORY.startWorkingMemorySession();

    // Store goal
    const learningGoal: LearningGoal = {
      id: `goal-${sessionId}`,
      goal,
      createdAt: new Date(),
    };

    await workingMemory.putMemory({
      content: JSON.stringify(learningGoal),
      key: 'goal',
      agent: 'api',
    });

    // Generate assessment questions
    const questions = await generateAssessmentQuestions(goal, this.env.REASONER);

    // Initialize session data
    const sessionData: SessionData = {
      sessionId,
      goal,
      currentQuestionIndex: 0,
      questions,
      answers: [],
      knowledgeLevels: [],
      phase: 'assessment',
    };

    await workingMemory.putMemory({
      content: JSON.stringify(sessionData),
      key: 'session_data',
      agent: 'api',
    });

    return new Response(
      JSON.stringify({
        success: true,
        sessionId,
        phase: 'assessment',
        message: "Let's assess your current knowledge to create the best learning path.",
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Get session state
  private async getSession(
    sessionId: string,
    corsHeaders: Record<string, string>
  ): Promise<Response> {
    const workingMemory = await this.env.MEMORY.getWorkingMemorySession(sessionId);

    const memories = await workingMemory.getMemory({
      key: 'session_data',
      nMostRecent: 1,
    });

    if (!memories || memories.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const sessionData: SessionData = JSON.parse(memories[0].content);

    return new Response(
      JSON.stringify({
        success: true,
        session: {
          sessionId: sessionData.sessionId,
          goal: sessionData.goal,
          phase: sessionData.phase,
          progress: {
            current: sessionData.currentQuestionIndex,
            total: sessionData.questions.length,
          },
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Get next assessment question
  private async getNextQuestion(
    sessionId: string,
    corsHeaders: Record<string, string>
  ): Promise<Response> {
    const workingMemory = await this.env.MEMORY.getWorkingMemorySession(sessionId);

    const memories = await workingMemory.getMemory({
      key: 'session_data',
      nMostRecent: 1,
    });

    if (!memories || memories.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const sessionData: SessionData = JSON.parse(memories[0].content);

    if (sessionData.currentQuestionIndex >= sessionData.questions.length) {
      return new Response(
        JSON.stringify({
          success: true,
          completed: true,
          message: 'Assessment completed! Generating your learning path...',
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const currentQuestion = sessionData.questions[sessionData.currentQuestionIndex];

    return new Response(
      JSON.stringify({
        success: true,
        question: currentQuestion,
        progress: {
          current: sessionData.currentQuestionIndex + 1,
          total: sessionData.questions.length,
          percentage: Math.round(
            ((sessionData.currentQuestionIndex + 1) / sessionData.questions.length) * 100
          ),
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Submit assessment answer
  private async submitAnswer(
    sessionId: string,
    request: Request,
    corsHeaders: Record<string, string>
  ): Promise<Response> {
    const body = await request.json();
    const { questionId, answer } = body;

    if (!questionId || !answer) {
      return new Response(
        JSON.stringify({ error: 'Question ID and answer are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const workingMemory = await this.env.MEMORY.getWorkingMemorySession(sessionId);

    const memories = await workingMemory.getMemory({
      key: 'session_data',
      nMostRecent: 1,
    });

    if (!memories || memories.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const sessionData: SessionData = JSON.parse(memories[0].content);

    // Find the question
    const question = sessionData.questions.find(q => q.id === questionId);
    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Evaluate the answer
    const knowledgeLevel = await evaluateAnswer(question, answer, this.env.REASONER);

    // Store answer and evaluation
    const answerData: AssessmentAnswer = {
      questionId,
      answer,
    };

    sessionData.answers.push(answerData);
    sessionData.knowledgeLevels.push(knowledgeLevel);
    sessionData.currentQuestionIndex++;

    // Update session data
    await workingMemory.putMemory({
      content: JSON.stringify(sessionData),
      key: 'session_data',
      agent: 'api',
    });

    // Check if assessment is complete
    const completed = sessionData.currentQuestionIndex >= sessionData.questions.length;

    return new Response(
      JSON.stringify({
        success: true,
        completed,
        message: completed
          ? 'Assessment completed!'
          : 'Answer recorded. Ready for next question.',
        progress: {
          current: sessionData.currentQuestionIndex,
          total: sessionData.questions.length,
          percentage: Math.round(
            (sessionData.currentQuestionIndex / sessionData.questions.length) * 100
          ),
        },
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Generate learning path
  private async generatePath(
    sessionId: string,
    corsHeaders: Record<string, string>
  ): Promise<Response> {
    const workingMemory = await this.env.MEMORY.getWorkingMemorySession(sessionId);

    const memories = await workingMemory.getMemory({
      key: 'session_data',
      nMostRecent: 1,
    });

    if (!memories || memories.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Session not found' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const sessionData: SessionData = JSON.parse(memories[0].content);

    // Determine overall level
    const overallLevel = determineOverallLevel(sessionData.knowledgeLevels);

    // Identify gaps
    const gaps = identifyKnowledgeGaps(
      sessionData.goal!,
      sessionData.knowledgeLevels
    );

    // Generate learning path
    const learningPath = await generateLearningPath(
      sessionId,
      sessionData.goal!,
      overallLevel,
      gaps,
      this.env.REASONER
    );

    // Store learning path
    await workingMemory.putMemory({
      content: JSON.stringify(learningPath),
      key: 'learning_path',
      agent: 'api',
    });

    // Update session phase
    sessionData.phase = 'completed';
    await workingMemory.putMemory({
      content: JSON.stringify(sessionData),
      key: 'session_data',
      agent: 'api',
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Learning path generated successfully!',
        pathId: learningPath.id,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }

  // Get learning path
  private async getPath(
    sessionId: string,
    corsHeaders: Record<string, string>
  ): Promise<Response> {
    const workingMemory = await this.env.MEMORY.getWorkingMemorySession(sessionId);

    const memories = await workingMemory.getMemory({
      key: 'learning_path',
      nMostRecent: 1,
    });

    if (!memories || memories.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Learning path not found. Please generate it first.' }),
        {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const learningPath = JSON.parse(memories[0].content);

    return new Response(
      JSON.stringify({
        success: true,
        learningPath,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
