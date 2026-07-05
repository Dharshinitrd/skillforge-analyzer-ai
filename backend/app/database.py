import sqlite3
import os
import json
from datetime import datetime

DATABASE_PATH = None

def set_db_path(path):
    global DATABASE_PATH
    DATABASE_PATH = path

def get_db_connection():
    if not DATABASE_PATH:
        raise ValueError("Database path is not set. Initialize the app first.")
    
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path):
    """
    Initializes the database, creating the necessary tables.
    """
    global DATABASE_PATH
    DATABASE_PATH = db_path
    
    # Ensure folder for database exists
    db_dir = os.path.dirname(db_path)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir)

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create resumes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS resumes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            content TEXT NOT NULL,
            uploaded_at TEXT NOT NULL
        )
    ''')
    
    # Create analyses table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS analyses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            resume_id INTEGER NOT NULL,
            job_description TEXT NOT NULL,
            candidate_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            education TEXT NOT NULL,
            experience TEXT NOT NULL,
            projects TEXT NOT NULL,
            skills TEXT NOT NULL,
            strengths TEXT NOT NULL,
            weaknesses TEXT NOT NULL,
            missing_skills TEXT NOT NULL,
            ats_score INTEGER NOT NULL,
            technical_score INTEGER NOT NULL,
            communication_score INTEGER NOT NULL,
            experience_score INTEGER NOT NULL,
            skill_match_percentage INTEGER NOT NULL,
            final_recommendation TEXT NOT NULL,
            suggestions TEXT NOT NULL,
            created_at TEXT NOT NULL,
            FOREIGN KEY (resume_id) REFERENCES resumes (id)
        )
    ''')
    
    conn.commit()
    conn.close()

def save_resume(filename, content):
    """
    Saves a resume's text content to the database.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    uploaded_at = datetime.now().isoformat()
    
    cursor.execute('''
        INSERT INTO resumes (filename, content, uploaded_at)
        VALUES (?, ?, ?)
    ''', (filename, content, uploaded_at))
    
    resume_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return resume_id

def get_resume(resume_id):
    """
    Retrieves a resume's content by ID.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM resumes WHERE id = ?', (resume_id,))
    row = cursor.fetchone()
    conn.close()
    if row:
        return dict(row)
    return None

def save_analysis(resume_id, job_description, analysis_data):
    """
    Saves the structured AI analysis of a resume against a job description.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    created_at = datetime.now().isoformat()
    
    # Convert lists and dicts to JSON strings for SQLite storage
    education_json = json.dumps(analysis_data.get("education", []))
    experience_json = json.dumps(analysis_data.get("experience", []))
    projects_json = json.dumps(analysis_data.get("projects", []))
    skills_json = json.dumps(analysis_data.get("skills", []))
    strengths_json = json.dumps(analysis_data.get("strengths", []))
    weaknesses_json = json.dumps(analysis_data.get("weaknesses", []))
    missing_skills_json = json.dumps(analysis_data.get("missing_skills", []))
    suggestions_json = json.dumps(analysis_data.get("suggestions", {}))
    
    cursor.execute('''
        INSERT INTO analyses (
            resume_id, job_description, candidate_name, email, phone,
            education, experience, projects, skills, strengths, weaknesses, missing_skills,
            ats_score, technical_score, communication_score, experience_score,
            skill_match_percentage, final_recommendation, suggestions, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        resume_id,
        job_description,
        analysis_data.get("candidate_name", "Not Found"),
        analysis_data.get("email", "Not Found"),
        analysis_data.get("phone", "Not Found"),
        education_json,
        experience_json,
        projects_json,
        skills_json,
        strengths_json,
        weaknesses_json,
        missing_skills_json,
        analysis_data.get("ats_score", 0),
        analysis_data.get("technical_score", 0),
        analysis_data.get("communication_score", 0),
        analysis_data.get("experience_score", 0),
        analysis_data.get("skill_match_percentage", 0),
        analysis_data.get("final_recommendation", "Recommended"),
        suggestions_json,
        created_at
    ))
    
    analysis_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return analysis_id

def get_analysis(analysis_id):
    """
    Retrieves the structured analysis by ID and deserializes JSON fields.
    """
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM analyses WHERE id = ?', (analysis_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
        
    data = dict(row)
    
    # Deserialize the JSON fields
    try:
        data["education"] = json.loads(data["education"])
        data["experience"] = json.loads(data["experience"])
        data["projects"] = json.loads(data["projects"])
        data["skills"] = json.loads(data["skills"])
        data["strengths"] = json.loads(data["strengths"])
        data["weaknesses"] = json.loads(data["weaknesses"])
        data["missing_skills"] = json.loads(data["missing_skills"])
        data["suggestions"] = json.loads(data["suggestions"])
    except Exception as e:
        # Fallback to empty values if JSON parsing fails
        logger.error(f"Error parsing database JSON fields: {str(e)}")
        
    return data
