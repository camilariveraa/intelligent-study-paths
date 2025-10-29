#!/bin/bash

# Setup script for Learning Path Agent
# This script sets up both backend and frontend

set -e

echo "🚀 Learning Path Agent - Setup Script"
echo "======================================"
echo ""

# Check if raindrop CLI is installed
echo "📦 Checking Raindrop CLI..."
if ! command -v raindrop &> /dev/null; then
    echo "❌ Raindrop CLI not found!"
    echo "Install it with: npm install -g @raindrop/cli"
    echo "Then run: raindrop auth login"
    exit 1
fi
echo "✅ Raindrop CLI found"
echo ""

# Check if authenticated
echo "🔐 Checking Raindrop authentication..."
if ! raindrop auth whoami &> /dev/null; then
    echo "❌ Not authenticated with Raindrop!"
    echo "Run: raindrop auth login"
    exit 1
fi
echo "✅ Authenticated"
echo ""

# Create .env.local if it doesn't exist
echo "⚙️  Setting up environment..."
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo "✅ Created .env.local"
else
    echo "✅ .env.local already exists"
fi
echo ""

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
npm install
echo "✅ Frontend dependencies installed"
echo ""

# Build backend
echo "🏗️  Building Raindrop backend..."
raindrop build
echo "✅ Backend built successfully"
echo ""

echo "✨ Setup complete!"
echo ""
echo "To run the application:"
echo ""
echo "  Terminal 1 (Backend):"
echo "  $ raindrop dev"
echo ""
echo "  Terminal 2 (Frontend):"
echo "  $ npm run dev"
echo ""
echo "Then open http://localhost:5173 in your browser!"
echo ""
