# ATS Deployment Guide

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## Environment Setup

### Server Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration
MONGO_URI=mongodb://localhost:27017/ats_database

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production_min_32_chars
JWT_EXPIRE=24h

# Client Configuration
CLIENT_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Client Environment Variables

Create a `.env.local` file in the `client` directory:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_CLIENT_URL=http://localhost:3000
NODE_ENV=production
```

## Local Development

### 1. Install Dependencies

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Start MongoDB

Ensure MongoDB is running on your system:

```bash
# For Ubuntu/Debian
sudo systemctl start mongod

# For macOS with Homebrew
brew services start mongodb-community

# For Windows
net start MongoDB
```

### 3. Start the Application

```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm run dev
```

The application will be available at:
- Client: http://localhost:3000
- Server API: http://localhost:5000

## Production Deployment

### Server Deployment

1. **Environment Setup**: Ensure all environment variables are properly configured for production
2. **Build**: No build step required for the Express server
3. **Start**: Use `npm start` to run the production server
4. **Process Management**: Consider using PM2 for process management:

```bash
npm install -g pm2
pm2 start server.js --name "ats-server"
```

### Client Deployment

1. **Build the Application**:
```bash
cd client
npm run build
```

2. **Start Production Server**:
```bash
npm start
```

### Database Setup

1. **Production MongoDB**: Set up a production MongoDB instance (MongoDB Atlas recommended)
2. **Update MONGO_URI**: Update the environment variable to point to your production database
3. **Security**: Ensure proper authentication and network security for your database

## Docker Deployment (Optional)

### Server Dockerfile

Create `server/Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

### Client Dockerfile

Create `client/Dockerfile`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:18-alpine AS runner

WORKDIR /app

COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

### Docker Compose

Create `docker-compose.yml` in the root directory:

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    container_name: ats-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password

  server:
    build: ./server
    container_name: ats-server
    restart: unless-stopped
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    environment:
      - MONGO_URI=mongodb://admin:password@mongodb:27017/ats_database?authSource=admin
      - JWT_SECRET=your_super_secret_jwt_key_here
      - CLIENT_URL=http://localhost:3000
      - NODE_ENV=production

  client:
    build: ./client
    container_name: ats-client
    restart: unless-stopped
    ports:
      - "3000:3000"
    depends_on:
      - server
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:5000/api
      - NODE_ENV=production

volumes:
  mongodb_data:
```

## Security Considerations

1. **JWT Secret**: Use a strong, unique JWT secret in production
2. **CORS**: Configure CORS properly for your production domain
3. **HTTPS**: Use HTTPS in production
4. **Rate Limiting**: Adjust rate limiting based on your needs
5. **Database Security**: Secure your MongoDB instance with authentication
6. **File Uploads**: Validate and sanitize file uploads

## Monitoring and Logging

1. **Logging**: The application includes Morgan for HTTP request logging
2. **Error Handling**: Comprehensive error handling is implemented
3. **Health Checks**: Consider implementing health check endpoints
4. **Monitoring**: Use tools like PM2 monitor or external monitoring services

## Troubleshooting

### Common Issues

1. **Server won't start**: Check environment variables and MongoDB connection
2. **Database connection failed**: Verify MongoDB is running and MONGO_URI is correct
3. **CORS errors**: Ensure CLIENT_URL matches your frontend domain
4. **File upload issues**: Check upload directory permissions and file size limits

### Logs

- Server logs are output to console
- Check PM2 logs: `pm2 logs ats-server`
- MongoDB logs: Check MongoDB log files

## Performance Optimization

1. **Caching**: Implement Redis for session storage and caching
2. **CDN**: Use a CDN for static assets
3. **Database Indexing**: Add appropriate database indexes
4. **Compression**: Enable gzip compression
5. **Load Balancing**: Use a load balancer for multiple instances
