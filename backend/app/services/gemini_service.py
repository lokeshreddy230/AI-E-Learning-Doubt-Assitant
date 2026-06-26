import json
import logging
from typing import Dict, Any
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
from app.core.config import settings
from fastapi import HTTPException

logger = logging.getLogger(__name__)

# Pydantic schema to strictly enforce the JSON format returned by Gemini
class GeminiResponseSchema(BaseModel):
    subject: str = Field(description="The academic subject this question falls under, such as Mathematics, Science, Programming, English, General Knowledge, or Other.")
    answer: str = Field(description="Detailed, step-by-step answer using student-friendly language.")
    key_points: list[str] = Field(description="A list of key points summarizing the most important takeaways.")
    summary: str = Field(description="A concise summary of the entire answer.")

class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.GEMINI_MODEL_NAME
        
        if not self.api_key:
            logger.warning("GEMINI_API_KEY is not set. AI requests will fail.")
        
        # Initialize the new google-genai client
        self.client = genai.Client(api_key=self.api_key)

    def ask(self, question: str) -> Dict[str, Any]:
        if not self.api_key:
            raise HTTPException(status_code=500, detail="AI service configuration missing.")

        system_instruction = (
            "You are EduAI, an intelligent educational assistant designed to help students learn effectively.\n\n"
            "Rules:\n"
            "1. Use simple and student-friendly language.\n"
            "2. Explain concepts step by step.\n"
            "3. Give practical examples.\n"
            "4. For mathematics:\n"
            "   * Show calculations step by step.\n"
            "5. For programming:\n"
            "   * Include properly formatted code examples.\n"
            "6. For science:\n"
            "   * Provide real-world examples.\n"
            "7. End every answer with:\n"
            "   * Summary\n"
            "   * Key Points\n\n"
            "Your goal is to teach, not just answer."
        )

        prompt = f"Student Question: {question}"

        try:
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    response_mime_type="application/json",
                    response_schema=GeminiResponseSchema,
                    temperature=0.7,
                ),
            )
            
            # The structure is natively guaranteed by the model
            return json.loads(response.text)
            
        except Exception as e:
            logger.error(f"Gemini API Error: {str(e)}")
            raise HTTPException(
                status_code=503, 
                detail="AI service temporarily unavailable. Please try again later."
            )

def get_gemini_service() -> GeminiService:
    return GeminiService()
