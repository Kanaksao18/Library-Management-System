#!/bin/bash

echo "========================================"
echo "Library Management System Setup"
echo "========================================"
echo

echo "Checking prerequisites..."
echo

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java 21 and try again"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed or not in PATH"
    echo "Please install Node.js 18+ and try again"
    exit 1
fi

# Check if Maven is installed
if ! command -v mvn &> /dev/null; then
    echo "ERROR: Maven is not installed or not in PATH"
    echo "Please install Maven 3.6+ and try again"
    exit 1
fi

echo "Prerequisites check passed!"
echo

echo "Starting backend setup..."
cd backend
echo "Building backend..."
mvn clean install -q
if [ $? -ne 0 ]; then
    echo "ERROR: Backend build failed"
    exit 1
fi

echo "Backend setup completed!"
echo

echo "Starting frontend setup..."
cd ../frontend
echo "Installing frontend dependencies..."
npm install --silent
if [ $? -ne 0 ]; then
    echo "ERROR: Frontend setup failed"
    exit 1
fi

echo "Frontend setup completed!"
echo

echo "========================================"
echo "Setup completed successfully!"
echo "========================================"
echo
echo "To run the application:"
echo
echo "1. Start MySQL database"
echo "2. Open a new terminal and run:"
echo "   cd backend"
echo "   mvn spring-boot:run"
echo
echo "3. Open another terminal and run:"
echo "   cd frontend"
echo "   npm run dev"
echo
echo "The application will be available at:"
echo "- Frontend: http://localhost:5173"
echo "- Backend: http://localhost:8080"
echo
echo "Default admin credentials:"
echo "- Email: admin@library.com"
echo "- Password: admin123"
echo 