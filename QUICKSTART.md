# Quick Start Guide - Learning Path Agent MVP

Get the MVP running in 5 minutes!

## Prerequisites

```bash
# 1. Install Raindrop CLI
npm install -g @raindrop/cli

# 2. Authenticate with Raindrop
raindrop auth login

# 3. Verify installation
raindrop --version
```

## Run the MVP

### Step 1: Build

```bash
raindrop build
```

Expected output:
```
✓ Building application...
✓ Compiling TypeScript...
✓ Build complete!
```

### Step 2: Deploy Locally

```bash
raindrop dev
```

Expected output:
```
✓ Starting development server...
✓ API service running on http://localhost:8080
✓ Ready to accept requests
```

### Step 3: Test

Open a new terminal and run:

```bash
node src/scripts/test-api.js
```

You should see:
```
🧪 Testing Learning Path Agent MVP API

1️⃣  Testing health check...
   ✅ Health check passed: ok

2️⃣  Creating new learning session...
   ✅ Session created: session-1234567890
   ...

📚 LEARNING PATH SUMMARY:
   Goal: I want to learn Vercel deployment
   Knowledge Level: intermediate
   Total Modules: 3
   Total Videos: 7

✅ All tests passed!
```

## That's It!

You now have a working Learning Path Agent that:
- ✅ Accepts learning goals
- ✅ Assesses user knowledge
- ✅ Generates personalized learning paths
- ✅ Curates relevant videos

## Next Steps

### Try Different Goals

Modify the test script to try different learning goals:

```javascript
// In src/scripts/test-api.js, line 21:
goal: 'I want to learn React hooks'
// or
goal: 'I want to master Git workflows'
```

### Test with curl

```bash
# Create session
curl -X POST http://localhost:8080/api/sessions \
  -H "Content-Type: application/json" \
  -d '{"goal": "I want to learn Next.js"}'

# Use the returned sessionId for subsequent requests
```

### Connect a Frontend

The API is CORS-enabled and ready for frontend integration. Use the existing React/Vite setup in the root directory.

Example API call from React:

```typescript
const response = await fetch('http://localhost:8080/api/sessions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ goal: 'I want to learn Vercel' })
});
const data = await response.json();
console.log('Session ID:', data.sessionId);
```

## Troubleshooting

### "Command not found: raindrop"

Install Raindrop CLI:
```bash
npm install -g @raindrop/cli
```

### "Not authenticated"

Run:
```bash
raindrop auth login
```

### "Port 8080 already in use"

Kill the process using port 8080:
```bash
# macOS/Linux
lsof -ti:8080 | xargs kill -9

# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F
```

### "Module not found"

Make sure you ran:
```bash
raindrop build
```

## File Overview

If you want to understand or modify the code:

- `raindrop.manifest` - Defines the application structure
- `src/services/api/index.ts` - Main API service with all endpoints
- `src/utils/assessment.ts` - Assessment question generation and evaluation
- `src/utils/path-generator.ts` - Learning path generation logic
- `src/data/mock-videos.ts` - Mock video dataset
- `src/types.ts` - TypeScript type definitions

## Quick Architecture Overview

```
User Request
    ↓
API Service (Port 8080)
    ↓
┌───────────────┬──────────────┐
│               │              │
AI Reasoner   SmartMemory   Mock Videos
(Questions &   (Sessions &    (Video Data)
 Evaluation)    Paths)
```

## API Flow

1. **POST /api/sessions** → Create session
2. **GET /api/sessions/:id/assessment/next** → Get question
3. **POST /api/sessions/:id/assessment/answer** → Submit answer
4. Repeat steps 2-3 for all questions
5. **POST /api/sessions/:id/path/generate** → Generate path
6. **GET /api/sessions/:id/path** → Get learning path

## What's Next?

See:
- `MVP_README.md` - Detailed MVP documentation
- `ARCHITECTURE.md` - Full system architecture
- `API_CONTRACTS.md` - Complete API specifications
- `IMPLEMENTATION_ROADMAP.md` - Path to production

Happy learning! 🚀
