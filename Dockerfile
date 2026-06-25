FROM node:20-alpine

WORKDIR /app

# Install backend deps
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm install --production

# Copy source
COPY backend/ ./backend/
COPY frontend/ ./frontend/

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

CMD ["node", "backend/server.js"]
