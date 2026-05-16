from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from datetime import datetime
from app.core.database import Base


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    category = Column(String, index=True)
    limit_amount = Column(Float)
    spent_amount = Column(Float, default=0)
    month = Column(Integer)
    year = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
