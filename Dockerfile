# ════════════════════════════════════════════════════════════════════════════
# TN Election Guide — Production Dockerfile
# FREE Google Services only: Gemini free tier, Google Fonts, Firebase Hosting
#
# Stage 1: Build React frontend (Node 20)
# Stage 2: Serve everything via FastAPI (Python 3.12)
#
# For deployment: Use FREE Firebase Hosting for frontend
# See README.md → "Deploy with Firebase (Free)"
# ════════════════════════════════════════════════════════════════════════════

# ── Stage 1: Build React frontend ─────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /build

# Cache npm install as separate layer
COPY frontend/package.json ./
RUN npm install --frozen-lockfile

# Build production bundle
COPY frontend/ ./
RUN npm run build

# ── Stage 2: Python production server ─────────────────────────────────────
FROM python:3.12-slim

# Security: run as non-root user
RUN groupadd --system appgroup && \
    useradd --system --gid appgroup --no-create-home appuser

WORKDIR /app

# Install Python dependencies
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt \
 && pip install --no-cache-dir aiofiles==24.1.0

# Copy backend source
COPY backend/app.py ./

# SPA entry point: serves React + all API routes on one server
# (server.py lives at the repo root next to this Dockerfile)
COPY server.py ./

# Copy compiled React frontend → serve as static files
COPY --from=frontend-builder /build/dist ./static

# Set ownership
RUN chown -R appuser:appgroup /app

USER appuser

# PORT env var — set 8080 as default for local Docker
# (For Firebase Hosting, the frontend is deployed separately for free)
ENV PORT=8080
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')" || exit 1

CMD ["sh", "-c", "uvicorn server:app --host 0.0.0.0 --port ${PORT} --workers 1 --no-access-log"]
