"""
pytest configuration for TN Election Guide backend tests.
"""
import os
import sys

# Ensure backend directory is on path so `from app import app` works
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Set required environment variables before any imports
os.environ.setdefault("GEMINI_API_KEY", "")
os.environ.setdefault("ALLOWED_ORIGINS", "http://localhost:5173")
os.environ.setdefault("RATE_LIMIT_REQUESTS", "100")
os.environ.setdefault("RATE_LIMIT_WINDOW", "60")
