#!/bin/bash

# Verification Script for Dashboard Enhancements
# This script checks that all enhanced components are properly integrated

set -e

echo "🔍 Fintrace Dashboard Enhancement Verification"
echo "=========================================="
echo ""

# Check if we're in the dashboard directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the dashboard directory"
    exit 1
fi

echo "✅ Running from dashboard directory"
echo ""

# Check for enhanced component files
echo "📁 Checking for enhanced component files..."

FILES=(
    "components/enhanced-graph-view.tsx"
    "components/enhanced-node-details-panel.tsx"
    "components/enhanced-summary-cards.tsx"
)

for file in "${FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✅ $file exists"
    else
        echo "  ❌ $file missing"
        exit 1
    fi
done

echo ""

# Check dashboard-shell.tsx for correct imports
echo "🔗 Checking dashboard-shell.tsx imports..."

if grep -q "EnhancedGraphView" components/dashboard/dashboard-shell.tsx; then
    echo "  ✅ EnhancedGraphView imported"
else
    echo "  ❌ EnhancedGraphView not imported"
    exit 1
fi

if grep -q "EnhancedNodeDetailsPanel" components/dashboard/dashboard-shell.tsx; then
    echo "  ✅ EnhancedNodeDetailsPanel imported"
else
    echo "  ❌ EnhancedNodeDetailsPanel not imported"
    exit 1
fi

if grep -q "EnhancedSummaryCards" components/dashboard/dashboard-shell.tsx; then
    echo "  ✅ EnhancedSummaryCards imported"
else
    echo "  ❌ EnhancedSummaryCards not imported"
    exit 1
fi

echo ""

# Check for old imports (should not exist)
echo "🚫 Checking for old component imports..."

if grep -q "from '@/components/graph-view'" components/dashboard/dashboard-shell.tsx; then
    echo "  ⚠️  Warning: Old GraphView import still present"
else
    echo "  ✅ Old GraphView import removed"
fi

if grep -q "from '@/components/node-details-panel'" components/dashboard/dashboard-shell.tsx; then
    echo "  ⚠️  Warning: Old NodeDetailsPanel import still present"
else
    echo "  ✅ Old NodeDetailsPanel import removed"
fi

if grep -q "from '@/components/summary-cards'" components/dashboard/dashboard-shell.tsx; then
    echo "  ⚠️  Warning: Old SummaryCards import still present"
else
    echo "  ✅ Old SummaryCards import removed"
fi

echo ""

# Check TypeScript compilation
echo "🔨 Checking TypeScript compilation..."

if command -v tsc &> /dev/null; then
    if tsc --noEmit --skipLibCheck 2>&1 | grep -q "error TS"; then
        echo "  ❌ TypeScript errors found"
        echo "  Run 'tsc --noEmit' to see details"
        exit 1
    else
        echo "  ✅ No TypeScript errors"
    fi
else
    echo "  ⚠️  TypeScript not found, skipping type check"
fi

echo ""

# Check for required dependencies
echo "📦 Checking dependencies..."

DEPS=(
    "vis-network"
    "zustand"
    "lucide-react"
)

for dep in "${DEPS[@]}"; do
    if grep -q "\"$dep\"" package.json; then
        echo "  ✅ $dep installed"
    else
        echo "  ❌ $dep missing"
        exit 1
    fi
done

echo ""

# Check documentation files
echo "📚 Checking documentation..."

DOCS=(
    "../INTEGRATION_COMPLETE.md"
    "../DASHBOARD_ENHANCEMENTS_COMPLETE.md"
    "../VISUAL_CHANGES_GUIDE.md"
    "../QUICK_START.md"
)

for doc in "${DOCS[@]}"; do
    if [ -f "$doc" ]; then
        echo "  ✅ $(basename $doc) exists"
    else
        echo "  ⚠️  $(basename $doc) missing"
    fi
done

echo ""

# Summary
echo "=========================================="
echo "✨ Verification Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Navigate to http://localhost:3000/dashboard"
echo "3. Upload a CSV file to test the enhancements"
echo "4. Check QUICK_START.md for feature guide"
echo ""
echo "Documentation:"
echo "- INTEGRATION_COMPLETE.md - Integration details"
echo "- DASHBOARD_ENHANCEMENTS_COMPLETE.md - Feature docs"
echo "- VISUAL_CHANGES_GUIDE.md - Visual comparison"
echo "- QUICK_START.md - Quick start guide"
echo ""
