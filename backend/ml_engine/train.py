import os
import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split

MODEL_PATH = os.path.join(os.path.dirname(__file__), "nids_model.pkl")

# Classes
INT_TO_LABEL = {
    0: "Normal",
    1: "DDoS",
    2: "Port Scan",
    3: "SQL Injection",
    4: "Brute Force",
    5: "Botnet"
}
LABEL_TO_INT = {v: k for k, v in INT_TO_LABEL.items()}

def generate_synthetic_data(num_samples=10000):
    """
    Generate synthetic network features:
    [src_port, dst_port, packet_size, flow_duration, num_packets]
    """
    X = []
    y = []

    for _ in range(num_samples):
        # 50% normal, 50% attacks
        if np.random.rand() > 0.5:
            # Normal traffic: web browsing, etc.
            src_port = np.random.randint(1024, 65535)
            dst_port = np.random.choice([80, 443, 53, 22])
            packet_size = int(np.random.normal(500, 200))
            flow_duration = max(0.1, np.random.normal(5.0, 2.0))
            num_packets = int(np.random.normal(20, 10))
            y.append(0)
        else:
            attack_type = np.random.randint(1, 6)
            if attack_type == 1: # DDoS
                src_port = np.random.randint(1024, 65535)
                dst_port = np.random.choice([80, 443])
                packet_size = int(np.random.normal(1200, 100))
                flow_duration = max(0.01, np.random.normal(0.5, 0.2))
                num_packets = int(np.random.normal(5000, 1000))
            elif attack_type == 2: # Port Scan
                src_port = np.random.randint(1024, 65535)
                dst_port = np.random.randint(1, 1024)
                packet_size = int(np.random.normal(60, 10))
                flow_duration = max(0.001, np.random.normal(0.1, 0.05))
                num_packets = int(np.random.normal(3, 1))
            elif attack_type == 3: # SQL Injection
                src_port = np.random.randint(1024, 65535)
                dst_port = np.random.choice([80, 443])
                packet_size = int(np.random.normal(800, 150))
                flow_duration = max(0.5, np.random.normal(2.0, 1.0))
                num_packets = int(np.random.normal(15, 5))
            elif attack_type == 4: # Brute Force
                src_port = np.random.randint(1024, 65535)
                dst_port = 22
                packet_size = int(np.random.normal(150, 30))
                flow_duration = max(1.0, np.random.normal(10.0, 5.0))
                num_packets = int(np.random.normal(50, 20))
            else: # Botnet
                src_port = np.random.randint(1024, 65535)
                dst_port = np.random.choice([6667, 8080])
                packet_size = int(np.random.normal(300, 50))
                flow_duration = max(10.0, np.random.normal(3600.0, 600.0))
                num_packets = int(np.random.normal(100, 30))
            
            y.append(attack_type)
        
        # Ensure positive features
        X.append([src_port, dst_port, max(1, packet_size), max(0.001, flow_duration), max(1, num_packets)])

    return np.array(X), np.array(y)


def train_model():
    print("Generating synthetic network data...")
    X, y = generate_synthetic_data(10000)
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training Random Forest Classifier model...")
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    
    print("Evaluating model...")
    y_pred = clf.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"Model Accuracy: {accuracy:.4f}")
    target_names = [INT_TO_LABEL[i] for i in range(6)]
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=target_names))
    
    print(f"Saving model to {MODEL_PATH}...")
    with open(MODEL_PATH, "wb") as f:
        pickle.dump(clf, f)
    
    print("Training complete! Model saved successfully.")

if __name__ == "__main__":
    train_model()
