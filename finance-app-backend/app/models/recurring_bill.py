from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from datetime import datetime
from app.core.database import Base


class RecurringBill(Base):
    __tablename__ = "recurring_bills"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, index=True)
    amount = Column(Float)
    due_date = Column(Integer)  # day of month
    status = Column(String, default="upcoming")  # upcoming, paid, overdue
    category = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
