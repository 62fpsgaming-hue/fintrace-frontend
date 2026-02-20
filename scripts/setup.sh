#!/bin/bash

# Financial Forensics Dashboard Setup Script

set -e

echo "=================================="
echo "Financial Forensics Dashboard Setup"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}Error: Python is not installed${NC}"
    echo "Please install Python 3.11+ from https://python.org/"
    exit 1
fi

# Check if pnpm is installed
if ! command -v pnpm &> /dev/null; then
    echo -e "${YELLOW}pnpm not found. Installing...${NC}"
    npm install -g pnpm
fi

echo -e "${GREEN}✓ Prerequisites check passed${NC}"
echo ""

# Setup environment files
echo "Setting up environment files..."
if [ ! -f .env.local ]; then
    cp .env.local.example .env.local
    echo -e "${YELLOW}⚠ Created .env.local - Please edit with your Supabase credentials${NC}"
else
    echo -e "${GREEN}✓ .env.local already exists${NC}"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ Created backend/.env${NC}"
else
    echo -e "${GREEN}✓ backend/.env already exists${NC}"
fi

echo ""

# Install frontend dependencies
echo "Installing frontend dependencies..."
pnpm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
python3 -m venv venv
source venv/bin/activate 2>/dev/null || . venv/Scripts/activate 2>/dev/null
pip install -r requirements.txt
cd ..
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Check if package.json exists
if [ ! -f package.json ]; then
    echo -e "${RED}Error: package.json not found${NC}"
    exit 1
fi

echo "=================================="
echo -e "${GREEN}Setup Complete!${NC}"
echo "=================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Edit .env.local with your Supabase credentials:"
echo "   - NEXT_PUBLIC_SUPABASE_URL"
echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo ""
echo "2. Run the database migration in Supabase:"
echo "   - Open Supabase SQL Editor"
echo "   - Run scripts/001_create_analysis_history.sql"
echo ""
echo "3. Start the development servers:"
echo "   Terminal 1: cd backend && source venv/bin/activate && python main.py"
echo "   Terminal 2: pnpm dev"
echo ""
echo "4. Visit http://localhost:3000"
echo ""
echo "For deployment instructions, see DEPLOYMENT.md"
echo ""
