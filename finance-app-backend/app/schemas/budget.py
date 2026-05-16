from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class BudgetBase(BaseModel):
    category: str
    limit_amount: float
    month: int
    year: int


class BudgetCreate(BudgetBase):
    pass


class BudgetUpdate(BaseModel):
    limit_amount: Optional[float] = None


class BudgetResponse(BudgetBase):
    id: int
    user_id: int
    spent_amount: float
    created_at: datetime

    class Config:
        from_attributes = True
