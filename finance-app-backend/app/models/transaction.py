from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from datetime import datetime
from app.core.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    title = Column(String, index=True)
    amount = Column(Float)
    type = Column(String)  # income or expense
    category = Column(String, index=True, nullable=True)
    description = Column(String, nullable=True)
    transaction_date = Column(DateTime(timezone=True), default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
