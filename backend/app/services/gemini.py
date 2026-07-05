import os
import json
import logging
import google.generativeai as genai

logger = logging.getLogger(__name__)

def get_mock_analysis_data(resume_text, job_description):
    """
    Returns a professional mock analysis structure if Gemini API is not configured.
    """
    logger.warning("Gemini API key not found or error occurred. Returning mock analysis for demo.")
    
    # Try to extract basic details if present in the text
    name = "John Doe"
    email = "john.doe@example.com"
    phone = "+1 (555) 019-2834"
    
    lines = resume_text.split('\n')
    for line in lines[:10]:
        line_strip = line.strip()
        if "@" in line_strip and "." in line_strip:
            email = line_strip
        elif any(char.isdigit() for char in line_strip) and ("phone" in line_strip.lower() or "mobile" in line_strip.lower() or "+" in line_strip):
            phone = line_strip
    
    return {
        "candidate_name": name,
        "email": email,
        "phone": phone,
        "education": [
            {
                "degree": "B.S. in Computer Science",
                "institution": "State University",
                "year": "2018 - 2022"
            }
        ],
        "experience": [
            {
                "role": "Software Engineer",
                "company": "Tech Innovations Inc.",
                "duration": "2022 - Present",
                "description": "Developed and maintained full-stack web applications using React, Python Flask, and PostgreSQL. Improved API query efficiency by 25%."
            },
            {
                "role": "Junior Web Developer",
                "company": "Digital Solutions LLC",
                "duration": "2021 - 2022",
                "description": "Collaborated with backend engineers to integrate REST APIs. Designed responsive UI layouts and resolved front-end rendering bugs."
            }
        ],
        "projects": [
            {
                "title": "E-Commerce Recommendation System",
                "description": "Built a collaborative filtering engine that recommends products based on search history and user profiles.",
                "technologies": ["Python", "Flask", "Scikit-Learn", "Redis"]
            },
            {
                "title": "Real-time Chat Application",
                "description": "Developed a secure messaging app featuring real-time message synchronization and typing indicators.",
                "technologies": ["React", "Node.js", "Socket.io", "MongoDB"]
            }
        ],
        "skills": ["Python", "Flask", "React.js", "JavaScript", "HTML/CSS", "SQL", "Git", "Docker", "REST APIs"],
        "strengths": [
            "Strong foundation in full-stack web development practices.",
            "Demonstrated ability to optimize API endpoints and system queries.",
            "Great communication skills and collaborative team experience."
        ],
        "weaknesses": [
            "Limited production experience with cloud orchestration platforms (AWS/GCP).",
            "Fewer years of experience in system design and database sharding."
        ],
        "missing_skills": ["AWS", "Spring Boot", "MySQL"],
        "ats_score": 78,
        "technical_score": 82,
        "communication_score": 88,
        "experience_score": 70,
        "skill_match_percentage": 75,
        "final_recommendation": "Recommended",
        "resume_summary": "Motivated Software Engineer with 3+ years of experience building scalable web solutions with Python and React. Seeking to expand technical expertise into cloud architectures and microservices.",
        "suggestions": {
            "resume_improvements": [
                "Quantify achievements more specifically in the Junior Web Developer role.",
                "Add a dedicated certifications section to highlight cloud or security credentials."
            ],
            "recommended_courses": [
                "AWS Developer Associate Prep Course on Udemy",
                "Spring Boot Microservices Masterclass"
            ],
            "recommended_certifications": [
                "AWS Certified Developer - Associate",
                "Oracle Certified Associate, Java SE Programmer"
            ],
            "recommended_projects": [
                "Migrate the recommendation system to AWS ECS/EKS to practice cloud deployments.",
                "Create a simple Java Spring Boot API and connect it to a React frontend."
            ],
            "recommended_technologies": [
                "AWS (ECS, S3, RDS)",
                "Spring Boot & Java",
                "MySQL"
            ]
        }
    }

def analyze_resume_with_gemini(resume_text, job_description):
    """
    Sends the resume and job description to Google Gemini AI to obtain structured JSON evaluation.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY environment variable not configured. Falling back to mock data.")
        return get_mock_analysis_data(resume_text, job_description)

    try:
        genai.configure(api_key=api_key)
        
        # Use gemini-1.5-flash or gemini-2.5-flash
        # Let's specify gemini-1.5-flash as it is highly cost-effective and supports JSON outputs
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        prompt = f"""
You are an expert ATS (Applicant Tracking System) parser and recruitment assistant.
Analyze the following RESUME against the provided JOB DESCRIPTION.

RESUME TEXT:
\"\"\"
{resume_text}
\"\"\"

JOB DESCRIPTION:
\"\"\"
{job_description}
\"\"\"

Return your response in strict JSON format. The response must match the following JSON schema:
{{
  "candidate_name": "Full name of the candidate, or 'Not Found'",
  "email": "Email address, or 'Not Found'",
  "phone": "Phone number, or 'Not Found'",
  "education": [
    {{
      "degree": "Degree / Qualification (e.g. B.S. Computer Science)",
      "institution": "University / Institution name",
      "year": "Time period or year completed"
    }}
  ],
  "experience": [
    {{
      "role": "Job Title / Role",
      "company": "Company Name",
      "duration": "Time period (e.g. 2021 - 2023 or 2 Years)",
      "description": "Short explanation of duties and accomplishments"
    }}
  ],
  "projects": [
    {{
      "title": "Project Title",
      "description": "Short description of project",
      "technologies": ["Array", "of", "technologies", "used"]
    }}
  ],
  "skills": ["Array of skills listed in the resume"],
  "strengths": ["List of 2-4 candidate strengths based on their qualifications"],
  "weaknesses": ["List of 1-3 minor candidates weaknesses or areas of improvement"],
  "missing_skills": ["Skills required or highly preferred in the job description that are NOT found in the resume"],
  "ats_score": 85, // Integer from 0 to 100 representing general compatibility with typical ATS rules
  "technical_score": 80, // Integer from 0 to 100 representing match with technical requirements
  "communication_score": 85, // Integer from 0 to 100 estimating communication skills based on tone and wording
  "experience_score": 75, // Integer from 0 to 100 assessing suitability of candidate's career level for the role
  "skill_match_percentage": 78, // Integer from 0 to 100 representing overlap between candidate skills and job description skills
  "final_recommendation": "Highly Recommended", // MUST be exactly one of: "Highly Recommended", "Recommended", "Needs Improvement", "Not Suitable"
  "resume_summary": "A concise professional summary of the candidate's profile relative to the job (2-3 sentences)",
  "suggestions": {{
    "resume_improvements": ["List of actionable changes to improve their resume layout or content"],
    "recommended_courses": ["Specific courses they could take to close skill gaps"],
    "recommended_certifications": ["Certifications that would make them more competitive for this role"],
    "recommended_projects": ["Ideas for side projects to build missing skills"],
    "recommended_technologies": ["Technologies they should learn to improve alignment"]
  }}
}}

Make sure to output ONLY valid JSON.
"""
        
        response = model.generate_content(
            prompt,
            generation_config={"response_mime_type": "application/json"}
        )
        
        # Parse the output
        analysis_data = json.loads(response.text)
        return analysis_data
        
    except Exception as e:
        logger.error(f"Error in Gemini API call: {str(e)}")
        # Fallback to mock data in case of any failures
        return get_mock_analysis_data(resume_text, job_description)
