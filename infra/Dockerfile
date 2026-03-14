# Use a slim Python 3.11 image for smaller footprint
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies required for OpenCV/Audio libraries (standard in multimedia apps)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1-mesa-glx \
    libglib2.0-0 \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first to leverage Docker cache
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend code and models
COPY backend/ /app/backend/
COPY models/ /app/models/

# Note: In a production scenario, the React frontend would be built into a 'dist' folder
# and served via FastAPI's StaticFiles. For this architecture, we will run the backend API.
# If separating, the frontend could run on a separate bucket/service. 
# We'll assume the frontend will be served independently or accessed locally for the walkthrough.

WORKDIR /app/backend
EXPOSE 8000

# Run FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
