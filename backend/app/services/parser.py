import io
import PyPDF2
import docx

def extract_text_from_pdf(file_bytes):
    """
    Extracts text from PDF file bytes using PyPDF2.
    """
    try:
        pdf_file = io.BytesIO(file_bytes)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page_num in range(len(reader.pages)):
            page = reader.pages[page_num]
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        return text.strip()
    except Exception as e:
        raise ValueError(f"Error parsing PDF file: {str(e)}")

def extract_text_from_docx(file_bytes):
    """
    Extracts text from DOCX file bytes using python-docx.
    """
    try:
        docx_file = io.BytesIO(file_bytes)
        doc = docx.Document(docx_file)
        text = []
        for paragraph in doc.paragraphs:
            text.append(paragraph.text)
        return "\n".join(text).strip()
    except Exception as e:
        raise ValueError(f"Error parsing DOCX file: {str(e)}")

def extract_text(filename, file_bytes):
    """
    Extracts text based on the file extension.
    """
    lower_filename = filename.lower()
    if lower_filename.endswith('.pdf'):
        return extract_text_from_pdf(file_bytes)
    elif lower_filename.endswith('.docx'):
        return extract_text_from_docx(file_bytes)
    else:
        raise ValueError("Unsupported file type. Only PDF and DOCX are supported.")
