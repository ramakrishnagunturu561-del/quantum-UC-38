import os
import time
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

from models import OrderCreate, Order
from orders import (
    create_order,
    get_orders,
    get_pending_orders,
    delete_order,
    seed_sample_orders
)
from solver import solve_cvrp_ortools, solve_cvrp_qaoa, DEPOT

app = FastAPI(title="QuantumRoute AI API", version="1.0.0")

# Enable CORS for React frontend (Vite port 5173, etc.)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OptimizeRequest(BaseModel):
    vehicles: int = 5
    capacity: int = 100
    qaoa_depth: int = 2
    shots: int = 512

# Store the latest completed optimization in memory
latest_optimization_result = None

# -------------------------
# Health Check
# -------------------------
@app.get("/")
def root():
    return {"name": "QuantumRoute AI API", "status": "running"}

@app.get("/api/health")
def health():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# -------------------------
# Benchmark Reference
# -------------------------
@app.get("/api/dataset/benchmark")
def get_benchmark_reference():
    """Returns metadata for the benchmark reference dataset (A-n32-k5)."""
    return {
        "status": "success",
        "dataset": "A-n32-k5.vrp",
        "type": "CVRP Validation Benchmark",
        "locations": 32,
        "vehicles": 5,
        "capacity": 100,
        "known_benchmark_optimum": 784,
        "description": "Standard Augerat CVRP validation dataset used exclusively for algorithmic benchmarking."
    }

# -------------------------
# Orders Routes
# -------------------------
@app.get("/api/orders")
def api_get_orders():
    orders = get_orders()
    return orders

@app.post("/api/orders")
def api_create_order(order: OrderCreate):
    new_order = create_order(order)
    return {"status": "success", "order": new_order}

@app.delete("/api/orders/{order_id}")
def api_delete_order(order_id: str):
    removed = delete_order(order_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"status": "success", "order": removed}

@app.post("/api/orders/seed")
def api_seed_orders():
    seed_sample_orders()
    return {"status": "success", "orders": get_orders()}

# -------------------------
# Real Optimization (Classical OR-Tools + QAOA Quantum)
# -------------------------
@app.get("/api/optimize/latest")
def get_latest_optimization():
    if not latest_optimization_result:
        return {"status": "none", "message": "No optimization run yet."}
    return latest_optimization_result

@app.post("/api/optimize")
def optimize_route(config: OptimizeRequest):
    global latest_optimization_result

    # 1. Fetch CURRENT live delivery orders
    raw_orders = get_orders()
    if not raw_orders:
        raise HTTPException(status_code=400, detail="Add delivery orders before running optimization.")

    orders = [o.model_dump() for o in raw_orders]
    total_demand = sum(o.get("demand", 0) for o in orders)

    # Validate vehicle parameters
    num_vehicles = max(1, config.vehicles)
    capacity = max(10, config.capacity)
    qaoa_depth = max(1, min(config.qaoa_depth, 6))
    shots = max(64, min(config.shots, 4096))

    # 2. Run Classical OR-Tools CVRP optimization
    c_routes, c_dist, c_time, c_feasible = solve_cvrp_ortools(
        orders=orders,
        num_vehicles=num_vehicles,
        vehicle_capacity=capacity
    )

    # 3. Run Quantum QAOA CVRP optimization
    q_result = solve_cvrp_qaoa(
        orders=orders,
        num_vehicles=num_vehicles,
        vehicle_capacity=capacity,
        qaoa_depth=qaoa_depth,
        shots=shots
    )

    # 4. Compare Classical and QAOA
    dist_diff = round(q_result["distance_km"] - c_dist, 2)
    has_quantum_advantage = dist_diff < -0.05

    if has_quantum_advantage:
        analysis = f"QAOA found a route {abs(dist_diff)} km shorter than classical solver."
    elif dist_diff == 0.0:
        analysis = "QAOA matched the exact classical optimum route."
    else:
        analysis = (
            f"Classical OR-Tools found a shorter route by {dist_diff} km. "
            f"QAOA at circuit depth p={qaoa_depth} achieved a {round(c_dist / max(q_result['distance_km'], 0.1) * 100, 1)}% "
            f"approximation ratio with {q_result['feasible_probability_pct']}% feasible ground state probability."
        )

    # Mark orders as assigned in memory
    for o in raw_orders:
        o.status = "assigned"

    result = {
        "status": "success",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "depot": DEPOT,
        "orders_count": len(orders),
        "total_demand": total_demand,
        "config": {
            "vehicles": num_vehicles,
            "capacity": capacity,
            "qaoa_depth": qaoa_depth,
            "shots": shots
        },
        "classical": {
            "algorithm": "OR-Tools CVRP Solver",
            "distance_km": c_dist,
            "vehicles_used": len(c_routes),
            "feasible": c_feasible,
            "runtime_ms": c_time,
            "routes": c_routes
        },
        "quantum": q_result,
        "comparison": {
            "distance_diff_km": dist_diff,
            "quantum_advantage": has_quantum_advantage,
            "analysis": analysis
        }
    }

    latest_optimization_result = result
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
