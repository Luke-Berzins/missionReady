# Why MissionReady?

Streamlined Progression: Clear visibility into career paths and training requirements
Smart Scheduling: Curse recommendations and availability management
Actionable Insights: Real-time analytics on team readiness and development progress
Seamless Integration: Works with the Army App

Key Features
🎯 Smart Profiles

Progress tracking
Skill gap analysis
Custom development paths

📊 Analytics Dashboard

Team readiness metrics
Training completion rates
Resource utilization

🤖 Intelligent Planning

Predictive scheduling
Capacity optimization

🔄 Integration Ready

REST API
SSO support
Enterprise security

# Technical Architecture and Setup

## Project Overview

This project implements a modern web application using a microservices architecture with three main components: a frontend service, a backend API service, and a MongoDB database. The entire application is containerized using Docker and orchestrated with Docker Compose.

## System Architecture

### Infrastructure Components

The system consists of three main services:

1. **Frontend Service**
   - Built as a development environment
   - Runs on port 5173
   - Uses Vite as the development server
   - Connected to backend API via environment variable configuration

2. **Backend Service**
   - Node.js-based API server
   - Runs on port 3000
   - Connects to MongoDB database
   - Handles business logic and data operations

3. **MongoDB Database**
   - Latest version of MongoDB
   - Runs on standard port 27017
   - Persists data using named volume
   - Includes initialization scripts support

## Development Environment Setup

### Prerequisites

- Docker
- Docker Compose version 3.8 or higher
- Node.js development environment (recommended for local development)

### Configuration

The system uses environment variables for configuration:

**Frontend Environment Variables:**
```env
NODE_ENV=development
VITE_API_URL=http://localhost:3000
```

**Backend Environment Variables:**
```env
MONGODB_URI=mongodb://mongo:27017/career_paths
```

### Volume Mounts

The project uses several strategic volume mounts for development and data persistence:

1. **Frontend Volumes:**
   - `./src:/app/src`: Live reload for source code
   - `./public:/app/public`: Static assets directory

2. **Backend Volumes:**
   - `./server:/app`: Server code with live reload
   - `/app/node_modules`: Isolated node modules

3. **MongoDB Volumes:**
   - `./mongo-init:/docker-entrypoint-initdb.d`: Database initialization scripts
   - `mongodb_data:/data/db`: Persistent database storage

## Getting Started

1. Clone the repository
2. Navigate to the project root directory
3. Start the services:
   ```bash
   docker-compose up -d
   ```

The services will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- MongoDB: mongodb://localhost:27017

## Development Workflow

### Hot Reload Support

The development environment supports hot reloading:
- Frontend code changes in `./src` will trigger automatic rebuilds
- Backend code changes in `./server` will restart the Node.js server
- Database initialization scripts in `./mongo-init` will run on first database startup

### Dependency Management

- Frontend dependencies should be installed through the container
- Backend dependencies are isolated in the container's node_modules
- Database schemas and indexes should be defined in initialization scripts

### Debugging

You can access logs for each service using:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f [frontend|backend|mongo]
```

## Production Considerations

The current configuration is optimized for development. For production deployment, consider:

1. Using multi-stage builds for smaller images
2. Implementing proper security measures for MongoDB
3. Setting up proper environment variable management
4. Implementing health checks
5. Setting up monitoring and logging solutions
6. Configuring proper backup strategies for MongoDB
7. Implementing SSL/TLS for secure communication

## Troubleshooting

Common issues and solutions:

1. **Port Conflicts**
   - Ensure ports 5173, 3000, and 27017 are available
   - Modify port mappings in docker-compose.yml if needed

2. **Volume Permissions**
   - Ensure proper read/write permissions on mounted volumes
   - Check container logs for permission-related errors

3. **Database Connection Issues**
   - Verify MongoDB is running: `docker-compose ps`
   - Check MongoDB logs: `docker-compose logs mongo`
   - Ensure MONGODB_URI is correct in backend service

4. **Hot Reload Not Working**
   - Verify volume mounts are correct
   - Check for file watching limitations on your OS
   - Restart the affected service: `docker-compose restart [service]`
