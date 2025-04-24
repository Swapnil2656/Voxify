"""
Fixed FastAPI backend for PolyLingo AI enhancement features.
"""
import os
import time
import httpx
import json
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict
from dotenv import load_dotenv
from updated_prompts import *

# Import authentication modules
from auth_routes import router as auth_router
from auth import get_current_active_user, User

# Load environment variables
load_dotenv()

# Create FastAPI app
app = FastAPI(
    title="PolyLingo Fixed Backend",
    description="Fixed backend for PolyLingo AI enhancement features",
    version="1.0.0",
)

# Include authentication router
app.include_router(auth_router, prefix="/auth", tags=["authentication"])

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request models
class TextTranslationRequest(BaseModel):
    text: str
    targetLanguage: str
    sourceLanguage: Optional[str] = "auto"
    aiEnhance: Optional[bool] = True

class ChatMessage(BaseModel):
    text: str
    speaker: str
    language: Optional[str] = "en"

class ChatTranslationRequest(BaseModel):
    message: str
    conversationHistory: Optional[List[ChatMessage]] = []
    sourceLanguage: Optional[str] = "auto"
    targetLanguage: str
    aiEnhance: Optional[bool] = True

class LearningRequest(BaseModel):
    text: str
    userLanguage: str
    targetLanguage: str
    proficiencyLevel: Optional[str] = "intermediate"  # beginner, intermediate, advanced
    focusArea: Optional[str] = "general"  # grammar, vocabulary, idioms, general

class SentimentAnalysisRequest(BaseModel):
    messages: List[ChatMessage]
    analyzeFor: Optional[List[str]] = ["sentiment"]  # sentiment, formality, engagement, cultural

class ExerciseRequest(BaseModel):
    text: str
    targetLanguage: str
    proficiencyLevel: Optional[str] = "intermediate"  # beginner, intermediate, advanced
    exerciseType: Optional[str] = "mixed"  # vocabulary, grammar, comprehension, mixed

# Helper function to safely call Groq API
async def call_groq_api(prompt, system_message, timeout=15):
    """
    Helper function to safely call Groq API with error handling.

    Args:
        prompt: The prompt to send to the API
        system_message: The system message to use
        timeout: Timeout in seconds

    Returns:
        API response or error message
    """
    try:
        headers = {
            "Authorization": f"Bearer {os.getenv('GROQ_API_KEY')}",
            "Content-Type": "application/json"
        }
        payload = {
            "model": "llama3-8b-8192",
            "messages": [
                {"role": "system", "content": system_message},
                {"role": "user", "content": prompt}
            ]
        }

        # Log the API request for debugging
        print(f"Calling Groq API with prompt: {prompt[:100]}...")

        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                headers=headers,
                json=payload
            )
            data = response.json()

            # Log raw response for debugging
            print(f"Groq API Raw Response: {data}")

            # Add defensive code to check response structure
            if "choices" in data and data["choices"] and "message" in data["choices"][0] and "content" in data["choices"][0]["message"]:
                content = data["choices"][0]["message"]["content"].strip()
                return {"success": True, "content": content}
            else:
                print("⚠️ Unexpected API response structure")
                return {"success": False, "error": "Invalid API response structure", "raw": str(data)}
    except Exception as e:
        print(f"API Call Error: {e}")
        return {"success": False, "error": str(e)}

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "healthy", "api_key_configured": bool(os.getenv('GROQ_API_KEY'))}

# Language learning suggestions function
async def generate_learning_suggestions(text: str, user_lang: str, target_lang: str, proficiency: str, focus: str) -> dict:
    """
    Generate personalized language learning suggestions based on the text.

    Args:
        text: Text to analyze
        user_lang: User's native language
        target_lang: Language being learned
        proficiency: User's proficiency level
        focus: Area to focus on

    Returns:
        Dictionary with learning suggestions
    """
    try:
        # Select the appropriate prompt template based on focus area
        if focus == "grammar":
            prompt = GRAMMAR_PROMPT.format(text=text, proficiency=proficiency, user_lang=user_lang, target_lang=target_lang)
        elif focus == "vocabulary":
            prompt = VOCABULARY_PROMPT.format(text=text, proficiency=proficiency, user_lang=user_lang, target_lang=target_lang)
        elif focus == "idioms":
            prompt = IDIOMS_PROMPT.format(text=text, proficiency=proficiency, user_lang=user_lang, target_lang=target_lang)
        else:  # general
            prompt = GENERAL_PROMPT.format(text=text, proficiency=proficiency, user_lang=user_lang, target_lang=target_lang)

        system_message = "You are an AI language tutor. Provide helpful, accurate language learning insights formatted as JSON."

        # Call the Groq API
        result = await call_groq_api(prompt, system_message)

        if result["success"]:
            # Try to parse as JSON, but return as text if parsing fails
            try:
                parsed_suggestions = json.loads(result["content"])
                return parsed_suggestions
            except json.JSONDecodeError as json_err:
                print(f"⚠️ JSON parsing failed in learning suggestions: {json_err}")
                # If JSON parsing fails, return as raw text
                return {"raw": result["content"], "error": "Failed to parse JSON response"}
        else:
            return {"error": result["error"], "raw": result.get("raw", "")}

    except Exception as e:
        print(f"Learning Suggestions Error: {e}")
        return {"error": str(e)}

# Language learning endpoint
@app.post("/learning-suggestions")
async def learning_suggestions(req: LearningRequest):
    """
    Generate personalized language learning suggestions.

    Args:
        req: Request containing text and learning parameters

    Returns:
        Learning suggestions
    """
    if not req.text:
        raise HTTPException(status_code=400, detail="Text is required.")

    start_time = time.time()

    # Generate learning suggestions
    suggestions = await generate_learning_suggestions(
        req.text,
        req.userLanguage,
        req.targetLanguage,
        req.proficiencyLevel,
        req.focusArea
    )

    # Calculate processing time
    processing_time = round((time.time() - start_time) * 1000)

    # Return suggestions
    return {
        "success": True,
        "text": req.text,
        "suggestions": suggestions,
        "userLanguage": req.userLanguage,
        "targetLanguage": req.targetLanguage,
        "proficiencyLevel": req.proficiencyLevel,
        "focusArea": req.focusArea,
        "processingTimeMs": processing_time
    }

# Exercise generation function
async def generate_exercises(text: str, target_lang: str, proficiency: str, exercise_type: str) -> dict:
    """
    Generate language learning exercises based on the text.

    Args:
        text: Text to base exercises on
        target_lang: Target language
        proficiency: User's proficiency level
        exercise_type: Type of exercises to generate

    Returns:
        Dictionary with exercises
    """
    try:
        # Create a prompt based on the exercise type and proficiency
        prompt = EXERCISE_GENERATOR_PROMPT.format(
            user_input=text,
            proficiency_level=proficiency,
            focus_area=f"{target_lang} {exercise_type}"
        )

        system_message = "You are an AI language exercise creator. Generate engaging, appropriate exercises formatted as JSON."

        # Call the Groq API
        result = await call_groq_api(prompt, system_message)

        if result["success"]:
            # Try to parse as JSON, but return as text if parsing fails
            try:
                parsed_exercises = json.loads(result["content"])
                return parsed_exercises
            except json.JSONDecodeError as json_err:
                print(f"⚠️ JSON parsing failed in exercise generation: {json_err}")
                # If JSON parsing fails, return as raw text
                return {"raw": result["content"], "error": "Failed to parse JSON response"}
        else:
            return {"error": result["error"], "raw": result.get("raw", "")}

    except Exception as e:
        print(f"Exercise Generation Error: {e}")
        return {"error": str(e)}

# Exercise generation endpoint
@app.post("/generate-exercises")
async def generate_exercises_endpoint(req: ExerciseRequest):
    """
    Generate language learning exercises.

    Args:
        req: Request containing text and exercise parameters

    Returns:
        Generated exercises
    """
    if not req.text:
        raise HTTPException(status_code=400, detail="Text is required.")

    start_time = time.time()

    # Generate exercises
    exercises = await generate_exercises(
        req.text,
        req.targetLanguage,
        req.proficiencyLevel,
        req.exerciseType
    )

    # Calculate processing time
    processing_time = round((time.time() - start_time) * 1000)

    # Return exercises
    return {
        "success": True,
        "text": req.text,
        "exercises": exercises,
        "targetLanguage": req.targetLanguage,
        "proficiencyLevel": req.proficiencyLevel,
        "exerciseType": req.exerciseType,
        "processingTimeMs": processing_time
    }

# Conversation analysis function
async def analyze_conversation(messages: List[ChatMessage], analyze_for: List[str]) -> dict:
    """
    Analyze conversation for sentiment, formality, engagement, and cultural aspects.

    Args:
        messages: List of chat messages
        analyze_for: List of aspects to analyze

    Returns:
        Dictionary with analysis results
    """
    try:
        # Format the conversation for analysis
        conversation_text = "\n".join([f"Speaker {msg.speaker} ({msg.language}): {msg.text}" for msg in messages])

        # Create a customized prompt based on what to analyze for
        analysis_aspects = ", ".join(analyze_for)
        prompt = f"Analyze this conversation for {analysis_aspects}: {conversation_text}"

        system_message = "You are an AI conversation analyst. Provide detailed, accurate analysis of conversations formatted as JSON."

        # Call the Groq API
        result = await call_groq_api(prompt, system_message)

        if result["success"]:
            # Try to parse as JSON, but return as text if parsing fails
            try:
                parsed_analysis = json.loads(result["content"])
                return parsed_analysis
            except json.JSONDecodeError as json_err:
                print(f"⚠️ JSON parsing failed in conversation analysis: {json_err}")
                # If JSON parsing fails, return as raw text
                return {"raw": result["content"], "error": "Failed to parse JSON response"}
        else:
            return {"error": result["error"], "raw": result.get("raw", "")}

    except Exception as e:
        print(f"Conversation Analysis Error: {e}")
        return {"error": str(e)}

# Conversation analysis endpoint
@app.post("/analyze-conversation")
async def analyze_conversation_endpoint(req: SentimentAnalysisRequest):
    """
    Analyze conversation for various aspects.

    Args:
        req: Request containing messages and analysis parameters

    Returns:
        Analysis results
    """
    if not req.messages or len(req.messages) == 0:
        raise HTTPException(status_code=400, detail="Messages are required.")

    start_time = time.time()

    # Analyze conversation
    analysis = await analyze_conversation(
        req.messages,
        req.analyzeFor
    )

    # Calculate processing time
    processing_time = round((time.time() - start_time) * 1000)

    # Return analysis
    return {
        "success": True,
        "messageCount": len(req.messages),
        "analysis": analysis,
        "analyzedFor": req.analyzeFor,
        "processingTimeMs": processing_time
    }

# Run the application
if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8001))
    host = os.getenv("HOST", "0.0.0.0")

    print(f"Starting PolyLingo Fixed Backend on {host}:{port}")
    uvicorn.run(app, host=host, port=port)
