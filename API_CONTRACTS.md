# Learning Path Agent - API Contracts & Data Flow

## Overview

This document defines the detailed API contracts, data structures, and integration patterns for the Learning Path Agent system.

## Core Data Types

### LearningGoal

```typescript
interface LearningGoal {
  id: string;
  userId?: string;
  goal: string;
  context?: string; // Additional context about why they want to learn
  targetDate?: Date; // Optional deadline
  createdAt: Date;
}
```

### AssessmentQuestion

```typescript
interface AssessmentQuestion {
  id: string;
  sessionId: string;
  question: string;
  topicArea: string;
  expectedKnowledge: string[];
  followUpQuestions?: string[];
  order: number;
}
```

### AssessmentAnswer

```typescript
interface AssessmentAnswer {
  questionId: string;
  answer: string;
  timestamp: Date;
  evaluationScore?: number; // 0-1 confidence score
}
```

### KnowledgeAssessment

```typescript
interface KnowledgeAssessment {
  sessionId: string;
  overallLevel: 'beginner' | 'intermediate' | 'advanced';
  topicAssessments: TopicAssessment[];
  gaps: string[];
  strengths: string[];
  recommendations: string[];
}

interface TopicAssessment {
  topic: string;
  level: 'none' | 'basic' | 'intermediate' | 'advanced';
  confidence: number; // 0-1
  evidence: string[]; // Quotes from user answers
}
```

### Topic

```typescript
interface Topic {
  id: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[]; // Topic IDs
  subtopics?: string[];
  estimatedHours: number;
  keywords: string[];
}
```

### Video

```typescript
interface Video {
  id: string;
  videoId: string; // YouTube video ID
  title: string;
  url: string;
  channel: string;
  channelId: string;
  duration: string; // Format: "HH:MM:SS"
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
  qualityScore?: number; // 0-1 calculated score
}
```

### LearningModule

```typescript
interface LearningModule {
  id: string;
  order: number;
  topic: Topic;
  explanation: string; // Why this module comes at this position
  learningObjectives: string[];
  videos: Video[];
  estimatedDuration: string;
  prerequisites: string[]; // Module IDs
}
```

### LearningPath

```typescript
interface LearningPath {
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
```

### SessionState

```typescript
type SessionPhase =
  | 'goal_collection'
  | 'assessment'
  | 'path_planning'
  | 'curation'
  | 'finalization'
  | 'completed';

interface SessionState {
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
```

## REST API Endpoints

### Session Management

#### POST /api/sessions
Create a new learning path generation session

**Request:**
```json
{
  "goal": "I want to learn Vercel deployment",
  "context": "I'm a React developer looking to deploy my projects",
  "userId": "user-123" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session-abc-123",
  "phase": "goal_collection",
  "nextAction": {
    "type": "assessment_start",
    "message": "Great! Let's assess your current knowledge to create the best learning path for you."
  }
}
```

#### GET /api/sessions/:sessionId
Get current session state

**Response:**
```json
{
  "success": true,
  "session": {
    "sessionId": "session-abc-123",
    "phase": "assessment",
    "currentStep": 2,
    "totalSteps": 5,
    "goal": "Learn Vercel deployment",
    "createdAt": "2025-10-28T10:00:00Z"
  }
}
```

#### DELETE /api/sessions/:sessionId
Cancel an in-progress session

**Response:**
```json
{
  "success": true,
  "message": "Session cancelled"
}
```

### Assessment

#### GET /api/sessions/:sessionId/assessment/next
Get the next assessment question

**Response:**
```json
{
  "success": true,
  "question": {
    "id": "q-1",
    "question": "What is your experience level with React?",
    "topicArea": "frontend-frameworks",
    "context": "This helps us understand your foundational knowledge"
  },
  "progress": {
    "current": 1,
    "total": 5,
    "percentage": 20
  }
}
```

#### POST /api/sessions/:sessionId/assessment/answer
Submit an answer to an assessment question

**Request:**
```json
{
  "questionId": "q-1",
  "answer": "I have 2 years of experience with React and have built several production applications"
}
```

**Response:**
```json
{
  "success": true,
  "nextQuestion": {
    "id": "q-2",
    "question": "Have you worked with Git and version control?",
    "topicArea": "development-tools"
  },
  "progress": {
    "current": 2,
    "total": 5,
    "percentage": 40
  }
}
```

#### POST /api/sessions/:sessionId/assessment/skip
Skip the current question

**Request:**
```json
{
  "questionId": "q-2",
  "reason": "Not sure" // Optional
}
```

**Response:**
```json
{
  "success": true,
  "nextQuestion": { ... },
  "progress": { ... }
}
```

#### GET /api/sessions/:sessionId/assessment/summary
Get assessment results summary

**Response:**
```json
{
  "success": true,
  "assessment": {
    "overallLevel": "intermediate",
    "topicAssessments": [
      {
        "topic": "React",
        "level": "advanced",
        "confidence": 0.9
      },
      {
        "topic": "Deployment",
        "level": "basic",
        "confidence": 0.4
      }
    ],
    "gaps": [
      "CI/CD concepts",
      "Environment variables",
      "Domain configuration"
    ],
    "strengths": [
      "Frontend development",
      "Component architecture"
    ]
  }
}
```

### Path Generation

#### POST /api/sessions/:sessionId/path/generate
Trigger learning path generation

**Response:**
```json
{
  "success": true,
  "status": "generating",
  "estimatedTime": "30 seconds",
  "message": "Analyzing your assessment and curating the perfect learning path..."
}
```

#### GET /api/sessions/:sessionId/path/status
Check path generation status

**Response:**
```json
{
  "success": true,
  "status": "completed",
  "phase": "finalization",
  "progress": {
    "assessment": "completed",
    "planning": "completed",
    "curation": "completed",
    "finalization": "in_progress"
  }
}
```

#### GET /api/sessions/:sessionId/path
Retrieve the generated learning path

**Response:**
```json
{
  "success": true,
  "learningPath": {
    "id": "path-xyz-789",
    "goal": "Learn Vercel deployment",
    "knowledgeLevel": "intermediate",
    "modules": [
      {
        "id": "module-1",
        "order": 1,
        "topic": {
          "name": "Deployment Fundamentals",
          "description": "Core concepts of web application deployment",
          "difficulty": "beginner"
        },
        "explanation": "Before diving into Vercel, it's important to understand general deployment concepts that apply across platforms.",
        "learningObjectives": [
          "Understand what deployment means",
          "Learn about hosting environments",
          "Grasp build vs. runtime concepts"
        ],
        "videos": [
          {
            "videoId": "abc123",
            "title": "Web Deployment Explained",
            "channel": "Tech Education",
            "duration": "15:30",
            "url": "https://youtube.com/watch?v=abc123",
            "thumbnailUrl": "https://...",
            "difficulty": "beginner"
          }
        ],
        "estimatedDuration": "1.5 hours"
      },
      {
        "id": "module-2",
        "order": 2,
        "topic": {
          "name": "Vercel Platform Introduction",
          "description": "Getting started with Vercel",
          "difficulty": "intermediate"
        },
        "explanation": "Now that you understand deployment basics, let's explore Vercel's specific features and advantages.",
        "learningObjectives": [
          "Set up a Vercel account",
          "Deploy your first project",
          "Understand Vercel's dashboard"
        ],
        "videos": [ ... ],
        "estimatedDuration": "2 hours"
      }
    ],
    "totalVideos": 12,
    "totalDuration": "8 hours",
    "estimatedWeeks": 2,
    "metadata": {
      "assessmentSummary": { ... },
      "topicsCovered": ["deployment", "vercel", "ci-cd"],
      "skillsAcquired": ["Vercel CLI", "Configuration", "Edge Functions"]
    }
  }
}
```

### Path Management

#### GET /api/paths/:pathId
Retrieve a specific learning path by ID

**Response:**
```json
{
  "success": true,
  "learningPath": { ... }
}
```

#### GET /api/paths
List all learning paths (with pagination)

**Query Parameters:**
- `userId` (optional): Filter by user
- `topic` (optional): Filter by topic
- `page` (default: 1)
- `limit` (default: 10)

**Response:**
```json
{
  "success": true,
  "paths": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

#### POST /api/paths/:pathId/fork
Create a copy of an existing path for customization

**Response:**
```json
{
  "success": true,
  "newPathId": "path-new-123",
  "message": "Path forked successfully"
}
```

### Video Management

#### POST /api/videos/index
Add a new video to the repository (admin/curator)

**Request:**
```json
{
  "videoId": "dQw4w9WgXcQ",
  "metadata": {
    "topics": ["deployment", "basics"],
    "difficulty": "beginner",
    "prerequisites": [],
    "manualTags": ["tutorial", "introduction"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "video": { ... },
  "message": "Video indexed successfully"
}
```

#### GET /api/videos/search
Search videos by topic or keywords

**Query Parameters:**
- `query`: Search query
- `difficulty`: Filter by difficulty
- `limit`: Results limit

**Response:**
```json
{
  "success": true,
  "videos": [ ... ],
  "pagination": { ... }
}
```

#### GET /api/videos/:videoId
Get detailed video information

**Response:**
```json
{
  "success": true,
  "video": { ... }
}
```

### Analytics & Feedback

#### POST /api/feedback
Submit feedback on a learning path

**Request:**
```json
{
  "pathId": "path-xyz-789",
  "rating": 5,
  "comment": "Excellent progression, very helpful!",
  "completedModules": 3,
  "helpful": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback recorded"
}
```

#### GET /api/analytics/paths/:pathId
Get analytics for a specific path

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalGenerations": 45,
    "averageRating": 4.5,
    "completionRate": 0.67,
    "popularModules": [ ... ]
  }
}
```

## Internal Agent APIs

These are internal service-to-service APIs used by agents.

### Assessment Agent API

#### POST /internal/assessment/generate-questions

**Request:**
```typescript
{
  sessionId: string;
  goal: string;
  targetTopics: string[];
  previousAnswers?: AssessmentAnswer[];
}
```

**Response:**
```typescript
{
  questions: AssessmentQuestion[];
  strategy: 'broad-to-narrow' | 'prerequisite-focused';
}
```

#### POST /internal/assessment/evaluate-answer

**Request:**
```typescript
{
  question: AssessmentQuestion;
  answer: string;
  context: {
    previousAnswers: AssessmentAnswer[];
    targetTopic: string;
  };
}
```

**Response:**
```typescript
{
  evaluation: {
    topicLevel: 'none' | 'basic' | 'intermediate' | 'advanced';
    confidence: number;
    evidence: string[];
    suggestedFollowUp?: string;
  };
}
```

#### POST /internal/assessment/generate-summary

**Request:**
```typescript
{
  sessionId: string;
  questions: AssessmentQuestion[];
  answers: AssessmentAnswer[];
  goal: string;
}
```

**Response:**
```typescript
{
  assessment: KnowledgeAssessment;
}
```

### Planner Agent API

#### POST /internal/planner/analyze-gaps

**Request:**
```typescript
{
  goal: string;
  assessment: KnowledgeAssessment;
  domainKnowledge: any; // Retrieved from semantic memory
}
```

**Response:**
```typescript
{
  gapAnalysis: {
    criticalGaps: string[];
    niceToHave: string[];
    existingKnowledge: string[];
  };
}
```

#### POST /internal/planner/generate-topic-tree

**Request:**
```typescript
{
  goal: string;
  gaps: string[];
  assessment: KnowledgeAssessment;
}
```

**Response:**
```typescript
{
  topics: Topic[];
  dependencyGraph: {
    [topicId: string]: string[]; // topicId -> prerequisite topicIds
  };
  orderedTopics: string[]; // Topologically sorted
}
```

### Curation Agent API

#### POST /internal/curation/search-videos

**Request:**
```typescript
{
  topic: Topic;
  criteria: {
    difficulty: string;
    maxVideos: number;
    preferredDuration?: string;
    recencyPreference?: 'any' | 'recent' | 'latest';
  };
}
```

**Response:**
```typescript
{
  videos: Video[];
  searchMetadata: {
    totalFound: number;
    searchQuery: string;
    filters: any;
  };
}
```

#### POST /internal/curation/evaluate-videos

**Request:**
```typescript
{
  videos: Video[];
  topic: Topic;
  evaluationCriteria: {
    contentQuality: number; // weight
    teachingStyle: number;
    practicalExamples: number;
    recency: number;
  };
}
```

**Response:**
```typescript
{
  evaluatedVideos: Array<Video & {
    qualityScore: number;
    pros: string[];
    cons: string[];
    recommendation: 'highly-recommended' | 'recommended' | 'acceptable' | 'not-recommended';
  }>;
}
```

#### POST /internal/curation/select-best

**Request:**
```typescript
{
  evaluatedVideos: Video[];
  topic: Topic;
  targetCount: number;
  diversityPreference: boolean;
}
```

**Response:**
```typescript
{
  selectedVideos: Video[];
  selectionRationale: string;
}
```

## Data Flow Diagrams

### Complete End-to-End Flow

```
User Input (Goal)
    ↓
[Orchestrator Service]
    ↓
[Start Session] → SmartMemory.startWorkingMemorySession()
    ↓                      ↓
    ↓              Working Memory Created
    ↓                      ↓
[Store Goal] ← workingMemory.putMemory()
    ↓
[Assessment Phase]
    ↓
[Assessment Agent] ← POST /internal/assessment/generate-questions
    ↓                      ↓
    ↓              SmartMemory.getProceduralMemory() → Question Templates
    ↓              SmartMemory.searchSemanticMemory() → Domain Knowledge
    ↓                      ↓
    ↓              AI.generateText() → Contextual Questions
    ↓                      ↓
[Questions to User]        ↓
    ↓              workingMemory.putMemory() → Store Questions
User Answers
    ↓
[Assessment Agent] ← POST /internal/assessment/evaluate-answer
    ↓                      ↓
    ↓              AI.generateText() → Evaluate Response
    ↓                      ↓
    ↓              workingMemory.putMemory() → Store Evaluation
    ↓
[Repeat for all questions]
    ↓
[Assessment Agent] ← POST /internal/assessment/generate-summary
    ↓                      ↓
    ↓              workingMemory.getMemory() → Retrieve All Answers
    ↓              AI.generateText() → Generate Summary
    ↓                      ↓
    ↓              workingMemory.putMemory() → Store Assessment
    ↓
[Planning Phase]
    ↓
[Planner Agent] ← POST /internal/planner/analyze-gaps
    ↓                      ↓
    ↓              workingMemory.getMemory() → Get Assessment
    ↓              SmartMemory.searchSemanticMemory() → Domain Knowledge
    ↓              AI.generateText() → Gap Analysis
    ↓                      ↓
    ↓              workingMemory.putMemory() → Store Gaps
    ↓
[Planner Agent] ← POST /internal/planner/generate-topic-tree
    ↓                      ↓
    ↓              AI.generateText() → Generate Topics & Dependencies
    ↓                      ↓
    ↓              workingMemory.putMemory() → Store Topic Tree
    ↓
[Curation Phase]
    ↓
FOR EACH Topic in Tree:
    ↓
    [Curation Agent] ← POST /internal/curation/search-videos
        ↓                      ↓
        ↓              SmartBucket.search() → Find Videos by Topic
        ↓                      ↓
        ↓              SmartBucket.chunkSearch() → Detailed Content Search
        ↓
    [Curation Agent] ← POST /internal/curation/evaluate-videos
        ↓                      ↓
        ↓              FOR EACH Video:
        ↓                  AI.generateText() → Evaluate Quality
        ↓                      ↓
    [Curation Agent] ← POST /internal/curation/select-best
        ↓                      ↓
        ↓              AI.generateText() → Select Top Videos
        ↓                      ↓
        ↓              workingMemory.putMemory() → Store Selected Videos
        ↓
[Finalization Phase]
    ↓
[Orchestrator]
    ↓              workingMemory.getMemory() → Retrieve All Components
    ↓                      ↓
    ↓              Assemble Complete Learning Path
    ↓                      ↓
    ↓              PathDB.insert() → Store Path
    ↓              SmartMemory.putSemanticMemory() → Store for Reference
    ↓              workingMemory.endSession(flush=true) → Archive to Episodic
    ↓
[Return Learning Path to User]
```

### Memory Layer Interactions

```
┌─────────────────────────────────────────────────┐
│         Working Memory (Session)                 │
│                                                  │
│  • User Goal                                     │
│  • Assessment Q&A                                │
│  • Topic Tree                                    │
│  • Curated Videos                                │
│  • Temporary Calculations                        │
│                                                  │
│  Operations: putMemory(), getMemory()            │
│  Lifetime: Duration of session                   │
└───────────────┬─────────────────────────────────┘
                │
                │ endSession(flush=true)
                ↓
┌─────────────────────────────────────────────────┐
│         Episodic Memory (History)                │
│                                                  │
│  • Session Summaries                             │
│  • Successful Patterns                           │
│  • User Learning Preferences                     │
│  • Historical Assessments                        │
│                                                  │
│  Operations: searchEpisodicMemory()              │
│  Lifetime: Permanent (with retention policy)     │
└──────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│      Semantic Memory (Knowledge Base)            │
│                                                  │
│  • Topic Definitions                             │
│  • Prerequisite Relationships                    │
│  • Domain Knowledge                              │
│  • Generated Learning Paths                      │
│                                                  │
│  Operations: searchSemanticMemory(),             │
│              putSemanticMemory()                 │
│  Lifetime: Permanent (curated)                   │
└──────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│     Procedural Memory (Templates)                │
│                                                  │
│  • Question Templates                            │
│  • Agent System Prompts                          │
│  • Evaluation Criteria                           │
│  • Curation Rules                                │
│                                                  │
│  Operations: getProcedure(),                     │
│              putProcedure()                      │
│  Lifetime: Permanent (versioned)                 │
└──────────────────────────────────────────────────┘
```

## Error Handling

### Error Response Format

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: Date;
}
```

### Common Error Codes

- `SESSION_NOT_FOUND` - Session ID doesn't exist
- `INVALID_PHASE` - Action not allowed in current phase
- `ASSESSMENT_INCOMPLETE` - Cannot proceed without completing assessment
- `VIDEO_NOT_FOUND` - Requested video not in repository
- `GENERATION_FAILED` - Path generation encountered an error
- `INVALID_INPUT` - Request validation failed
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_ERROR` - Unexpected system error

### Example Error Response

```json
{
  "success": false,
  "error": {
    "code": "ASSESSMENT_INCOMPLETE",
    "message": "Please complete the assessment before requesting a learning path",
    "details": {
      "questionsAnswered": 2,
      "questionsRequired": 5
    }
  },
  "timestamp": "2025-10-28T10:30:00Z"
}
```

## Webhooks (Optional)

For async path generation, implement webhooks:

### POST /api/webhooks/register

**Request:**
```json
{
  "sessionId": "session-abc-123",
  "events": ["path_completed", "path_failed"],
  "url": "https://client.com/webhooks/learning-path"
}
```

### Webhook Payload

```json
{
  "event": "path_completed",
  "sessionId": "session-abc-123",
  "pathId": "path-xyz-789",
  "timestamp": "2025-10-28T10:35:00Z",
  "data": {
    "learningPath": { ... }
  }
}
```

## Rate Limiting

- **Session Creation**: 10 per hour per IP
- **Assessment Answers**: 100 per hour per session
- **Path Generation**: 5 per hour per user
- **Video Search**: 100 per hour per user

## Authentication

Use JWT tokens for user authentication:

```
Authorization: Bearer <jwt_token>
```

Token payload:
```json
{
  "userId": "user-123",
  "email": "user@example.com",
  "roles": ["user"],
  "iat": 1730109000,
  "exp": 1730195400
}
```

## Versioning

API version is included in the URL:

- Current: `/api/v1/*`
- Future: `/api/v2/*`

Version headers:
```
X-API-Version: 1.0
```
