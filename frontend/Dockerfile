# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files for better caching
COPY package*.json ./

# Install dependencies with clean install and frozen lockfile
RUN npm ci --silent

# Copy source files
COPY . .

# Development stage
FROM node:18-alpine AS development

WORKDIR /app

# Copy deps and source from builder
COPY --from=builder /app ./

# Expose Vite dev server port
EXPOSE 5173

# Start development server with host flag
CMD ["npm", "run", "dev", "--", "--host"]

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy deps and source from builder
COPY --from=builder /app ./

# Build for production
RUN npm run build

# Use lightweight nginx for serving
FROM nginx:alpine AS nginx

# Copy built files to nginx
COPY --from=production /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]