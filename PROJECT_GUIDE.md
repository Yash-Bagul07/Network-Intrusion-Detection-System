# Network Intrusion Detection System (NIDS) - Detailed Project Explanation

This document is prepared for project presentation and guide discussion.

- GitHub Repository: [Network-Intrusion-Detection-System](https://github.com/Yash-Bagul07/Network-Intrusion-Detection-System)
- Live Deployment: [NIDS Live App](https://network-intrusion-detection-system-5yd5.onrender.com/)

## 1) Project Objective

The aim of this project is to detect malicious network behavior using Machine Learning and show threat insights in a live web dashboard.

The system combines:
- a **FastAPI backend** for APIs, authentication, and streaming,
- a **Machine Learning engine** for attack classification,
- and a **React frontend** for real-time visualization.

In simple terms: network-like traffic is converted into features, passed to an ML model, and the prediction is instantly shown to the user through live UI updates.

## 2) Problem Statement and Motivation

Traditional static security checks often miss fast, evolving attack patterns. Network monitoring tools can generate too much raw data for manual analysis. This project addresses that by:
- converting traffic behavior into model features,
- classifying potential intrusions automatically,
- and presenting actionable alerts in real time.

## 3) High-Level Architecture

The architecture has three major layers:

1. **Frontend (React + Vite)**  
   Shows dashboards, charts, and threat feeds; consumes REST + WebSocket data.

2. **Backend (FastAPI)**  
   Manages user auth, serves APIs, runs the real-time event loop, and pushes live updates via WebSocket.

3. **ML Engine (Scikit-learn model)**  
   Trains and serves a multiclass classifier to label traffic as normal or attack type.

Data flow:
- traffic feature vector generated -> model prediction -> severity logic -> alert object -> broadcast to connected clients.

## 4) Tech Stack Used

### Frontend
- React 19
- Vite
- React Router
- Axios
- react-use-websocket
- Recharts
- Lucide icons
- Tailwind CSS ecosystem

### Backend
- FastAPI
- Uvicorn
- AsyncIO + WebSockets
- Pydantic
- python-jose (JWT)
- passlib + bcrypt (password hashing)
- Motor + PyMongo (MongoDB async access)

### Machine Learning and Data
- NumPy
- Scikit-learn (`RandomForestClassifier`)
- Imbalanced-learn (available in dependencies for future extension)
- XGBoost (listed as dependency for future/alternate model usage)

### Packet/Network Tooling
- Scapy (packet sniffing module implemented in codebase)

## 5) Project Modules (Code-Level)

### A) Authentication Module
- Register/Login endpoints are provided under `/api/auth/...`.
- Passwords are hashed before storage.
- JWT access token is generated on login.
- Protected routes in frontend ensure only logged-in users can access core pages (`/predict`, `/real-time`, `/attacks`).

### B) Real-Time Backend Module
- Backend starts an async generator loop at startup.
- It continuously creates traffic-like feature samples and runs ML prediction.
- When an attack class is detected, an alert payload is created with:
  - timestamp
  - source/destination IP
  - predicted attack type
  - severity (MEDIUM/HIGH/CRITICAL)
  - confidence score
- Alerts and stats are broadcast to connected clients through `/ws/live`.

### C) Dashboard Module
- Frontend connects to WebSocket for low-latency updates.
- Frontend also polls REST endpoints as a reliability fallback.
- Dashboard shows:
  - active flows
  - packets/sec trend graph
  - critical alert count
  - live threat feed with severity tags

### D) ML Prediction Module
- Loads model file `nids_model.pkl`.
- If model file is missing, auto-trains the model.
- Input feature vector format:
  - `src_port`
  - `dst_port`
  - `packet_size`
  - `flow_duration`
  - `num_packets`
- Output:
  - class ID
  - class label
  - prediction confidence (%)

## 6) Machine Learning Working (Detailed)

### 6.1 Classes Predicted
The model predicts six classes:
- Normal
- DDoS
- Port Scan
- SQL Injection
- Brute Force
- Botnet

### 6.2 Training Data Strategy
Current implementation generates **synthetic network data** programmatically (normal + attack-like distributions).  
This enables:
- reproducible demo training,
- fast retraining,
- multiclass behavior demonstration without external dataset dependency.

### 6.3 Training Pipeline
1. Generate synthetic feature vectors and labels.
2. Split train/test data.
3. Train a Random Forest classifier.
4. Evaluate with accuracy + classification report.
5. Save model (`pickle`) as `nids_model.pkl`.

### 6.4 Inference Pipeline
1. Receive one feature vector.
2. Run `predict()` and `predict_proba()`.
3. Select label and max probability as confidence.
4. Return structured prediction object to backend loop.

### 6.5 Severity Mapping Logic
After model predicts an attack class, severity is computed using confidence and packet behavior:
- Very high confidence / high packet burst -> `CRITICAL`
- High confidence -> `HIGH`
- else -> `MEDIUM`

## 7) How "Real-Time" Is Working in Current Version

This is important to explain clearly to a guide:

- The live dashboard is genuinely real-time in delivery terms:
  - backend emits events continuously,
  - frontend receives via WebSocket almost instantly.
- Current event source is a **simulated traffic generator** (for reliable live demo).
- A separate Scapy-based sniffer module exists and can capture real packets, but it is not yet fully integrated into the same live prediction stream in the main app flow.

So the current status is:
- **Realtime transport and UI: implemented**
- **Realtime ML prediction loop: implemented**
- **Direct OS packet capture wired to main live pipeline: partially prepared (next step)**

## 8) API and Communication Summary

### REST Endpoints
- `GET /api/stats` -> current traffic stats
- `GET /api/alerts` -> latest alerts list
- `GET /api/flows` -> flow data buffer
- `POST /api/model/retrain` -> retrain and reload model

### WebSocket
- `WS /ws/live`  
Sends two event types:
- `stats` events
- `alert` events

## 9) Deployment and Environment

The project is deployable as split services (frontend + backend), and currently hosted on Render.

Important environment variables for frontend:
- `VITE_API_BASE` -> backend API base URL
- `VITE_WS_URL` -> backend WebSocket URL

The frontend also contains fallback logic for local and Render patterns to reduce configuration friction.

## 10) Security Considerations

Implemented:
- password hashing
- JWT-based authentication
- protected frontend routes

Recommended improvements for production:
- move all secrets/DB URIs to environment variables
- restrict CORS origins
- add token refresh/expiry handling strategy
- add rate-limiting and login attempt throttling
- validate and sanitize all uploaded/analyzed content paths

## 11) Current Limitations (Honest Academic Discussion)

- Model is trained on synthetic data (good for prototype/demo, not final SOC-grade accuracy).
- Features are minimal (5 core fields); enterprise IDS typically uses richer flow/statistical features.
- Real packet sniffer is not yet fully integrated into the main inference pipeline for production capture.
- Alert persistence and SIEM-like analytics are basic and can be extended.

## 12) Future Enhancements / Roadmap

1. Integrate Scapy/sniffer output directly into live ML classification loop.  
2. Expand feature engineering (flow entropy, flags, inter-arrival times, protocol ratios).  
3. Train on standard intrusion datasets (NSL-KDD, CIC-IDS variants, UNSW-NB15, etc.).  
4. Add model versioning + scheduled retraining pipeline.  
5. Add role-based dashboard (admin/analyst) and audit logs.  
6. Add alert persistence, filtering, and long-term trend analysis.  
7. Containerize full system (Docker Compose/Kubernetes-ready).  
8. Add automated tests for API, WS stream, and model endpoints.

## 13) Viva/Guide Presentation Script (Short)

You can explain the project in this sequence:

1. "We built an end-to-end NIDS with React frontend, FastAPI backend, and ML classifier."  
2. "Backend continuously generates/captures traffic features, predicts attack class, computes severity, and streams events by WebSocket."  
3. "Frontend renders live packets/sec trend and threat feed in near real time."  
4. "The model is multiclass and predicts Normal, DDoS, Port Scan, SQL Injection, Brute Force, and Botnet."  
5. "Current version is production-style architecture with synthetic live generator for stable demos; direct packet sniffer integration is our next milestone."  
6. "So this project demonstrates both cybersecurity analytics and full-stack real-time system design."

## 14) Conclusion

This project demonstrates practical integration of:
- cybersecurity domain understanding,
- machine learning classification,
- asynchronous backend engineering,
- and real-time frontend observability.

It is a strong working prototype and a good foundation for an industry-grade NIDS with deeper data, richer features, and tighter production hardening.
