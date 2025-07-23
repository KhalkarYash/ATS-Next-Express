#!/bin/bash

# ATS Production Startup Script

echo "🚀 Starting ATS Application in Production Mode..."

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   Ubuntu/Debian: sudo systemctl start mongod"
    echo "   macOS: brew services start mongodb-community"
    echo "   Windows: net start MongoDB"
    exit 1
fi

# Check if environment files exist
if [ ! -f "server/.env" ]; then
    echo "⚠️  Server .env file not found. Copying from .env.example..."
    cp server/.env.example server/.env
    echo "📝 Please update server/.env with your production values"
fi

if [ ! -f "client/.env.local" ]; then
    echo "⚠️  Client .env.local file not found. Creating with defaults..."
    cat > client/.env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
NODE_ENV=production
EOF
fi

# Install dependencies if node_modules don't exist
if [ ! -d "server/node_modules" ]; then
    echo "📦 Installing server dependencies..."
    cd server && npm install && cd ..
fi

if [ ! -d "client/node_modules" ]; then
    echo "📦 Installing client dependencies..."
    cd client && npm install && cd ..
fi

# Build client for production
echo "🔨 Building client for production..."
cd client && npm run build && cd ..

# Create uploads directory if it doesn't exist
mkdir -p server/uploads

# Start the applications
echo "🚀 Starting server..."
cd server
NODE_ENV=production npm start &
SERVER_PID=$!
cd ..

echo "⏳ Waiting for server to start..."
sleep 5

echo "🚀 Starting client..."
cd client
NODE_ENV=production npm start &
CLIENT_PID=$!
cd ..

echo "✅ ATS Application started successfully!"
echo "📊 Server: http://localhost:5000"
echo "🌐 Client: http://localhost:3000"
echo ""
echo "To stop the application:"
echo "  kill $SERVER_PID $CLIENT_PID"
echo ""
echo "Server PID: $SERVER_PID"
echo "Client PID: $CLIENT_PID"

# Wait for both processes
wait $SERVER_PID $CLIENT_PID
