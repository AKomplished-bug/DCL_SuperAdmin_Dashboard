from fastapi import FastAPI, File, UploadFile, HTTPException
from loguru import logger
from typing import Optional
import requests
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables (you can define SARVAM_API_KEY in a .env file)
load_dotenv()

app = FastAPI()

# API configuration
SARVAM_URL = "https://api.sarvam.ai/speech-to-text-translate"
SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")

if not SARVAM_API_KEY:
    logger.error("SARVAM_API_KEY not found in environment variables.")
    raise RuntimeError("Missing SARVAM_API_KEY. Please set it in your environment or .env file.")

# Log service start
logger.info("🚀 Sarvam Speech-to-Text Translate microservice is up.")

@app.post("/speech-to-text-translate")
async def speech_to_text_translate(
    audio: UploadFile = File(...),
    prompt: Optional[str] = None,
    with_diarization: bool = False,
    num_speakers: Optional[int] = None,
    model: str = "saaras:v2"
):
    """
    Receives an audio file and forwards it to Sarvam's Speech-to-Text Translate API.
    """
    try:
        logger.info(f"📥 Received audio file: {audio.filename}")
        audio_bytes = await audio.read()

        # Prepare multipart-form data
        files = {
            "file": (audio.filename, audio_bytes, audio.content_type),
            "model": (None, model),
            "with_diarization": (None, str(with_diarization).lower())
        }

        if prompt:
            files["prompt"] = (None, prompt)

        if with_diarization and num_speakers is not None:
            files["num_speakers"] = (None, str(num_speakers))

        headers = {
            "api-subscription-key": SARVAM_API_KEY
        }

        logger.debug("📤 Sending request to Sarvam API...")
        response = requests.post(SARVAM_URL, files=files, headers=headers)

        logger.debug(f"📡 Sarvam responded with status {response.status_code}")
        if response.status_code != 200:
            logger.error(f"❌ Error from Sarvam API: {response.text}")
            raise HTTPException(status_code=response.status_code, detail=response.text)

        json_response = response.json()
        logger.info(f"✅ Transcription success. Language: {json_response.get('language_code')}")

        return json_response

    except Exception as e:
        logger.exception("💥 An error occurred during transcription.")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
