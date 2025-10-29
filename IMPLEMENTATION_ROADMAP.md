# Learning Path Agent - Implementation Roadmap

## Overview

This document provides a detailed, step-by-step implementation plan for building the Learning Path Agent system using Raindrop Framework and MCP.

## Technology Stack

### Core Platform
- **Raindrop Framework** - Cloud application platform
- **TypeScript/JavaScript** - Primary development language
- **Node.js** - Runtime environment

### Raindrop Components
- **Services** - HTTP API endpoints
- **AI Models** - LLM integration (70b+ recommended)
- **SmartMemory** - Multi-layered memory system
- **SmartBucket** - RAG-enabled storage with semantic search
- **SmartSQL** - Relational database

### Frontend (Optional)
- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Zustand** - State management
- **React Query** - Data fetching

### Development Tools
- **Raindrop CLI** - Project management and deployment
- **ESLint + Prettier** - Code quality
- **Vitest** - Unit testing
- **Playwright** - E2E testing

### External Services
- **YouTube Data API v3** - Video metadata
- **youtube-transcript-api** - Video transcripts
- **OpenAI API** (optional) - Additional AI capabilities

## Project Structure

```
intelligent-study-paths/
├── raindrop.manifest           # Raindrop configuration
├── package.json
├── tsconfig.json
├── .env
├── .env.example
│
├── src/
│   ├── services/               # Raindrop Services
│   │   ├── orchestrator/
│   │   │   ├── index.ts
│   │   │   ├── routes.ts
│   │   │   ├── handlers/
│   │   │   │   ├── session.ts
│   │   │   │   ├── assessment.ts
│   │   │   │   ├── path.ts
│   │   │   │   └── videos.ts
│   │   │   └── middleware/
│   │   │       ├── auth.ts
│   │   │       ├── validation.ts
│   │   │       └── error-handler.ts
│   │   │
│   │   ├── assessment-agent/
│   │   │   ├── index.ts
│   │   │   ├── question-generator.ts
│   │   │   ├── answer-evaluator.ts
│   │   │   └── assessment-summarizer.ts
│   │   │
│   │   ├── curation-agent/
│   │   │   ├── index.ts
│   │   │   ├── video-searcher.ts
│   │   │   ├── quality-evaluator.ts
│   │   │   └── video-selector.ts
│   │   │
│   │   └── planner-agent/
│   │       ├── index.ts
│   │       ├── gap-analyzer.ts
│   │       ├── topic-tree-generator.ts
│   │       └── dependency-resolver.ts
│   │
│   ├── shared/                 # Shared utilities
│   │   ├── types.ts
│   │   ├── constants.ts
│   │   ├── prompts/
│   │   │   ├── assessment-prompts.ts
│   │   │   ├── curation-prompts.ts
│   │   │   └── planner-prompts.ts
│   │   ├── utils/
│   │   │   ├── validation.ts
│   │   │   ├── formatting.ts
│   │   │   └── youtube.ts
│   │   └── memory/
│   │       ├── memory-manager.ts
│   │       └── memory-utils.ts
│   │
│   ├── scripts/                # Utility scripts
│   │   ├── seed-videos.ts
│   │   ├── seed-knowledge.ts
│   │   └── migrate-data.ts
│   │
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── e2e/
│
├── frontend/                   # Optional Next.js frontend
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── sessions/
│   │   │   ├── [id]/
│   │   │   │   ├── page.tsx
│   │   │   │   └── assessment/
│   │   │   │       └── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   └── paths/
│   │       └── [id]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/                 # shadcn components
│   │   ├── assessment/
│   │   ├── learning-path/
│   │   └── video-card/
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   └── hooks/
│       ├── useSession.ts
│       └── useAssessment.ts
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API_CONTRACTS.md
│   └── IMPLEMENTATION_ROADMAP.md
│
└── README.md
```

## Implementation Phases

## Phase 1: Project Setup & Foundation (Week 1)

### Step 1.1: Initialize Raindrop Project

```bash
# Install Raindrop CLI
npm install -g @raindrop/cli

# Authenticate
raindrop auth login

# Create new project
mkdir intelligent-study-paths
cd intelligent-study-paths
npm init -y

# Install dependencies
npm install @raindrop/runtime @raindrop/types
npm install -D typescript @types/node tsx
npm install zod # For validation
```

### Step 1.2: Create Raindrop Manifest

Create `raindrop.manifest`:

```hcl
application "learning-path-agent" {

  # Main orchestration service
  service "orchestrator" {
    port = 8080
    entrypoint = "src/services/orchestrator/index.ts"
  }

  # Assessment agent service
  service "assessment-agent" {
    entrypoint = "src/services/assessment-agent/index.ts"
  }

  # Curation agent service
  service "curation-agent" {
    entrypoint = "src/services/curation-agent/index.ts"
  }

  # Planner agent service
  service "planner-agent" {
    entrypoint = "src/services/planner-agent/index.ts"
  }

  # AI model for reasoning (70b+ recommended)
  ai "reasoning-engine" {}

  # Multi-layered memory system
  smartmemory "agent-memory" {}

  # Video repository with semantic search
  smartbucket "video-repository" {}

  # Database for generated paths
  sql_database "path-database" {}
}
```

### Step 1.3: Setup TypeScript Configuration

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022"],
    "moduleResolution": "node",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@shared/*": ["./src/shared/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Step 1.4: Define Core Types

Create `src/shared/types.ts`:

```typescript
// Core data types
export interface LearningGoal {
  id: string;
  userId?: string;
  goal: string;
  context?: string;
  targetDate?: Date;
  createdAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  sessionId: string;
  question: string;
  topicArea: string;
  expectedKnowledge: string[];
  followUpQuestions?: string[];
  order: number;
}

export interface AssessmentAnswer {
  questionId: string;
  answer: string;
  timestamp: Date;
  evaluationScore?: number;
}

export interface TopicAssessment {
  topic: string;
  level: 'none' | 'basic' | 'intermediate' | 'advanced';
  confidence: number;
  evidence: string[];
}

export interface KnowledgeAssessment {
  sessionId: string;
  overallLevel: 'beginner' | 'intermediate' | 'advanced';
  topicAssessments: TopicAssessment[];
  gaps: string[];
  strengths: string[];
  recommendations: string[];
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  subtopics?: string[];
  estimatedHours: number;
  keywords: string[];
}

export interface Video {
  id: string;
  videoId: string;
  title: string;
  url: string;
  channel: string;
  channelId: string;
  duration: string;
  durationSeconds: number;
  publishedAt: Date;
  description: string;
  transcript?: string;
  thumbnailUrl: string;
  viewCount?: number;
  likeCount?: number;
  topics: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  tags: string[];
  language: string;
  qualityScore?: number;
}

export interface LearningModule {
  id: string;
  order: number;
  topic: Topic;
  explanation: string;
  learningObjectives: string[];
  videos: Video[];
  estimatedDuration: string;
  prerequisites: string[];
}

export interface LearningPath {
  id: string;
  sessionId: string;
  userId?: string;
  goal: string;
  knowledgeLevel: string;
  modules: LearningModule[];
  totalVideos: number;
  totalDuration: string;
  estimatedWeeks: number;
  createdAt: Date;
  metadata: {
    assessmentSummary: KnowledgeAssessment;
    topicsCovered: string[];
    skillsAcquired: string[];
  };
}

export type SessionPhase =
  | 'goal_collection'
  | 'assessment'
  | 'path_planning'
  | 'curation'
  | 'finalization'
  | 'completed';

export interface SessionState {
  sessionId: string;
  phase: SessionPhase;
  currentStep: number;
  totalSteps: number;
  data: {
    goal?: LearningGoal;
    questions?: AssessmentQuestion[];
    answers?: AssessmentAnswer[];
    assessment?: KnowledgeAssessment;
    topicTree?: Topic[];
    learningPath?: LearningPath;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Environment bindings
export interface Env {
  ORCHESTRATOR: Service;
  ASSESSMENT_AGENT: Service;
  CURATION_AGENT: Service;
  PLANNER_AGENT: Service;
  REASONING_ENGINE: AI;
  AGENT_MEMORY: SmartMemory;
  VIDEO_REPOSITORY: SmartBucket;
  PATH_DATABASE: SQLDatabase;
}
```

### Step 1.5: Deploy Initial Setup

```bash
# Build the project
raindrop build

# Deploy to Raindrop
raindrop deploy
```

## Phase 2: Assessment System (Weeks 2-3)

### Step 2.1: Create Procedural Memory Templates

Create `src/scripts/seed-procedural-memory.ts`:

```typescript
import { Env } from '@/shared/types';

export async function seedProceduralMemory(env: Env) {
  const proceduralMemory = await env.AGENT_MEMORY.getProceduralMemory();

  // Assessment question template
  await proceduralMemory.putProcedure(
    'assessment_question_template',
    `You are an expert educational assessor. Generate contextual questions to evaluate a learner's knowledge.

Context:
- Learning Goal: {goal}
- Topic Area: {topicArea}
- Previous Responses: {previousResponses}

Generate a question that:
1. Assesses practical understanding, not just theoretical knowledge
2. Allows for various expertise levels in the response
3. Is open-ended enough to gauge depth of knowledge
4. Is specific enough to evaluate competency

Question:`
  );

  // Answer evaluation template
  await proceduralMemory.putProcedure(
    'answer_evaluation_template',
    `You are an expert educational assessor. Evaluate a learner's response.

Question: {question}
Topic Area: {topicArea}
Answer: {answer}

Evaluate:
1. Knowledge Level: none | basic | intermediate | advanced
2. Confidence: 0.0 to 1.0
3. Evidence: Key phrases that support your assessment
4. Gaps: Concepts the learner seems unfamiliar with

Provide your evaluation in JSON format.`
  );

  // Assessment summary template
  await proceduralMemory.putProcedure(
    'assessment_summary_template',
    `You are an expert educational assessor. Summarize a learner's knowledge assessment.

Learning Goal: {goal}
Responses: {responses}

Provide:
1. Overall Level: beginner | intermediate | advanced
2. Topic Assessments: List each topic evaluated with level and confidence
3. Knowledge Gaps: What the learner needs to learn
4. Strengths: What the learner already knows well
5. Recommendations: Suggested focus areas

Provide your summary in JSON format.`
  );

  console.log('Procedural memory seeded successfully');
}
```

### Step 2.2: Implement Question Generator

Create `src/services/assessment-agent/question-generator.ts`:

```typescript
import { Env, AssessmentQuestion, AssessmentAnswer } from '@/shared/types';

export class QuestionGenerator {
  constructor(private env: Env) {}

  async generateQuestions(
    sessionId: string,
    goal: string,
    topicAreas: string[],
    previousAnswers: AssessmentAnswer[] = []
  ): Promise<AssessmentQuestion[]> {
    const proceduralMemory = await this.env.AGENT_MEMORY.getProceduralMemory();
    const template = await proceduralMemory.getProcedure(
      'assessment_question_template'
    );

    if (!template) {
      throw new Error('Question template not found');
    }

    const questions: AssessmentQuestion[] = [];

    for (let i = 0; i < topicAreas.length; i++) {
      const topicArea = topicAreas[i];

      // Prepare prompt
      const prompt = template
        .replace('{goal}', goal)
        .replace('{topicArea}', topicArea)
        .replace(
          '{previousResponses}',
          JSON.stringify(previousAnswers.slice(-3)) // Last 3 for context
        );

      // Generate question using AI
      const response = await this.env.REASONING_ENGINE.generateText({
        prompt,
        temperature: 0.7,
        maxTokens: 200,
      });

      questions.push({
        id: `q-${sessionId}-${i}`,
        sessionId,
        question: response.text.trim(),
        topicArea,
        expectedKnowledge: [], // Will be populated based on topic
        order: i,
      });
    }

    return questions;
  }

  async generateFollowUpQuestion(
    sessionId: string,
    previousQuestion: AssessmentQuestion,
    answer: AssessmentAnswer,
    assessmentLevel: string
  ): Promise<AssessmentQuestion | null> {
    // If answer shows high confidence, no follow-up needed
    if (assessmentLevel === 'advanced') {
      return null;
    }

    const proceduralMemory = await this.env.AGENT_MEMORY.getProceduralMemory();
    const template = await proceduralMemory.getProcedure(
      'assessment_question_template'
    );

    if (!template) {
      throw new Error('Question template not found');
    }

    const prompt = `${template}

Previous Question: ${previousQuestion.question}
User Answer: ${answer.answer}
Assessed Level: ${assessmentLevel}

Generate a follow-up question that probes deeper into areas where the user showed uncertainty.`;

    const response = await this.env.REASONING_ENGINE.generateText({
      prompt,
      temperature: 0.7,
      maxTokens: 200,
    });

    return {
      id: `q-${sessionId}-followup-${Date.now()}`,
      sessionId,
      question: response.text.trim(),
      topicArea: previousQuestion.topicArea,
      expectedKnowledge: [],
      order: previousQuestion.order + 0.5, // Between questions
    };
  }
}
```

### Step 2.3: Implement Answer Evaluator

Create `src/services/assessment-agent/answer-evaluator.ts`:

```typescript
import { Env, AssessmentQuestion, AssessmentAnswer, TopicAssessment } from '@/shared/types';

export class AnswerEvaluator {
  constructor(private env: Env) {}

  async evaluateAnswer(
    question: AssessmentQuestion,
    answer: string
  ): Promise<TopicAssessment> {
    const proceduralMemory = await this.env.AGENT_MEMORY.getProceduralMemory();
    const template = await proceduralMemory.getProcedure(
      'answer_evaluation_template'
    );

    if (!template) {
      throw new Error('Evaluation template not found');
    }

    const prompt = template
      .replace('{question}', question.question)
      .replace('{topicArea}', question.topicArea)
      .replace('{answer}', answer);

    const response = await this.env.REASONING_ENGINE.generateText({
      prompt,
      temperature: 0.3, // Lower temperature for consistent evaluation
      maxTokens: 500,
    });

    // Parse JSON response
    try {
      const evaluation = JSON.parse(response.text);

      return {
        topic: question.topicArea,
        level: evaluation.knowledgeLevel,
        confidence: evaluation.confidence,
        evidence: evaluation.evidence || [],
      };
    } catch (error) {
      console.error('Failed to parse evaluation:', error);
      throw new Error('Invalid evaluation response');
    }
  }
}
```

### Step 2.4: Implement Assessment Service

Create `src/services/assessment-agent/index.ts`:

```typescript
import { Service } from '@raindrop/runtime';
import { Env, AssessmentQuestion, KnowledgeAssessment } from '@/shared/types';
import { QuestionGenerator } from './question-generator';
import { AnswerEvaluator } from './answer-evaluator';

export default class AssessmentAgent extends Service<Env> {
  private questionGenerator: QuestionGenerator;
  private answerEvaluator: AnswerEvaluator;

  constructor() {
    super();
    this.questionGenerator = new QuestionGenerator(this.env);
    this.answerEvaluator = new AnswerEvaluator(this.env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Generate questions
      if (path === '/generate-questions' && request.method === 'POST') {
        const body = await request.json();
        const questions = await this.questionGenerator.generateQuestions(
          body.sessionId,
          body.goal,
          body.topicAreas,
          body.previousAnswers
        );

        return Response.json({ questions });
      }

      // Evaluate answer
      if (path === '/evaluate-answer' && request.method === 'POST') {
        const body = await request.json();
        const evaluation = await this.answerEvaluator.evaluateAnswer(
          body.question,
          body.answer
        );

        return Response.json({ evaluation });
      }

      // Generate summary
      if (path === '/generate-summary' && request.method === 'POST') {
        const body = await request.json();
        const summary = await this.generateAssessmentSummary(
          body.sessionId,
          body.goal,
          body.topicAssessments
        );

        return Response.json({ summary });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Assessment agent error:', error);
      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  private async generateAssessmentSummary(
    sessionId: string,
    goal: string,
    topicAssessments: any[]
  ): Promise<KnowledgeAssessment> {
    const proceduralMemory = await this.env.AGENT_MEMORY.getProceduralMemory();
    const template = await proceduralMemory.getProcedure(
      'assessment_summary_template'
    );

    if (!template) {
      throw new Error('Summary template not found');
    }

    const prompt = template
      .replace('{goal}', goal)
      .replace('{responses}', JSON.stringify(topicAssessments));

    const response = await this.env.REASONING_ENGINE.generateText({
      prompt,
      temperature: 0.3,
      maxTokens: 1000,
    });

    const summary = JSON.parse(response.text);

    return {
      sessionId,
      overallLevel: summary.overallLevel,
      topicAssessments: summary.topicAssessments,
      gaps: summary.gaps,
      strengths: summary.strengths,
      recommendations: summary.recommendations,
    };
  }
}
```

## Phase 3: Knowledge Base & Path Planning (Weeks 4-5)

### Step 3.1: Seed Semantic Memory with Domain Knowledge

Create `src/scripts/seed-semantic-memory.ts`:

```typescript
import { Env } from '@/shared/types';

export async function seedSemanticMemory(env: Env) {
  const memory = env.AGENT_MEMORY;

  // Define topic relationships
  const topics = [
    {
      topic: 'Vercel',
      category: 'deployment-platform',
      description: 'Cloud platform for frontend frameworks and static sites',
      prerequisites: ['frontend-basics', 'git-basics', 'deployment-concepts'],
      subtopics: [
        'vercel-cli',
        'vercel-config',
        'edge-functions',
        'deployment-workflows',
        'environment-variables',
        'domains-ssl',
      ],
      relatedTopics: ['Netlify', 'AWS Amplify', 'Cloudflare Pages'],
      difficultyLevel: 'intermediate',
      estimatedHours: 8,
    },
    {
      topic: 'deployment-concepts',
      category: 'fundamentals',
      description: 'Core concepts of web application deployment',
      prerequisites: ['web-basics'],
      subtopics: [
        'hosting-types',
        'build-process',
        'runtime-vs-buildtime',
        'continuous-deployment',
      ],
      relatedTopics: ['CI/CD', 'DevOps'],
      difficultyLevel: 'beginner',
      estimatedHours: 4,
    },
    // Add more topics...
  ];

  for (const topic of topics) {
    await memory.putSemanticMemory(topic);
  }

  console.log(`Seeded ${topics.length} topics to semantic memory`);
}
```

### Step 3.2: Implement Planner Agent

Create `src/services/planner-agent/gap-analyzer.ts`:

```typescript
import { Env, KnowledgeAssessment } from '@/shared/types';

export class GapAnalyzer {
  constructor(private env: Env) {}

  async analyzeGaps(
    goal: string,
    assessment: KnowledgeAssessment
  ): Promise<{
    criticalGaps: string[];
    niceToHave: string[];
    existingKnowledge: string[];
  }> {
    // Search semantic memory for goal topic
    const domainKnowledge = await this.env.AGENT_MEMORY.searchSemanticMemory(
      goal
    );

    if (!domainKnowledge.success || !domainKnowledge.documentSearchResponse) {
      throw new Error('Failed to retrieve domain knowledge');
    }

    // Extract prerequisites from domain knowledge
    const prerequisites = new Set<string>();
    for (const result of domainKnowledge.documentSearchResponse.results) {
      if (result.text) {
        const data = JSON.parse(result.text);
        if (data.prerequisites) {
          data.prerequisites.forEach((p: string) => prerequisites.add(p));
        }
      }
    }

    // Compare with user's assessed knowledge
    const userKnowledge = new Set(
      assessment.topicAssessments
        .filter((t) => t.level !== 'none')
        .map((t) => t.topic)
    );

    const criticalGaps: string[] = [];
    const niceToHave: string[] = [];

    for (const prereq of prerequisites) {
      if (!userKnowledge.has(prereq)) {
        criticalGaps.push(prereq);
      }
    }

    const existingKnowledge = Array.from(userKnowledge);

    return {
      criticalGaps,
      niceToHave,
      existingKnowledge,
    };
  }
}
```

### Step 3.3: Implement Topic Tree Generator

Create `src/services/planner-agent/topic-tree-generator.ts`:

```typescript
import { Env, Topic, KnowledgeAssessment } from '@/shared/types';

export class TopicTreeGenerator {
  constructor(private env: Env) {}

  async generateTopicTree(
    goal: string,
    gaps: string[],
    assessment: KnowledgeAssessment
  ): Promise<{ topics: Topic[]; orderedTopics: string[] }> {
    const prompt = `You are an expert curriculum designer. Create a structured learning path.

Learning Goal: ${goal}
Current Knowledge Level: ${assessment.overallLevel}
Knowledge Gaps: ${gaps.join(', ')}
Existing Strengths: ${assessment.strengths.join(', ')}

Generate a learning path as a JSON array of topics with:
1. id: unique identifier
2. name: topic name
3. description: what will be learned
4. difficulty: beginner | intermediate | advanced
5. prerequisites: array of topic ids that must be learned first
6. estimatedHours: estimated learning time
7. keywords: relevant search keywords
8. explanation: why this topic is important for the goal

Order topics logically with prerequisites first.`;

    const response = await this.env.REASONING_ENGINE.generateText({
      prompt,
      temperature: 0.4,
      maxTokens: 2000,
    });

    const topics: Topic[] = JSON.parse(response.text);

    // Topologically sort topics by prerequisites
    const orderedTopics = this.topologicalSort(topics);

    return { topics, orderedTopics };
  }

  private topologicalSort(topics: Topic[]): string[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Build graph
    topics.forEach((topic) => {
      graph.set(topic.id, topic.prerequisites);
      inDegree.set(topic.id, topic.prerequisites.length);
    });

    // Find topics with no prerequisites
    const queue: string[] = [];
    inDegree.forEach((degree, topicId) => {
      if (degree === 0) {
        queue.push(topicId);
      }
    });

    const sorted: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      sorted.push(current);

      // Reduce in-degree for dependents
      topics.forEach((topic) => {
        if (topic.prerequisites.includes(current)) {
          const newDegree = inDegree.get(topic.id)! - 1;
          inDegree.set(topic.id, newDegree);
          if (newDegree === 0) {
            queue.push(topic.id);
          }
        }
      });
    }

    return sorted;
  }
}
```

## Phase 4: Video Curation System (Weeks 6-7)

### Step 4.1: Seed Video Repository

Create `src/scripts/seed-videos.ts`:

```typescript
import { Env, Video } from '@/shared/types';
import { google } from 'googleapis';

const youtube = google.youtube('v3');

export async function seedVideoRepository(env: Env) {
  const topics = [
    'Vercel deployment tutorial',
    'Next.js deployment',
    'Frontend deployment basics',
    'CI/CD for frontend',
    // Add more search queries
  ];

  for (const topic of topics) {
    const videos = await searchYouTubeVideos(topic);

    for (const video of videos) {
      // Store in SmartBucket for semantic search
      await env.VIDEO_REPOSITORY.put(video.id, JSON.stringify(video));
    }
  }

  console.log('Video repository seeded');
}

async function searchYouTubeVideos(query: string): Promise<Video[]> {
  const response = await youtube.search.list({
    part: ['snippet'],
    q: query,
    type: ['video'],
    maxResults: 50,
    relevanceLanguage: 'en',
    key: process.env.YOUTUBE_API_KEY,
  });

  const videos: Video[] = [];

  for (const item of response.data.items || []) {
    const videoId = item.id?.videoId;
    if (!videoId) continue;

    // Get detailed video info
    const videoResponse = await youtube.videos.list({
      part: ['snippet', 'contentDetails', 'statistics'],
      id: [videoId],
      key: process.env.YOUTUBE_API_KEY,
    });

    const videoData = videoResponse.data.items?.[0];
    if (!videoData) continue;

    // Get transcript
    const transcript = await getTranscript(videoId);

    videos.push({
      id: `video-${videoId}`,
      videoId,
      title: videoData.snippet?.title || '',
      url: `https://youtube.com/watch?v=${videoId}`,
      channel: videoData.snippet?.channelTitle || '',
      channelId: videoData.snippet?.channelId || '',
      duration: videoData.contentDetails?.duration || '',
      durationSeconds: parseDuration(videoData.contentDetails?.duration || ''),
      publishedAt: new Date(videoData.snippet?.publishedAt || ''),
      description: videoData.snippet?.description || '',
      transcript,
      thumbnailUrl: videoData.snippet?.thumbnails?.high?.url || '',
      viewCount: parseInt(videoData.statistics?.viewCount || '0'),
      likeCount: parseInt(videoData.statistics?.likeCount || '0'),
      topics: extractTopics(videoData.snippet?.title || ''),
      difficulty: 'beginner', // Will be classified by AI
      prerequisites: [],
      tags: videoData.snippet?.tags || [],
      language: 'en',
    });
  }

  return videos;
}

async function getTranscript(videoId: string): Promise<string> {
  // Use youtube-transcript-api or similar
  // Implementation depends on the library
  return '';
}

function parseDuration(duration: string): number {
  // Parse ISO 8601 duration to seconds
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1]) || 0;
  const minutes = parseInt(match[2]) || 0;
  const seconds = parseInt(match[3]) || 0;

  return hours * 3600 + minutes * 60 + seconds;
}

function extractTopics(title: string): string[] {
  // Simple keyword extraction
  const keywords = title.toLowerCase().match(/\b\w{4,}\b/g) || [];
  return [...new Set(keywords)];
}
```

### Step 4.2: Implement Video Curation Agent

Create `src/services/curation-agent/index.ts`:

```typescript
import { Service } from '@raindrop/runtime';
import { Env, Topic, Video } from '@/shared/types';

export default class CurationAgent extends Service<Env> {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Search videos
      if (path === '/search-videos' && request.method === 'POST') {
        const body = await request.json();
        const videos = await this.searchVideos(body.topic, body.criteria);
        return Response.json({ videos });
      }

      // Evaluate videos
      if (path === '/evaluate-videos' && request.method === 'POST') {
        const body = await request.json();
        const evaluated = await this.evaluateVideos(
          body.videos,
          body.topic,
          body.criteria
        );
        return Response.json({ evaluatedVideos: evaluated });
      }

      // Select best videos
      if (path === '/select-best' && request.method === 'POST') {
        const body = await request.json();
        const selected = await this.selectBestVideos(
          body.evaluatedVideos,
          body.targetCount
        );
        return Response.json({ selectedVideos: selected });
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Curation agent error:', error);
      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  private async searchVideos(
    topic: Topic,
    criteria: any
  ): Promise<Video[]> {
    // Search SmartBucket for relevant videos
    const searchResults = await this.env.VIDEO_REPOSITORY.search({
      input: `${topic.name} ${topic.keywords.join(' ')}`,
      requestId: `search-${topic.id}-${Date.now()}`,
    });

    // Parse video results
    const videos: Video[] = [];
    for (const result of searchResults.results) {
      if (result.text) {
        const video = JSON.parse(result.text) as Video;
        videos.push({ ...video, qualityScore: result.score });
      }
    }

    return videos.slice(0, criteria.maxVideos || 20);
  }

  private async evaluateVideos(
    videos: Video[],
    topic: Topic,
    criteria: any
  ): Promise<(Video & { evaluation: any })[]> {
    const evaluated = [];

    for (const video of videos) {
      const prompt = `Evaluate this video for teaching "${topic.name}" to ${topic.difficulty} level learners.

Video Title: ${video.title}
Channel: ${video.channel}
Duration: ${video.duration}
Description: ${video.description.substring(0, 500)}

Rate 1-10:
1. Content Quality
2. Teaching Style
3. Practical Examples
4. Clarity of Explanations

Provide JSON with: contentQuality, teachingStyle, practicalExamples, clarity, overallScore (average), recommendation (highly-recommended | recommended | acceptable | not-recommended), pros (array), cons (array)`;

      const response = await this.env.REASONING_ENGINE.generateText({
        prompt,
        temperature: 0.3,
        maxTokens: 500,
      });

      const evaluation = JSON.parse(response.text);

      evaluated.push({
        ...video,
        evaluation,
      });
    }

    return evaluated;
  }

  private async selectBestVideos(
    evaluatedVideos: any[],
    targetCount: number
  ): Promise<Video[]> {
    // Sort by overall score
    const sorted = evaluatedVideos
      .filter((v) => v.evaluation.recommendation !== 'not-recommended')
      .sort((a, b) => b.evaluation.overallScore - a.evaluation.overallScore);

    return sorted.slice(0, targetCount).map((v) => ({
      ...v,
      qualityScore: v.evaluation.overallScore / 10,
    }));
  }
}
```

## Phase 5: Integration & Orchestration (Weeks 8-9)

### Step 5.1: Implement Orchestrator Service

Create `src/services/orchestrator/index.ts`:

```typescript
import { Service } from '@raindrop/runtime';
import { Env, SessionState, LearningPath } from '@/shared/types';
import { SessionHandler } from './handlers/session';
import { AssessmentHandler } from './handlers/assessment';
import { PathHandler } from './handlers/path';

export default class Orchestrator extends Service<Env> {
  private sessionHandler: SessionHandler;
  private assessmentHandler: AssessmentHandler;
  private pathHandler: PathHandler;

  constructor() {
    super();
    this.sessionHandler = new SessionHandler(this.env);
    this.assessmentHandler = new AssessmentHandler(this.env);
    this.pathHandler = new PathHandler(this.env);
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // Session management
      if (path === '/api/sessions' && request.method === 'POST') {
        return await this.sessionHandler.createSession(request);
      }

      if (path.match(/^\/api\/sessions\/[^/]+$/) && request.method === 'GET') {
        const sessionId = path.split('/').pop()!;
        return await this.sessionHandler.getSession(sessionId);
      }

      // Assessment
      if (path.match(/^\/api\/sessions\/[^/]+\/assessment\/next$/)) {
        const sessionId = path.split('/')[3];
        return await this.assessmentHandler.getNextQuestion(sessionId);
      }

      if (path.match(/^\/api\/sessions\/[^/]+\/assessment\/answer$/)) {
        const sessionId = path.split('/')[3];
        return await this.assessmentHandler.submitAnswer(sessionId, request);
      }

      // Path generation
      if (path.match(/^\/api\/sessions\/[^/]+\/path\/generate$/)) {
        const sessionId = path.split('/')[3];
        return await this.pathHandler.generatePath(sessionId);
      }

      if (path.match(/^\/api\/sessions\/[^/]+\/path$/)) {
        const sessionId = path.split('/')[3];
        return await this.pathHandler.getPath(sessionId);
      }

      return new Response('Not Found', { status: 404 });
    } catch (error) {
      console.error('Orchestrator error:', error);
      return Response.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }
}
```

### Step 5.2: Implement Session Handler

Create `src/services/orchestrator/handlers/session.ts`:

```typescript
import { Env, LearningGoal, SessionState } from '@/shared/types';

export class SessionHandler {
  constructor(private env: Env) {}

  async createSession(request: Request): Promise<Response> {
    const body = await request.json();
    const { goal, context, userId } = body;

    // Start working memory session
    const { sessionId, workingMemory } =
      await this.env.AGENT_MEMORY.startWorkingMemorySession();

    // Store goal
    const learningGoal: LearningGoal = {
      id: `goal-${sessionId}`,
      userId,
      goal,
      context,
      createdAt: new Date(),
    };

    await workingMemory.putMemory({
      content: JSON.stringify(learningGoal),
      key: 'user_goal',
      agent: 'orchestrator',
    });

    // Initialize session state
    const sessionState: SessionState = {
      sessionId,
      phase: 'goal_collection',
      currentStep: 0,
      totalSteps: 5,
      data: { goal: learningGoal },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await workingMemory.putMemory({
      content: JSON.stringify(sessionState),
      key: 'session_state',
      agent: 'orchestrator',
    });

    return Response.json({
      success: true,
      sessionId,
      phase: 'goal_collection',
      nextAction: {
        type: 'assessment_start',
        message: "Let's assess your current knowledge to create the best learning path for you.",
      },
    });
  }

  async getSession(sessionId: string): Promise<Response> {
    const workingMemory =
      await this.env.AGENT_MEMORY.getWorkingMemorySession(sessionId);

    const stateMemory = await workingMemory.getMemory({
      key: 'session_state',
      nMostRecent: 1,
    });

    if (!stateMemory || stateMemory.length === 0) {
      return Response.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    const sessionState: SessionState = JSON.parse(stateMemory[0].content);

    return Response.json({
      success: true,
      session: sessionState,
    });
  }
}
```

## Phase 6: Frontend Development (Weeks 10-11)

### Step 6.1: Setup Next.js Frontend

```bash
cd frontend
npx create-next-app@latest . --typescript --tailwind --app
npx shadcn-ui@latest init
```

### Step 6.2: Create API Client

Create `frontend/lib/api.ts`:

```typescript
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export class LearningPathAPI {
  async createSession(goal: string, context?: string) {
    const response = await fetch(`${API_BASE}/api/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal, context }),
    });
    return response.json();
  }

  async getSession(sessionId: string) {
    const response = await fetch(`${API_BASE}/api/sessions/${sessionId}`);
    return response.json();
  }

  async getNextQuestion(sessionId: string) {
    const response = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/assessment/next`
    );
    return response.json();
  }

  async submitAnswer(sessionId: string, questionId: string, answer: string) {
    const response = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/assessment/answer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer }),
      }
    );
    return response.json();
  }

  async generatePath(sessionId: string) {
    const response = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/path/generate`,
      {
        method: 'POST',
      }
    );
    return response.json();
  }

  async getPath(sessionId: string) {
    const response = await fetch(
      `${API_BASE}/api/sessions/${sessionId}/path`
    );
    return response.json();
  }
}

export const api = new LearningPathAPI();
```

## Phase 7: Testing & Deployment (Week 12)

### Step 7.1: Write Tests

Create `src/tests/unit/assessment.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { QuestionGenerator } from '@/services/assessment-agent/question-generator';

describe('QuestionGenerator', () => {
  it('should generate contextual questions', async () => {
    // Test implementation
  });
});
```

### Step 7.2: Deploy to Production

```bash
# Build and deploy
raindrop build
raindrop deploy --production

# Run migrations
raindrop run script:seed-procedural-memory
raindrop run script:seed-semantic-memory
raindrop run script:seed-videos
```

## Best Practices

### Code Organization
- Keep services focused on single responsibilities
- Use shared utilities for common operations
- Maintain clear separation between agents
- Document all public APIs

### Memory Management
- Use working memory only for active sessions
- Flush to episodic memory after completion
- Keep procedural memory templates versioned
- Index semantic memory with clear structure

### Performance
- Cache frequently accessed memory
- Use async operations for agent coordination
- Batch video searches when possible
- Implement request pagination

### Error Handling
- Use try-catch blocks in all services
- Log errors with context
- Return meaningful error messages
- Implement retry logic for external APIs

### Security
- Validate all user inputs
- Sanitize content from external APIs
- Use rate limiting
- Implement authentication

## Monitoring & Analytics

### Key Metrics
- Session completion rate
- Average assessment time
- Path generation success rate
- Video quality scores
- User satisfaction ratings

### Logging
- Use Raindrop's built-in logging
- Log all agent interactions
- Track performance metrics
- Monitor error rates

## Next Steps

After completing the basic implementation:

1. **Add Progress Tracking** - Allow users to mark videos as completed
2. **Implement Feedback Loop** - Collect user feedback to improve curation
3. **Add Collaborative Features** - Share and fork learning paths
4. **Build Mobile App** - Native mobile experience
5. **Integrate with LMS** - Export to learning management systems
6. **Multi-Language Support** - Support videos in multiple languages
7. **Skill Trees** - Visual representation of learning paths

## Resources

- [Raindrop Documentation](https://docs.raindrop.io)
- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com)
