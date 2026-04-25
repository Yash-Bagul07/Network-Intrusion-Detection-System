from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
from datetime import datetime
from api.auth_routes import router as auth_router
from ml_engine.predictor import predictor

app = FastAPI(title="Real-Time NIDS Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")

# In-memory storage for mock data later
alerts = []
stats = {"packets_per_sec": 0, "active_flows": 0, "attack_rate": 0}
flows = []

# WebSocket connections tracking
active_connections: list[WebSocket] = []

@app.on_event("startup")
async def startup_event():
    print("Starting NIDS Backend...")
    # Fire up the mock generator thread
    asyncio.create_task(mock_traffic_generator())

async def mock_traffic_generator():
    import random
    import numpy as np
    ips = ["192.168.1.100", "10.0.0.5", "172.16.0.8", "8.8.8.8", "45.33.32.156", "104.22.4.11", "114.114.114.114", "9.9.9.9"]
    
    while True:
        await asyncio.sleep(random.uniform(0.5, 2.0)) 
        
        # We simulate dynamic realtime traffic features natively
        src_port = random.randint(1024, 65535)
        dst_port = random.choice([80, 443, 22, 53, 8080] + [random.randint(1024, 65535)] * 5)
        
        # Make stats dynamic depending on what kind of traffic is simulated
        # Sometimes throw huge spikes to test model detection capabilities
        if random.random() < 0.2:
            packet_size = int(np.random.normal(1200, 200))
            flow_duration = max(0.01, np.random.normal(0.5, 0.2))
            num_packets = int(np.random.normal(5000, 1000))
        else:
            packet_size = int(np.random.normal(500, 200))
            flow_duration = max(0.1, np.random.normal(5.0, 2.0))
            num_packets = int(np.random.normal(20, 10))
            
        features = [src_port, dst_port, max(1, packet_size), max(0.001, flow_duration), max(1, num_packets)]
        
        # Perform machine learning prediction
        prediction_result = predictor.predict(features)
        
        # Update system stats based on simulated features
        stats["packets_per_sec"] = num_packets * 10
        stats["active_flows"] = random.randint(100, 800)
        await broadcast_alert({"type": "stats", "data": stats})

        # Generate alert only if the ML model classifies it as an attack (prediction > 0)
        if prediction_result["prediction"] > 0:
            attack_type = prediction_result["label"]
            confidence = prediction_result["confidence"]
            
            # Compute severity dynamically
            if confidence > 95.0 or num_packets > 1000:
                severity = "CRITICAL"
            elif confidence > 85.0:
                severity = "HIGH"
            else:
                severity = "MEDIUM"
                
            alert = {
                "timestamp": datetime.utcnow().isoformat(),
                "src_ip": random.choice(ips),
                "dst_ip": random.choice(ips),
                "type": attack_type,
                "severity": severity,
                "confidence": confidence,
                "features": {
                    "src_port": src_port,
                    "dst_port": dst_port,
                    "packet_size": packet_size
                }
            }
            alerts.append(alert)
            await broadcast_alert({"type": "alert", "data": alert})


@app.get("/api/stats")
async def get_stats():
    return stats

@app.get("/api/alerts")
async def get_alerts():
    return {"alerts": alerts[-100:]}

@app.get("/api/flows")
async def get_flows():
    return {"flows": flows[-200:]}

@app.post("/api/model/retrain")
async def retrain_model():
    try:
        from ml_engine.train import train_model
        train_model()
        predictor._load_model() # Reload with new weights
        return {"status": "Model retrained successfully"}
    except Exception as e:
        return {"status": f"Error during retraining: {str(e)}"}

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            # We'll expect the client to just listen, but we can receive ping/pong heartbeat
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

async def broadcast_alert(alert_data: dict):
    for connection in active_connections:
        try:
            await connection.send_json(alert_data)
        except Exception:
            pass
