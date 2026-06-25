# Devsiy production Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install serve for static hosting
RUN npm install -g serve

# Copy built assets
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Start static server
CMD ["serve", "-s", "dist", "-l", "3000"]
