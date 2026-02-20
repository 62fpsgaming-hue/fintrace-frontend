#!/bin/bash

# Script to push backend code to separate repository

echo "🚀 Pushing Backend Code to GitHub"
echo "=================================="

# Navigate to backend directory
cd ../backend || exit 1

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git branch -M main
fi

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "Removing existing origin..."
    git remote remove origin
fi

# Add the backend repository
echo "Adding remote repository..."
git remote add origin https://github.com/62fpsgaming-hue/fintrace-backend.git

# Add all files
echo "Adding files..."
git add .

# Commit
echo "Committing changes..."
git commit -m "Initial backend commit with FastAPI fraud detection API" || echo "Nothing to commit or already committed"

# Push
echo "Pushing to GitHub..."
git push -u origin main --force

echo ""
echo "✅ Backend code pushed successfully!"
echo "🔗 Repository: https://github.com/62fpsgaming-hue/fintrace-backend"
