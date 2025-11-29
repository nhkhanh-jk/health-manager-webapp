#!/bin/bash
# Build script for Render deployment

echo "Building Health Manager Backend..."

# Check if Maven wrapper exists
if [ -f "./mvnw" ]; then
    echo "Using Maven wrapper..."
    chmod +x ./mvnw
    ./mvnw clean package -DskipTests
else
    echo "Using system Maven..."
    mvn clean package -DskipTests
fi

echo "Build completed!"

