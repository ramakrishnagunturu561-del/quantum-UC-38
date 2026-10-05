import uuid
from typing import Dict, List
from models import Order, OrderCreate

orders: Dict[str, Order] = {}

def seed_sample_orders():
    if len(orders) == 0:
        samples = [
            OrderCreate(customer_name="Vijayawada Central", latitude=16.5062, longitude=80.6480, demand=8, address="MG Road, Vijayawada"),
            OrderCreate(customer_name="Kanuru Hub", latitude=16.4890, longitude=80.6712, demand=12, address="Kanuru Main Rd, Vijayawada"),
            OrderCreate(customer_name="Bhavanipuram Depot", latitude=16.5180, longitude=80.6200, demand=7, address="Bhavanipuram, Vijayawada"),
            OrderCreate(customer_name="Benz Circle Store", latitude=16.5015, longitude=80.6534, demand=15, address="Benz Circle, Vijayawada"),
            OrderCreate(customer_name="Gandhinagar Mart", latitude=16.5123, longitude=80.6350, demand=5, address="Gandhinagar, Vijayawada"),
            OrderCreate(customer_name="Gollapudi Retail", latitude=16.5385, longitude=80.5921, demand=9, address="Gollapudi By-pass, Vijayawada"),
        ]
        for s in samples:
            create_order(s)

def create_order(order_data: OrderCreate) -> Order:
    order_id = f"ORD-{uuid.uuid4().hex[:6].upper()}"
    order = Order(order_id=order_id, **order_data.model_dump())
    orders[order_id] = order
    return order

def get_orders() -> List[Order]:
    if not orders:
        seed_sample_orders()
    return list(orders.values())

def get_pending_orders() -> List[Order]:
    if not orders:
        seed_sample_orders()
    return [order for order in orders.values() if order.status == "pending"]

def delete_order(order_id: str) -> Order | None:
    return orders.pop(order_id, None)

# Initialize seed on startup
seed_sample_orders()
