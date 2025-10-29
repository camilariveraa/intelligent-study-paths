// Core types for Learning Path Agent MVP

export interface LearningGoal {
  id: string;
  userId?: string;
  goal: string;
  createdAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  question: string;
  topicArea: string;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
}

export interface KnowledgeLevel {
  topic: string;
  level: 'none' | 'basic' | 'intermediate' | 'advanced';
  confidence: number;
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
  createdAt: Date;
}

export interface SessionData {
  sessionId: string;
  goal?: string;
  currentQuestionIndex: number;
  questions: AssessmentQuestion[];
  answers: AssessmentAnswer[];
  knowledgeLevels: KnowledgeLevel[];
  phase: 'init' | 'assessment' | 'generating' | 'completed';
}

// Raindrop environment bindings
export interface Env {
  API: Service;
  REASONER: AI;
  MEMORY: SmartMemory;
  VIDEOS: SmartBucket;
}

// Type definitions for Raindrop runtime
export interface Service {
  fetch(request: Request): Promise<Response>;
}

export interface AI {
  generateText(params: {
    prompt: string;
    systemPrompt?: string;
    temperature?: number;
    maxTokens?: number;
  }): Promise<{ text: string }>;
}

export interface SmartMemory {
  startWorkingMemorySession(): Promise<{
    sessionId: string;
    workingMemory: WorkingMemory;
  }>;
  getWorkingMemorySession(sessionId: string): Promise<WorkingMemory>;
}

export interface WorkingMemory {
  putMemory(entry: {
    content: string;
    key?: string;
    agent?: string;
  }): Promise<string>;

  getMemory(query: {
    key?: string;
    nMostRecent?: number;
  }): Promise<Array<{
    id: string;
    content: string;
    key?: string;
    agent?: string;
    at: Date;
  }> | null>;

  endSession(flush: boolean): Promise<void>;
}

export interface SmartBucket {
  search(params: {
    input: string;
    requestId: string;
  }): Promise<{
    results: Array<{
      text?: string;
      source?: string;
      score?: number;
    }>;
  }>;

  put(key: string, value: string): Promise<void>;
}
