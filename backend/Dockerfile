FROM python:3.10-slim

# Environment Variables (new format)
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

WORKDIR /app/backend

# Copy requirements.txt
COPY requirements.txt ./

# Install dependencies (multi-stage build)
RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc python3-dev libpq-dev libmagic1 libmagic-dev && \
    pip install --no-cache-dir -r requirements.txt

# Clean up build dependencies (optional)
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/*  # Remove package lists

# Copy application code
COPY . .

# Start the application
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8000" ]


