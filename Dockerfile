# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Create necessary directories
RUN mkdir -p logs data

# Set environment variables
ENV NODE_ENV=production

# Expose the application port
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]