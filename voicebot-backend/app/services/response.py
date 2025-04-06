from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv
from loguru import logger
from groq import Groq
import os
import uvicorn

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    logger.error("Missing GROQ_API_KEY in environment.")
    raise RuntimeError("Missing GROQ_API_KEY")

# Initialize FastAPI app
app = FastAPI()

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)

# Log service start
logger.info("🚨 LLaMA 4 Disaster Call Center service (Kerala) is running on port 8001.")

# Request schema
class TextInput(BaseModel):
    input_text: str

@app.post("/generate-response")
def generate_response_and_emotion(request: TextInput):
    input_text = request.input_text
    logger.info(f"🧠 Received input text: {input_text}")

    try:
        # Step 1: Generate Response from LLaMA 4
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI assistant working in a real-time emergency disaster response call center based in Kerala, India. "
                        "You are the official emergency helpline, so never ask the caller to contact police, fire, ambulance, or dial 911. "
                        "You must give clear and calm safety instructions, ask immediate follow-up questions, and reassure the person in crisis. "
                        "Use simple, Indian English. Always assume you're the first point of help. "
                        "Ask for their current location, if they are in immediate danger, and if others are with them. "
                        "Never redirect to any other services — you are the official emergency contact."
                    )
                },
                {
                    "role": "user",
                    "content": f"A caller said: '{input_text}'. Give a response as an empathetic Kerala-based emergency helpline agent."
                }
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            stream=False,
        )

        generated_response = chat_completion.choices[0].message.content.strip()
        logger.success("✅ Generated LLaMA 4 response.")

        # Step 2: Infer Emotion Label in disaster context
        emotion_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI that detects the emotion of a person calling a Kerala-based disaster helpline. "
                        "Return the dominant emotion in **one word only** from this list: "
                        "calm, confused, urgent, panicked, scared, distressed, angry, hopeless, sad, uncertain."
                    )
                },
                {
                    "role": "user",
                    "content": f"Identify the dominant emotion in this caller's message: '{input_text}'"
                }
            ],
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            stream=False,
        )

        emotion = emotion_completion.choices[0].message.content.strip().lower()
        logger.success(f"🎭 Detected emotion: {emotion}")

        return {
            "response_text": generated_response,
            "emotion": emotion
        }

    except Exception as e:
        logger.exception("💥 Error during LLaMA 4 response generation.")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("llama_service:app", host="0.0.0.0", port=8001, reload=True)
