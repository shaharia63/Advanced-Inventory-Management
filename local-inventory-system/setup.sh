#!/bin/bash

echo "====================================="
echo "  Local Inventory System Setup"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

echo "Step 1: Installing backend dependencies..."
cd backend
npm install
echo "Backend dependencies installed!"
echo ""

echo "Step 2: Initializing database..."
npm run init-db
echo "Database initialized!"
echo ""

echo "Step 3: Loading sample data..."
npm run seed
echo "Sample data loaded!"
echo ""

echo "Step 4: Installing frontend dependencies..."
cd ../frontend/inventory-frontend
npm install
echo "Frontend dependencies installed!"
echo ""

echo "====================================="
echo "  Setup Complete!"
echo "====================================="
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm start"
echo "2. Frontend: cd frontend/inventory-frontend && npm run dev"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@inventory.local"
echo "  Password: password"
echo ""
echo "Backend will run on: http://localhost:3000"
echo "Frontend will run on: http://localhost:5173"
echo "====================================="
