@echo off
echo ========================================
echo Library Management System Setup
echo ========================================
echo.

echo Checking prerequisites...
echo.

REM Check if Java is installed
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Java is not installed or not in PATH
    echo Please install Java 21 and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js 18+ and try again
    pause
    exit /b 1
)

REM Check if Maven is installed
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Maven is not installed or not in PATH
    echo Please install Maven 3.6+ and try again
    pause
    exit /b 1
)

echo Prerequisites check passed!
echo.

echo Starting backend setup...
cd backend
echo Building backend...
call mvn clean install -q
if %errorlevel% neq 0 (
    echo ERROR: Backend build failed
    pause
    exit /b 1
)

echo Backend setup completed!
echo.

echo Starting frontend setup...
cd ..\frontend
echo Installing frontend dependencies...
call npm install --silent
if %errorlevel% neq 0 (
    echo ERROR: Frontend setup failed
    pause
    exit /b 1
)

echo Frontend setup completed!
echo.

echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To run the application:
echo.
echo 1. Start MySQL database
echo 2. Open a new terminal and run:
echo    cd backend
echo    mvn spring-boot:run
echo.
echo 3. Open another terminal and run:
echo    cd frontend
echo    npm run dev
echo.
echo The application will be available at:
echo - Frontend: http://localhost:5173
echo - Backend: http://localhost:8080
echo.
echo Default admin credentials:
echo - Email: admin@library.com
echo - Password: admin123
echo.
pause 