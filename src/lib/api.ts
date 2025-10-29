// API client for Learning Path Agent backend

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080';

export interface CreateSessionResponse {
  success: boolean;
  sessionId: string;
  phase: string;
  message: string;
}

export interface Question {
  id: string;
  question: string;
  topicArea: string;
}

export interface QuestionResponse {
  success: boolean;
  question?: Question;
  completed?: boolean;
  message?: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
}

export interface AnswerResponse {
  success: boolean;
  completed: boolean;
  message: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
}

export interface Video {
  id: string;
  videoId: string;
  title: string;
  url: string;
  channel: string;
  duration: string;
  thumbnailUrl: string;
  topics: string[];
}

export interface LearningModule {
  id: string;
  order: number;
  topic: string;
  explanation: string;
  videos: Video[];
}

export interface LearningPath {
  id: string;
  sessionId: string;
  goal: string;
  knowledgeLevel: string;
  modules: LearningModule[];
  totalVideos: number;
  createdAt: string;
}

export interface LearningPathResponse {
  success: boolean;
  learningPath: LearningPath;
}

export interface GeneratePathResponse {
  success: boolean;
  message: string;
  pathId: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

class LearningPathAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async createSession(goal: string): Promise<CreateSessionResponse> {
    return this.request<CreateSessionResponse>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ goal }),
    });
  }

  async getSession(sessionId: string): Promise<any> {
    return this.request(`/api/sessions/${sessionId}`);
  }

  async getNextQuestion(sessionId: string): Promise<QuestionResponse> {
    return this.request<QuestionResponse>(
      `/api/sessions/${sessionId}/assessment/next`
    );
  }

  async submitAnswer(
    sessionId: string,
    questionId: string,
    answer: string
  ): Promise<AnswerResponse> {
    return this.request<AnswerResponse>(
      `/api/sessions/${sessionId}/assessment/answer`,
      {
        method: 'POST',
        body: JSON.stringify({ questionId, answer }),
      }
    );
  }

  async generatePath(sessionId: string): Promise<GeneratePathResponse> {
    return this.request<GeneratePathResponse>(
      `/api/sessions/${sessionId}/path/generate`,
      {
        method: 'POST',
      }
    );
  }

  async getLearningPath(sessionId: string): Promise<LearningPathResponse> {
    return this.request<LearningPathResponse>(
      `/api/sessions/${sessionId}/path`
    );
  }

  async healthCheck(): Promise<{ status: string }> {
    return this.request('/health');
  }
}

// Export singleton instance
export const api = new LearningPathAPI();
