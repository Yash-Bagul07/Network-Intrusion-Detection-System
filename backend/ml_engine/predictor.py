import os
import pickle
import numpy as np

# Make sure train module is imported if needed to build model
from . import train

MODEL_PATH = os.path.join(os.path.dirname(__file__), "nids_model.pkl")

class NIDSPredictor:
    def __init__(self):
        self.model = None
        self._load_model()

    def _load_model(self):
        # If the model does not exist yet, trigger training automatically
        if not os.path.exists(MODEL_PATH):
            print(f"Warning: Model not found at {MODEL_PATH}. Generating one now...")
            train.train_model()
            
        with open(MODEL_PATH, "rb") as f:
            self.model = pickle.load(f)

    def predict(self, features: list):
        """
        Takes in a single instance of features:
        [src_port, dst_port, packet_size, flow_duration, num_packets]

        Returns:
            dict containing:
                "prediction": int (0-5)
                "label": string ("Normal", "DDoS", etc)
                "confidence": float (0.0 to 100.0)
        """
        # Ensure it's a 2D array
        X = np.array([features])
        
        # Get raw prediction
        pred = self.model.predict(X)[0]
        
        # Get probabilities
        probas = self.model.predict_proba(X)[0]
        confidence = float(np.max(probas)) * 100.0
        
        return {
            "prediction": int(pred),
            "label": train.INT_TO_LABEL[pred],
            "confidence": round(confidence, 1)
        }

# Singleton instance to be imported by main.py
predictor = NIDSPredictor()
