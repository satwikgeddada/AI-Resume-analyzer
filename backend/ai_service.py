import os
import google.generativeai as genai
import json
from dotenv import load_dotenv

load_dotenv()

class GeminiService:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("Neither GEMINI_API_KEY nor GOOGLE_API_KEY found in environment variables")
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction="You are an expert AI Resume Analyzer and Career Coach. Analyze resumes professionally and provide ATS scoring, strengths, weaknesses, skill analysis, and career recommendations."
        )

    async def analyze_resume(self, resume_text, job_description):
        prompt = f"""
        Analyze the following resume text against the provided Job Description (JD).
        Provide a comprehensive evaluation in JSON format.

        ### JOB DESCRIPTION:
        {job_description}

        ### RESUME TEXT:
        {resume_text}

        ### OUTPUT REQUIREMENTS:
        1. summary: A professional summary (2-3 sentences) tailored to the JD.
        2. ats_score: Integer (0-100) based on JD match.
        3. technical_skills: Object with 'current_skills' (list) and 'missing_skills' (list).
        4. strengths: List of strings (3-5 items).
        5. weaknesses: List of strings (3-5 items).
        6. career_recommendations: Object with 'suggested_roles' (list) and 'certifications' (list).
        7. improvements: List of specific actionable tips to tailor the resume to the JD.
        8. online_presence: Tips for LinkedIn/Portfolio.
        9. hiring_verdict: One of ['Highly Competitive', 'Market Ready', 'Developing', 'Needs Significant Improvement'].
        10. section_scores: Object with scores (0-10) for 'formatting', 'keywords', 'experience_impact', 'clarity'.
        11. skills_balance: Object with scores (0-10) for 'technical', 'leadership', 'communication', 'domain_expertise'.

        Return ONLY valid JSON.
        """
        
        try:
            response = self.model.generate_content(
                prompt,
                generation_config={"response_mime_type": "application/json"}
            )
            return json.loads(response.text)
        except Exception as e:
            print(f"Error in Gemini analysis: {e}")
            return {"error": str(e)}

ai_service = GeminiService()
