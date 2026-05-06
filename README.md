# Real-Time Network Intrusion Detection System (NIDS.core) 🛡️

A production-grade, end-to-end Real-Time Network Intrusion Detection System (NIDS). This system leverages a high-performance Machine Learning ensemble model for traffic classification, a robust FastAPI backend for real-time packet processing, and a sophisticated React-based dashboard to visualize network traffic, threat maps, and security alerts in real-time.

## ✨ Features

- **Real-Time Traffic Monitoring**: Intercepts and processes high volumes of incoming/outgoing TCP/UDP network packets.
- **Machine Learning Threat Detection**: Utilizes XGBoost and Scikit-Learn ensemble models to classify traffic as benign or malicious, identifying threats like DDoS, Port Scans, SQL Injections, and Botnets.
- **WebSocket Streaming**: Employs WebSockets to push live alerts, throughput metrics, and network statistics to the client instantaneously.
- **Interactive Security Dashboard**: Modern, dark-themed React dashboard built with Tailwind CSS v4 and Recharts. Features dynamic threat feeds and real-time active flow statistics.
- **Database Storage & Auditing**: SQLAlchemy and MySQL backend integrations manage persistent connections for storing historic threat alerts and logging.

## 💻 Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Components/Icons**: Lucide React, Recharts
- **State/Real-Time**: react-use-websocket

### Backend
- **Framework**: FastAPI + Uvicorn
- **Concurrency**: Asyncio + WebSockets
- **Database**: SQLAlchemy, PyMySQL
- **Auth/Security**: Pydantic, python-jose, passlib

### Machine Learning & Packet Analysis
- **Data Science**: Pandas, NumPy, Scikit-learn
- **Modeling**: XGBoost, imbalanced-learn
- **Packet Capture**: Scapy

## 📂 Project Structure

```text
📁 College Project
 ├── 📁 backend          # FastAPI backend server & API logic
 │   ├── 📁 api          # API routing configurations
 │   ├── 📁 capture      # Scapy-based network packet capture scripts
 │   ├── 📁 ml_engine    # NIDS ML prediction and data extraction engines
 │   ├── main.py         # App entry point (WebSocket & Routes)
 │   └── requirements.txt
 │
 ├── 📁 frontend         # React/Vite frontend Dashboard
 │   ├── 📁 src          # App.jsx, styles, components
 │   ├── index.html
 │   └── package.json
 │
 ├── 📁 database         # Database schemas and migration scripts
 ├── 📁 ml               # Raw model notebooks and dataset processing
 ├── 📁 docs             # Documentation assets
 ├── 📁 tests            # Unit testing for frontend and backend
 │
 ├── package.json        # Root workspace manager
 └── run.ps1             # PowerShell bootstrap script for concurrent running
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18+ recommended)
- [Python 3.9+](https://www.python.org/)
- PowerShell (for the `run.ps1` execute script on Windows)

### 1. Backend Setup
Navigate into the `backend` folder, set up your virtual environment, and install all Python dependencies:
```bash
cd backend
python -m venv venv

# Activate Virtual Environment (Windows)
.\venv\Scripts\Activate.ps1
# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
```

**Database Configuration (MongoDB)**
The backend utilizes MongoDB for user authentication and alert storage. Ensure you have your connection string ready. You can configure this by editing `db_mongo.py` or `.env` inside the `backend` directory (if you transition it to environment variables):
```python
# In backend/db_mongo.py
MONGO_URL = "mongodb+srv://<username>:<password>@cluster...mongodb.net/"
```


### 2. Frontend Setup
Navigate into the `frontend` folder and install all NPM dependencies:
```bash
cd frontend
npm install
```

### 3. Root Setup
Install root dependencies (if any) to enable the concurrent runner:
```bash
cd ..
npm install
```

## 🛠️ Running the Application

This project is configured with a unified runner. From the **root level** of the directory, simply run:

```bash
npm run dev
```

**What this does:**
It executes the underlying `run.ps1` script which will automatically spawn two separate terminal windows:
1. **Backend**: Automatically boots up the Uvicorn FastAPI server on `http://localhost:8000`.
2. **Frontend**: Starts the Vite Hot-Module-Replacement development server on `http://localhost:5173`.

> **Note**: If you run into script execution policy errors on Windows, run the command `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted` in PowerShell as an administrator.

## 🌐 Deploying on Render

This project now includes a Render Blueprint file: `render.yaml`.

- Backend service (`nids-backend`):
  - Root: `backend`
  - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Frontend service (`nids-frontend`):
  - Root: `frontend`
  - Build: `npm ci && npm run build`
  - Start: `npx serve -s dist -l $PORT`

### Required frontend environment variables on Render

Set these on the frontend service so realtime works without any local PowerShell session:

- `VITE_API_BASE=https://<your-backend-service>.onrender.com/api`
- `VITE_WS_URL=wss://<your-backend-service>.onrender.com/ws/live`

You can copy the sample values from `frontend/.env.example`.

### Important

If these variables are missing, the frontend will try same-origin `/api` and `/ws/live`.  
For split frontend/backend deployments, always set both env vars explicitly.

## 🔮 Future Enhancements
- Dockerizing the full-stack setup for seamless CI/CD.
- Adding comprehensive end-to-end integration tests.
- Implementing an auto-retraining pipeline for the ML classifier. 
