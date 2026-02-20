#!/bin/bash

# FinTrace Frontend - Vercel Deployment Script
# This script helps you deploy to Vercel quickly

set -e

echo "🚀 FinTrace Frontend - Vercel Deployment"
echo "=========================================="
echo ""

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
    echo "✅ Vercel CLI installed"
fi

# Check if logged in
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

echo ""
echo "📦 Building project..."
npm run build

echo ""
echo "🌍 Deploying to Vercel..."
echo ""
echo "Choose deployment type:"
echo "1) Preview deployment (test)"
echo "2) Production deployment"
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo "Deploying preview..."
        vercel
        ;;
    2)
        echo "Deploying to production..."
        vercel --prod
        ;;
    *)
        echo "Invalid choice. Deploying preview by default..."
        vercel
        ;;
esac

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📝 Next steps:"
echo "1. Set environment variables in Vercel Dashboard"
echo "2. Configure custom domain (optional)"
echo "3. Test your deployment"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
