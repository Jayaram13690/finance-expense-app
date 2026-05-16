from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PotBase(BaseModel):
    name: str
    target_amount: float
    theme_color: Optional[str] = "blue"


class PotCreate(PotBase):
    pass


class PotUpdate(BaseModel):
    name: Optional[str] = None
    target_amount: Optional[float] = None
    theme_color: Optional[str] = None


class PotDepositWithdraw(BaseModel):
    amount: float


class PotResponse(PotBase):
    id: int
    user_id: int
    current_amount: float
    created_at: datetime

    class Config:
        from_attributes = True
