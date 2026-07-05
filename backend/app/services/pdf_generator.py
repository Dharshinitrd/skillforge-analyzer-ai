import io
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

def clean_text(text):
    """
    Cleans text to be safe for ReportLab PDF rendering.
    """
    if not isinstance(text, str):
        return str(text)
    # Replace common issues
    return text.encode('ascii', 'ignore').decode('ascii')

def generate_pdf_report(analysis_data):
    """
    Generates a professional PDF report from analysis data.
    Returns bytes of the generated PDF.
    """
    buffer = io.BytesIO()
    
    # Page setup
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Define custom palette
    primary_color = colors.HexColor('#6D28D9')   # Purple
    secondary_color = colors.HexColor('#1D4ED8') # Blue
    accent_color = colors.HexColor('#0891B2')    # Cyan
    dark_neutral = colors.HexColor('#1E293B')    # Dark Slate
    light_neutral = colors.HexColor('#F8FAFC')   # Light Slate
    success_color = colors.HexColor('#10B981')   # Green
    warning_color = colors.HexColor('#F59E0B')   # Orange
    danger_color = colors.HexColor('#EF4444')    # Red
    
    # Custom Paragraph Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=primary_color,
        alignment=TA_LEFT
    )
    
    subtitle_style = ParagraphStyle(
        'DocSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#64748B'),
        alignment=TA_LEFT
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=primary_color,
        spaceBefore=12,
        spaceAfter=6,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=14,
        textColor=dark_neutral
    )
    
    body_bold = ParagraphStyle(
        'BodyTextBold',
        parent=body_style,
        fontName='Helvetica-Bold'
    )
    
    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=body_style,
        leftIndent=15,
        firstLineIndent=-10,
        spaceAfter=4
    )
    
    story = []
    
    # ------------------ HEADER ------------------
    story.append(Paragraph("SKILLFORGE AI", title_style))
    story.append(Paragraph("Intelligent Resume Screening Evaluation Report", subtitle_style))
    story.append(Spacer(1, 15))
    
    # Horizontal rule
    hr_table = Table([[""]], colWidths=[532])
    hr_table.setStyle(TableStyle([
        ('LINEABOVE', (0,0), (-1,-1), 2, primary_color),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
        ('TOPPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(hr_table)
    story.append(Spacer(1, 15))
    
    # ------------------ CANDIDATE METADATA & RECOMMENDATION ------------------
    rec_text = clean_text(analysis_data.get("final_recommendation", "N/A"))
    rec_bg = success_color
    if "Highly" in rec_text:
        rec_bg = success_color
    elif "Needs" in rec_text:
        rec_bg = warning_color
    elif "Not" in rec_text:
        rec_bg = danger_color
    else:
        rec_bg = secondary_color
        
    rec_style = ParagraphStyle(
        'RecStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.white,
        alignment=TA_CENTER
    )
    
    meta_data = [
        [
            Paragraph("<b>Candidate Name:</b>", body_style), 
            Paragraph(clean_text(analysis_data.get("candidate_name", "N/A")), body_style),
            Paragraph("<b>Recommendation:</b>", body_style),
            Paragraph(rec_text, rec_style)
        ],
        [
            Paragraph("<b>Email:</b>", body_style), 
            Paragraph(clean_text(analysis_data.get("email", "N/A")), body_style),
            Paragraph("<b>ATS Score:</b>", body_style),
            Paragraph(f"<b>{analysis_data.get('ats_score', 0)} / 100</b>", body_style)
        ],
        [
            Paragraph("<b>Phone:</b>", body_style), 
            Paragraph(clean_text(analysis_data.get("phone", "N/A")), body_style),
            Paragraph("<b>Skill Match:</b>", body_style),
            Paragraph(f"<b>{analysis_data.get('skill_match_percentage', 0)}%</b>", body_style)
        ]
    ]
    
    meta_table = Table(meta_data, colWidths=[110, 160, 110, 152])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), light_neutral),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 10),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.HexColor('#E2E8F0')),
        
        # Color coding the recommendation cell
        ('BACKGROUND', (3,0), (3,0), rec_bg),
        ('TEXTCOLOR', (3,0), (3,0), colors.white),
    ]))
    
    story.append(meta_table)
    story.append(Spacer(1, 15))
    
    # ------------------ PROFILE SUMMARY ------------------
    story.append(Paragraph("Candidate Summary", section_heading))
    story.append(Paragraph(clean_text(analysis_data.get("resume_summary", "No summary provided.")), body_style))
    story.append(Spacer(1, 15))
    
    # ------------------ EVALUATION SCORES ------------------
    story.append(Paragraph("Evaluation Breakdown", section_heading))
    
    score_data = [
        [
            Paragraph("<b>ATS Score</b>", body_style),
            Paragraph("<b>Technical Fit</b>", body_style),
            Paragraph("<b>Skill Match</b>", body_style),
            Paragraph("<b>Experience Fit</b>", body_style),
            Paragraph("<b>Communication</b>", body_style)
        ],
        [
            Paragraph(f"<font size=12 color='{primary_color.hexval()}'><b>{analysis_data.get('ats_score', 0)}%</b></font>", body_style),
            Paragraph(f"<font size=12 color='{secondary_color.hexval()}'><b>{analysis_data.get('technical_score', 0)}%</b></font>", body_style),
            Paragraph(f"<font size=12 color='{accent_color.hexval()}'><b>{analysis_data.get('skill_match_percentage', 0)}%</b></font>", body_style),
            Paragraph(f"<font size=12 color='{dark_neutral.hexval()}'><b>{analysis_data.get('experience_score', 0)}%</b></font>", body_style),
            Paragraph(f"<font size=12 color='{primary_color.hexval()}'><b>{analysis_data.get('communication_score', 0)}%</b></font>", body_style)
        ]
    ]
    
    score_table = Table(score_data, colWidths=[106, 106, 106, 106, 106])
    score_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), light_neutral),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0,0), (-1,-1), 0.25, colors.HexColor('#E2E8F0')),
    ]))
    
    story.append(score_table)
    story.append(Spacer(1, 15))
    
    # ------------------ STRENGTHS, WEAKNESSES, MISSING SKILLS ------------------
    analysis_blocks = []
    
    # Strengths
    analysis_blocks.append(Paragraph("Strengths", section_heading))
    for s in analysis_data.get("strengths", []):
        analysis_blocks.append(Paragraph(f"• {clean_text(s)}", bullet_style))
    analysis_blocks.append(Spacer(1, 10))
    
    # Weaknesses
    analysis_blocks.append(Paragraph("Areas of Improvement", section_heading))
    for w in analysis_data.get("weaknesses", []):
        analysis_blocks.append(Paragraph(f"• {clean_text(w)}", bullet_style))
    analysis_blocks.append(Spacer(1, 10))
    
    # Missing Skills
    analysis_blocks.append(Paragraph("Missing Skills", section_heading))
    missing = analysis_data.get("missing_skills", [])
    if missing:
        analysis_blocks.append(Paragraph(f"<b>Key Gaps Identified:</b> {clean_text(', '.join(missing))}", body_style))
    else:
        analysis_blocks.append(Paragraph("None detected! Candidate matches all major required skills.", body_style))
        
    story.append(KeepTogether(analysis_blocks))
    story.append(Spacer(1, 15))
    
    # ------------------ SUGGESTIONS & ROADMAP ------------------
    sug_blocks = []
    sug_blocks.append(Paragraph("AI Recommendations & Learning Roadmap", section_heading))
    
    suggestions_dict = analysis_data.get("suggestions", {})
    
    # Resume Improvements
    improvements = suggestions_dict.get("resume_improvements", [])
    if improvements:
        sug_blocks.append(Paragraph("<b>Resume Enhancements:</b>", body_bold))
        for imp in improvements:
            sug_blocks.append(Paragraph(f"• {clean_text(imp)}", bullet_style))
        sug_blocks.append(Spacer(1, 6))
        
    # Certifications & Courses
    certs = suggestions_dict.get("recommended_certifications", [])
    courses = suggestions_dict.get("recommended_courses", [])
    if certs or courses:
        sug_blocks.append(Paragraph("<b>Recommended Education & Credentials:</b>", body_bold))
        for c in certs + courses:
            sug_blocks.append(Paragraph(f"• {clean_text(c)}", bullet_style))
        sug_blocks.append(Spacer(1, 6))
        
    # Suggested Side Projects / Tech to learn
    projs = suggestions_dict.get("recommended_projects", [])
    techs = suggestions_dict.get("recommended_technologies", [])
    if projs or techs:
        sug_blocks.append(Paragraph("<b>Recommended Skills & Projects to Build:</b>", body_bold))
        for p in projs:
            sug_blocks.append(Paragraph(f"• Project: {clean_text(p)}", bullet_style))
        if techs:
            sug_blocks.append(Paragraph(f"• Technologies to study: {clean_text(', '.join(techs))}", bullet_style))
            
    story.append(KeepTogether(sug_blocks))
    
    # Build Document
    doc.build(story)
    
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
