# Deployment Guide: QuantumRoute AI

QuantumRoute AI consists of two components:
1. **Frontend**: React + Vite + OpenStreetMap (Static SPA)
2. **Backend**: FastAPI + Google OR-Tools + QAOA Quantum Simulator (Python Web Service)

---

## 🚀 Recommended Production Setup (100% Free)

### Step 1: Deploy Backend to Render (Free)

1. Sign up or log into [Render.com](https://render.com).
2. Click **New +** → **Web Service**.
3. Connect your GitHub repository: `ramakrishnagunturu561-del/quantum-UC-38`.
4. Configure the settings:
   - **Name**: `quantumroute-backend`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Instance Type**: `Free`
5. Click **Deploy Web Service**.
6. When deployment finishes, copy your live backend URL (e.g., `https://quantumroute-backend.onrender.com`).

---

### Step 2: Deploy Frontend to Vercel (Free)

1. Sign up or log into [Vercel.com](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Select your GitHub repository: `ramakrishnagunturu561-del/quantum-UC-38`.
4. Configure the settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add the **Environment Variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: Your Render backend URL from Step 1 (e.g. `https://quantumroute-backend.onrender.com`)
6. Click **Deploy**.
7. Vercel will build the frontend and provide your live production URL (e.g. `https://quantum-uc-38.vercel.app`).

*Note: `vercel.json` is already included in the repository to handle all client-side React routes (`/orders`, `/optimization`, `/map`, `/results`) seamlessly.*

---

## 🐳 Alternative: Run Anywhere with Docker

To build and run the backend locally or on any cloud VPS (AWS, GCP, DigitalOcean):

```bash
# Build the container
docker build -t quantumroute-backend .

# Run container
docker run -p 8000:8000 quantumroute-backend
```
Backend API will be accessible at `http://localhost:8000`.
