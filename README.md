# Learning Path Agent with Raindrop MCP

An AI-powered learning path generator that creates personalized video courses from YouTube. Built with React frontend and Raindrop serverless backend.

## 🚀 Quick Start

### Automated Setup

```bash
./setup.sh
```

Then run in two terminals:

```bash
# Terminal 1: Backend
raindrop dev

# Terminal 2: Frontend
npm run dev
```

Open `http://localhost:5173` and start learning!

### Manual Setup

See [INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md) for detailed instructions.

## 📚 Documentation

- **[INTEGRATION_COMPLETE.md](./INTEGRATION_COMPLETE.md)** - ⭐ Start here! Complete integration guide
- **[QUICKSTART.md](./QUICKSTART.md)** - Get the MVP running in 5 minutes
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** - Frontend details
- **[MVP_README.md](./MVP_README.md)** - MVP documentation
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[API_CONTRACTS.md](./API_CONTRACTS.md)** - API specifications

## 🎯 What It Does

1. **User enters learning goal** (e.g., "I want to learn Vercel")
2. **AI assesses current knowledge** with 3 contextual questions
3. **System generates personalized path** with ordered modules
4. **Displays curated YouTube videos** for each topic
5. **Tracks progress** as user watches videos

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite
- Tailwind CSS + shadcn/ui
- Lucide React icons

### Backend
- Raindrop Framework (Serverless)
- Raindrop SmartMemory (Session state)
- Raindrop AI (Question generation)
- Mock video dataset

## 🏗️ Project Structure

```
intelligent-study-paths/
├── src/
│   ├── components/          # React components
│   │   ├── SearchInput.tsx      # Goal input
│   │   ├── AssessmentFlow.tsx   # Q&A interface
│   │   └── LearningPathDisplay.tsx  # Path display
│   ├── lib/
│   │   └── api.ts          # API client
│   ├── services/           # Raindrop services
│   │   └── api/
│   │       └── index.ts    # Backend API
│   ├── utils/              # Assessment & path generation
│   ├── data/               # Mock video dataset
│   └── pages/
│       └── Index.tsx       # Main page
├── raindrop.manifest       # Raindrop config
└── setup.sh               # Setup script
```

## 🎨 Features

- ✅ AI-powered knowledge assessment
- ✅ Personalized learning paths
- ✅ Module-based organization
- ✅ Curated YouTube videos
- ✅ Progress tracking
- ✅ Beautiful animated UI
- ✅ Spanish language interface

## 🧪 Testing

```bash
# Test backend API
node src/scripts/test-api.js

# Or use the UI
npm run dev  # Frontend
raindrop dev # Backend
```

## Original Lovable Project

**URL**: https://lovable.dev/projects/f4e04306-3d58-4575-90d7-085e175f38d7

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/f4e04306-3d58-4575-90d7-085e175f38d7) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/f4e04306-3d58-4575-90d7-085e175f38d7) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
