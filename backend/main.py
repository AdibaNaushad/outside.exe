from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
# import ollama
import json

import google.generativeai as genai
import os

app = FastAPI()

# Allow React to talk to this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# UPDATE 2: Initialize Google AI Studio using the environment variable
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

# Use the Gemma 2 2B model hosted directly on Google AI Studio
model = genai.GenerativeModel('gemma-2-2b-it')

# 1. Define what data we expect from React
class QuestPreferences(BaseModel):
    mood: str
    energy: str
    time: str



@app.post("/api/quest")
async def generate_quest(req: QuestRequest):
    prompt = f"""
    Write a short real-world side quest for someone who is feeling {req.mood}, has {req.energy} energy, and has {req.time}.
    You MUST output ONLY valid JSON.
    Format: {{"title": "Quest Name", "description": "Short description", "steps": ["step 1", "step 2"], "xp": 25}}
    """
    
    # UPDATE 3: Call the API and force it to return clean JSON
    response = model.generate_content(
        prompt,
        generation_config={"response_mime_type": "application/json"}
    )
    
    # Return the parsed JSON back to React
    return json.loads(response.text)



# 2. Define the fallback quest in case the AI fails
FALLBACK_QUEST = {
    "title": "The Cloud Watcher",
    "description": "Take a tiny break and look up.",
    "steps": [
        "Go to a window or step outside.",
        "Find a cloud with an interesting shape.",
        "Take three deep breaths."
    ],
    "xp": 10
}

@app.post("/api/generate-quest")
def generate_quest(prefs: QuestPreferences):
    # 3. Build the strict prompt for Gemma
    prompt = f"""
    You are a cozy quest generator. Generate a small, safe, real-world activity.
    User Preferences: Mood={prefs.mood}, Energy={prefs.energy}, Time={prefs.time} minutes.
    
    Output strictly in JSON format. Do not include markdown formatting or conversational text.
    Use this exact structure:
    {{
        "title": "Short catchy title",
        "description": "One sentence explaining the vibe.",
        "steps": ["Step 1", "Step 2", "Step 3"],
        "xp": 20
    }}
    """
    
    try:
        # 4. Ask Ollama to generate the response
        response = ollama.chat(model='gemma:2b', messages=[
            {'role': 'user', 'content': prompt}
        ], format='json')
        
        # 5. Parse the AI's string response into an actual Python dictionary
        quest_data = json.loads(response['message']['content'])
        return quest_data

    except json.JSONDecodeError:
        # If Gemma outputs bad JSON, don't crash the app. Return the fallback.
        print("Error: Gemma returned malformed JSON.")
        return FALLBACK_QUEST
        
    except Exception as e:
        # If Ollama is off or crashes, return the fallback.
        print(f"Error communicating with Ollama: {e}")
        return FALLBACK_QUEST