# Dockerfile
FROM node:20-slim AS builder

WORKDIR /app

# Create new Vite project
RUN npm create vite@latest . -- --template react --yes

# Install dependencies
RUN npm install
RUN npm install @radix-ui/react-icons lucide-react class-variance-authority clsx tailwindcss-animate
RUN npm install -D tailwindcss postcss autoprefixer

# Set up Tailwind
RUN npx tailwindcss init -p

# Copy configuration files
COPY tailwind.config.js .
COPY src/ src/

# Development stage
FROM builder AS development
CMD ["npm", "run", "dev", "--", "--host"]

# Production stage
FROM builder AS production
RUN npm run build
CMD ["npm", "run", "preview", "--", "--host"]