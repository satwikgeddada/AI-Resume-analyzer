from ai_service import ai_service
from resume_parser import parse_resume
import os

class ResumeAnalyzer:
    async def analyze(self, file_path, job_description):
        # 1. Extract text
        try:
            resume_text = parse_resume(file_path)
        except Exception as e:
            return {"error": f"Technical error during file parsing: {str(e)}"}

        if not resume_text:
            return {"error": "The uploaded resume appears to be empty or unreadable."}
        
        # 2. Get AI analysis
        try:
            analysis = await ai_service.analyze_resume(resume_text, job_description)
            
            if not analysis or "error" in analysis:
                return {"error": analysis.get("error", "AI Analysis timed out or failed.")}
                
            return analysis
        except Exception as e:
            return {"error": f"AI Service error: {str(e)}"}

analyzer = ResumeAnalyzer()
