# Learning Path Agent - MVP (Minimum Viable Prototype)

A minimal working prototype of the Learning Path Agent that uses Raindrop MCP to create personalized learning paths from curated YouTube videos.

## What's Included in the MVP

This MVP demonstrates the core functionality:

✅ **Session Management** - Create and track learning sessions
✅ **Assessment System** - AI-powered knowledge assessment with 3 questions
✅ **Knowledge Evaluation** - Automatic evaluation of user responses
✅ **Gap Analysis** - Identifies prerequisite knowledge gaps
✅ **Path Generation** - Creates structured learning paths with ordered modules
✅ **Video Curation** - Selects relevant YouTube videos (mock data for MVP)
✅ **SmartMemory Integration** - Session state persisted in Raindrop SmartMemory

## Architecture

```
┌─────────────┐
│   User/API  │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│     API Service (Port 8080)     │
│  - Session Management           │
│  - Assessment Flow              │
│  - Path Generation              │
└────┬────────────────────┬───────┘
     │                    │
     ▼                    ▼
┌──────────┐      ┌──────────────┐
│ AI Model │      │ SmartMemory  │
│ Reasoner │      │  - Sessions  │
└──────────┘      │  - Answers   │
                  │  - Paths     │
                  └──────────────┘
```

## Project Structure

```
intelligent-study-paths/
├── raindrop.manifest           # Raindrop configuration
├── src/
│   ├── types.ts               # Core TypeScript types
│   ├── data/
│   │   └── mock-videos.ts     # Mock video dataset
│   ├── utils/
│   │   ├── assessment.ts      # Assessment logic
│   │   └── path-generator.ts  # Path generation
│   ├── services/
│   │   └── api/
│   │       └── index.ts       # Main API service
│   └── scripts/
│       └── test-api.js        # API testing script
└── MVP_README.md              # This file
```

## Prerequisites

Before running the MVP, ensure you have:

1. **Raindrop CLI** installed and authenticated
   ```bash
   npm install -g @raindrop/cli
   raindrop auth login
   ```

2. **Node.js** version 18 or higher
   ```bash
   node --version
   ```

## Setup Instructions

### Step 1: Install Dependencies

The project uses Raindrop's built-in runtime, so minimal dependencies are needed:

```bash
npm install
```

### Step 2: Review the Manifest

The `raindrop.manifest` file defines the application structure:

```hcl
application "learning-path-agent-mvp" {
  service "api" {
    port = 8080
    entrypoint = "src/services/api/index.ts"
  }
  ai "reasoner" {}
  smartmemory "memory" {}
  smartbucket "videos" {}
}
```

This creates:
- An API service on port 8080
- An AI reasoning engine
- SmartMemory for session persistence
- SmartBucket for video storage (not used in MVP, but available)

### Step 3: Build the Application

```bash
raindrop build
```

This compiles the TypeScript code and prepares the application for deployment.

### Step 4: Deploy (Development Mode)

For local development:

```bash
raindrop dev
```

This starts the application locally with hot-reloading enabled.

For cloud deployment:

```bash
raindrop deploy
```

This deploys your application to Raindrop's cloud infrastructure.

## Testing the MVP

### Option 1: Use the Test Script

Run the automated test script that walks through the entire flow:

```bash
node src/scripts/test-api.js
```

This will:
1. Create a new session
2. Go through the assessment (3 questions)
3. Generate a learning path
4. Display the complete learning path with videos

### Option 2: Manual API Testing with curl

#### 1. Create a Session

```bash
curl -X POST http://localhost:8080/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"goal": "I want to learn Vercel deployment"}'
```

Response:
```json
{
  "success": true,
  "sessionId": "session-abc-123",
  "phase": "assessment",
  "message": "Let's assess your current knowledge..."
}
```

#### 2. Get First Question

```bash
curl http://localhost:8080/api/sessions/SESSION_ID/assessment/next
```

#### 3. Submit Answer

```bash
curl -X POST http://localhost:8080/api/sessions/SESSION_ID/assessment/answer \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "q1",
    "answer": "I have 2 years of experience with React..."
  }'
```

#### 4. Repeat for All Questions

Continue getting questions and submitting answers until assessment is complete.

#### 5. Generate Learning Path

```bash
curl -X POST http://localhost:8080/api/sessions/SESSION_ID/path/generate
```

#### 6. Get Learning Path

```bash
curl http://localhost:8080/api/sessions/SESSION_ID/path
```

### Option 3: Use the Frontend

If you have the React frontend set up, you can interact with the API through the UI:

```bash
npm run dev  # In the root directory
```

Then navigate to `http://localhost:5173` (or whatever port Vite uses).

## API Endpoints

### Session Management

- **POST** `/api/sessions`
  - Create new learning session
  - Body: `{ "goal": "string" }`

- **GET** `/api/sessions/:sessionId`
  - Get session state

### Assessment

- **GET** `/api/sessions/:sessionId/assessment/next`
  - Get next assessment question

- **POST** `/api/sessions/:sessionId/assessment/answer`
  - Submit answer to question
  - Body: `{ "questionId": "string", "answer": "string" }`

### Learning Path

- **POST** `/api/sessions/:sessionId/path/generate`
  - Generate learning path after assessment

- **GET** `/api/sessions/:sessionId/path`
  - Retrieve generated learning path

### Health Check

- **GET** `/health`
  - Check API status

## How It Works

### 1. Assessment Phase

When a user starts a session with a learning goal, the system:
1. Uses the AI reasoner to generate 3 contextual assessment questions
2. Evaluates each answer to determine knowledge level (none/basic/intermediate/advanced)
3. Builds a knowledge profile

### 2. Gap Analysis

After assessment, the system:
1. Identifies what the user already knows
2. Determines prerequisite knowledge gaps
3. Maps out required learning topics

### 3. Path Generation

The system then:
1. Creates an ordered list of topics (prerequisites first)
2. Generates explanations for why each topic is needed
3. Selects 2-3 relevant videos per topic from the mock dataset
4. Assembles a complete learning path

## Mock Data

The MVP uses a curated set of mock videos in `src/data/mock-videos.ts`:

- Deployment basics (2 videos)
- Vercel basics (2 videos)
- Vercel advanced (2 videos)
- Git basics (2 videos)
- React basics (2 videos)

In production, these would be replaced with:
- Real YouTube video metadata
- Semantic search in SmartBucket
- Dynamic video quality evaluation

## Customization

### Adding More Mock Videos

Edit `src/data/mock-videos.ts`:

```typescript
export const MOCK_VIDEOS: Record<string, Video[]> = {
  'your-topic': [
    {
      id: 'v123',
      videoId: 'youtube-id',
      title: 'Video Title',
      url: 'https://youtube.com/watch?v=...',
      channel: 'Channel Name',
      duration: '15:30',
      thumbnailUrl: 'https://...',
      topics: ['topic1', 'topic2'],
    },
  ],
};
```

### Adjusting Assessment Questions

The AI generates questions dynamically, but you can modify the prompt in:
`src/utils/assessment.ts` → `generateAssessmentQuestions()`

### Customizing Path Generation

Modify the path generation logic in:
`src/utils/path-generator.ts` → `generateModules()`

## Troubleshooting

### Error: "Session not found"

This usually means the session expired or wasn't created properly. Create a new session.

### Error: "Failed to generate questions"

The AI model might be unavailable. The system will fall back to default questions.

### Error: "Port 8080 already in use"

Stop any other services running on port 8080, or change the port in `raindrop.manifest`.

### TypeScript Errors

Make sure you've run:
```bash
raindrop build
```

## Limitations of MVP

This MVP is intentionally simplified:

❌ No user authentication
❌ No persistent database (only working memory)
❌ No real YouTube API integration
❌ No video quality evaluation
❌ No progress tracking
❌ Limited error handling
❌ No rate limiting

## Next Steps

To evolve this MVP into a production system:

1. **Add Real Video Integration**
   - Integrate YouTube Data API
   - Populate SmartBucket with real videos
   - Implement semantic search

2. **Add Persistent Storage**
   - Use SmartSQL for learning paths
   - Store user progress
   - Add episodic memory

3. **Enhance Assessment**
   - Add more questions
   - Implement adaptive questioning
   - Better evaluation criteria

4. **Build Frontend**
   - Create React UI for the assessment flow
   - Visualize learning paths
   - Add progress tracking

5. **Production Features**
   - User authentication
   - Rate limiting
   - Analytics
   - Feedback system

## Learning Resources

- [Raindrop Documentation](https://docs.raindrop.io)
- [SmartMemory Guide](/reference/smartmemory)
- [SmartBucket RAG Guide](/reference/smartbucket)
- [Architecture Patterns](/reference/architecture-patterns)

## Support

For issues with:
- **Raindrop Platform**: Check [Raindrop Docs](https://docs.raindrop.io)
- **This MVP**: Review the architecture documents in this repo
- **General Questions**: See ARCHITECTURE.md and API_CONTRACTS.md

## Example Output

When you run the test script, you should see output like:

```
🧪 Testing Learning Path Agent MVP API

1️⃣  Testing health check...
   ✅ Health check passed: ok

2️⃣  Creating new learning session...
   ✅ Session created: session-1234567890
   Phase: assessment

3️⃣  Getting first assessment question...
   ✅ Question received:
    What is your experience with web development and frontend frameworks?

...

📚 LEARNING PATH SUMMARY:
   Goal: I want to learn Vercel deployment
   Knowledge Level: intermediate
   Total Modules: 3
   Total Videos: 7

📖 MODULES:
   1. deployment-basics
      Understanding core deployment concepts before platform-specific features
      Videos: 2
         1) Web Deployment Fundamentals (15:30)
            https://youtube.com/watch?v=abc123
         2) Understanding Build vs Runtime (12:45)
            https://youtube.com/watch?v=def456

   2. vercel-basics
      Core Vercel platform features
      Videos: 2
         ...

✅ All tests passed!
```

## Summary

This MVP demonstrates the core concept of the Learning Path Agent:
- AI-powered assessment
- Intelligent path generation
- Structured video curation
- Session state management

It's ready to be tested, demonstrated, and evolved into a full production system!
