from pydantic import BaseModel, Field
from typing import Literal

class OrderCreate(BaseModel):
    customer_name: str
    latitude: float
    longitude: float
    demand: int = Field(gt=0)
    address: str | None = None

class Order(OrderCreate):
    order_id: str
    status: Literal['pending', 'assigned', 'delivered'] = 'pending'
