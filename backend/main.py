from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import json

from services.fusion_service import FusionService
from services.preprocessing import preprocess_video_for_face, preprocess_audio, preprocess_text

app = FastAPI(title="Trisense Emotion Sensing API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

fusion_service = FusionService()

@app.get("/")
def read_root():
    return {"message": "Trisense Emotion Sensing API is running. Upload to /analyze"}

@app.post("/analyze")
async def analyze_emotions(
    video: Optional[UploadFile] = File(None),
    audio: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    """
    Main endpoint for analyzing multi-modal emotion data.
    Accepts video or audio files and text input.
    """
    results = {}
    
    try:
        # Process and predict text
        if text:
            text_data = preprocess_text(text)
            text_probs = fusion_service.predict_text(text_data)
            results['text'] = fusion_service.format_probs(text_probs)
            
        # For simplicity in this example, we mock the file processing since
        # full multimedia processing requires FFmpeg/Librosa in the environment
        if video:
            video_data = preprocess_video_for_face(video.file)
            face_probs = fusion_service.predict_face(video_data)
            results['face'] = fusion_service.format_probs(face_probs)
            
            # Extract audio from video if needed
            audio_data = preprocess_audio(video.file)
            voice_probs = fusion_service.predict_voice(audio_data)
            results['voice'] = fusion_service.format_probs(voice_probs)
            
        elif audio:
            audio_data = preprocess_audio(audio.file)
            voice_probs = fusion_service.predict_voice(audio_data)
            results['voice'] = fusion_service.format_probs(voice_probs)

        # Apply late fusion
        # Map the dictionary results back to arrays for fusion
        probs_matrix = {
            'face': fusion_service._unformat_probs(results.get('face')),
            'voice': fusion_service._unformat_probs(results.get('voice')),
            'text': fusion_service._unformat_probs(results.get('text'))
        }
        
        fused_probs = fusion_service.fuse_predictions(probs_matrix)
        results['fused'] = fusion_service.format_probs(fused_probs)
        results['overall_emotion'] = fusion_service.get_top_emotion(fused_probs)

        return results
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
