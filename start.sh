#!/bin/bash

# HR Management System Startup Script
echo "🚀 Starting HR Management System..."

# Check if Docker is available
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "📦 Docker detected. Starting with Docker Compose..."
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        echo "⚙️  Creating .env file from template..."
        cp environment-example.txt .env
        echo "⚠️  Please update the GEMINI_API_KEY in .env file before running again"
        exit 1
    fi
    
    # Start services
    docker-compose up -d
    
    echo "✅ Services started successfully!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:8080"
    echo "📊 MySQL: localhost:3306"
    
else
    echo "🔧 Docker not found. Starting manually..."
    
    # Check if MySQL is running
    if ! pgrep -x "mysqld" > /dev/null; then
        echo "⚠️  MySQL is not running. Please start MySQL first."
        echo "   - macOS: brew services start mysql"
        echo "   - Ubuntu: sudo service mysql start"
        echo "   - Windows: Start MySQL service"
        exit 1
    fi
    
    # Start Backend
    echo "🔧 Starting Backend (Spring Boot)..."
    cd backend
    if [ ! -f target/hr-backend-0.0.1-SNAPSHOT.jar ]; then
        echo "📦 Building backend..."
        mvn clean install -DskipTests
    fi
    
    mvn spring-boot:run > ../backend.log 2>&1 &
    BACKEND_PID=$!
    cd ..
    
    # Wait for backend to start
    echo "⏳ Waiting for backend to start..."
    sleep 10
    
    # Start Frontend
    echo "🎨 Starting Frontend (React)..."
    cd frontend
    if [ ! -d node_modules ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    
    npm start > ../frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    echo "✅ Services started successfully!"
    echo "🌐 Frontend: http://localhost:3000"
    echo "🔧 Backend: http://localhost:8080"
    echo ""
    echo "📋 Demo Accounts:"
    echo "   Admin: admin@company.com / admin123"
    echo "   HR: hr@company.com / hr123"
    echo "   Manager: manager@company.com / manager123"
    echo "   Employee: employee@company.com / emp123"
    echo ""
    echo "🛑 To stop services:"
    echo "   kill $BACKEND_PID $FRONTEND_PID"
    echo "   or run: ./stop.sh"
    
    # Save PIDs for stop script
    echo "$BACKEND_PID" > .backend.pid
    echo "$FRONTEND_PID" > .frontend.pid
fi

echo ""
echo "🎉 HR Management System is now running!"
echo "📚 Check README.md for more information"

