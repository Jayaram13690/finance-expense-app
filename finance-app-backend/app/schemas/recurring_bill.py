from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RecurringBillBase(BaseModel):
    title: str
    amount: float
    due_date: int
    category: str


class RecurringBillCreate(RecurringBillBase):
    pass


class RecurringBillUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None
    due_date: Optional[int] = None
    category: Optional[str] = None


class RecurringBillResponse(RecurringBillBase):
    id: int
    user_id: int
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
