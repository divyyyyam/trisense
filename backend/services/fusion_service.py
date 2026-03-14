import os
import json
import numpy as np

# In a real scenario, you'd import keras and load models:
# from tensorflow.keras.models import load_model

class FusionService:
    def __init__(self):
        """
        Initializes the service by loading the 3 multimodal keras models.
        """
        self.emotions = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]
        self.num_classes = len(self.emotions)
        
        self.models_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'models')
        
        # Load weights from the models directly here.
        # self.face_model = load_model(os.path.join(self.models_dir, 'face_model.keras'))
        # self.voice_model = load_model(os.path.join(self.models_dir, 'voice_model.keras'))
        # self.text_model = load_model(os.path.join(self.models_dir, 'text_model.keras'))
        
        # Define weights for late fusion [Face, Voice, Text]
        # These weights should sum to 1. Adjust based on validation accuracy of individual models.
        self.fusion_weights = {'face': 0.4, 'voice': 0.3, 'text': 0.3}

    def predict_face(self, processed_data):
        """Mock prediction for face returning softmax probabilities."""
        # return self.face_model.predict(processed_data)[0]
        probs = np.random.dirichlet(np.ones(self.num_classes), size=1)[0]
        return probs

    def predict_voice(self, processed_data):
        """Mock prediction for voice returning softmax probabilities."""
        # return self.voice_model.predict(processed_data)[0]
        probs = np.random.dirichlet(np.ones(self.num_classes), size=1)[0]
        return probs

    def predict_text(self, processed_data):
        """Mock prediction for text returning softmax probabilities."""
        # return self.text_model.predict(processed_data)[0]
        probs = np.random.dirichlet(np.ones(self.num_classes), size=1)[0]
        return probs

    def fuse_predictions(self, probs_dict):
        """
        Performs weighted late fusion on the predictions.
        probs_dict: dict containing arrays for 'face', 'voice', 'text'.
        Only missing modalities are excluded and weights are re-normalized.
        """
        fused_probs = np.zeros(self.num_classes)
        total_weight = 0.0
        
        for modality, probs in probs_dict.items():
            if probs is not None:
                weight = self.fusion_weights.get(modality, 0)
                fused_probs += np.array(probs) * weight
                total_weight += weight
                
        if total_weight > 0:
            fused_probs = fused_probs / total_weight
            
        return fused_probs.tolist()
        
    def format_probs(self, probs):
        """Returns dictionary of emotion names to probabilities."""
        if probs is None: return None
        return {self.emotions[i]: float(probs[i]) for i in range(self.num_classes)}
        
    def _unformat_probs(self, prob_dict):
        """Helper to convert dictionary back to list of floats for fusion."""
        if prob_dict is None: return None
        return [prob_dict[e] for e in self.emotions]
        
    def get_top_emotion(self, fused_probs):
        """Returns string name of highest probability emotion."""
        max_idx = np.argmax(fused_probs)
        return self.emotions[max_idx]
