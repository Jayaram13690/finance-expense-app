from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, func
from datetime import datetime
from app.core.database import Base


class Pot(Base):
    __tablename__ = "pots"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), index=True)
    name = Column(String, index=True)
    target_amount = Column(Float)
    current_amount = Column(Float, default=0)
    theme_color = Column(String, default="blue")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
