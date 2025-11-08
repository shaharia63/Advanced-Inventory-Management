#!/bin/bash

# Enhanced Local Inventory System - Automated Setup Script
# This script sets up the complete backend and frontend

set -e  # Exit on error

echo "========================================="
echo "Enhanced Inventory System - Setup"
echo "========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}Error: Node.js is not installed${NC}"
    echo "Please install Node.js 16.x or higher from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node --version)
echo -e "${GREEN}✓ Node.js found: $NODE_VERSION${NC}"

# Check npm or pnpm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    echo -e "${GREEN}✓ Using pnpm${NC}"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    echo -e "${GREEN}✓ Using npm${NC}"
else
    echo -e "${RED}Error: Neither npm nor pnpm found${NC}"
    exit 1
fi

echo ""
echo "========================================="
echo "Step 1: Backend Setup"
echo "========================================="

cd backend

echo "Installing backend dependencies..."
$PKG_MANAGER install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install backend dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Backend dependencies installed${NC}"

echo ""
echo "Initializing enhanced database..."
$PKG_MANAGER run init-db-enhanced

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to initialize database${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Database initialized${NC}"

echo ""
echo "Loading sample data..."
$PKG_MANAGER run seed-enhanced

if [ $? -ne 0 ]; then
    echo -e "${YELLOW}Warning: Failed to seed sample data (optional)${NC}"
else
    echo -e "${GREEN}✓ Sample data loaded${NC}"
fi

cd ..

echo ""
echo "========================================="
echo "Step 2: Frontend Setup"
echo "========================================="

cd frontend/inventory-frontend

echo "Installing frontend dependencies..."
$PKG_MANAGER install

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to install frontend dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend dependencies installed${NC}"

echo ""
echo "Building frontend..."
$PKG_MANAGER run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Failed to build frontend${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Frontend built successfully${NC}"

cd ../..

echo ""
echo "========================================="
echo "Setup Complete!"
echo "========================================="
echo ""
echo "To start the system:"
echo ""
echo "  Option 1: Use the start script"
echo "    ./start.sh"
echo ""
echo "  Option 2: Start manually"
echo "    cd backend && $PKG_MANAGER start"
echo ""
echo "Then access the system at: http://localhost:3000"
echo ""
echo "Default login credentials:"
echo "  Email: admin@inventory.local"
echo "  Password: password"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Change the password after first login!${NC}"
echo ""
echo "For more information, see:"
echo "  - README-ENHANCED.md"
echo "  - INSTALLATION-ENHANCED.md"
echo ""
