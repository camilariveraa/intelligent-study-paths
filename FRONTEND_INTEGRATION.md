# Frontend Integration Guide

## Overview

The frontend is now fully integrated with the Raindrop backend! This guide explains how everything works and how to run the complete application.

## What Was Integrated

### ✅ New Components Created

1. **API Client** (`src/lib/api.ts`)
   - Complete TypeScript API client
   - All endpoints wrapped with proper types
   - Error handling and retry logic

2. **Assessment Flow** (`src/components/AssessmentFlow.tsx`)
   - Interactive question/answer interface
   - Progress tracking
   - Real-time communication with backend

3. **Learning Path Display** (`src/components/LearningPathDisplay.tsx`)
   - Beautiful display of generated learning paths
   - Module organization with video cards
   - Progress tracking (mark videos as watched)
   - Direct links to YouTube videos

4. **Enhanced SearchInput** (`src/components/SearchInput.tsx`)
   - Integrated with backend API
   - Session creation
   - Error handling
   - Loading states

5. **Custom Hook** (`src/hooks/useLearningPath.ts`)
   - State management for the learning path flow
   - (Optional - created but not used in main flow)

### ✅ Updated Components

- **Index.tsx** (`src/pages/Index.tsx`)
  - Added phase management (landing → assessment → generating → completed)
  - Orchestrates entire user flow
  - Smooth transitions between phases

## Architecture

```
User Flow:
┌─────────────┐
│   Landing   │ ← User enters learning goal
│    Page     │
└──────┬──────┘
       │ POST /api/sessions
       ▼
┌─────────────┐
│ Assessment  │ ← User answers 3 questions
│    Flow     │   GET /assessment/next
└──────┬──────┘   POST /assessment/answer
       │
       ▼
┌─────────────┐
│ Generating  │ ← AI generates learning path
│   Screen    │   POST /path/generate
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Learning   │ ← Display structured path
│    Path     │   with videos and modules
└─────────────┘
```

## Running the Complete Application

### Step 1: Start the Backend

In one terminal:

```bash
# Build and run Raindrop backend
raindrop build
raindrop dev
```

This starts the API server on `http://localhost:8080`

### Step 2: Configure Frontend

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Content should be:
```
VITE_API_BASE=http://localhost:8080
```

### Step 3: Start the Frontend

In another terminal:

```bash
# Install dependencies (if not already done)
npm install

# Start the Vite dev server
npm run dev
```

This starts the frontend on `http://localhost:5173` (or similar)

### Step 4: Use the Application

1. Open `http://localhost:5173` in your browser
2. Enter a learning goal (e.g., "I want to learn Vercel deployment")
3. Click "Crear Ruta"
4. Answer the 3 assessment questions
5. Wait for the learning path to generate
6. View your personalized learning path with curated videos!

## Component Details

### SearchInput Component

**Location:** `src/components/SearchInput.tsx`

**Props:**
- `onSessionCreated?: (sessionId: string, goal: string) => void`
- `disabled?: boolean`

**What it does:**
1. Captures user's learning goal
2. Sends POST request to `/api/sessions`
3. Shows animated loading messages
4. Calls `onSessionCreated` callback with session ID
5. Handles errors gracefully

**Usage:**
```tsx
<SearchInput
  onSessionCreated={(sessionId, goal) => {
    // Handle session creation
  }}
/>
```

### AssessmentFlow Component

**Location:** `src/components/AssessmentFlow.tsx`

**Props:**
- `sessionId: string` - Active session ID
- `goal: string` - User's learning goal
- `onComplete: () => void` - Called when assessment is done

**What it does:**
1. Fetches next question from API
2. Displays question with topic area badge
3. Accepts user's answer in textarea
4. Shows progress bar (X of 3 questions)
5. Submits answer and loads next question
6. Calls `onComplete` when all questions answered

**Flow:**
```
GET /assessment/next → Display Question → User Answers
→ POST /assessment/answer → Repeat → onComplete()
```

### LearningPathDisplay Component

**Location:** `src/components/LearningPathDisplay.tsx`

**Props:**
- `learningPath: LearningPath` - Generated learning path
- `onReset: () => void` - Restart the flow

**Features:**
- Displays goal and knowledge level
- Shows all modules in order
- Each module has explanation and videos
- Video cards with:
  - Thumbnail
  - Title and channel
  - Duration
  - Topics/tags
  - "Mark as watched" button
  - "Watch on YouTube" link
- Progress tracking across all videos
- Completion celebration when 100% done

### API Client

**Location:** `src/lib/api.ts`

**Methods:**
```typescript
// Create new session
api.createSession(goal: string)

// Get session state
api.getSession(sessionId: string)

// Get next assessment question
api.getNextQuestion(sessionId: string)

// Submit answer
api.submitAnswer(sessionId: string, questionId: string, answer: string)

// Generate learning path
api.generatePath(sessionId: string)

// Get learning path
api.getLearningPath(sessionId: string)

// Health check
api.healthCheck()
```

**All methods return Promises and handle errors automatically.**

## State Management

The Index page manages the global application state:

```typescript
type AppPhase = "landing" | "assessment" | "generating" | "completed";

const [phase, setPhase] = useState<AppPhase>("landing");
const [sessionId, setSessionId] = useState<string | null>(null);
const [goal, setGoal] = useState<string>("");
const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
```

**Phase Transitions:**
1. **landing** → User enters goal → `assessment`
2. **assessment** → Questions complete → `generating`
3. **generating** → Path generated → `completed`
4. **completed** → User clicks reset → `landing`

## Styling

The application uses:
- **Tailwind CSS** for utility classes
- **shadcn/ui** for component library
- **Custom gradients** defined in CSS
- **Animated blur orbs** for background effects

Key classes:
- `.bg-gradient-primary` - Primary gradient
- `.text-gradient` - Gradient text
- `.animate-fade-in` - Fade in animation
- `.bg-blur-orb` - Animated background orbs

## Error Handling

Errors are handled at multiple levels:

1. **API Level** (`src/lib/api.ts`)
   - Try-catch around fetch calls
   - Automatic error throwing

2. **Component Level**
   - SearchInput shows error messages
   - AssessmentFlow shows error messages
   - Loading states prevent duplicate requests

3. **User Feedback**
   - Red error boxes with descriptive messages
   - Spanish language error messages for UX

## Testing the Integration

### Manual Testing Checklist

- [ ] Backend is running (`raindrop dev`)
- [ ] Frontend is running (`npm run dev`)
- [ ] Can enter a learning goal
- [ ] Session is created successfully
- [ ] Assessment questions load
- [ ] Can submit answers to all 3 questions
- [ ] Generating screen appears
- [ ] Learning path is displayed
- [ ] Can see modules and videos
- [ ] Can click video links (opens YouTube)
- [ ] Can mark videos as watched
- [ ] Can reset and start over

### Quick Test

```bash
# Terminal 1
raindrop dev

# Terminal 2
npm run dev

# Browser
# Open http://localhost:5173
# Enter: "I want to learn React"
# Complete the flow
```

## Customization

### Change API Base URL

Edit `.env.local`:
```
VITE_API_BASE=https://your-production-url.com
```

### Customize Colors

The app uses CSS variables. Edit `src/index.css` or Tailwind config.

### Add More Suggestions

Edit `SearchInput.tsx` line 108:
```typescript
["Your", "Custom", "Suggestions", "Here"]
```

### Modify Loading Messages

Edit `SearchInput.tsx` lines 6-12:
```typescript
const loadingMessages = [
  "Your custom message 1...",
  "Your custom message 2...",
];
```

## Production Deployment

### Build Frontend

```bash
npm run build
```

Creates optimized build in `dist/` directory.

### Deploy Backend

```bash
raindrop deploy --production
```

Gets production URL like: `https://your-app.raindrop.io`

### Update Frontend Config

Update `.env.local`:
```
VITE_API_BASE=https://your-app.raindrop.io
```

Rebuild:
```bash
npm run build
```

### Deploy Frontend

Deploy `dist/` folder to:
- Vercel
- Netlify
- Cloudflare Pages
- Any static hosting

## Troubleshooting

### "Failed to fetch" Error

**Problem:** Cannot connect to backend

**Solutions:**
1. Check backend is running: `raindrop dev`
2. Verify URL in `.env.local` matches backend port
3. Check CORS is enabled (already done in API service)

### "Session not found" Error

**Problem:** Session expired or invalid

**Solution:**
- Sessions are temporary in working memory
- Click "Crear Nueva Ruta" to start fresh

### Questions Not Loading

**Problem:** Assessment flow stuck

**Solutions:**
1. Check backend logs for errors
2. Verify AI model is available
3. Check browser console for errors

### Path Not Generating

**Problem:** Stuck on generating screen

**Solutions:**
1. Check backend logs
2. AI generation might have failed
3. Refresh page and try again

## File Structure

```
src/
├── lib/
│   └── api.ts                    # API client
├── hooks/
│   └── useLearningPath.ts        # Learning path hook (optional)
├── components/
│   ├── SearchInput.tsx           # ✨ Updated - Backend integrated
│   ├── AssessmentFlow.tsx        # ✨ New - Question/answer flow
│   └── LearningPathDisplay.tsx   # ✨ New - Path display
└── pages/
    └── Index.tsx                 # ✨ Updated - Full flow orchestration
```

## Next Steps

### Enhancements You Can Add

1. **User Authentication**
   - Save learning paths per user
   - Track progress across sessions

2. **Progress Persistence**
   - Save completed videos to backend
   - Resume progress later

3. **Path Sharing**
   - Generate shareable links
   - Social media integration

4. **Analytics**
   - Track completion rates
   - Popular learning goals

5. **Feedback System**
   - Rate videos
   - Report issues
   - Suggest better videos

## Summary

✅ **Complete integration done!**
- Frontend communicates with Raindrop backend
- Full user flow implemented
- Beautiful UI with animations
- Error handling in place
- Production ready

Just run:
```bash
# Terminal 1
raindrop dev

# Terminal 2
npm run dev
```

And visit `http://localhost:5173` to see it in action! 🚀
