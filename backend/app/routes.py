from flask import Blueprint, request, jsonify, send_file
import io
import logging
from app.services.parser import extract_text
from app.services.gemini import analyze_resume_with_gemini
from app.services.pdf_generator import generate_pdf_report
from app.database import save_resume, get_resume, save_analysis, get_analysis

logger = logging.getLogger(__name__)
api_bp = Blueprint('api', __name__)

@api_bp.route('/upload', methods=['POST'])
def upload_resume():
    """
    Endpoint to upload a PDF/DOCX resume and extract its text content.
    Returns: resume_id, filename, and parsed character count.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected for uploading"}), 400
        
    if not (file.filename.lower().endswith('.pdf') or file.filename.lower().endswith('.docx')):
        return jsonify({"error": "Unsupported file type. Only PDF and DOCX files are allowed."}), 400
        
    try:
        filename = file.filename
        file_bytes = file.read()
        
        # Extract text content
        extracted_text = extract_text(filename, file_bytes)
        
        if not extracted_text.strip():
            return jsonify({"error": "Could not extract any readable text from the document. Please check the file content."}), 400
            
        # Save to database
        resume_id = save_resume(filename, extracted_text)
        
        return jsonify({
            "message": "Resume uploaded and parsed successfully",
            "resume_id": resume_id,
            "filename": filename,
            "text_length": len(extracted_text)
        }), 201
        
    except ValueError as ve:
        logger.error(f"Validation error during upload: {str(ve)}")
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        logger.error(f"Unexpected error during upload: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@api_bp.route('/analyze', methods=['POST'])
def analyze_resume():
    """
    Endpoint to evaluate a resume against a job description using Gemini AI.
    Returns: JSON formatted full resume analysis.
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "Request body must be JSON"}), 400
        
    resume_id = data.get("resume_id")
    job_description = data.get("job_description")
    
    if not resume_id:
        return jsonify({"error": "resume_id is required"}), 400
    if not job_description or not job_description.strip():
        return jsonify({"error": "job_description is required"}), 400
        
    try:
        # Fetch resume text from SQLite
        resume = get_resume(resume_id)
        if not resume:
            return jsonify({"error": f"Resume with ID {resume_id} not found"}), 444
            
        # Run Gemini analysis (with mock data fallback if API key is not present)
        analysis_data = analyze_resume_with_gemini(resume["content"], job_description)
        
        # Save analysis to SQLite database
        analysis_id = save_analysis(resume_id, job_description, analysis_data)
        
        # Append database IDs to payload
        analysis_data["id"] = analysis_id
        analysis_data["resume_id"] = resume_id
        
        return jsonify(analysis_data), 200
        
    except Exception as e:
        logger.error(f"Error during analysis: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500

@api_bp.route('/report', methods=['GET'])
def get_report():
    """
    Endpoint to download a professional PDF evaluation report.
    Returns: PDF file bytes.
    """
    analysis_id = request.args.get('analysis_id')
    if not analysis_id:
        return jsonify({"error": "analysis_id query parameter is required"}), 400
        
    try:
        # Fetch structured analysis from database
        analysis_data = get_analysis(analysis_id)
        if not analysis_data:
            return jsonify({"error": f"Analysis with ID {analysis_id} not found"}), 444
            
        # Generate the PDF file bytes
        pdf_bytes = generate_pdf_report(analysis_data)
        
        # Clean candidate name for file downloading
        candidate_name = analysis_data.get("candidate_name", "Candidate").replace(" ", "_")
        report_filename = f"SkillForge_Report_{candidate_name}.pdf"
        
        return send_file(
            io.BytesIO(pdf_bytes),
            mimetype='application/pdf',
            as_attachment=True,
            download_name=report_filename
        )
        
    except Exception as e:
        logger.error(f"Error generating PDF report: {str(e)}")
        return jsonify({"error": f"Internal server error: {str(e)}"}), 500
