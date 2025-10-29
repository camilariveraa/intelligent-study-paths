# Learning Path Agent - MVP User Flow

## Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    1. USER STARTS SESSION                    │
│  POST /api/sessions { goal: "I want to learn Vercel" }      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                 2. SYSTEM CREATES SESSION                    │
│  • Start SmartMemory working session                         │
│  • Store goal in memory                                      │
│  • AI generates 3 contextual questions                       │
│  • Return sessionId                                          │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              3. ASSESSMENT LOOP (3 questions)                │
│                                                              │
│  ┌──────────────────────────────────────────────┐          │
│  │ GET /api/sessions/:id/assessment/next        │          │
│  │ → Returns next question                      │          │
│  └──────────┬───────────────────────────────────┘          │
│             │                                               │
│             ▼                                               │
│  ┌──────────────────────────────────────────────┐          │
│  │ User answers question                        │          │
│  └──────────┬───────────────────────────────────┘          │
│             │                                               │
│             ▼                                               │
│  ┌──────────────────────────────────────────────┐          │
│  │ POST /api/sessions/:id/assessment/answer     │          │
│  │ • AI evaluates answer                        │          │
│  │ • Determines knowledge level                 │          │
│  │ • Stores in memory                           │          │
│  └──────────┬───────────────────────────────────┘          │
│             │                                               │
│             └─────────► Repeat for all questions            │
│                                                              │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              4. GENERATE LEARNING PATH                       │
│  POST /api/sessions/:id/path/generate                       │
│                                                              │
│  • Analyze all assessment results                           │
│  • Determine overall knowledge level                        │
│  • Identify knowledge gaps                                  │
│  • AI generates topic structure                             │
│  • Order topics by prerequisites                            │
│  • Select videos for each topic                             │
│  • Store complete path in memory                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│               5. DELIVER LEARNING PATH                       │
│  GET /api/sessions/:id/path                                 │
│                                                              │
│  Returns:                                                    │
│  • Goal                                                      │
│  • Knowledge level                                           │
│  • Ordered modules                                           │
│  • Videos for each module                                    │
│  • Explanations for ordering                                 │
└─────────────────────────────────────────────────────────────┘
```

## Detailed Step-by-Step Flow

### Step 1: Create Session

**Request:**
```bash
POST /api/sessions
{
  "goal": "I want to learn Vercel deployment"
}
```

**Response:**
```json
{
  "success": true,
  "sessionId": "session-1698765432000",
  "phase": "assessment",
  "message": "Let's assess your current knowledge..."
}
```

**What Happens Internally:**
1. Raindrop SmartMemory creates new working session
2. Goal stored with key "goal"
3. AI generates 3 contextual questions based on goal
4. Session data initialized with questions
5. Phase set to "assessment"

---

### Step 2: Get First Question

**Request:**
```bash
GET /api/sessions/session-1698765432000/assessment/next
```

**Response:**
```json
{
  "success": true,
  "question": {
    "id": "q1",
    "question": "What is your experience with web development and frontend frameworks?",
    "topicArea": "frontend"
  },
  "progress": {
    "current": 1,
    "total": 3,
    "percentage": 33
  }
}
```

**What Happens Internally:**
1. Retrieve session data from SmartMemory
2. Get question at currentQuestionIndex
3. Return question with progress info

---

### Step 3: Submit First Answer

**Request:**
```bash
POST /api/sessions/session-1698765432000/assessment/answer
{
  "questionId": "q1",
  "answer": "I have 2 years of experience with React and have built several production applications. I'm comfortable with hooks, state management, and routing."
}
```

**Response:**
```json
{
  "success": true,
  "completed": false,
  "message": "Answer recorded. Ready for next question.",
  "progress": {
    "current": 1,
    "total": 3,
    "percentage": 33
  }
}
```

**What Happens Internally:**
1. AI evaluates answer against question
2. Determines knowledge level: "advanced" for React
3. Stores answer and evaluation in session
4. Increments currentQuestionIndex
5. Updates session data in SmartMemory

---

### Step 4-5: Continue Assessment

Repeat steps 2-3 for questions 2 and 3.

After the 3rd answer is submitted:

**Response:**
```json
{
  "success": true,
  "completed": true,
  "message": "Assessment completed!",
  "progress": {
    "current": 3,
    "total": 3,
    "percentage": 100
  }
}
```

---

### Step 6: Generate Learning Path

**Request:**
```bash
POST /api/sessions/session-1698765432000/path/generate
```

**What Happens Internally:**
1. **Retrieve Assessment Results**
   ```
   Frontend: advanced (0.9 confidence)
   Deployment: basic (0.4 confidence)
   Git: intermediate (0.7 confidence)
   ```

2. **Determine Overall Level**
   ```
   Average score: (3 + 1 + 2) / 3 = 2.0 → intermediate
   ```

3. **Identify Gaps**
   ```
   Goal requires: deployment, git, vercel
   User has: strong frontend, weak deployment
   Gaps: deployment-basics, vercel-basics
   ```

4. **AI Generates Topic Structure**
   ```
   AI prompt: Create learning path for "learn Vercel"
             with intermediate level, needs deployment basics

   AI returns: [
     { topic: "deployment-basics", order: 1, ... },
     { topic: "vercel-basics", order: 2, ... },
     { topic: "vercel-advanced", order: 3, ... }
   ]
   ```

5. **Select Videos**
   ```
   For "deployment-basics":
     → Search mock data for matching videos
     → Select top 2-3 videos

   For "vercel-basics":
     → Search mock data for matching videos
     → Select top 2-3 videos
   ```

6. **Store Complete Path**
   ```
   SmartMemory.putMemory({
     key: "learning_path",
     content: JSON.stringify(completePath)
   })
   ```

**Response:**
```json
{
  "success": true,
  "message": "Learning path generated successfully!",
  "pathId": "path-1698765432001"
}
```

---

### Step 7: Retrieve Learning Path

**Request:**
```bash
GET /api/sessions/session-1698765432000/path
```

**Response:**
```json
{
  "success": true,
  "learningPath": {
    "id": "path-1698765432001",
    "sessionId": "session-1698765432000",
    "goal": "I want to learn Vercel deployment",
    "knowledgeLevel": "intermediate",
    "modules": [
      {
        "id": "module-1",
        "order": 1,
        "topic": "deployment-basics",
        "explanation": "Understanding core deployment concepts before platform-specific features",
        "videos": [
          {
            "id": "v1",
            "videoId": "abc123",
            "title": "Web Deployment Fundamentals",
            "url": "https://youtube.com/watch?v=abc123",
            "channel": "Tech Education",
            "duration": "15:30",
            "topics": ["deployment", "hosting", "web basics"]
          },
          {
            "id": "v2",
            "videoId": "def456",
            "title": "Understanding Build vs Runtime",
            "url": "https://youtube.com/watch?v=def456",
            "channel": "Developer Academy",
            "duration": "12:45",
            "topics": ["build process", "deployment", "ci/cd"]
          }
        ]
      },
      {
        "id": "module-2",
        "order": 2,
        "topic": "vercel-basics",
        "explanation": "Core Vercel platform features and deployment workflow",
        "videos": [
          {
            "id": "v3",
            "videoId": "ghi789",
            "title": "Vercel Platform Overview",
            "url": "https://youtube.com/watch?v=ghi789",
            "channel": "Vercel",
            "duration": "20:15",
            "topics": ["vercel", "deployment", "platform"]
          }
        ]
      }
    ],
    "totalVideos": 3,
    "createdAt": "2025-10-28T12:00:00Z"
  }
}
```

---

## SmartMemory State Throughout Flow

### After Session Creation
```
Working Memory:
  session-1698765432000/
    ├─ goal: "I want to learn Vercel deployment"
    └─ session_data: {
         sessionId: "...",
         phase: "assessment",
         questions: [q1, q2, q3],
         answers: [],
         knowledgeLevels: [],
         currentQuestionIndex: 0
       }
```

### After First Answer
```
Working Memory:
  session-1698765432000/
    ├─ goal: "I want to learn Vercel deployment"
    └─ session_data: {
         ...
         answers: [a1],
         knowledgeLevels: [{ topic: "frontend", level: "advanced" }],
         currentQuestionIndex: 1
       }
```

### After Assessment Complete
```
Working Memory:
  session-1698765432000/
    ├─ goal: "I want to learn Vercel deployment"
    └─ session_data: {
         ...
         answers: [a1, a2, a3],
         knowledgeLevels: [
           { topic: "frontend", level: "advanced" },
           { topic: "deployment", level: "basic" },
           { topic: "git", level: "intermediate" }
         ],
         currentQuestionIndex: 3
       }
```

### After Path Generation
```
Working Memory:
  session-1698765432000/
    ├─ goal: "I want to learn Vercel deployment"
    ├─ session_data: { ... phase: "completed" }
    └─ learning_path: {
         id: "path-...",
         modules: [...],
         totalVideos: 7
       }
```

---

## Error Handling

### AI Failure
If AI model fails to generate questions:
```
→ Falls back to default questions
→ Continues flow normally
```

If AI fails to evaluate answer:
```
→ Uses simple heuristic (word count)
→ Continues flow normally
```

### Session Not Found
```json
{
  "error": "Session not found"
}
```

### Missing Parameters
```json
{
  "error": "Goal is required"
}
```

---

## Performance Characteristics

- **Session Creation**: ~2-3 seconds (AI question generation)
- **Answer Evaluation**: ~1-2 seconds (AI evaluation)
- **Path Generation**: ~3-5 seconds (AI path structure + video search)
- **Total Flow**: ~15-20 seconds

---

## Testing the Flow

Run the complete flow:
```bash
node src/scripts/test-api.js
```

Or manually:
```bash
# 1. Create session
curl -X POST http://localhost:8080/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"goal": "I want to learn Vercel"}'

# 2. Get question
curl http://localhost:8080/api/sessions/SESSION_ID/assessment/next

# 3. Submit answer
curl -X POST http://localhost:8080/api/sessions/SESSION_ID/assessment/answer \
  -H "Content-Type: application/json" \
  -d '{"questionId": "q1", "answer": "Your answer here"}'

# Repeat 2-3 for all questions

# 4. Generate path
curl -X POST http://localhost:8080/api/sessions/SESSION_ID/path/generate

# 5. Get path
curl http://localhost:8080/api/sessions/SESSION_ID/path
```

---

## Next: Frontend Integration

The API is ready for a React frontend:

```typescript
import { useState } from 'react';

function AssessmentFlow() {
  const [sessionId, setSessionId] = useState('');
  const [question, setQuestion] = useState(null);

  const startSession = async (goal: string) => {
    const res = await fetch('http://localhost:8080/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goal })
    });
    const data = await res.json();
    setSessionId(data.sessionId);
    loadNextQuestion(data.sessionId);
  };

  const loadNextQuestion = async (sid: string) => {
    const res = await fetch(
      `http://localhost:8080/api/sessions/${sid}/assessment/next`
    );
    const data = await res.json();
    setQuestion(data.question);
  };

  const submitAnswer = async (questionId: string, answer: string) => {
    await fetch(
      `http://localhost:8080/api/sessions/${sessionId}/assessment/answer`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, answer })
      }
    );
    loadNextQuestion(sessionId);
  };

  // ... render UI
}
```

See your existing React setup for integration!
