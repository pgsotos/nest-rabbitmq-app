# Stage 1: Build stage
FROM oven/bun:1 as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY bun.lock ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Build the application
RUN bun build ./src/index.ts --outdir ./dist

# Stage 2: Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/bun.lock ./

# Install production dependencies only
RUN bun install --production

# Expose the application port
EXPOSE 3000

CMD ["bun", "run", "dist/index.js"]