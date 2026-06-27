FROM node:20-alpine

WORKDIR /app

# Install backend deps
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm install --production

# Copy source
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY src/ ./src/

# Run as non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO /dev/null http://localhost:3000/ || exit 1

CMD ["node", "backend/server.js"]
