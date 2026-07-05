FROM python:3.11-slim
WORKDIR /app

# Install system dependencies if compiling reportlab or other libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements list relative to backend build context
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY . .

# Create SQLite storage location
RUN mkdir -p instance

ENV FLASK_APP=main.py
ENV FLASK_ENV=production
ENV PORT=5000

EXPOSE 5000

# Run with Gunicorn on port 5000
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "main:app"]
