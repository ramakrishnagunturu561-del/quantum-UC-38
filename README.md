# quantum-UC-38: QuantumRoute AI

> **Last-Mile Delivery and Capacitated Vehicle Routing (CVRP) using Classical OR-Tools and Quantum QAOA Optimization.**

Real-time fleet logistics platform centered in **Vijayawada, Andhra Pradesh**. The platform optimizes delivery stop sequences across multiple vehicles using Google OR-Tools CVRP heuristics and Quantum Approximate Optimization Algorithm (QAOA) Ising Hamiltonian circuits, visualizing routes on OpenStreetMap with OSRM road geometry.

---

## 🚀 Key Features

- **Real-Time Orders API**: Live dispatch management for Vijayawada delivery stops via FastAPI (`GET`, `POST`, `DELETE /api/orders`).
- **Dual Optimization Engines**:
  - **Classical CVRP**: Google OR-Tools with Guided Local Search and capacity constraints.
  - **Quantum QAOA**: QUBO formulation & Ising Cost Hamiltonian simulated with Qiskit statevector evolution.
- **100% Free Interactive Map**:
  - OpenStreetMap & Leaflet / React-Leaflet integration.
  - OSRM street-following road snapping.
  - Interactive multi-vehicle routes with distinct color legends.
- **Enterprise Dark Dashboard**: High-contrast dark navy/slate theme (`#0b132b` / `#0f172a` / `#1e293b`).

---

## 🛠️ Project Structure

```
quantum-route-ui/
├── backend/                  # FastAPI Optimization Backend
│   ├── main.py               # REST API endpoints (/api/orders, /api/optimize, /api/health)
│   ├── solver.py             # Google OR-Tools CVRP solver & QAOA quantum simulator
│   ├── models.py             # Pydantic data schemas
│   ├── orders.json           # Live orders database
│   └── data/                 # Benchmark CVRP datasets (A-n32-k5.vrp)
├── src/                      # React + Vite Frontend
│   ├── components/           # Reusable UI & Map components
│   │   ├── RealOpenStreetMap.jsx # OpenStreetMap + Leaflet + OSRM road snapping
│   │   ├── Sidebar.jsx       # Platform navigation & backend status
│   │   ├── Header.jsx        # Telemetry & hub status
│   │   └── StatCard.jsx      # Metrics cards
│   ├── pages/                # Main Application Views
│   │   ├── Dashboard.jsx     # Overview & live map
│   │   ├── LiveOrders.jsx    # Live order management
│   │   ├── RouteOptimization.jsx # Solver execution & progress pipeline
│   │   ├── RouteMapPage.jsx  # Fullscreen route map with vehicle turn-by-turn cards
│   │   └── ResultsPage.jsx   # Classical vs. Quantum comparison analytics
│   ├── services/
│   │   └── osrmRouting.js    # OSRM street network routing
│   └── context/
│       └── OptimizationContext.jsx # Global backend state management
├── package.json
└── vite.config.js
```

---

## ⚡ Getting Started

### 1. Backend Setup (FastAPI)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Linux/Mac:
# source venv/bin/activate

pip install fastapi uvicorn ortools qiskit scipy numpy pydantic
python main.py
```
Backend runs at `http://localhost:8000`.

### 2. Frontend Setup (React + Vite)
```bash
# In the project root:
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.
