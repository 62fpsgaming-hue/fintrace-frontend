#!/bin/bash

# User Management Setup Script
# This script helps set up the enhanced user management system

set -e

echo "🚀 Fintrace User Management Setup"
echo "================================"
echo ""

# Check if we're in the dashboard directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the dashboard directory"
    exit 1
fi

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  Warning: .env.local not found"
    echo "📝 Creating .env.local from example..."
    if [ -f ".env.local.example" ]; then
        cp .env.local.example .env.local
        echo "✅ Created .env.local - please update with your Supabase credentials"
    else
        echo "❌ Error: .env.local.example not found"
        exit 1
    fi
fi

# Check for Supabase credentials
echo ""
echo "🔍 Checking Supabase configuration..."
if grep -q "your-supabase-url" .env.local 2>/dev/null; then
    echo "⚠️  Warning: Supabase URL not configured in .env.local"
    echo "   Please update NEXT_PUBLIC_SUPABASE_URL with your project URL"
fi

if grep -q "your-anon-key" .env.local 2>/dev/null; then
    echo "⚠️  Warning: Supabase anon key not configured in .env.local"
    echo "   Please update NEXT_PUBLIC_SUPABASE_ANON_KEY with your anon key"
fi

# Check if Supabase CLI is installed
echo ""
echo "🔍 Checking for Supabase CLI..."
if command -v supabase &> /dev/null; then
    echo "✅ Supabase CLI is installed"
    
    # Ask if user wants to apply migrations
    echo ""
    read -p "📦 Do you want to apply database migrations now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🔗 Linking to Supabase project..."
        read -p "Enter your Supabase project ref: " PROJECT_REF
        
        if [ -n "$PROJECT_REF" ]; then
            supabase link --project-ref "$PROJECT_REF"
            echo ""
            echo "📤 Pushing migrations to Supabase..."
            supabase db push
            echo "✅ Migrations applied successfully!"
        else
            echo "⚠️  Skipping migration - no project ref provided"
        fi
    fi
else
    echo "⚠️  Supabase CLI not found"
    echo ""
    echo "To install Supabase CLI:"
    echo "  npm install -g supabase"
    echo ""
    echo "Or apply migrations manually:"
    echo "  1. Go to your Supabase dashboard"
    echo "  2. Open SQL Editor"
    echo "  3. Copy and run: supabase/migrations/001_enhanced_user_system.sql"
fi

# Check dependencies
echo ""
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found"
    read -p "Install dependencies now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command -v pnpm &> /dev/null; then
            pnpm install
        elif command -v npm &> /dev/null; then
            npm install
        else
            echo "❌ Error: No package manager found (npm or pnpm)"
            exit 1
        fi
        echo "✅ Dependencies installed"
    fi
else
    echo "✅ Dependencies already installed"
fi

# Summary
echo ""
echo "================================"
echo "✨ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo ""
echo "1. Configure Supabase credentials in .env.local"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "2. Apply database migrations (if not done already)"
echo "   - See supabase/migrations/README.md for instructions"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "4. Test the user flow:"
echo "   - Sign up at http://localhost:3000/auth/sign-up"
echo "   - Sign in at http://localhost:3000/auth/login"
echo "   - Access dashboard at http://localhost:3000/dashboard"
echo "   - View profile at http://localhost:3000/profile"
echo ""
echo "📚 For more information, see USER_MANAGEMENT_GUIDE.md"
echo ""
