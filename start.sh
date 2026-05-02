#!/bin/bash

# Quick start script for the purchase form

echo "🚀 Starting AI Business Purchase Form..."
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found!"
    echo "Creating .env from .env.example..."
    cp .env.example .env
    echo ""
    echo "⚡ Please edit .env file with your Stripe keys and email settings:"
    echo "   nano .env"
    echo ""
    echo "Then run this script again."
    exit 1
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Start the server
echo "✅ Starting server on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

npm start
