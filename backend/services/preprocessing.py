# Mock Preprocessing definitions for Face, Voice, and Text modalities.
# In a full implementation, this uses OpenCV for resizing Face frames,
# Librosa for computing Voice MFCC/Mel-Spectrograms,
# and Keras Tokenizer/Transformers for Text.

def preprocess_video_for_face(file_stream):
    """
    Extracts frames from video, detects face, crops, converts to RGB,
    and resizes to match the Face model input shape (e.g., 224x224x3).
    """
    # mock data return
    return [0.0]

def preprocess_audio(file_stream):
    """
    Extracts audio track, computes Mel-Spectrogram or MFCCs,
    and scales to match Voice model input shape.
    """
    # mock data return
    return [0.0]

def preprocess_text(text_string):
    """
    Tokenizes text input and pads sequence to match Text model input size.
    """
    # mock data return
    return [0.0]
