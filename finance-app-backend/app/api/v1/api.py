from fastapi import APIRouter
from app.api.v1.routes import auth, transactions, budgets, pots, dashboard

router = APIRouter(prefix="/api/v1")

router.include_router(auth.router)
router.include_router(transactions.router)
router.include_router(budgets.router)
router.include_router(pots.router)
router.include_router(dashboard.router)
