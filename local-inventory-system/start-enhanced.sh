#!/bin/bash

# Enhanced Local Inventory System - Start Script
# Starts both backend server

set -e

echo "========================================="
echo "Enhanced Inventory System - Starting"
echo "========================================="
echo ""

# Check if database exists
if [ ! -f "backend/database.sqlite" ]; then
    echo "Error: Database not found!"
    echo "Please run setup-enhanced.sh first"
    exit 1
fi

echo "Starting backend server..."
echo "Server will run on http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd backend
npm start
