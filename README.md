# SkillForge AI – Intelligent Resume Screening Agent

SkillForge AI is a premium, production-ready SaaS platform that helps recruitment teams automatically parse, analyze, and grade candidate resumes against job descriptions using Google Gemini AI. The platform provides detailed evaluation metrics, ATS scoring, skill gap detection, strengths/weaknesses profiling, hiring decisions, and professional PDF report downloads.

---

## Architecture Overview

```
c:\Users\Lenovo\Downloads\skillforge-backend\
├── frontend/                 # React.js (Vite + Tailwind CSS + Framer Motion)
│   ├── src/
│   │   ├── components/       # Shared UI (Sidebar, CircularProgress)
│   │   ├── pages/            # View pages (Landing, Upload, JobDescription, Dashboard, Suggestions, NotFound)
│   │   ├── App.jsx           # Client-side router
│   │   ├── index.css         # Tailwind directives & glass styles
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json           # Vercel proxy configuration
├── backend/                  # Python Flask REST API
│   ├── app/
│   │   ├── services/
│   │   │   ├── parser.py     # Document text parsing (PyPDF2, python-docx)
│   │   │   ├── gemini.py     # Gemini structured schema parser & fallback
│   │   │   └── pdf_generator.py # PDF document rendering (ReportLab)
│   │   ├── database.py       # SQLite connection hooks
│   │   ├── routes.py         # REST endpoints (/upload, /analyze, /report)
│   │   └── __init__.py       # App builder & CORS Setup
│   ├── main.py               # WSGI development runner
│   ├── requirements.txt
│   ├── .env.template         # Environment variables template
│   └── render.yaml           # Render deployment blueprint
├── docker/                   # Docker environment configurations
│   ├── nginx.conf            # Nginx config for frontend static host & proxy
│   ├── frontend.Dockerfile
│   └── backend.Dockerfile
├── docker-compose.yml        # Multi-container local execution setup
├── .gitignore
└── README.md                 # Project documentation
```

---

## Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, React Router, Axios, Framer Motion, React Icons.
- **Backend:** Python 3.11, Flask, Flask-CORS, PyPDF2, python-docx, ReportLab.
- **AI Engine:** Google Gemini Pro / Flash (response JSON schema mode).
- **Database:** SQLite.
- **Containers & Deployment:** Docker, Docker Compose, Vercel, Render.

---

## Local Installation Guide

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.9 or higher)
- Docker & Docker Compose (optional, for container runs)

### Setup & Run (Separated services)

#### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Copy the environment variables template and configure it:
   ```bash
   cp .env.template .env
   ```
   Open the `.env` file and insert your `GEMINI_API_KEY`.
5. Run the Flask application:
   ```bash
   python main.py
   ```
   *The backend starts at `http://localhost:5000`.*

#### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install npm packages:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend starts at `http://localhost:3000`.*

---

## Running with Docker

1. Ensure Docker is running.
2. In the repository root directory, create a `.env` file (or set the shell variable) to define your key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
3. Boot the multi-container configuration:
   ```bash
   docker-compose up --build
   ```
4. Access the web app at `http://localhost:3000`. The frontend will automatically proxy backend calls to the running backend service.

---

## REST API Documentation

### 1. Upload Resume
- **URL:** `/api/upload`
- **Method:** `POST`
- **Content-Type:** `multipart/form-data`
- **Request Body:** 
  - `file`: Resume file (only `.pdf` and `.docx` supported).
- **Success Response (201 Created):**
  ```json
  {
    "message": "Resume uploaded and parsed successfully",
    "resume_id": 1,
    "filename": "john_doe_resume.pdf",
    "text_length": 3420
  }
  ```

### 2. Analyze Resume
- **URL:** `/api/analyze`
- **Method:** `POST`
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "resume_id": 1,
    "job_description": "We are looking for a Java Full Stack Developer with Spring Boot..."
  }
  ```
- **Success Response (200 OK):** Returns structured analysis containing Candidate Name, Email, Phone, Scores (ATS, Technical, Skill Match), Strengths, Weaknesses, Missing Skills, and Learning Roadmap Suggestions.

### 3. Generate Report
- **URL:** `/api/report`
- **Method:** `GET`
- **Query Parameters:**
  - `analysis_id`: Integer ID of the analysis.
- **Success Response (200 OK):** Returns binary stream of a professionally compiled, printable evaluation PDF report.

---

## Production Deployment Guide

### Backend: Render
1. Register on Render and connect your GitHub repository.
2. Render automatically reads the `backend/render.yaml` configuration to spin up the web service.
3. Configure `GEMINI_API_KEY` under Environment variables on Render Dashboard.
4. Render attaches a persistent SSD volume `/app/instance` to persist candidate analysis databases across restarts.

### Frontend: Vercel
1. Connect your repository to Vercel.
2. Set Framework Preset as `Vite`.
3. Set the root directory of Vercel build to `frontend`.
4. Vercel automatically deploys the application and uses the proxy rewrite configurations defined in `frontend/vercel.json` to safely route API calls.
